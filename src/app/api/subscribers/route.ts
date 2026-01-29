import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const VALID_TYPES = ["webhook", "email", "expo_push"];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topic_id");
    if (!topicId) {
      return NextResponse.json({ error: "topic_id is required" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Verify user owns the topic
    const { data: topic } = await admin
      .from("iot_topics")
      .select("id")
      .eq("id", topicId)
      .eq("user_id", user.id)
      .single();

    if (!topic) {
      return NextResponse.json({ error: "Topic not found or not owned by you" }, { status: 404 });
    }

    const { data: subscribers, error } = await admin
      .from("iot_subscribers")
      .select("id, endpoint, type, active, created_at")
      .eq("topic_id", topicId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
    }

    return NextResponse.json({ subscribers: subscribers || [] });
  } catch (error) {
    console.error("[iotpush] Subscribers GET error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topic_id, endpoint, type } = body;

    if (!topic_id || !endpoint || !type) {
      return NextResponse.json({ error: "topic_id, endpoint, and type are required" }, { status: 400 });
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: `type must be one of: ${VALID_TYPES.join(", ")}` }, { status: 400 });
    }

    const admin = createAdminClient();

    // Verify user owns the topic
    const { data: topic } = await admin
      .from("iot_topics")
      .select("id")
      .eq("id", topic_id)
      .eq("user_id", user.id)
      .single();

    if (!topic) {
      return NextResponse.json({ error: "Topic not found or not owned by you" }, { status: 404 });
    }

    // Upsert — don't duplicate same endpoint for same topic
    const { data: existing } = await admin
      .from("iot_subscribers")
      .select("id")
      .eq("topic_id", topic_id)
      .eq("endpoint", endpoint)
      .single();

    if (existing) {
      // Reactivate if it exists
      const { data: updated, error } = await admin
        .from("iot_subscribers")
        .update({ active: true, type })
        .eq("id", existing.id)
        .select("id, endpoint, type, active, created_at")
        .single();

      if (error) {
        return NextResponse.json({ error: "Failed to update subscriber" }, { status: 500 });
      }
      return NextResponse.json({ subscriber: updated, upserted: true });
    }

    const { data: subscriber, error } = await admin
      .from("iot_subscribers")
      .insert({ topic_id, endpoint, type, active: true })
      .select("id, endpoint, type, active, created_at")
      .single();

    if (error) {
      console.error("[iotpush] Subscriber insert error:", error);
      return NextResponse.json({ error: "Failed to create subscriber" }, { status: 500 });
    }

    return NextResponse.json({ subscriber }, { status: 201 });
  } catch (error) {
    console.error("[iotpush] Subscribers POST error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, topic_id, endpoint } = body;

    const admin = createAdminClient();

    if (id) {
      // Get subscriber to verify ownership
      const { data: sub } = await admin
        .from("iot_subscribers")
        .select("id, topic_id")
        .eq("id", id)
        .single();

      if (!sub) {
        return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
      }

      // Verify user owns the topic
      const { data: topic } = await admin
        .from("iot_topics")
        .select("id")
        .eq("id", sub.topic_id)
        .eq("user_id", user.id)
        .single();

      if (!topic) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }

      await admin.from("iot_subscribers").delete().eq("id", id);
      return NextResponse.json({ deleted: true });
    }

    if (topic_id && endpoint) {
      // Verify user owns the topic
      const { data: topic } = await admin
        .from("iot_topics")
        .select("id")
        .eq("id", topic_id)
        .eq("user_id", user.id)
        .single();

      if (!topic) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }

      await admin.from("iot_subscribers").delete().eq("topic_id", topic_id).eq("endpoint", endpoint);
      return NextResponse.json({ deleted: true });
    }

    return NextResponse.json({ error: "Provide id or (topic_id + endpoint)" }, { status: 400 });
  } catch (error) {
    console.error("[iotpush] Subscribers DELETE error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
