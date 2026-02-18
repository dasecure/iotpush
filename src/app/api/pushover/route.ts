import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { createAdminClient } from "@/lib/supabase-admin";
import { Resend } from "resend";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { PLAN_LIMITS, type PlanName } from "@/lib/stripe";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Pushover-Compatible API Endpoint
 * 
 * POST /api/pushover — Accepts Pushover API format
 * Also available at /api/1/messages.json for full compatibility
 * 
 * Pushover parameters mapped to iotpush:
 * - token: iotpush topic api_key (required)
 * - user: iotpush topic name OR ignored if token uniquely identifies topic
 * - message: notification message (required)
 * - title: notification title
 * - url: click URL
 * - url_title: (stored in metadata)
 * - priority: -2 to 2 mapped to iotpush priority
 * - sound: (stored in metadata for future use)
 * - device: (stored in metadata)
 * - timestamp: (stored in metadata)
 * - html: HTML formatting flag
 */

// Delivery functions (same as main push route)
async function deliverWebhook(endpoint: string, payload: Record<string, unknown>) {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
  } catch (err) {
    console.error(`[iotpush] Webhook delivery failed:`, err);
  }
}

async function deliverEmail(endpoint: string, topicName: string, title: string | null, message: string, priority: string) {
  if (!resend) return;
  try {
    const subject = title || `Notification from ${topicName}`;
    const priorityColor = priority === "urgent" ? "#ef4444" : priority === "high" ? "#f97316" : "#6b7280";
    await resend.emails.send({
      from: "iotpush <onboarding@resend.dev>",
      to: endpoint,
      subject,
      html: `<div style="font-family:sans-serif;padding:20px;"><h2>${title || topicName}</h2><p>${message}</p><small style="color:${priorityColor}">Priority: ${priority}</small></div>`,
    });
  } catch (err) {
    console.error(`[iotpush] Email delivery failed:`, err);
  }
}

async function deliverExpoPush(endpoint: string, topicName: string, title: string | null, message: string, messageId: string, priority: string) {
  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: endpoint,
        title: title || `Notification from ${topicName}`,
        body: message,
        data: { topic: topicName, messageId },
        sound: "default",
        priority: priority === "urgent" || priority === "high" ? "high" : "default",
      }),
    });
  } catch (err) {
    console.error(`[iotpush] Expo push delivery failed:`, err);
  }
}

