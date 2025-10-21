import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Your Platform Name",
  description:
    "Read our terms of service to understand the rules and guidelines for using our course platform, including access periods, payment terms, and our no-refund policy.",
  robots: "index, follow",
  openGraph: {
    title: "Terms of Service | Your Platform Name",
    description: "Terms and conditions for using our course platform.",
    type: "website",
  },
};

export const dynamic = "force-static";

export default function TermsOfService() {
  return (
    <>
      <header className="h-auto pb-4 bg-primary w-full flex">
        <div className="max-w-lg px-2 md:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl w-full mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-times mt-4 font-semibold text-gray-100">
            Terms of Service
          </h1>
        </div>
      </header>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h2>
            <p className="text-gray-600 mb-8">Last updated: October 22, 2025</p>

            <div className="prose prose-gray max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Agreement to Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing or using our course platform, you agree to be
                  bound by these Terms of Service. If you do not agree to these
                  terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Course Access and Subscriptions
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    We offer courses with different access durations. When
                    purchasing a course, you must select your preferred access
                    period:
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>
                        <strong>1 Month Access:</strong> Course access expires
                        30 days after purchase
                      </li>
                      <li>
                        <strong>3 Month Access:</strong> Course access expires
                        90 days after purchase
                      </li>
                      <li>
                        <strong>Lifetime Access:</strong> Permanent access to
                        the course with no expiration
                      </li>
                    </ul>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Once your access period expires (for 1-month or 3-month
                    options), you will no longer be able to access the course
                    content unless you purchase a new access period or upgrade
                    to lifetime access.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Payment Terms
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    All payments are processed securely through Stripe. By
                    making a purchase, you agree to provide accurate payment
                    information and authorize us to charge your payment method.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Prices are displayed in the currency shown at checkout and
                    may be subject to applicable taxes.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  No Refund Policy
                </h2>
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    All sales are final. We do not offer refunds for any course
                    purchases, regardless of the access duration selected.
                    Please carefully review the course details and select your
                    access period before completing your purchase.
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  By completing a purchase, you acknowledge and accept this
                  no-refund policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  User Account
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To access courses, you must create an account. You are
                  responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>
                    Maintaining the confidentiality of your account credentials
                  </li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                  <li>Providing accurate and complete information</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  You may not share your account credentials or allow others to
                  access courses using your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Intellectual Property
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    All course content, including but not limited to videos,
                    text, images, audio, and materials, is owned by the course
                    creator and protected by copyright laws.
                  </p>
                  <p className="text-gray-700 leading-relaxed">You may not:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>
                      Download, copy, reproduce, or distribute course content
                    </li>
                    <li>Share your login credentials with others</li>
                    <li>Record, screenshot, or capture course materials</li>
                    <li>Use course content for commercial purposes</li>
                    <li>Resell or transfer your access to others</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Prohibited Activities
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit viruses or malicious code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated tools to access the platform</li>
                  <li>Harass or harm other users</li>
                  <li>Post spam or inappropriate content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Content Updates and Availability
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify, update, or remove course
                  content at any time without prior notice. While we strive to
                  maintain continuous access, we do not guarantee uninterrupted
                  availability of the platform or courses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Account Termination
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or terminate your account at
                  any time if you violate these terms or engage in prohibited
                  activities. No refunds will be provided for terminated
                  accounts.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Limitation of Liability
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  To the fullest extent permitted by law, we shall not be liable
                  for any indirect, incidental, special, consequential, or
                  punitive damages arising from your use of our platform or
                  courses. Our total liability shall not exceed the amount you
                  paid for the specific course in question.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Disclaimer of Warranties
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Our platform and courses are provided &quot;as is&quot;
                  without warranties of any kind, either express or implied. We
                  do not guarantee specific results from taking our courses and
                  make no representations about the accuracy or completeness of
                  the content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Indemnification
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree to indemnify and hold us harmless from any claims,
                  damages, losses, or expenses arising from your violation of
                  these terms or your use of our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Governing Law
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  These terms shall be governed by and construed in accordance
                  with the laws of [Your Jurisdiction], without regard to its
                  conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Changes to Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. We
                  will notify users of significant changes via email or platform
                  notification. Continued use of our services after changes
                  constitutes acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms of Service, please
                  contact us at:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700">
                    <strong>Email:</strong> support@yourplatform.com
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
