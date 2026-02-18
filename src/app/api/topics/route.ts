import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { PLAN_LIMITS, type PlanName } from "@/lib/stripe";

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
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    
    const { name, description, is_private } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Topic name is required" }, { status: 400 });
    }

    // --- Enforce topic creation limit based on user's plan ---
    const admin = createAdminClient();
    
    // Get or create account
    let { data: account, error: accountError } = await admin
      .from("iot_accounts")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    // If no account exists (user signed up before migration), create one
    if (accountError?.code === "PGRST116") {
      const { data: newAccount, error: createError } = await admin
        .from("iot_accounts")
        .insert({ user_id: user.id, plan: "free" })
        .select("plan")
        .single();
      
      if (createError) {
        console.error("[topics] Failed to create account:", createError);
        return NextResponse.json({ error: "Failed to initialize account" }, { status: 500 });
      }
      account = newAccount;
    } else if (accountError) {
      console.error("[topics] Account lookup failed:", accountError);
      return NextResponse.json({ error: "Failed to verify account" }, { status: 500 });
    }

    const plan = (account?.plan || "free") as PlanName;
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    const { count: existingTopicCount } = await supabase
      .from("iot_topics")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((existingTopicCount || 0) >= limits.topics) {
      return NextResponse.json(
        {
          error: `Topic limit reached (${limits.topics} topic${limits.topics === 1 ? "" : "s"} on ${plan} plan). Upgrade at /dashboard/billing`,
          limit: limits.topics,
          current: existingTopicCount,
          plan,
        },
        { status: 403 }
      );
    }

    // Gate private topics by plan
    if (is_private && !limits.privateTopics) {
      return NextResponse.json(
        {
          error: `Private topics require a Pro or Business plan. Upgrade at /dashboard/billing`,
          plan,
        },
        { status: 403 }
      );
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
      console.error("[topics] Insert failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ topic }, { status: 201 });
  } catch (err) {
    console.error("[topics] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
