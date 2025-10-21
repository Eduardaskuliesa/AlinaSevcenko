import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Your Platform Name",
  description:
    "Learn how we collect, use, and protect your personal information on our course platform. Read our privacy policy for details on data security and your rights.",
  robots: "index, follow",
  openGraph: {
    title: "Privacy Policy | Your Platform Name",
    description: "Our commitment to protecting your privacy and personal data.",
    type: "website",
  },
};

export const dynamic = "force-static";

export default function PrivacyPolicy() {
  return (
    <>
      <header className="h-auto pb-4 bg-primary w-full flex">
        <div className="max-w-lg px-2 md:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl w-full mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-times mt-4 font-semibold text-gray-100">
            Privacy Policy
          </h1>
        </div>
      </header>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h2>
            <p className="text-gray-600 mb-8">Last updated: October 22, 2025</p>

            <div className="prose prose-gray max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We respect your privacy and are committed to protecting your
                  personal data. This privacy policy explains how we collect,
                  use, and safeguard your information when you use our course
                  platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Personal Information
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>Name and email address</li>
                      <li>Account credentials</li>
                      <li>
                        Payment information (processed securely by Stripe)
                      </li>
                      <li>Course progress and completion data</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Automatically Collected Information
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Usage data and analytics</li>
                      <li>Cookies and similar technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  How We Use Your Information
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Provide access to purchased courses</li>
                  <li>Process payments securely through Stripe</li>
                  <li>
                    Send transactional emails (receipts, password resets,
                    notifications)
                  </li>
                  <li>Track course progress and completion</li>
                  <li>Improve our platform and user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Third-Party Services
                </h2>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <p className="text-gray-700">
                    <strong>Stripe:</strong> We use Stripe to process payments.
                    Stripe collects and processes your payment information
                    according to their privacy policy. We do not store your full
                    credit card details on our servers.
                  </p>
                </div>
                <p className="text-gray-700">
                  Other third-party services we may use include analytics
                  providers and email service providers. These services have
                  their own privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate technical and organizational measures
                  to protect your personal data against unauthorized access,
                  alteration, disclosure, or destruction. This includes
                  encryption, secure servers, and regular security audits.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Your Rights
                </h2>
                <p className="text-gray-700 mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to data processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Cookies
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to improve
                  your experience on our platform. You can control cookie
                  settings through your browser preferences. Essential cookies
                  are required for the platform to function properly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Data Retention
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your personal data for as long as necessary to
                  provide our services and comply with legal obligations. Course
                  progress data is retained while your account is active. You
                  may request data deletion at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Changes to This Policy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this privacy policy from time to time. We will
                  notify you of any significant changes by email or through a
                  notice on our platform. Continued use of our services after
                  changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this privacy policy or how we
                  handle your data, please contact us at:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@yourplatform.com
                    <br />
                    <strong>Address:</strong> [Your Company Address]
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
