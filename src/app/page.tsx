import Link from "next/link";
import { Bell, Cpu, Zap, Shield, Globe, Terminal, ArrowRight, Smartphone, Mail, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-gray-950/80 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-7 h-7 text-orange-400" />
            <span>iot<span className="text-orange-400">push</span></span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/docs" className="text-gray-300 hover:text-white transition">Docs</Link>
            <Link href="/integrations" className="text-gray-300 hover:text-white transition">Integrations</Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>
            <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
            <Link 
              href="/signup" 
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-medium transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-block bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1 text-orange-400 text-sm mb-6">
              Multi-channel notifications for IoT
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              One API call.<br />
              <span className="text-orange-400">Push, email, and webhook.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Send push notifications, emails, and webhooks from any device with a single HTTP request.
              Raspberry Pi, Arduino, servers — if it can curl, it can notify everywhere.
            </p>
            
            {/* Code Example */}
            <div className="bg-gray-900 rounded-xl p-4 mb-8 font-mono text-sm overflow-x-auto">
              <p className="text-gray-500 mb-2"># Send a notification in one line</p>
              <p>
                <span className="text-green-400">curl</span>
                <span className="text-gray-300"> -d </span>
                <span className="text-yellow-300">"Your sensor triggered!"</span>
                <span className="text-gray-300"> iotpush.com/</span>
                <span className="text-orange-400">your-topic</span>
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
              <Link 
                href="/signup" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg transition flex items-center gap-2"
              >
                Start for Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/docs" 
                className="border border-gray-700 hover:border-gray-500 px-8 py-4 rounded-lg transition flex items-center gap-2"
              >
                <Terminal className="w-5 h-5" /> View Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Dead simple</h2>
          <p className="text-gray-400 text-center mb-12">Three steps to push notifications</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create a topic</h3>
              <p className="text-gray-400">Get a unique topic URL for your project or device</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Subscribe</h3>
              <p className="text-gray-400">Get notifications on web, mobile, or desktop</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Push!</h3>
              <p className="text-gray-400">Send notifications with a simple HTTP request</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Built for IoT</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Layers, title: "Multi-Channel Delivery", desc: "Push, email, and webhook — all from one API call. Notify everywhere at once." },
              { icon: Cpu, title: "Any Device", desc: "Raspberry Pi, Arduino, ESP32, servers — anything with HTTP" },
              { icon: Zap, title: "Instant Delivery", desc: "Real-time push to all subscribed devices" },
              { icon: Terminal, title: "Simple API", desc: "One curl command. No SDKs required." },
              { icon: Smartphone, title: "Mobile Ready", desc: "iOS and Android push notifications" },
              { icon: Shield, title: "Secure", desc: "Optional authentication and private topics" },
            ].map((feature) => (
              <div key={feature.title} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <feature.icon className="w-10 h-10 text-orange-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Works everywhere</h2>
          <p className="text-gray-400 text-center mb-12">Send from any language or platform</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bash/Curl */}
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
              <div className="px-4 py-2 bg-gray-800 text-sm text-gray-400 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Bash / cURL
              </div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code>{`# Simple message
curl -d "Hello from my Pi!" \\
  iotpush.com/my-topic

# With title and priority
curl -H "Title: Alert!" \\
  -H "Priority: high" \\
  -d "Temperature exceeded 80°C" \\
  iotpush.com/my-topic`}</code>
              </pre>
            </div>

            {/* Python */}
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
              <div className="px-4 py-2 bg-gray-800 text-sm text-gray-400 flex items-center gap-2">
                🐍 Python
              </div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code>{`import requests

requests.post(
    "https://iotpush.com/my-topic",
    data="Sensor triggered!",
    headers={
        "Title": "Motion Detected",
        "Priority": "high"
    }
)`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Works with everything</h2>
          <p className="text-gray-400 text-center mb-12">If it can make an HTTP request, it works with iotpush</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {[
              { name: "n8n", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
              { name: "cURL / Any HTTP", color: "bg-gray-500/20 text-gray-300 border-gray-500/30" },
              { name: "Arduino / ESP32", color: "bg-green-500/20 text-green-400 border-green-500/30" },
              { name: "Raspberry Pi", color: "bg-red-500/20 text-red-400 border-red-500/30" },
              { name: "Node.js / Python", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
            ].map((platform) => (
              <div
                key={platform.name}
                className={`${platform.color} border rounded-xl p-4 text-center font-medium text-sm`}
              >
                {platform.name}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/integrations"
              className="inline-flex items-center gap-2 border border-orange-500/50 text-orange-400 hover:bg-orange-500/10 px-6 py-3 rounded-lg transition font-medium"
            >
              View Integration Guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-gray-400 text-center mb-12">Free for hobby projects, affordable for production</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-gray-400 text-sm mb-4">For makers & hobby projects</p>
              <div className="text-4xl font-bold mb-6">$0</div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> 3 topics
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> 1,000 pushes/month
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> Push + email delivery
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> Public topics only
                </li>
              </ul>
              <Link href="/signup" className="block text-center border border-gray-600 hover:border-gray-500 py-3 rounded-lg transition">
                Get Started
              </Link>
            </div>
            
            {/* Pro */}
            <div className="bg-gradient-to-br from-orange-900/50 to-gray-800/50 p-8 rounded-xl border border-orange-500/50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-sm px-3 py-1 rounded-full">
                Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-gray-400 text-sm mb-4">For serious IoT projects</p>
              <div className="text-4xl font-bold mb-6">$9<span className="text-lg text-gray-400">/mo</span></div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> 10 topics
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> 10,000 pushes/month
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> Private topics
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> Webhooks (Slack, Discord, email)
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> 30-day message history
                </li>
              </ul>
              <Link href="/signup?plan=pro" className="block text-center bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-semibold transition">
                Start Pro
              </Link>
            </div>

            {/* Business */}
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold mb-2">Business</h3>
              <p className="text-gray-400 text-sm mb-4">For teams & production</p>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-400">/mo</span></div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> Unlimited topics
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> 100,000 pushes/month
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> Private topics
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> Webhooks
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-orange-400">✓</span> Priority support
                </li>
              </ul>
              <Link href="/signup?plan=business" className="block text-center border border-gray-600 hover:border-gray-500 py-3 rounded-lg transition">
                Start Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to push?</h2>
          <p className="text-gray-400 mb-8">Get your first notification in under a minute.</p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg transition"
          >
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
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
