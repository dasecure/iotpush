import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase-admin";

// DELETE /api/account/delete — Permanently delete user account and all data
export async function DELETE(request: NextRequest) {
  try {
    // Get bearer token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify the token and get user
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = user.id;
    const admin = createAdminClient();

    // Delete all user data in order (respecting foreign keys)
    
    // 1. Delete push subscriptions
    await admin
      .from("iot_subscriptions")
      .delete()
      .eq("user_id", userId);

    // 2. Delete topic subscribers (where user subscribed to others' topics)
    await admin
      .from("iot_topic_subscribers")
      .delete()
      .eq("user_id", userId);

    // 3. Delete subscribers from user's topics
    const { data: userTopics } = await admin
      .from("iot_topics")
      .select("id")
      .eq("user_id", userId);

    if (userTopics && userTopics.length > 0) {
      const topicIds = userTopics.map(t => t.id);
      
      // Delete subscribers of user's topics
      await admin
        .from("iot_topic_subscribers")
        .delete()
        .in("topic_id", topicIds);
      
      // Delete messages in user's topics
      await admin
        .from("iot_messages")
        .delete()
        .in("topic_id", topicIds);
    }

    // 4. Delete user's topics
    await admin
      .from("iot_topics")
      .delete()
      .eq("user_id", userId);

    // 5. Delete user's account record
    await admin
      .from("iot_accounts")
      .delete()
      .eq("user_id", userId);

    // 6. Delete the auth user (this is the final step)
    const { error: deleteUserError } = await admin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error("Error deleting auth user:", deleteUserError);
      return NextResponse.json(
        { error: "Failed to delete account. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Account and all associated data have been permanently deleted",
    });

  } catch (error: any) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting your account" },
      { status: 500 }
    );
  }
}

// Also support OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
