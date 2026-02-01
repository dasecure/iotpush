"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Loader2, Shield } from "lucide-react";

export default function SSOPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    }>
      <SSOContent />
    </Suspense>
  );
}

function SSOContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setErrorMsg("Missing SSO token");
      return;
    }

    exchangeToken(token);
  }, [searchParams]);

  const exchangeToken = async (token: string) => {
    try {
      // Exchange SSO token for local session
      const res = await fetch("/api/auth/sso/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error || "SSO authentication failed");
        return;
      }

      // Use the token_hash to verify and create local session
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: data.email,
        token: data.token_hash,
        type: "email",
      });

      if (verifyError) {
        // Fallback: try magiclink type
        const { error: fallbackError } = await supabase.auth.verifyOtp({
          email: data.email,
          token: data.token_hash,
          type: "magiclink",
        });

        if (fallbackError) {
          console.error("[SSO] OTP verify failed:", fallbackError);
          setStatus("error");
          setErrorMsg("Failed to establish session. Please try logging in directly.");
          return;
        }
      }

      // Success — redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("[SSO] Exchange error:", err);
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">SSO Login Failed</h1>
          <p className="text-gray-400 mb-6">{errorMsg}</p>
          <a
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Sign in manually
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-white mb-2">Signing you in...</h1>
        <p className="text-gray-400">Connecting via DaSecure SSO</p>
      </div>
    </div>
  );
}
