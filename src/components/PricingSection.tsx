"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  const proPrice = annual ? 7.2 : 9;
  const businessPrice = annual ? 23.2 : 29;
  const billingLabel = annual ? "/mo (billed annually)" : "/mo";

  return (
    <section id="pricing" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
        <p className="text-gray-400 text-center mb-8">Free for hobby projects, affordable for production</p>
        
        {/* Annual toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm ${!annual ? "text-white font-medium" : "text-gray-400"}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${annual ? "bg-orange-500" : "bg-gray-600"}`}
            aria-label="Toggle annual billing"
          >
            <div
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${annual ? "translate-x-7" : ""}`}
            />
          </button>
          <span className={`text-sm ${annual ? "text-white font-medium" : "text-gray-400"}`}>
            Annual <span className="text-orange-400 text-xs font-semibold">Save 20%</span>
          </span>
        </div>

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
            <div className="text-4xl font-bold mb-1">
              ${proPrice}<span className="text-lg text-gray-400">{billingLabel}</span>
            </div>
            {annual && <p className="text-orange-400 text-xs mb-5">${(proPrice * 12).toFixed(0)}/year — save ${((9 * 12) - (proPrice * 12)).toFixed(0)}</p>}
            {!annual && <div className="mb-6" />}
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
            <Link href={`/signup?plan=pro${annual ? "&billing=annual" : ""}`} className="block text-center bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-semibold transition">
              Start Pro
            </Link>
          </div>

          {/* Business */}
          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold mb-2">Business</h3>
            <p className="text-gray-400 text-sm mb-4">For teams & production</p>
            <div className="text-4xl font-bold mb-1">
              ${businessPrice}<span className="text-lg text-gray-400">{billingLabel}</span>
            </div>
            {annual && <p className="text-orange-400 text-xs mb-5">${(businessPrice * 12).toFixed(0)}/year — save ${((29 * 12) - (businessPrice * 12)).toFixed(0)}</p>}
            {!annual && <div className="mb-6" />}
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
              <li className="flex items-center gap-2 text-gray-300">
                <span className="text-orange-400">✓</span> 90-day message history
              </li>
            </ul>
            <Link href={`/signup?plan=business${annual ? "&billing=annual" : ""}`} className="block text-center border border-gray-600 hover:border-gray-500 py-3 rounded-lg transition font-medium">
              Start Business
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
