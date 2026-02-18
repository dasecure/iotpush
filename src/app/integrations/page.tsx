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

        {/* Pushover-Compatible Section Header */}
        <section className="mb-8">
          <div className="text-center">
            <div className="inline-block bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1 text-green-400 text-sm mb-4">
              Drop-in Pushover replacement
            </div>
            <h2 className="text-3xl font-bold mb-3">Pushover-Compatible Integrations</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              These apps have built-in Pushover support. Just change the API URL to iotpush and use your topic API key.
            </p>
          </div>
        </section>

        {/* Sonarr / Radarr / Lidarr */}
        <section className="mb-16">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center text-white font-bold text-sm">*arr</div>
              <div>
                <h2 className="text-2xl font-bold">Sonarr / Radarr / Lidarr</h2>
                <p className="text-gray-400 text-sm">Media automation for TV, movies, and music</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              All *arr apps have native Pushover support. Configure iotpush as a custom Pushover server.
            </p>

            <h3 className="text-lg font-semibold mb-3">Setup Steps</h3>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-6">
              <li>Go to <strong>Settings → Connect → Add → Pushover</strong></li>
              <li>Click the wrench icon to access advanced settings</li>
              <li>Set <strong>Server</strong> to: <code className="text-orange-400 bg-gray-800 px-2 py-0.5 rounded">https://iotpush.com</code></li>
              <li>Set <strong>API Key</strong> to your iotpush topic API key</li>
              <li>Set <strong>User Key</strong> to your topic name (e.g., <code className="text-orange-400">sonarr-alerts</code>)</li>
              <li>Test and save!</li>
            </ol>

            <CopyBlock
              language="Sonarr/Radarr Connection Settings"
              code={`Name:      iotpush
Server:    https://iotpush.com
API Key:   your-topic-api-key-here
User Key:  your-topic-name

Triggers:  ✓ On Grab  ✓ On Download  ✓ On Upgrade  ✓ On Health Issue`}
            />

            <p className="text-gray-500 text-sm mt-3">
              💡 Works the same for Sonarr, Radarr, Lidarr, Readarr, and Prowlarr.
            </p>
          </div>
        </section>

        {/* Prometheus / Grafana */}
        <section className="mb-16">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Prometheus Alertmanager</h2>
                <p className="text-gray-400 text-sm">Metrics alerting for Kubernetes and beyond</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              Alertmanager supports Pushover natively. Configure iotpush as the receiver.
            </p>

            <h3 className="text-lg font-semibold mb-3">alertmanager.yml</h3>

            <CopyBlock
              language="yaml"
              code={`receivers:
  - name: 'iotpush'
    pushover_configs:
      - user_key: 'your-topic-name'
        token: 'your-topic-api-key'
        # Override Pushover URL to use iotpush
        http_config:
          proxy_url: ''
        # Custom API URL (requires Alertmanager 0.25+)
        api_url: 'https://iotpush.com/api/1/messages.json'
        
        title: '{{ .Status | toUpper }}: {{ .CommonLabels.alertname }}'
        message: '{{ .CommonAnnotations.summary }}'
        priority: '{{ if eq .Status "firing" }}1{{ else }}0{{ end }}'

route:
  receiver: 'iotpush'
  group_by: ['alertname']
  group_wait: 30s`}
            />

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
              <p className="text-yellow-300 text-sm">
                <strong>Note:</strong> If your Alertmanager version doesn&apos;t support <code>api_url</code>, use a webhook receiver instead pointing to <code>https://iotpush.com/api/push/your-topic</code>
              </p>
            </div>
          </div>
        </section>

        {/* UptimeRobot / Healthchecks.io */}
        <section className="mb-16">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded flex items-center justify-center text-white font-bold text-sm">✓</div>
              <div>
                <h2 className="text-2xl font-bold">UptimeRobot / Healthchecks.io</h2>
                <p className="text-gray-400 text-sm">Uptime and cron job monitoring</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">UptimeRobot</h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm">
                  <li>Go to <strong>My Settings → Alert Contacts</strong></li>
                  <li>Add new contact → <strong>Pushover</strong></li>
                  <li>API Token: your iotpush topic API key</li>
                  <li>User Key: your topic name</li>
                  <li>For the server URL, use webhook instead with: <code className="text-orange-400 text-xs">https://iotpush.com/api/push/your-topic</code></li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Healthchecks.io</h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm">
                  <li>Go to <strong>Integrations → Pushover</strong></li>
                  <li>Since healthchecks.io doesn&apos;t allow custom URLs, use <strong>Webhook</strong> instead</li>
                  <li>URL: <code className="text-orange-400 text-xs">https://iotpush.com/api/push/your-topic</code></li>
                  <li>Method: POST</li>
                  <li>Add header: <code className="text-orange-400 text-xs">Authorization: Bearer YOUR_API_KEY</code></li>
                </ol>
              </div>
            </div>

            <CopyBlock
              language="Webhook URL for monitoring services"
              code={`POST https://iotpush.com/api/push/uptime-alerts

Headers:
  Authorization: Bearer your-topic-api-key
  Content-Type: application/json

Body:
{
  "title": "$MONITORNAME is $ALERTTYPE",
  "message": "$MONITORURL - $ALERTDETAIL",
  "priority": "high"
}`}
            />
          </div>
        </section>

        {/* SABnzbd / Downloaders */}
        <section className="mb-16">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded flex items-center justify-center text-white font-bold text-sm">↓</div>
              <div>
                <h2 className="text-2xl font-bold">SABnzbd / qBittorrent / Transmission</h2>
                <p className="text-gray-400 text-sm">Download managers and torrent clients</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">SABnzbd</h3>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-6">
              <li>Go to <strong>Config → Notifications</strong></li>
              <li>Enable Pushover notifications</li>
              <li>API Key: your iotpush topic API key</li>
              <li>User Key: your topic name</li>
              <li>SABnzbd doesn&apos;t allow custom URLs, so use the script method below</li>
            </ol>

            <h3 className="text-lg font-semibold mb-3">Post-Processing Script (Universal)</h3>
            <CopyBlock
              language="bash"
              code={`#!/bin/bash
# save as: iotpush-notify.sh
# Add to your download client's post-processing scripts

TOPIC="downloads"
API_KEY="your-topic-api-key"
TITLE="Download Complete"
MESSAGE="$1 has finished downloading"

curl -s -X POST "https://iotpush.com/api/push/$TOPIC" \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d "{\\"title\\": \\"$TITLE\\", \\"message\\": \\"$MESSAGE\\"}"
`}
            />

            <p className="text-gray-500 text-sm mt-3">
              💡 Works with any download client that supports post-processing scripts.
            </p>
          </div>
        </section>

        {/* openHAB / Domoticz */}
        <section className="mb-16">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">openHAB / Domoticz</h2>
                <p className="text-gray-400 text-sm">Open-source home automation platforms</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">openHAB (pushover binding)</h3>
            <CopyBlock
              language="text"
              code={`# In services/pushover.cfg, openHAB's Pushover binding 
# doesn't support custom URLs. Use HTTP binding instead:

# things/http.things
Thing http:url:iotpush "iotpush" [
    baseURL="https://iotpush.com/api/push/home-alerts",
    authMode="BASIC",
    username="",
    password="your-topic-api-key"
]

# rules/notify.rules
rule "Motion Alert"
when
    Item MotionSensor changed to ON
then
    sendHttpPostRequest(
        "https://iotpush.com/api/push/home-alerts",
        "application/json",
        '{"title":"Motion","message":"Motion detected!","priority":"high"}',
        newHashMap("Authorization" -> "Bearer YOUR_API_KEY")
    )
end`}
            />

            <h3 className="text-lg font-semibold mb-3 mt-6">Domoticz</h3>
            <CopyBlock
              language="text"
              code={`# Setup → Settings → Notifications → Pushover

# Domoticz doesn't support custom Pushover URLs.
# Use Custom HTTP/Action instead:

# Setup → More Options → Events → Create dzVents script:

return {
    on = { devices = { 'Motion Sensor' } },
    execute = function(domoticz, device)
        if device.state == 'On' then
            domoticz.openURL({
                url = 'https://iotpush.com/api/push/domoticz',
                method = 'POST',
                headers = { 
                    ['Authorization'] = 'Bearer YOUR_API_KEY',
                    ['Content-Type'] = 'application/json'
                },
                postData = {
                    title = 'Motion Alert',
                    message = device.name .. ' triggered',
                    priority = 'high'
                }
            })
        end
    end
}`}
            />
          </div>
        </section>

        {/* Generic Migration Guide */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-green-900/20 to-gray-900/60 border border-green-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">🔄 Migrating from Pushover?</h2>
            <p className="text-gray-300 text-center mb-6 max-w-2xl mx-auto">
              For any app with Pushover support, the migration is simple:
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-800/60 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">1️⃣</div>
                <h4 className="font-semibold mb-1">Change URL</h4>
                <p className="text-gray-400 text-sm">
                  <code className="text-red-400 line-through">api.pushover.net</code><br />
                  <code className="text-green-400">iotpush.com</code>
                </p>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">2️⃣</div>
                <h4 className="font-semibold mb-1">Use Topic API Key</h4>
                <p className="text-gray-400 text-sm">
                  Your iotpush topic API key<br />goes in the <code className="text-orange-400">token</code> field
                </p>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">3️⃣</div>
                <h4 className="font-semibold mb-1">Topic Name</h4>
                <p className="text-gray-400 text-sm">
                  Your topic name goes in<br />the <code className="text-orange-400">user</code> field
                </p>
              </div>
            </div>

            <CopyBlock
              language="Pushover → iotpush Migration"
              code={`# Before (Pushover)
curl -s --form-string "token=PUSHOVER_APP_TOKEN" \\
       --form-string "user=PUSHOVER_USER_KEY" \\
       --form-string "message=Hello" \\
       https://api.pushover.net/1/messages.json

# After (iotpush) — just change URL and credentials!
curl -s --form-string "token=YOUR_IOTPUSH_TOPIC_API_KEY" \\
       --form-string "user=your-topic-name" \\
       --form-string "message=Hello" \\
       https://iotpush.com/api/1/messages.json`}
            />
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
