"use client";

import Link from "next/link";
import { Bell, ArrowLeft, Copy, Check, Home, Terminal, Globe, Workflow, Zap, Code2, ArrowRight } from "lucide-react";
import { useState } from "react";

function CopyBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/80 border-b border-gray-700">
        <span className="text-xs text-gray-400 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto text-gray-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// SVG icons for platforms
function N8nIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
      <rect width="24" height="24" rx="4" fill="#EA4B71" />
      <path d="M7 12h10M12 7v10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MakeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
      <rect width="24" height="24" rx="4" fill="#6D00CC" />
      <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  );
}

function ZapierIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
      <rect width="24" height="24" rx="4" fill="#FF4A00" />
      <path d="M12 4L8 12h8l-4 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeAssistantIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
      <rect width="24" height="24" rx="4" fill="#18BCF2" />
      <path d="M12 4L4 12h3v7h10v-7h3L12 4z" fill="white" />
    </svg>
  );
}

export default function Integrations() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-7 h-7 text-orange-400" />
            <span>iot<span className="text-orange-400">push</span></span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/docs" className="text-gray-300 hover:text-white transition">Docs</Link>
            <Link href="/integrations" className="text-orange-400 font-medium">Integrations</Link>
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-block bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1 text-orange-400 text-sm mb-4">
            Works with everything
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Integrations</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            If it can make an HTTP request, it works with iotpush.
            Connect your favorite automation platforms in minutes.
          </p>
        </div>

        {/* n8n */}
        <section className="mb-16">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <N8nIcon />
              <div>
                <h2 className="text-2xl font-bold">n8n</h2>
                <p className="text-gray-400 text-sm">Open-source workflow automation</p>
              </div>
            </div>

            <p className="text-gray-300 mb-4">
              Use the <strong>HTTP Request</strong> node in n8n to send push notifications from any workflow.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">Example Workflow</span>
                </div>
                <p className="text-gray-400 text-sm">Get a push notification when a new row is added to Google Sheets</p>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">Example Workflow</span>
                </div>
                <p className="text-gray-400 text-sm">Monitor a website and get alerted when it goes down</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">HTTP Request Node Configuration</h3>

            <CopyBlock
              language="n8n — HTTP Request Node"
              code={`Method:  POST
URL:     https://www.iotpush.com/api/push/my-topic

Headers:
  Authorization: Bearer {api_key}
  Content-Type:  application/json

Body (JSON):
{
  "title": "New Row Added",
  "message": "{{$json.column_name}} was added to the sheet",
  "priority": "normal"
}`}
            />

            <p className="text-gray-500 text-sm mt-3">
              💡 Tip: Use n8n expressions like <code className="text-orange-400/80">{"{{$json.field}}"}</code> to inject dynamic data from previous nodes.
            </p>
          </div>
        </section>

        {/* Make (Integromat) */}
        <section className="mb-16">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <MakeIcon />
              <div>
                <h2 className="text-2xl font-bold">Make <span className="text-gray-500 text-lg font-normal">(Integromat)</span></h2>
                <p className="text-gray-400 text-sm">Visual automation platform</p>
              </div>
            </div>

            <p className="text-gray-300 mb-4">
              Add an <strong>HTTP &gt; Make a request</strong> module to any Make scenario to send iotpush notifications.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">Example Scenario</span>
                </div>
                <p className="text-gray-400 text-sm">Get push notifications for new Shopify orders</p>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">Example Scenario</span>
                </div>
                <p className="text-gray-400 text-sm">Alert when someone fills out a Typeform</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">HTTP Module Configuration</h3>

            <CopyBlock
              language="Make — HTTP Module"
              code={`Module: HTTP > Make a request

URL:     https://www.iotpush.com/api/push/my-topic
Method:  POST

Headers:
  Authorization: Bearer {api_key}
  Content-Type:  application/json

Request content:
{
  "title": "New Shopify Order",
  "message": "Order #{{order_number}} — {{total_price}}",
  "priority": "high"
}`}
            />

            <p className="text-gray-500 text-sm mt-3">
              💡 Tip: Map fields from previous modules using Make&apos;s variable picker to create dynamic notifications.
            </p>
          </div>
        </section>

        {/* Zapier */}
        <section className="mb-16">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <ZapierIcon />
              <div>
                <h2 className="text-2xl font-bold">Zapier</h2>
                <p className="text-gray-400 text-sm">Connect your apps and automate workflows</p>
              </div>
            </div>

            <p className="text-gray-300 mb-4">
              Use the <strong>Webhooks by Zapier</strong> action to send a POST request to iotpush from any Zap.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">Example Zap</span>
                </div>
                <p className="text-gray-400 text-sm">New email in Gmail → push notification</p>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">Example Zap</span>
                </div>
                <p className="text-gray-400 text-sm">New Stripe payment → push alert</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Webhooks by Zapier — POST Action</h3>

            <CopyBlock
              language="Zapier — Webhooks Action"
              code={`Action: Webhooks by Zapier > POST

URL:     https://www.iotpush.com/api/push/my-topic

Headers:
  Authorization: Bearer {api_key}
  Content-Type:  application/json

Data (JSON):
{
  "title": "New Payment",
  "message": "Received {{amount}} from {{customer_email}}",
  "priority": "normal"
}

Payload Type: json`}
            />

            <p className="text-gray-500 text-sm mt-3">
              💡 Tip: Use Zapier&apos;s field mapping to insert data from any trigger (Gmail, Stripe, Airtable, etc.).
            </p>
          </div>
        </section>

        {/* Home Assistant */}
        <section className="mb-16">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <HomeAssistantIcon />
              <div>
                <h2 className="text-2xl font-bold">Home Assistant</h2>
                <p className="text-gray-400 text-sm">Open-source home automation</p>
              </div>
            </div>

            <p className="text-gray-300 mb-4">
              Define a <strong>REST command</strong> in your Home Assistant configuration, then call it from any automation.
              Perfect for motion sensors, door triggers, temperature alerts, and more.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">Example Automation</span>
                </div>
                <p className="text-gray-400 text-sm">Motion sensor triggers → push notification to your phone</p>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">Example Automation</span>
                </div>
                <p className="text-gray-400 text-sm">Temperature sensor exceeds threshold → instant alert</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">configuration.yaml — REST Command</h3>

            <CopyBlock
              language="yaml"
              code={`rest_command:
  iotpush_notify:
    url: "https://www.iotpush.com/api/push/my-topic"
    method: POST
    headers:
      Authorization: "Bearer YOUR_API_KEY"
      Content-Type: "application/json"
    payload: >
      {"title": "{{ title }}", "message": "{{ message }}", "priority": "{{ priority }}"}`}
            />

            <h3 className="text-lg font-semibold mb-3 mt-6">Automation Example — Motion Sensor</h3>

            <CopyBlock
              language="yaml"
              code={`automation:
  - alias: "Motion Alert — Front Door"
    trigger:
      - platform: state
        entity_id: binary_sensor.front_door_motion
        to: "on"
    action:
      - service: rest_command.iotpush_notify
        data:
          title: "Motion Detected"
          message: "Movement at the front door at {{ now().strftime('%H:%M') }}"
          priority: "high"`}
            />

            <p className="text-gray-500 text-sm mt-3">
              💡 Tip: Use Home Assistant templates to include sensor values, timestamps, and device states in your notifications.
            </p>
          </div>
        </section>

        {/* cURL / Any Platform */}
        <section className="mb-16">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                <Terminal className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">cURL / Any Platform</h2>
                <p className="text-gray-400 text-sm">Works with anything that can make HTTP requests</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              iotpush uses a simple HTTP API. If your tool, script, or platform can send an HTTP POST request, it can send push notifications.
            </p>

            <h3 className="text-lg font-semibold mb-3">Quick Test</h3>
            <CopyBlock
              language="bash"
              code={`# Simplest possible push notification
curl -d "Hello World!" https://www.iotpush.com/api/push/my-topic`}
            />

            <h3 className="text-lg font-semibold mb-3">With Authentication</h3>
            <CopyBlock
              language="bash"
              code={`curl -X POST https://www.iotpush.com/api/push/my-topic \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Server Alert",
    "message": "CPU usage at 95%",
    "priority": "high"
  }'`}
            />

            <h3 className="text-lg font-semibold mb-3">Using Headers</h3>
            <CopyBlock
              language="bash"
              code={`curl -X POST https://www.iotpush.com/api/push/my-topic \\
  -H "Title: Disk Space Warning" \\
  -H "Priority: urgent" \\
  -H "Tags: server,disk" \\
  -d "Only 5% disk space remaining on /dev/sda1"`}
            />

            <h3 className="text-lg font-semibold mb-3">wget Alternative</h3>
            <CopyBlock
              language="bash"
              code={`wget --post-data="Backup complete!" \\
  https://www.iotpush.com/api/push/my-topic`}
            />

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mt-6">
              <p className="text-orange-300 text-sm">
                <strong>Works with:</strong> Shell scripts, cron jobs, CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins),
                monitoring tools (Prometheus Alertmanager, Grafana), IoT devices (ESP32, Raspberry Pi), and literally anything else with HTTP.
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-orange-900/20 to-gray-900/60 border border-orange-500/20 rounded-2xl p-8 text-center">
            <div className="inline-block bg-orange-500/20 rounded-full p-3 mb-4">
              <Zap className="w-8 h-8 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Coming Soon: Native Integrations</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-6">
              We&apos;re building native nodes and apps for popular automation platforms.
              No more HTTP configuration — just drag, drop, and push.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "Zapier App", icon: <ZapierIcon /> },
                { name: "n8n Node", icon: <N8nIcon /> },
                { name: "Make App", icon: <MakeIcon /> },
                { name: "Home Assistant Add-on", icon: <HomeAssistantIcon /> },
              ].map((item) => (
                <div
                  key={item.name}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 flex items-center gap-3"
                >
                  {item.icon}
                  <span className="text-sm text-gray-300">{item.name}</span>
                  <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">Soon</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to automate?</h2>
          <p className="text-gray-400 mb-8">Create a free account and start pushing in under a minute.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg transition"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 border border-gray-700 hover:border-gray-500 px-8 py-4 rounded-lg transition"
            >
              <Code2 className="w-5 h-5" /> API Docs
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-400" />
            <span className="font-semibold">iotpush</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 iotpush by dasecure solutions LLC</p>
          <div className="flex gap-6">
            <Link href="/docs" className="text-gray-500 hover:text-white transition text-sm">Docs</Link>
            <Link href="/integrations" className="text-gray-500 hover:text-white transition text-sm">Integrations</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-white transition text-sm">Privacy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-white transition text-sm">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
