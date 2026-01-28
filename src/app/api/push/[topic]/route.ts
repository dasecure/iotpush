import { NextRequest, NextResponse } from "next/server";

/**
 * iotpush - Push Notification API
 * 
 * Send a notification to a topic:
 * 
 * POST /api/push/{topic}
 * Body: Plain text message or JSON
 * 
 * Headers (optional):
 * - Title: Notification title
 * - Priority: low, normal, high, urgent
 * - Tags: Comma-separated tags (e.g., "warning,sensor")
 * - Click: URL to open when notification is clicked
 * - Attach: URL of file to attach
 * 
 * Examples:
 * curl -d "Hello!" iotpush.com/api/push/my-topic
 * curl -H "Title: Alert" -d "Temp high!" iotpush.com/api/push/my-topic
 */

// Mock topic storage - replace with Supabase
const mockTopics: Record<string, {
  id: string;
  name: string;
  userId: string;
  isPrivate: boolean;
  subscribers: number;
}> = {
  "my-topic": {
    id: "1",
    name: "my-topic",
    userId: "user1",
    isPrivate: false,
    subscribers: 3,
  },
  "home-sensors": {
    id: "2",
    name: "home-sensors",
    userId: "user1",
    isPrivate: false,
    subscribers: 1,
  },
};

// Mock message storage
const messageHistory: Array<{
  id: string;
  topic: string;
  title?: string;
  message: string;
  priority: string;
  timestamp: string;
}> = [];

export async function POST(
  request: NextRequest,
  { params }: { params: { topic: string } }
) {
  try {
    const topic = params.topic;
    
    // Check if topic exists (or auto-create for free tier)
    // In production, check user's plan and limits
    
    // Parse request
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
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    // Extract optional headers
    const title = request.headers.get("title") || request.headers.get("x-title") || (jsonData.title as string);
    const priority = request.headers.get("priority") || request.headers.get("x-priority") || (jsonData.priority as string) || "normal";
    const tags = request.headers.get("tags") || request.headers.get("x-tags") || (jsonData.tags as string);
    const click = request.headers.get("click") || request.headers.get("x-click") || (jsonData.click as string);

    // Create notification object
    const notification = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      topic,
      title,
      message: message.trim(),
      priority,
      tags: tags?.split(",").map((t: string) => t.trim()),
      click,
      timestamp: new Date().toISOString(),
    };

    // Store in history (for dashboard)
    messageHistory.unshift({
      id: notification.id,
      topic,
      title: title || undefined,
      message: message.trim(),
      priority,
      timestamp: notification.timestamp,
    });

    // Keep only last 100 messages in memory (demo)
    if (messageHistory.length > 100) {
      messageHistory.pop();
    }

    // TODO: In production:
    // 1. Store message in Supabase
    // 2. Check rate limits
    // 3. Send to Web Push subscribers
    // 4. Send to mobile push (FCM/APNs)
    // 5. Forward to webhooks (Slack, Discord, email)

    console.log(`[iotpush] New message on topic "${topic}":`, notification);

    return NextResponse.json({
      success: true,
      id: notification.id,
      topic,
      timestamp: notification.timestamp,
      message: "Notification sent",
      subscribers: mockTopics[topic]?.subscribers || 0,
    });

  } catch (error) {
    console.error("Push error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}

// GET - Retrieve recent messages for a topic (for subscribers)
export async function GET(
  request: NextRequest,
  { params }: { params: { topic: string } }
) {
  const topic = params.topic;
  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since"); // ISO timestamp
  const limit = parseInt(searchParams.get("limit") || "10");

  // Filter messages for this topic
  let messages = messageHistory.filter(m => m.topic === topic);
  
  if (since) {
    messages = messages.filter(m => m.timestamp > since);
  }

  messages = messages.slice(0, Math.min(limit, 50));

  return NextResponse.json({
    topic,
    messages,
    count: messages.length,
  });
}

// Also support PUT for compatibility
export const PUT = POST;
