"use client";

import { useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";

const PRODUCTS = [
  { id: "passqr", name: "PassQR", icon: "🎫", color: "blue", desc: "Digital QR passes" },
  { id: "iotpush", name: "iotpush", icon: "🔔", color: "orange", desc: "IoT push notifications" },
  { id: "waitlistwin", name: "WaitlistWin", icon: "📋", color: "purple", desc: "Waitlist management" },
  { id: "sensestamp", name: "SenseStamp", icon: "🔏", color: "emerald", desc: "IoT security sensors" },
];

const CURRENT_PRODUCT = process.env.NEXT_PUBLIC_SSO_PRODUCT_ID || "iotpush";

export default function SSOSwitcher() {
  const [loading, setLoading] = useState<string | null>(null);

  const otherProducts = PRODUCTS.filter((p) => p.id !== CURRENT_PRODUCT);

  const handleSwitch = async (targetId: string) => {
    setLoading(targetId);
    try {
      const res = await fetch("/api/auth/sso/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: targetId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to switch");
        setLoading(null);
      }
    } catch {
      alert("Failed to switch product");
      setLoading(null);
    }
  };

  return (
    <div className="border border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">
        DaSecure Products
      </p>
      <div className="space-y-2">
        {otherProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => handleSwitch(product.id)}
            disabled={loading !== null}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition text-left group disabled:opacity-50"
          >
            <span className="text-xl">{product.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-200 group-hover:text-white transition">
                {product.name}
              </p>
              <p className="text-xs text-gray-500">{product.desc}</p>
            </div>
            {loading === product.id ? (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            ) : (
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
