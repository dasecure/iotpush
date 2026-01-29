"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Plus, Copy, Check, Send, Trash2, LogOut, Lock, Globe, X } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Topic {
  id: string;
  name: string;
  description: string | null;
  is_private: boolean;
  api_key: string;
  created_at: string;
  message_count: number;
  subscriber_count: number;
  last_message_at: string | null;
}

interface Message {
  id: string;
  title: string | null;
  message: string;
  priority: string;
  tags: string[] | null;
  created_at: string;
  topic_id: string;
  topic_name: string;
}

interface DashboardProps {
  user: User;
  topics: Topic[];
  recentMessages: Message[];
  messagesToday: number;
  totalSubscribers: number;
}

export default function DashboardClient({
  user,
  topics: initialTopics,
  recentMessages,
  messagesToday,
  totalSubscribers,
}: DashboardProps) {
  const [topics, setTopics] = useState(initialTopics);
  const [copied, setCopied] = useState<string | null>(null);
  const [testTopic, setTestTopic] = useState(topics[0]?.name || "");
  const [testMessage, setTestMessage] = useState("");
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDesc, setNewTopicDesc] = useState("");
  const [newTopicPrivate, setNewTopicPrivate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sendTestMessage = async () => {
    if (!testMessage.trim() || !testTopic) return;
    setSending(true);
    try {
      const res = await fetch(`/api/push/${testTopic}`, {
        method: "POST",
        body: testMessage,
      });
      if (res.ok) {
        setTestMessage("");
        router.refresh();
      }
    } catch {
      // ignore
    }
    setSending(false);
  };

  const createTopic = async () => {
    if (!newTopicName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTopicName,
          description: newTopicDesc || null,
          is_private: newTopicPrivate,
        }),
      });
      if (res.ok) {
        const { topic } = await res.json();
        setTopics([{ ...topic, message_count: 0, subscriber_count: 0, last_message_at: null }, ...topics]);
        setNewTopicName("");
        setNewTopicDesc("");
        setNewTopicPrivate(false);
        setShowNewTopic(false);
        if (!testTopic) setTestTopic(topic.name);
      }
    } catch {
      // ignore
    }
    setCreating(false);
  };

  const deleteTopic = async (id: string) => {
    if (!confirm("Delete this topic and all its messages?")) return;
    const res = await fetch(`/api/topics/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTopics(topics.filter((t) => t.id !== id));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const timeAgo = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-7 h-7 text-orange-400" />
            <span>iot<span className="text-orange-400">push</span></span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/docs" className="text-gray-400 hover:text-white transition">Docs</Link>
            <span className="text-gray-400 text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-white transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Topics</p>
            <p className="text-2xl font-bold">{topics.length}</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Messages Today</p>
            <p className="text-2xl font-bold">{messagesToday}</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Subscribers</p>
            <p className="text-2xl font-bold">{totalSubscribers}</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Plan</p>
            <p className="text-2xl font-bold text-orange-400">Free</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Topics */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Topics</h2>
              <button
                onClick={() => setShowNewTopic(true)}
                className="text-orange-400 hover:text-orange-300 transition flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" /> New
              </button>
            </div>

            {/* New Topic Form */}
            {showNewTopic && (
              <div className="bg-gray-800/80 border border-orange-500/30 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-sm">Create Topic</h3>
                  <button onClick={() => setShowNewTopic(false)} className="text-gray-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="Topic name (e.g. home-sensors)"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 mb-2 text-sm focus:outline-none focus:border-orange-500"
                />
                <input
                  type="text"
                  value={newTopicDesc}
                  onChange={(e) => setNewTopicDesc(e.target.value)}
                  placeholder="Description (optional)"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 mb-2 text-sm focus:outline-none focus:border-orange-500"
                />
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <input
                    type="checkbox"
                    checked={newTopicPrivate}
                    onChange={(e) => setNewTopicPrivate(e.target.checked)}
                    className="accent-orange-500"
                  />
                  <Lock className="w-3 h-3" /> Private (requires API key)
                </label>
                <button
                  onClick={createTopic}
                  disabled={creating || !newTopicName.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-3 py-2 transition"
                >
                  {creating ? "Creating..." : "Create Topic"}
                </button>
              </div>
            )}

            {topics.length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
                <p className="text-gray-400 text-sm">No topics yet.</p>
                <button
                  onClick={() => setShowNewTopic(true)}
                  className="text-orange-400 hover:text-orange-300 text-sm mt-2 transition"
                >
                  Create your first topic →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {topics.map((topic) => (
                  <div key={topic.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{topic.name}</h3>
                        {topic.is_private ? (
                          <span title="Private"><Lock className="w-3 h-3 text-yellow-400" /></span>
                        ) : (
                          <span title="Public"><Globe className="w-3 h-3 text-green-400" /></span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(
                            `curl -d "Hello" ${window.location.origin}/api/push/${topic.name}`,
                            `curl-${topic.id}`
                          )}
                          className="text-gray-500 hover:text-white transition p-1"
                          title="Copy curl command"
                        >
                          {copied === `curl-${topic.id}` ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteTopic(topic.id)}
                          className="text-gray-500 hover:text-red-400 transition p-1"
                          title="Delete topic"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {topic.description && (
                      <p className="text-gray-500 text-xs mb-1">{topic.description}</p>
                    )}
                    <p className="text-gray-500 text-sm">{topic.message_count} messages</p>
                    <p className="text-gray-600 text-xs">{timeAgo(topic.last_message_at)}</p>
                    {topic.is_private && (
                      <button
                        onClick={() => copyToClipboard(topic.api_key, `key-${topic.id}`)}
                        className="mt-2 text-xs text-gray-500 hover:text-yellow-400 transition flex items-center gap-1"
                      >
                        {copied === `key-${topic.id}` ? (
                          <><Check className="w-3 h-3 text-green-400" /> Copied!</>
                        ) : (
                          <>🔑 Copy API Key</>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Quick Test */}
            {topics.length > 0 && (
              <div className="mt-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="font-medium mb-3">Quick Test</h3>
                <select
                  value={testTopic}
                  onChange={(e) => setTestTopic(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 mb-2 text-sm"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendTestMessage()}
                    placeholder="Test message..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={sendTestMessage}
                    disabled={sending || !testMessage.trim()}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-3 py-2 rounded-lg transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recent Messages */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
            {recentMessages.length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-400">No messages yet.</p>
                <p className="text-gray-500 text-sm mt-1">
                  Send your first message using the Quick Test or curl.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400 text-sm font-mono">{msg.topic_name}</span>
                        {msg.priority === "high" && (
                          <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded">high</span>
                        )}
                        {msg.priority === "urgent" && (
                          <span className="bg-red-500/30 text-red-300 text-xs px-2 py-0.5 rounded">urgent</span>
                        )}
                        {msg.tags && msg.tags.map((tag) => (
                          <span key={tag} className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm">{timeAgo(msg.created_at)}</span>
                    </div>
                    {msg.title && <h4 className="font-medium mb-1">{msg.title}</h4>}
                    <p className="text-gray-400 text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Integration Example */}
        <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Integration</h3>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <p className="text-gray-500"># Send from your Raspberry Pi / server / anywhere:</p>
            <p className="mt-2">
              <span className="text-green-400">curl</span>
              <span className="text-gray-300"> -d </span>
              <span className="text-yellow-300">&quot;Your message here&quot;</span>
              <span className="text-gray-300"> {typeof window !== "undefined" ? window.location.origin : "https://iotpush.com"}/api/push/</span>
              <span className="text-orange-400">{topics[0]?.name || "your-topic"}</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
