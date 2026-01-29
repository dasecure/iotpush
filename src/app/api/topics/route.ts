import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// GET /api/topics — List user's topics
export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: topics, error } = await supabase
    .from("iot_topics")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ topics: topics || [] });
}

// POST /api/topics — Create a new topic
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, is_private } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Topic name is required" }, { status: 400 });
  }

  // Sanitize name: lowercase, alphanumeric + hyphens only
  const sanitized = name.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  if (!sanitized) {
    return NextResponse.json({ error: "Invalid topic name" }, { status: 400 });
  }

  const { data: topic, error } = await supabase
    .from("iot_topics")
    .insert({
      user_id: user.id,
      name: sanitized,
      description: description || null,
      is_private: is_private || false,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Topic name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ topic }, { status: 201 });
}
