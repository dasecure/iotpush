import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

/**
 * iotpush - Push Notification API
 *
 * POST /api/push/{topic} — Send a notification
 * GET  /api/push/{topic} — Fetch recent messages
 *
 * Headers (optional):
 * - Title / X-Title: Notification title
 * - Priority / X-Priority: low, normal, high, urgent
 * - Tags / X-Tags: Comma-separated tags
 * - Click / X-Click: URL to open on click
 * - Authorization: Bearer {api_key} (required for private topics)
 */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ topic: string }> }
) {
  try {
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

    // Count subscribers
    const { count: subscriberCount } = await supabase
      .from("iot_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("topic_id", topic.id)
      .eq("active", true);

    return NextResponse.json({
      success: true,
      id: msg.id,
      topic: topicName,
      timestamp: msg.created_at,
      message: "Notification sent",
      subscribers: subscriberCount || 0,
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
