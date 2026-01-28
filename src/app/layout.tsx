import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iotpush - Push Notifications for IoT Devices",
  description: "Send push notifications from any device with a simple HTTP request. Raspberry Pi, Arduino, servers — if it can curl, it can push.",
  keywords: ["IoT", "push notifications", "Raspberry Pi", "Arduino", "notifications", "alerts"],
  openGraph: {
    title: "iotpush",
    description: "Push notifications for IoT devices",
    type: "website",
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
