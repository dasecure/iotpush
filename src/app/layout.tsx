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
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'IoTPush',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web, iOS, Android',
  description: 'Send push notifications, emails, and webhooks from any device with a single HTTP request. Works with Raspberry Pi, Arduino, ESP32.',
  url: 'https://iotpush.com',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan with 1,000 pushes/month',
  },
  publisher: {
    '@type': 'Organization',
    name: 'DaSecure Solutions LLC',
    url: 'https://dasecure.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
