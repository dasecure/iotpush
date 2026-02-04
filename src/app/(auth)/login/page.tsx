"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Loader2, Smartphone } from "lucide-react";

const ZAP_RELAY = "wss://zap.passqr.com";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Zap QR state
  const [zapSession, setZapSession] = useState<string | null>(null);
  const [zapStatus, setZapStatus] = useState<"connecting" | "ready" | "connected" | "filled" | "error">("connecting");
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize Zap WebSocket
  useEffect(() => {
    const ws = new WebSocket(ZAP_RELAY);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "create_session", domain: window.location.hostname }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "session_created") {
        setZapSession(msg.sessionId);
        setZapStatus("ready");
      }
      if (msg.type === "mobile_connected") {
        setZapStatus("connected");
      }
      if (msg.type === "payload") {
        try {
          const data = JSON.parse(atob(msg.data));
          if (data.password) {
            setPassword(data.password);
            if (data.username || data.email) setEmail(data.username || data.email);
            setZapStatus("filled");
            setTimeout(() => {
              document.getElementById("login-form")?.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
              );
            }, 500);
          }
        } catch (e) {
          console.error("[Zap] Payload error:", e);
        }
      }
      if (msg.type === "session_expired") {
        ws.send(JSON.stringify({ type: "create_session", domain: window.location.hostname }));
      }
    };

    ws.onerror = () => setZapStatus("error");
    ws.onclose = () => {
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) setZapStatus("connecting");
      }, 3000);
    };

    return () => ws.close();
  }, []);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    await supabase.auth.signOut({ scope: "local" });
    document.cookie.split(";").forEach((c) => {
      const name = c.trim().split("=")[0];
      if (name.startsWith("sb-") || name.includes("code-verifier")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback`, queryParams: { prompt: "select_account" } },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  // QR code URL
  const qrData = zapSession
    ? JSON.stringify({ v: 1, s: zapSession, d: typeof window !== "undefined" ? window.location.hostname : "iotpush.com", r: ZAP_RELAY })
    : null;
  const qrUrl = qrData ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}` : null;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold">
            <Bell className="w-8 h-8 text-orange-400" />
            <span className="text-white">iot<span className="text-orange-400">push</span></span>
          </Link>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        {/* Side-by-side layout on desktop */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Login Form */}
          <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-800 font-medium rounded-lg px-4 py-2.5 transition flex items-center justify-center gap-3 border border-gray-300"
            >
              {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            <form id="login-form" onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
                  placeholder="••••••••"
                />
                <div className="text-right mt-1">
                  <Link href="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300 transition">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium rounded-lg px-4 py-2.5 transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Sign In
              </button>
            </form>
          </div>

          {/* Right: Zap QR Code */}
          <div className="lg:w-72 bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-white mb-2">Scan to Login</h3>
            <p className="text-gray-400 text-sm text-center mb-4">
              Use your phone to sign in instantly
            </p>

            <div className="bg-white p-3 rounded-xl">
              {qrUrl ? (
                <img src={qrUrl} alt="Scan with Zap" width={180} height={180} className="rounded-lg" />
              ) : (
                <div className="w-[180px] h-[180px] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm">
              <Smartphone className="w-4 h-4" />
              <span>
                Open <span className="text-orange-400 font-medium">Zap</span> app
              </span>
            </div>

            <div className="mt-2 text-xs">
              {zapStatus === "connecting" && <span className="text-yellow-500">● Connecting...</span>}
              {zapStatus === "ready" && <span className="text-green-500">● Ready to scan</span>}
              {zapStatus === "connected" && <span className="text-green-500">📱 Phone connected</span>}
              {zapStatus === "filled" && <span className="text-green-500">✓ Credentials received!</span>}
              {zapStatus === "error" && <span className="text-red-500">● Connection failed</span>}
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 mt-4 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-orange-400 hover:text-orange-300 transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
