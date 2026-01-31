import Link from "next/link";
import { Bell, ArrowLeft } from "lucide-react";

export default function Docs() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-7 h-7 text-orange-400" />
            <span>iot<span className="text-orange-400">push</span></span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 prose prose-invert">
        <h1 className="text-4xl font-bold mb-8">Documentation</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
          <p className="text-gray-400 mb-4">
            Send your first notification in seconds. No signup required for public topics.
          </p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
            <p className="text-gray-500"># Just send a POST request</p>
            <p>curl -d "Hello from my Pi!" iotpush.com/api/push/my-topic</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
          
          <h3 className="text-xl font-medium mt-6 mb-3">Send Notification</h3>
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
            <code className="text-orange-400">POST /api/push/{"{topic}"}</code>
          </div>
          
          <h4 className="font-medium mb-2">Request Body</h4>
          <p className="text-gray-400 mb-4">Plain text or JSON message</p>
          
          <h4 className="font-medium mb-2">Optional Headers</h4>
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="text-left border-b border-gray-800">
                <th className="py-2">Header</th>
                <th className="py-2">Description</th>
                <th className="py-2">Example</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono">Title</td>
                <td className="py-2">Notification title</td>
                <td className="py-2 font-mono">Alert!</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono">Priority</td>
                <td className="py-2">low, normal, high, urgent</td>
                <td className="py-2 font-mono">high</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono">Tags</td>
                <td className="py-2">Comma-separated tags</td>
                <td className="py-2 font-mono">warning,sensor</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2 font-mono">Click</td>
                <td className="py-2">URL to open on click</td>
                <td className="py-2 font-mono">https://...</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-medium mb-2">Examples</h4>
          
          <p className="text-gray-400 text-sm mb-2">Simple message:</p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm mb-4">
            <p>curl -d "Sensor triggered!" iotpush.com/api/push/my-topic</p>
          </div>

          <p className="text-gray-400 text-sm mb-2">With title and priority:</p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm mb-4">
            <p>curl -H "Title: Alert" -H "Priority: high" \</p>
            <p>     -d "Temperature exceeded 80°C" \</p>
            <p>     iotpush.com/api/push/my-topic</p>
          </div>

          <p className="text-gray-400 text-sm mb-2">JSON body:</p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm mb-4">
            <p>curl -H "Content-Type: application/json" \</p>
            <p>     -d '{`'{"title":"Alert","message":"Temp high!","priority":"high"}'`}' \</p>
            <p>     iotpush.com/api/push/my-topic</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Language Examples</h2>
          
          <h3 className="text-lg font-medium mt-6 mb-3">Python</h3>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
            <pre>{`import requests

requests.post(
    "https://iotpush.com/api/push/my-topic",
    data="Hello from Python!",
    headers={"Title": "Python Alert"}
)`}</pre>
          </div>

          <h3 className="text-lg font-medium mt-6 mb-3">JavaScript / Node.js</h3>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
            <pre>{`fetch("https://iotpush.com/api/push/my-topic", {
  method: "POST",
  body: "Hello from JS!",
  headers: { "Title": "JS Alert" }
});`}</pre>
          </div>

          <h3 className="text-lg font-medium mt-6 mb-3">Arduino / ESP32</h3>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
            <pre>{`#include <HTTPClient.h>

HTTPClient http;
http.begin("https://iotpush.com/api/push/my-topic");
http.addHeader("Title", "ESP32 Alert");
http.POST("Sensor value: " + String(sensorValue));
http.end();`}</pre>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-800">
                <th className="py-2">Plan</th>
                <th className="py-2">Messages/Month</th>
                <th className="py-2">Topics</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              <tr className="border-b border-gray-800">
                <td className="py-2">Free</td>
                <td className="py-2">1,000</td>
                <td className="py-2">3</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">Pro ($9/mo)</td>
                <td className="py-2">10,000</td>
                <td className="py-2">10</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2">Business ($29/mo)</td>
                <td className="py-2">100,000</td>
                <td className="py-2">Unlimited</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
