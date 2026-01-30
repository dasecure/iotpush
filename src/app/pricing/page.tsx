import Link from "next/link";
import { Bell, Check, ArrowRight } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "For makers & hobby projects",
    features: [
      "1 topic",
      "100 pushes/month",
      "Public topics only",
      "Web push notifications",
      "Community support",
    ],
    cta: "Get Started",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/mo",
    description: "For serious IoT projects",
    features: [
      "10 topics",
      "10,000 pushes/month",
      "Private topics",
      "Webhooks (Slack, Discord, email)",
      "30-day message history",
      "Email support",
    ],
    cta: "Start Pro",
    href: "/signup?plan=pro",
    highlight: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "/mo",
    description: "For teams & production",
    features: [
      "Unlimited topics",
      "100,000 pushes/month",
      "Private topics",
      "Webhooks (Slack, Discord, email)",
      "90-day message history",
      "Priority support",
    ],
    cta: "Start Business",
    href: "/signup?plan=business",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-gray-950/80 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-7 h-7 text-orange-400" />
            <span>
              iot<span className="text-orange-400">push</span>
            </span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/docs" className="text-gray-300 hover:text-white transition">
              Docs
            </Link>
            <Link href="/pricing" className="text-white font-medium">
              Pricing
            </Link>
            <Link href="/login" className="text-gray-300 hover:text-white transition">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-medium transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
            <p className="text-xl text-gray-400">
              Free for hobby projects. Affordable for production.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`p-8 rounded-xl border relative ${
                  tier.highlight
                    ? "bg-gradient-to-br from-orange-900/50 to-gray-800/50 border-orange-500/50"
                    : "bg-gray-800/50 border-gray-700"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-sm px-3 py-1 rounded-full font-medium">
                    Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                <div className="text-4xl font-bold mb-6">
                  {tier.price}
                  {tier.period && (
                    <span className="text-lg text-gray-400">{tier.period}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`block text-center py-3 rounded-lg font-semibold transition ${
                    tier.highlight
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "border border-gray-600 hover:border-gray-500"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">What counts as a push?</h3>
                <p className="text-gray-400 text-sm">
                  Each HTTP request to your topic endpoint counts as one push. Delivery to
                  multiple subscribers from a single push is included.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I upgrade or downgrade anytime?</h3>
                <p className="text-gray-400 text-sm">
                  Yes! Upgrades take effect immediately with prorated billing. Downgrades apply
                  at the end of your billing cycle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What happens if I exceed my push limit?</h3>
                <p className="text-gray-400 text-sm">
                  We&apos;ll send you a notification when you&apos;re approaching your limit. Once
                  exceeded, pushes will be queued until the next billing cycle or you upgrade.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer annual billing?</h3>
                <p className="text-gray-400 text-sm">
                  Not yet, but it&apos;s coming soon! Annual plans will include a 20% discount.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to push?</h2>
            <p className="text-gray-400 mb-8">
              Get your first notification in under a minute.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg transition"
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-400" />
            <span className="font-semibold">iotpush</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 iotpush by dasecure solutions LLC</p>
          <div className="flex gap-6">
            <Link href="/docs" className="text-gray-500 hover:text-white transition text-sm">
              Docs
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-white transition text-sm">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