// Map Pushover priority (-2 to 2) to iotpush priority
function mapPriority(pushoverPriority: number | string | undefined): string {
  const p = typeof pushoverPriority === "string" ? parseInt(pushoverPriority) : pushoverPriority;
  if (p === undefined || isNaN(p as number)) return "normal";
  if (p <= -2) return "lowest";
  if (p === -1) return "low";
  if (p === 0) return "normal";
  if (p === 1) return "high";
  if (p >= 2) return "urgent";
  return "normal";
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed, resetIn } = await checkRateLimit(`pushover:${ip}`, 100);
    if (!allowed) return rateLimitResponse(resetIn);

    const supabase = createAdminClient();

    // Parse form data or JSON (Pushover accepts both)
    const contentType = request.headers.get("content-type") || "";
    let params: Record<string, string> = {};

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        params[key] = value.toString();
      });
    } else if (contentType.includes("application/json")) {
      params = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        if (typeof value === "string") params[key] = value;
      });
    } else {
      // Try to parse as form data anyway
      try {
        const text = await request.text();
        const searchParams = new URLSearchParams(text);
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
      } catch {
        return NextResponse.json({ status: 0, errors: ["Invalid request format"] }, { status: 400 });
      }
    }

    const { token, user, message, title, url, url_title, priority, sound, device, timestamp, html, monospace } = params;

    // Validate required fields
    if (!token) {
      return NextResponse.json({
        status: 0,
        errors: ["token parameter is required (use your iotpush topic API key)"],
      }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({
        status: 0,
        errors: ["message parameter is required"],
      }, { status: 400 });
    }

    // Look up topic by api_key (token)
    const { data: topic, error: topicError } = await supabase
      .from("iot_topics")
      .select("id, name, user_id, is_private, api_key")
      .eq("api_key", token)
      .single();

    if (topicError || !topic) {
      // If not found by api_key, try by name (user field) for public topics
      if (user) {
        const { data: topicByName } = await supabase
          .from("iot_topics")
          .select("id, name, user_id, is_private, api_key")
          .eq("name", user)
          .eq("is_private", false)
          .single();

        if (!topicByName) {
          return NextResponse.json({
            status: 0,
            errors: ["Invalid token or topic not found. Use your iotpush topic API key as the token."],
          }, { status: 400 });
        }
        // Use public topic (user param)
        Object.assign(topic || {}, topicByName);
      } else {
        return NextResponse.json({
          status: 0,
          errors: ["Invalid token. Use your iotpush topic API key."],
        }, { status: 400 });
      }
    }

    // Check push limits
    let ownerPlan: PlanName = "free";
    if (topic?.user_id) {
      const { data: account } = await supabase
        .from("iot_accounts")
        .select("plan, pushes_used, pushes_reset_at")
        .eq("user_id", topic.user_id)
        .single();

      const plan = (account?.plan || "free") as PlanName;
      const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
      let pushesUsed = account?.pushes_used || 0;

      // Reset counter if period passed
      if (account?.pushes_reset_at && new Date(account.pushes_reset_at) <= new Date()) {
        pushesUsed = 0;
        const nextReset = new Date();
        nextReset.setMonth(nextReset.getMonth() + 1, 1);
        nextReset.setHours(0, 0, 0, 0);
        await supabase
          .from("iot_accounts")
          .update({ pushes_used: 0, pushes_reset_at: nextReset.toISOString() })
          .eq("user_id", topic.user_id);
      }

      if (pushesUsed >= limits.pushes) {
        return NextResponse.json({
          status: 0,
          errors: [`Monthly push limit reached (${limits.pushes.toLocaleString()} on ${plan} plan)`],
        }, { status: 429 });
      }

      // Increment push count
      await supabase
        .from("iot_accounts")
        .update({ pushes_used: pushesUsed + 1 })
        .eq("user_id", topic.user_id);

      ownerPlan = plan;
    }

    // Map priority
    const iotpushPriority = mapPriority(priority);

    // Prepare message (add branding for free tier)
    let finalMessage = message.trim();
    if (ownerPlan === "free") {
      finalMessage += " • via iotpush.com";
    }

    // Store metadata from Pushover-specific fields
    const metadata: Record<string, unknown> = {};
    if (url_title) metadata.url_title = url_title;
    if (sound) metadata.sound = sound;
    if (device) metadata.device = device;
    if (timestamp) metadata.timestamp = timestamp;
    if (html === "1") metadata.html = true;
    if (monospace === "1") metadata.monospace = true;

    // Insert message
    const { data: msg, error: insertError } = await supabase
      .from("iot_messages")
      .insert({
        topic_id: topic!.id,
        title: title || null,
        message: finalMessage,
        priority: iotpushPriority,
        click_url: url || null,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
      })
      .select("id, created_at")
      .single();

    if (insertError) {
      console.error("[iotpush/pushover] Insert error:", insertError);
      return NextResponse.json({ status: 0, errors: ["Failed to store message"] }, { status: 500 });
    }

    // Deliver to subscribers
    const { data: subscribers } = await supabase
      .from("iot_subscribers")
      .select("id, endpoint, type")
      .eq("topic_id", topic!.id)
      .eq("active", true);

    if (subscribers && subscribers.length > 0) {
      const payload = {
        topic: topic!.name,
        title: title || "Notification",
        message: finalMessage,
        priority: iotpushPriority,
        click_url: url,
        timestamp: msg.created_at,
        id: msg.id,
      };

      waitUntil(
        Promise.all(
          subscribers.map(async (sub) => {
            switch (sub.type) {
              case "webhook":
                await deliverWebhook(sub.endpoint, payload);
                break;
              case "email":
                await deliverEmail(sub.endpoint, topic!.name, title || null, finalMessage, iotpushPriority);
                break;
              case "expo_push":
                await deliverExpoPush(sub.endpoint, topic!.name, title || null, finalMessage, msg.id, iotpushPriority);
                break;
            }
          })
        )
      );
    }

    // Return Pushover-compatible success response
    return NextResponse.json({
      status: 1,
      request: msg.id,
    });

  } catch (error) {
    console.error("[iotpush/pushover] Error:", error);
    return NextResponse.json({
      status: 0,
      errors: ["Internal server error"],
    }, { status: 500 });
  }
}

// Also support GET for health check
export async function GET() {
  return NextResponse.json({
    status: 1,
    info: "iotpush Pushover-compatible endpoint. POST messages here using Pushover API format.",
    docs: "https://iotpush.com/docs/pushover",
  });
}
