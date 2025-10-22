import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PrivacyPage.metadata");
  
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

export const dynamic = "force-static";

export default async function PrivacyPolicy() {
  const t = await getTranslations("PrivacyPage");
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
                  {t("sections.introduction.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.introduction.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.informationWeCollect.title")}
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t("sections.informationWeCollect.personalInfo.title")}
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>{t("sections.informationWeCollect.personalInfo.items.name")}</li>
                      <li>{t("sections.informationWeCollect.personalInfo.items.credentials")}</li>
                      <li>{t("sections.informationWeCollect.personalInfo.items.payment")}</li>
                      <li>{t("sections.informationWeCollect.personalInfo.items.progress")}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t("sections.informationWeCollect.automaticInfo.title")}
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>{t("sections.informationWeCollect.automaticInfo.items.ip")}</li>
                      <li>{t("sections.informationWeCollect.automaticInfo.items.browser")}</li>
                      <li>{t("sections.informationWeCollect.automaticInfo.items.usage")}</li>
                      <li>{t("sections.informationWeCollect.automaticInfo.items.cookies")}</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.howWeUseInfo.title")}
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>{t("sections.howWeUseInfo.purposes.access")}</li>
                  <li>{t("sections.howWeUseInfo.purposes.payments")}</li>
                  <li>{t("sections.howWeUseInfo.purposes.emails")}</li>
                  <li>{t("sections.howWeUseInfo.purposes.progress")}</li>
                  <li>{t("sections.howWeUseInfo.purposes.improve")}</li>
                  <li>{t("sections.howWeUseInfo.purposes.comply")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.thirdPartyServices.title")}
                </h2>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <p className="text-gray-700">
                    <strong>{t("sections.thirdPartyServices.stripe.title")}</strong>{" "}
                    {t("sections.thirdPartyServices.stripe.content")}
                  </p>
                </div>
                <p className="text-gray-700">
                  {t("sections.thirdPartyServices.others")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.dataSecurity.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.dataSecurity.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.yourRights.title")}
                </h2>
                <p className="text-gray-700 mb-4">{t("sections.yourRights.intro")}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>{t("sections.yourRights.rights.access")}</li>
                  <li>{t("sections.yourRights.rights.correct")}</li>
                  <li>{t("sections.yourRights.rights.delete")}</li>
                  <li>{t("sections.yourRights.rights.object")}</li>
                  <li>{t("sections.yourRights.rights.portability")}</li>
                  <li>{t("sections.yourRights.rights.withdraw")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.cookies.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.cookies.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.dataRetention.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.dataRetention.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.changesToPolicy.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.changesToPolicy.content")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("sections.contactUs.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("sections.contactUs.intro")}
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700">
                    <strong>{t("sections.contactUs.email")}</strong> privacy@yourplatform.com
                    <br />
                    <strong>{t("sections.contactUs.address")}</strong> [Your Company Address]
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
