import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const admin = createAdminClient();

  // Fetch user's topics
  const { data: topics } = await admin
    .from("iot_topics")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const topicList = topics || [];
  const topicIds = topicList.map((t) => t.id);

  // Fetch message counts per topic
  let topicsWithCounts = topicList.map((t) => ({
    ...t,
    message_count: 0,
    subscriber_count: 0,
    last_message_at: null as string | null,
  }));

  if (topicIds.length > 0) {
    // Get message counts and last message per topic
    for (const topic of topicsWithCounts) {
      const { count } = await admin
        .from("iot_messages")
        .select("*", { count: "exact", head: true })
        .eq("topic_id", topic.id);
      topic.message_count = count || 0;

      const { data: lastMsg } = await admin
        .from("iot_messages")
        .select("created_at")
        .eq("topic_id", topic.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      topic.last_message_at = lastMsg?.created_at || null;

      const { count: subCount } = await admin
        .from("iot_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("topic_id", topic.id)
        .eq("active", true);
      topic.subscriber_count = subCount || 0;
    }

    // Messages today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Recent messages across all topics
    const { data: recentMessages } = await admin
      .from("iot_messages")
      .select("id, title, message, priority, tags, created_at, topic_id")
      .in("topic_id", topicIds)
      .order("created_at", { ascending: false })
      .limit(20);

    // Messages today count
    const { count: messagesToday } = await admin
      .from("iot_messages")
      .select("*", { count: "exact", head: true })
      .in("topic_id", topicIds)
      .gte("created_at", todayStart.toISOString());

    // Total subscribers
    const totalSubscribers = topicsWithCounts.reduce((sum, t) => sum + t.subscriber_count, 0);

    // Map topic names to messages
    const topicMap = Object.fromEntries(topicList.map((t) => [t.id, t.name]));
    const messagesWithTopicName = (recentMessages || []).map((m) => ({
      ...m,
      topic_name: topicMap[m.topic_id] || "unknown",
    }));

    return (
      <DashboardClient
        user={user}
        topics={topicsWithCounts}
        recentMessages={messagesWithTopicName}
        messagesToday={messagesToday || 0}
        totalSubscribers={totalSubscribers}
      />
    );
  }

  return (
    <DashboardClient
      user={user}
      topics={topicsWithCounts}
      recentMessages={[]}
      messagesToday={0}
      totalSubscribers={0}
    />
  );
}
