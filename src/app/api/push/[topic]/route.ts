import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { Resend } from "resend";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { PLAN_LIMITS, type PlanName } from "@/lib/stripe";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * iotpush - Push Notification API
 *
 * POST /api/push/{topic} — Send a notification
 * GET  /api/push/{topic} — Fetch recent messages
 */

// Delivery functions (awaited to prevent Vercel from killing before completion)
async function deliverWebhook(endpoint: string, payload: Record<string, unknown>) {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[iotpush] Webhook delivery failed (${endpoint}):`, message);
  }
}

async function deliverEmail(endpoint: string, topicName: string, title: string | null, message: string, priority: string) {
  try {
  const subject = title || `New notification from ${topicName}`;
  const priorityColor = priority === "urgent" ? "#ef4444" : priority === "high" ? "#f97316" : "#6b7280";
  const priorityLabel = priority.charAt(0).toUpperCase() + priority.slice(1);

  if (!resend) { console.error("[iotpush] RESEND_API_KEY not set"); return; }
  await resend.emails.send({
    from: "iotpush <onboarding@resend.dev>",
    to: endpoint,
    subject,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:24px;font-weight:bold;color:#fff;">iot<span style="color:#f97316;">push</span></span>
    </div>
    <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:24px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
        <span style="background:#f97316;color:#fff;font-size:12px;padding:2px 8px;border-radius:6px;font-weight:600;">${topicName}</span>
        <span style="background:${priorityColor}22;color:${priorityColor};font-size:12px;padding:2px 8px;border-radius:6px;">${priorityLabel}</span>
      </div>
      ${title ? `<h2 style="color:#fff;margin:0 0 12px;font-size:18px;">${title}</h2>` : ""}
      <p style="color:#a1a1aa;margin:0;font-size:15px;line-height:1.6;">${message}</p>
    </div>
    <p style="text-align:center;color:#52525b;font-size:12px;margin-top:24px;">
      Sent via <a href="https://iotpush.co" style="color:#f97316;text-decoration:none;">iotpush</a>
    </p>
  </div>
</body>
</html>`,
  });
  } catch (err) {
    console.error(`[iotpush] Email delivery failed (${endpoint}):`, err);
  }
}

