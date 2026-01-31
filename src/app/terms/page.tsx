import Link from "next/link";
import { Bell } from "lucide-react";

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Effective date: January 31, 2026</p>

        <div className="prose prose-invert prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Agreement to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing or using iotpush (&quot;the Service&quot;), operated by DaSecure Solutions LLC, San Francisco, CA, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed">
              iotpush is an IoT push notification service that allows you to create topics, manage subscribers, send push notifications, configure webhooks, and deliver email notifications to connected devices and endpoints.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Account Registration</h2>
            <p className="text-gray-300 leading-relaxed">
              You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. User Responsibilities</h2>
            <p className="text-gray-300 leading-relaxed">You agree to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>Use the Service only for lawful purposes and in compliance with all applicable laws</li>
              <li>Not send unsolicited or spam notifications to subscribers</li>
              <li>Maintain accurate contact information on your account</li>
              <li>Ensure that all content sent through the Service complies with applicable laws and regulations</li>
              <li>Protect your API keys and credentials from unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Prohibited Use</h2>
            <p className="text-gray-300 leading-relaxed">You may not use the Service to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li>Send malicious, abusive, or harmful content</li>
              <li>Distribute malware, phishing attempts, or fraudulent notifications</li>
              <li>Interfere with or disrupt the Service or its infrastructure</li>
              <li>Attempt to gain unauthorized access to other users&apos; accounts or data</li>
              <li>Resell, redistribute, or sublicense the Service without written consent</li>
              <li>Violate any applicable local, state, national, or international law</li>
              <li>Exceed rate limits or abuse the API in a way that degrades performance for other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              The Service, including its design, logos, code, and documentation, is the intellectual property of DaSecure Solutions LLC. You retain ownership of all content you send through the Service. By using the Service, you grant us a limited license to process and deliver your content as necessary to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">7. Payment &amp; Billing</h2>
            <p className="text-gray-300 leading-relaxed">
              Paid plans are billed in advance on a monthly or annual basis. All payments are processed securely through Stripe. Refunds are handled on a case-by-case basis. We reserve the right to change pricing with 30 days&apos; notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">8. Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed">The Service relies on the following third-party providers:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
              <li><strong>Stripe</strong> — Payment processing</li>
              <li><strong>Supabase</strong> — Database, authentication, and storage</li>
              <li><strong>Vercel</strong> — Web hosting and edge functions</li>
              <li><strong>Expo / APNs / FCM</strong> — Push notification delivery</li>
              <li><strong>Resend</strong> — Email delivery</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-2">
              Each third-party service is governed by its own terms and privacy policy. We are not responsible for the practices of these providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">9. Data Collection &amp; Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Your use of the Service is also governed by our{" "}
              <Link href="/privacy" className="text-orange-400 hover:text-orange-300 transition">
                Privacy Policy
              </Link>
              , which describes how we collect, use, and protect your data. By using the Service, you consent to the data practices described therein.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">10. Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              We use essential cookies to maintain your session and authenticate your account. We may use analytics cookies to understand how the Service is used. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">11. Service Availability &amp; Warranties</h2>
            <p className="text-gray-300 leading-relaxed">
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied. We do not guarantee uninterrupted or error-free operation. We may modify, suspend, or discontinue the Service at any time with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">12. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, DaSecure Solutions LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, revenue, or profits, arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">13. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We may suspend or terminate your account at any time for violation of these terms or for any other reason at our discretion with reasonable notice. You may terminate your account at any time by contacting us. Upon termination, your right to use the Service ceases and we may delete your data after a reasonable retention period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">14. CCPA &amp; GDPR</h2>
            <p className="text-gray-300 leading-relaxed">
              If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA), including the right to know what personal data we collect and the right to request deletion. If you are located in the European Economic Area, you have rights under the General Data Protection Regulation (GDPR), including the right to access, rectify, and erase your personal data. To exercise any of these rights, contact us at{" "}
              <a href="mailto:support@iotpush.com" className="text-orange-400 hover:text-orange-300 transition">
                support@iotpush.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">15. Changes to These Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to update these Terms of Service at any time. We will notify you of material changes by posting the revised terms on this page and updating the effective date. Continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">16. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">17. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about these Terms of Service, contact us at{" "}
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
