import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "iotpush — One API call. Push, email, and webhook delivery.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        {/* Brand color accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "#f97316",
          }}
        />

        {/* Product name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            marginBottom: "16px",
            display: "flex",
          }}
        >
          <span style={{ color: "white" }}>iot</span>
          <span style={{ color: "#f97316" }}>push</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          One API call. Push, email, and webhook delivery.
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: 24,
            color: "#f97316",
          }}
        >
          iotpush.com
        </div>
      </div>
    ),
    { ...size }
  );
}
