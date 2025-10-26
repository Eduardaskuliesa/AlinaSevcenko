import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("TermsPage.metadata");
  
  return {
    title: t("title"),
    description: t("description"),
    robots: "index, follow",
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return [{ locale: "lt" }, { locale: "ru" }];
}

export const dynamic = "force-static";

export default async function TermsOfService() {
  const t = await getTranslations("TermsPage");

  return (
    <>
      <header className="h-auto pb-4 bg-primary w-full flex">
        <div className="max-w-lg px-2 md:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl w-full mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-times mt-4 font-semibold text-gray-100">
            {t("header.title")}
          </h1>
        </div>
      </header>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("mainTitle")}
            </h2>
            <p className="text-gray-600 mb-8">{t("lastUpdated")}</p>

            <div className="prose prose-gray max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.agreementToTerms.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.agreementToTerms.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.courseAccess.title")}
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {t("sections.courseAccess.intro")}
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>
                        <strong>1 {t("sections.courseAccess.options.oneMonth").split(":")[0]}:</strong>{" "}
                        {t("sections.courseAccess.options.oneMonth").split(":")[1]}
                      </li>
                      <li>
                        <strong>3 {t("sections.courseAccess.options.threeMonths").split(":")[0]}:</strong>{" "}
                        {t("sections.courseAccess.options.threeMonths").split(":")[1]}
                      </li>
                      <li>
                        <strong>{t("sections.courseAccess.options.lifetime").split(":")[0]}:</strong>{" "}
                        {t("sections.courseAccess.options.lifetime").split(":")[1]}
                      </li>
                    </ul>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {t("sections.courseAccess.expiration")}
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.paymentTerms.title")}
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {t("sections.paymentTerms.stripe")}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {t("sections.paymentTerms.currency")}
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.noRefund.title")}
                </h2>
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {t("sections.noRefund.policy")}
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  {t("sections.noRefund.acknowledgment")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.userAccount.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("sections.userAccount.intro")}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>{t("sections.userAccount.responsibilities.credentials")}</li>
                  <li>{t("sections.userAccount.responsibilities.activities")}</li>
                  <li>{t("sections.userAccount.responsibilities.unauthorized")}</li>
                  <li>{t("sections.userAccount.responsibilities.accurate")}</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  {t("sections.userAccount.sharing")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.intellectualProperty.title")}
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {t("sections.intellectualProperty.intro")}
                  </p>
                  <p className="text-gray-700 leading-relaxed">{t("sections.intellectualProperty.prohibited")}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>{t("sections.intellectualProperty.actions.download")}</li>
                    <li>{t("sections.intellectualProperty.actions.share")}</li>
                    <li>{t("sections.intellectualProperty.actions.record")}</li>
                    <li>{t("sections.intellectualProperty.actions.commercial")}</li>
                    <li>{t("sections.intellectualProperty.actions.resell")}</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.prohibited.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("sections.prohibited.intro")}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>{t("sections.prohibited.activities.laws")}</li>
                  <li>{t("sections.prohibited.activities.infringe")}</li>
                  <li>{t("sections.prohibited.activities.viruses")}</li>
                  <li>{t("sections.prohibited.activities.unauthorized")}</li>
                  <li>{t("sections.prohibited.activities.automated")}</li>
                  <li>{t("sections.prohibited.activities.harass")}</li>
                  <li>{t("sections.prohibited.activities.spam")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.contentUpdates.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.contentUpdates.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.accountTermination.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.accountTermination.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.limitationOfLiability.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.limitationOfLiability.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.disclaimerOfWarranties.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.disclaimerOfWarranties.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.indemnification.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.indemnification.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.governingLaw.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.governingLaw.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.changesToTerms.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.changesToTerms.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.contactInformation.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.contactInformation.intro")}
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700">
                    <strong>{t("sections.contactInformation.email")}</strong> support@yourplatform.com
                    <br />
                    <strong>{t("sections.contactInformation.address")}</strong> [Your Company Address]
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
