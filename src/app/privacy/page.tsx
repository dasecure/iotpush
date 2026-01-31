import Link from "next/link";
import { Bell } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-7 h-7 text-orange-400" />
            <span>iot<span className="text-orange-400">push</span></span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Effective date: January 31, 2026</p>

        <div className="prose prose-invert prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              iotpush (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is operated by DaSecure Solutions LLC, San Francisco, CA. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use the iotpush website (iotpush.com) and mobile application (collectively, the &quot;Service&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-orange-400 mt-4 mb-2">Account Information</h3>
            <p className="text-gray-300 leading-relaxed">
              When you create an account, we collect your email address and password (stored securely via Supabase Auth with bcrypt hashing).
            </p>
            <h3 className="text-lg font-medium text-orange-400 mt-4 mb-2">Push Notification Tokens</h3>
            <p className="text-gray-300 leading-relaxed">
              If you enable push notifications, we store your device&apos;s Expo push token to deliver notifications. This token does not contain personal information and is used solely for notification delivery.
            </p>
            <h3 className="text-lg font-medium text-orange-400 mt-4 mb-2">Messages &amp; Topics</h3>
            <p className="text-gray-300 leading-relaxed">
              We store the topics you create and messages sent through the API. Message content is provided by you or your devices and is stored to provide message history functionality.
            </p>
            <h3 className="text-lg font-medium text-orange-400 mt-4 mb-2">Subscriber Information</h3>
            <p className="text-gray-300 leading-relaxed">
              If you add webhook URLs or email addresses as subscribers, these endpoints are stored to deliver notifications.
            </p>
            <h3 className="text-lg font-medium text-orange-400 mt-4 mb-2">Payment Information</h3>
            <p className="text-gray-300 leading-relaxed">
              Payment details are collected and processed directly by Stripe. We do not store your full credit card number on our servers. We receive only a summary (last four digits, card brand, expiration) for display in your account dashboard.
            </p>
            <h3 className="text-lg font-medium text-orange-400 mt-4 mb-2">Usage Data</h3>
            <p className="text-gray-300 leading-relaxed">
              We may collect information about how you interact with the Service, including IP address, browser type, pages visited, and feature usage, to improve the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>To provide and maintain the Service</li>
              <li>To send push notifications to your subscribed devices</li>
              <li>To deliver messages to your configured webhooks and email addresses</li>
              <li>To authenticate your account and protect your topics</li>
              <li>To process payments and manage your subscription</li>
              <li>To communicate with you about your account or the Service</li>
              <li>To detect and prevent fraud, abuse, and security threats</li>
              <li>To improve the Service based on usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Data Storage &amp; Security</h2>
            <p className="text-gray-300 leading-relaxed">
              Your data is stored securely using Supabase (hosted on AWS). All data is encrypted in transit via TLS/SSL. Passwords are hashed using bcrypt. We implement row-level security policies to ensure users can only access their own data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed">We use the following third-party services:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li><strong>Supabase</strong> — Database and authentication</li>
              <li><strong>Stripe</strong> — Payment processing</li>
              <li><strong>Expo / APNs / FCM</strong> — Push notification delivery</li>
              <li><strong>Resend</strong> — Email notification delivery</li>
              <li><strong>Vercel</strong> — Web hosting and edge functions</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-2">
              Each third-party service is governed by its own privacy policy. We encourage you to review their policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              We use essential cookies to maintain your session and authenticate your account. We may also use analytics cookies to understand how the Service is used. You can manage cookie preferences through your browser settings. Disabling essential cookies may prevent parts of the Service from functioning properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">7. Data Retention</h2>
            <p className="text-gray-300 leading-relaxed">
              We retain your data for as long as your account is active. You may delete your account and all associated data at any time by contacting us. Messages are retained indefinitely unless you delete them from the dashboard. Upon account deletion, we will remove your personal data within 30 days, except where retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">8. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate personal data</li>
              <li>Delete your account and all associated data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of email notifications</li>
              <li>Revoke push notification permissions at any time via device settings</li>
              <li>Object to data processing where applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">9. CCPA &amp; GDPR</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong>California Residents (CCPA):</strong> You have the right to know what personal information we collect, request deletion of your data, and opt out of the sale of personal information. We do not sell your personal information.
            </p>
            <p className="text-gray-300 leading-relaxed mt-2">
              <strong>EEA Residents (GDPR):</strong> You have the right to access, rectify, erase, restrict processing, and port your data. Our lawful basis for processing is contract performance and legitimate interest. To exercise any of these rights, contact us at{" "}
              <a href="mailto:support@iotpush.com" className="text-orange-400 hover:text-orange-300 transition">
                support@iotpush.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">10. Children&apos;s Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              The Service is not intended for children under 13. We do not knowingly collect information from children under 13. If we become aware that we have collected data from a child under 13, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">11. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the effective date. Continued use of the Service after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">12. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy, contact us at{" "}
              <a href="mailto:support@iotpush.com" className="text-orange-400 hover:text-orange-300 transition">
                support@iotpush.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} DaSecure Solutions LLC. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
