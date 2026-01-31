import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://iotpush.com"),
  title: "iotpush - Push Notifications for IoT Devices",
  description: "Send push notifications from any device with a simple HTTP request. Raspberry Pi, Arduino, servers — if it can curl, it can push.",
  keywords: ["IoT", "push notifications", "Raspberry Pi", "Arduino", "notifications", "alerts"],
  openGraph: {
    title: "iotpush — One API call. Push, email, and webhook delivery.",
    description: "Send push notifications, emails, and webhooks from any device with a single HTTP request. The multi-channel notification API for IoT.",
    type: "website",
    // TODO: Create actual og-image.png (1200x630) and place in /public/og-image.png
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "iotpush — Multi-channel notifications for IoT" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
