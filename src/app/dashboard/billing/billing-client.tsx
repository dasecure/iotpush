"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Bell,
  Check,
  CreditCard,
  LogOut,
  ArrowLeft,
  Loader2,
  Zap,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface BillingProps {
  userId: string;
  email: string;
  plan: string;
  pushesUsed: number;
  pushesResetAt: string;
  hasStripeCustomer: boolean;
}

const PLAN_DETAILS = {
  free: {
    name: "Free",
    price: "$0",
    topics: "1 topic",
    pushes: "100 pushes/month",
    features: ["Public topics only", "Web push", "Community support"],
  },
  pro: {
    name: "Pro",
    price: "$9/mo",
    topics: "10 topics",
    pushes: "10,000 pushes/month",
    features: ["Private topics", "Webhooks", "Email support"],
  },
  business: {
    name: "Business",
    price: "$29/mo",
    topics: "Unlimited topics",
    pushes: "100,000 pushes/month",
    features: ["Private topics", "Webhooks", "Priority support"],
  },
};

const PUSH_LIMITS: Record<string, number> = {
  free: 100,
  pro: 10_000,
  business: 100_000,
};

export default function BillingClient({
  userId,
  email,
  plan,
  pushesUsed,
  pushesResetAt,
  hasStripeCustomer,
}: BillingProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const router = useRouter();
  const supabase = createClient();

  const currentPlan = PLAN_DETAILS[plan as keyof typeof PLAN_DETAILS] || PLAN_DETAILS.free;
  const pushLimit = PUSH_LIMITS[plan] || 100;
  const pushPercent = Math.min((pushesUsed / pushLimit) * 100, 100);

  const handleCheckout = async (targetPlan: string) => {
    setLoading(targetPlan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan, userId }),
      });
      const data = await res.json();

      if (data.upgraded) {
        // In-place upgrade
        router.refresh();
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Failed to start checkout");
    }
    setLoading(null);
  };

  const handlePortal = async () => {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Failed to open billing portal");
    }
    setLoading(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="text-2xl font-bold flex items-center gap-2"
          >
            <Bell className="w-7 h-7 text-orange-400" />
            <span>
              iot<span className="text-orange-400">push</span>
            </span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-white transition"
            >
              Dashboard
            </Link>
            <Link
              href="/docs"
              className="text-gray-400 hover:text-white transition"
            >
              Docs
            </Link>
            <span className="text-gray-400 text-sm">{email}</span>
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

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-8">Billing & Plan</h1>

        {/* Success/Cancel banners */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 text-green-400">
            <Check className="w-5 h-5 inline mr-2" />
            Your plan has been upgraded successfully!
          </div>
        )}
        {canceled && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 text-yellow-400">
            Checkout was canceled. No changes were made.
          </div>
        )}

        {/* Current Plan */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Current Plan</p>
              <h2 className="text-2xl font-bold">
                {currentPlan.name}{" "}
                <span className="text-gray-400 text-lg font-normal">
                  {currentPlan.price}
                </span>
              </h2>
            </div>
            {hasStripeCustomer && (
              <button
                onClick={handlePortal}
                disabled={loading === "portal"}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading === "portal" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                Manage Billing
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-xs mb-1">Topics</p>
              <p className="font-medium">{currentPlan.topics}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Push Limit</p>
              <p className="font-medium">{currentPlan.pushes}</p>
            </div>
          </div>

          {/* Push usage bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Pushes used this month</span>
              <span>
                {pushesUsed.toLocaleString()} / {pushLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  pushPercent > 90
                    ? "bg-red-500"
                    : pushPercent > 70
                    ? "bg-yellow-500"
                    : "bg-orange-500"
                }`}
                style={{ width: `${pushPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Resets{" "}
              {new Date(pushesResetAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Plan Options */}
        {plan === "free" && (
          <>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" /> Upgrade Your Plan
            </h3>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {/* Pro */}
              <div className="bg-gradient-to-br from-orange-900/30 to-gray-800/50 border border-orange-500/30 rounded-xl p-6">
                <h4 className="text-lg font-bold mb-1">Pro</h4>
                <p className="text-3xl font-bold mb-4">
                  $9<span className="text-lg text-gray-400">/mo</span>
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-orange-400" /> 10 topics
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-orange-400" /> 10k pushes/month
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-orange-400" /> Private topics
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-orange-400" /> Webhooks
                  </li>
                </ul>
                <button
                  onClick={() => handleCheckout("pro")}
                  disabled={loading !== null}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading === "pro" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                  Upgrade to Pro
                </button>
              </div>

              {/* Business */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-bold mb-1">Business</h4>
                <p className="text-3xl font-bold mb-4">
                  $29<span className="text-lg text-gray-400">/mo</span>
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-orange-400" /> Unlimited topics
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-orange-400" /> 100k pushes/month
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-orange-400" /> Private topics
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-orange-400" /> Priority support
                  </li>
                </ul>
                <button
                  onClick={() => handleCheckout("business")}
                  disabled={loading !== null}
                  className="w-full border border-gray-600 hover:border-gray-500 font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading === "business" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                  Upgrade to Business
                </button>
              </div>
            </div>
          </>
        )}

        {plan === "pro" && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-2">Need more?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Upgrade to Business for unlimited topics and 100k pushes/month.
            </p>
            <button
              onClick={() => handleCheckout("business")}
              disabled={loading !== null}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading === "business" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              Upgrade to Business — $29/mo
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