async function deliverExpoPush(endpoint: string, topicName: string, title: string | null, message: string, messageId: string, priority: string) {
  try {
    const expoPriority = priority === "urgent" || priority === "high" ? "high" : "default";
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        to: endpoint,
        title: title || `Notification from ${topicName}`,
        body: message,
        data: { topic: topicName, messageId },
        sound: "default",
        priority: expoPriority,
      }),
      signal: AbortSignal.timeout(10000),
    });
    const result = await res.json();
    console.log(`[iotpush] Expo push result:`, JSON.stringify(result));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[iotpush] Expo push delivery failed (${endpoint}):`, msg);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ topic: string }> }
) {
  try {
    const ip = getClientIp(request);
    const { allowed, resetIn } = checkRateLimit(`push:${ip}`, 100);
    if (!allowed) return rateLimitResponse(resetIn);

    const { topic: topicName } = await params;
    const supabase = createAdminClient();

    // Look up topic by name
    const { data: topic, error: topicError } = await supabase
      .from("iot_topics")
      .select("id, name, is_private, api_key")
      .eq("name", topicName)
      .limit(1)
      .single();

    if (topicError || !topic) {
      return NextResponse.json(
        { error: `Topic "${topicName}" not found. Create it in your dashboard first.` },
        { status: 404 }
      );
    }

    // Check auth for private topics
    if (topic.is_private) {
      const authHeader = request.headers.get("authorization");
      const token = authHeader?.replace("Bearer ", "");
      if (!token || token !== topic.api_key) {
        return NextResponse.json(
          { error: "This topic is private. Provide a valid API key via Authorization: Bearer {key}" },
          { status: 401 }
        );
      }
    }

    // --- Enforce monthly push limit based on owner's plan ---
    // Get the topic owner's user_id
    const { data: topicFull } = await supabase
      .from("iot_topics")
      .select("user_id")
      .eq("id", topic.id)
      .single();

    if (topicFull?.user_id) {
      // Look up the owner's account/plan
      const { data: account } = await supabase
        .from("iot_accounts")
        .select("plan, pushes_used, pushes_reset_at")
        .eq("user_id", topicFull.user_id)
        .single();

      const plan = (account?.plan || "free") as PlanName;
      const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
      let pushesUsed = account?.pushes_used || 0;

      // Check if the reset period has passed; if so, reset the counter
      if (account?.pushes_reset_at && new Date(account.pushes_reset_at) <= new Date()) {
        pushesUsed = 0;
        // Reset the counter and set next reset date (first of next month)
        const nextReset = new Date();
        nextReset.setMonth(nextReset.getMonth() + 1, 1);
        nextReset.setHours(0, 0, 0, 0);
        await supabase
          .from("iot_accounts")
          .update({ pushes_used: 0, pushes_reset_at: nextReset.toISOString() })
          .eq("user_id", topicFull.user_id);
      }

      if (pushesUsed >= limits.pushes) {
        return NextResponse.json(
          {
            error: `Monthly push limit reached (${limits.pushes.toLocaleString()} pushes on ${plan} plan). Upgrade at https://iotpush.com/dashboard/billing`,
            limit: limits.pushes,
            used: pushesUsed,
            plan,
          },
          { status: 429 }
        );
      }

      // Increment push count
      await supabase
        .from("iot_accounts")
        .update({ pushes_used: pushesUsed + 1 })
        .eq("user_id", topicFull.user_id);
    }

    // Parse request body
    const contentType = request.headers.get("content-type") || "";
    let message: string;
    let jsonData: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      jsonData = await request.json();
      message = (jsonData.message as string) || JSON.stringify(jsonData);
    } else {
      message = await request.text();
    }

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    // Extract optional headers / JSON fields
    const title = request.headers.get("title") || request.headers.get("x-title") || (jsonData.title as string) || null;
    const priority = request.headers.get("priority") || request.headers.get("x-priority") || (jsonData.priority as string) || "normal";
    const tagsRaw = request.headers.get("tags") || request.headers.get("x-tags") || (jsonData.tags as string);
    const tags = tagsRaw ? tagsRaw.split(",").map((t: string) => t.trim()) : null;
    const click_url = request.headers.get("click") || request.headers.get("x-click") || (jsonData.click as string) || null;

    // Insert message
    const { data: msg, error: insertError } = await supabase
      .from("iot_messages")
      .insert({
        topic_id: topic.id,
        title,
        message: message.trim(),
        priority,
        tags,
        click_url,
        metadata: jsonData.metadata || null,
      })
      .select("id, created_at")
      .single();

    if (insertError) {
      console.error("[iotpush] Insert error:", insertError);
      return NextResponse.json({ error: "Failed to store message" }, { status: 500 });
    }

    // Fetch active subscribers and deliver (fire-and-forget)
    const { data: subscribers } = await supabase
      .from("iot_subscribers")
      .select("id, endpoint, type")
      .eq("topic_id", topic.id)
      .eq("active", true);

    const subscriberCount = subscribers?.length || 0;

    if (subscribers && subscribers.length > 0) {
      const timestamp = msg.created_at;
      const payload = {
        topic: topicName,
        title: title || "Alert",
        message: message.trim(),
        priority,
        tags,
        click_url,
        timestamp,
        id: msg.id,
      };

      const deliveryPromises = subscribers.map(async (sub) => {
        try {
          switch (sub.type) {
            case "webhook":
              await deliverWebhook(sub.endpoint, payload);
              break;
            case "email":
              await deliverEmail(sub.endpoint, topicName, title, message.trim(), priority);
              break;
            case "expo_push":
              await deliverExpoPush(sub.endpoint, topicName, title, message.trim(), msg.id, priority);
              break;
          }
        } catch (err) {
          console.error(`[iotpush] Delivery error for subscriber ${sub.id}:`, err);
        }
      });
      await Promise.all(deliveryPromises);
    }

    return NextResponse.json({
      success: true,
      id: msg.id,
      topic: topicName,
      timestamp: msg.created_at,
      message: "Notification sent",
      subscribers: subscriberCount,
    });
  } catch (error) {
    console.error("[iotpush] Push error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ topic: string }> }
) {
  try {
    const { topic: topicName } = await params;
    const { searchParams } = new URL(request.url);
    const since = searchParams.get("since");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const supabase = createAdminClient();

    // Look up topic
    const { data: topic, error: topicError } = await supabase
      .from("iot_topics")
      .select("id, is_private, api_key")
      .eq("name", topicName)
      .limit(1)
      .single();

    if (topicError || !topic) {
      return NextResponse.json({ error: `Topic "${topicName}" not found` }, { status: 404 });
    }

    // Private topic auth check
    if (topic.is_private) {
      const authHeader = request.headers.get("authorization");
      const token = authHeader?.replace("Bearer ", "");
      if (!token || token !== topic.api_key) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    let query = supabase
      .from("iot_messages")
      .select("id, title, message, priority, tags, click_url, created_at")
      .eq("topic_id", topic.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (since) {
      query = query.gt("created_at", since);
    }

    const { data: messages, error: msgError } = await query;

    if (msgError) {
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }

    return NextResponse.json({
      topic: topicName,
      messages: messages || [],
      count: messages?.length || 0,
    });
  } catch (error) {
    console.error("[iotpush] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export const PUT = POST;
