"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Smartphone, ExternalLink } from "lucide-react";

const ZAP_RELAY = "wss://relay.zapqr.ai";
const APP_STORE_URL = "https://apps.apple.com/app/zap-passqr/id6740000000"; // Update with real App Store ID

interface ZapQRProps {
  onCredentials: (email: string, password: string) => void;
  accentColor?: string;
}

export default function ZapQR({ onCredentials, accentColor = "#8b5cf6" }: ZapQRProps) {
  const [zapSession, setZapSession] = useState<string | null>(null);
  const [zapStatus, setZapStatus] = useState<"connecting" | "ready" | "connected" | "filled" | "error">("connecting");
  const [isMobile, setIsMobile] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const lastTapRef = useRef<number>(0);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const ua = navigator.userAgent || navigator.vendor;
      return /android|iphone|ipad|ipod|mobile/i.test(ua);
    };
    setIsMobile(checkMobile());
  }, []);

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
            setZapStatus("filled");
            onCredentials(data.username || data.email || "", data.password);
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
  }, [onCredentials]);

  // Build deep link URL
  const getDeepLink = () => {
    if (!zapSession) return null;
    const params = new URLSearchParams({
      d: window.location.hostname,
      s: zapSession,
      r: ZAP_RELAY,
    });
    return `zap://auth?${params.toString()}`;
  };

  // Handle double-tap on mobile
  const handleTap = () => {
    if (!isMobile || !zapSession) return;

    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    lastTapRef.current = now;

    // Double-tap detection (within 300ms)
    if (timeSinceLastTap < 300) {
      launchZapApp();
    }
  };

  // Launch Zap app with fallback to App Store
  const launchZapApp = () => {
    const deepLink = getDeepLink();
    if (!deepLink) return;

    // Try to open the app
    const start = Date.now();
    window.location.href = deepLink;

    // If we're still here after 1.5s, app isn't installed - go to App Store
    setTimeout(() => {
      if (Date.now() - start < 2000) {
        // Page didn't navigate away, app not installed
        if (confirm("ZapQR app not installed. Open App Store to download?")) {
          window.location.href = APP_STORE_URL;
        }
      }
    }, 1500);
  };

  // QR code URL
  const qrData = zapSession
    ? JSON.stringify({ v: 1, s: zapSession, d: window.location.hostname, r: ZAP_RELAY })
    : null;
  const qrUrl = qrData
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`
    : null;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h3 className="text-lg font-semibold text-white mb-2">
        {isMobile ? "⚡ Open in ZapQR" : "Scan to Login"}
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        {isMobile
          ? "Double-tap to open the ZapQR app"
          : "Use your phone to sign in instantly"}
      </p>

      <div
        className={`bg-white p-3 rounded-xl ${isMobile ? "cursor-pointer active:scale-95 transition-transform" : ""}`}
        onClick={handleTap}
        onDoubleClick={isMobile ? launchZapApp : undefined}
      >
        {qrUrl ? (
          <>
            <img
              src={qrUrl}
              alt="Scan with Zap"
              width={180}
              height={180}
              className="rounded-lg"
              draggable={false}
            />
            {isMobile && (
              <div className="mt-2 text-xs text-gray-500 flex items-center justify-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Double-tap to open
              </div>
            )}
          </>
        ) : (
          <div className="w-[180px] h-[180px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm">
        <Smartphone className="w-4 h-4" />
        <span>
          Open <span style={{ color: accentColor }} className="font-medium">ZapQR</span> app
        </span>
      </div>

      <div className="mt-2 text-xs">
        {zapStatus === "connecting" && <span className="text-yellow-500">● Connecting...</span>}
        {zapStatus === "ready" && <span className="text-green-500">● Ready</span>}
        {zapStatus === "connected" && <span className="text-green-500">📱 Phone connected</span>}
        {zapStatus === "filled" && <span className="text-green-500">✓ Credentials received!</span>}
        {zapStatus === "error" && <span className="text-red-500">● Connection failed</span>}
      </div>

      {isMobile && zapSession && (
        <button
          onClick={launchZapApp}
          className="mt-4 px-4 py-2 rounded-lg text-white font-medium text-sm transition"
          style={{ backgroundColor: accentColor }}
        >
          Open ZapQR App
        </button>
      )}
    </div>
  );
}
