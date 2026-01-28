"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Plus, Copy, Check, Send, Trash2 } from "lucide-react";

// Mock data
const mockTopics = [
  { id: "1", name: "home-sensors", messages: 142, lastMessage: "2 min ago" },
  { id: "2", name: "server-alerts", messages: 56, lastMessage: "1 hour ago" },
  { id: "3", name: "doorbell", messages: 23, lastMessage: "Yesterday" },
];

const mockMessages = [
  { id: "1", topic: "home-sensors", title: "Temperature Alert", message: "Living room temp exceeded 28°C", time: "2 min ago", priority: "high" },
  { id: "2", topic: "home-sensors", message: "Humidity: 65%", time: "15 min ago", priority: "normal" },
  { id: "3", topic: "server-alerts", title: "CPU Warning", message: "CPU usage at 85%", time: "1 hour ago", priority: "high" },
  { id: "4", topic: "doorbell", message: "Motion detected at front door", time: "Yesterday", priority: "normal" },
];

export default function Dashboard() {
  const [topics] = useState(mockTopics);
  const [messages] = useState(mockMessages);
  const [copied, setCopied] = useState<string | null>(null);
  const [testTopic, setTestTopic] = useState("home-sensors");
  const [testMessage, setTestMessage] = useState("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sendTestMessage = async () => {
    if (!testMessage.trim()) return;
    
    try {
      await fetch(`/api/push/${testTopic}`, {
        method: "POST",
        body: testMessage,
      });
      setTestMessage("");
      alert("Message sent!");
    } catch {
      alert("Failed to send");
    }
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
            <span className="text-gray-400">vincent@dasecure.com</span>
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
            <p className="text-2xl font-bold">47</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Subscribers</p>
            <p className="text-2xl font-bold">5</p>
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
              <button className="text-orange-400 hover:text-orange-300 transition flex items-center gap-1 text-sm">
                <Plus className="w-4 h-4" /> New
              </button>
            </div>
            
            <div className="space-y-3">
              {topics.map((topic) => (
                <div key={topic.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{topic.name}</h3>
                    <button
                      onClick={() => copyToClipboard(`iotpush.com/api/push/${topic.name}`, topic.id)}
                      className="text-gray-500 hover:text-white transition"
                    >
                      {copied === topic.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm">{topic.messages} messages</p>
                  <p className="text-gray-600 text-xs">{topic.lastMessage}</p>
                </div>
              ))}
            </div>

            {/* Quick Test */}
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
                  placeholder="Test message..."
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={sendTestMessage}
                  className="bg-orange-500 hover:bg-orange-600 px-3 py-2 rounded-lg transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 text-sm font-mono">{msg.topic}</span>
                      {msg.priority === "high" && (
                        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded">high</span>
                      )}
                    </div>
                    <span className="text-gray-500 text-sm">{msg.time}</span>
                  </div>
                  {msg.title && <h4 className="font-medium mb-1">{msg.title}</h4>}
                  <p className="text-gray-400 text-sm">{msg.message}</p>
                </div>
              ))}
            </div>
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
              <span className="text-yellow-300">"Your message here"</span>
              <span className="text-gray-300"> https://iotpush.com/api/push/</span>
              <span className="text-orange-400">{topics[0]?.name || "your-topic"}</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
