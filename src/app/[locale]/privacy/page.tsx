import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PrivacyActions } from "./PrivacyActions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "PrivacyPage.metadata",
  });

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

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPage" });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 pt-12 pb-14">
        <div id="privacy-content" className="space-y-8 text-black">
          <div className="text-left mb-12">
            <h1 className="text-4xl font-bold mb-4">{t("mainTitle")}</h1>
            <p className="text-gray-600">{t("lastUpdated")}</p>
            <PrivacyActions />
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.introduction.title")}
            </h2>
            <p className="leading-relaxed">
              {t("sections.introduction.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.informationWeCollect.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("sections.informationWeCollect.personalInfo.title")}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    {t("sections.informationWeCollect.personalInfo.items.name")}
                  </li>
                  <li>
                    {t(
                      "sections.informationWeCollect.personalInfo.items.credentials"
                    )}
                  </li>
                  <li>
                    {t(
                      "sections.informationWeCollect.personalInfo.items.payment"
                    )}
                  </li>
                  <li>
                    {t(
                      "sections.informationWeCollect.personalInfo.items.progress"
                    )}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("sections.informationWeCollect.automaticInfo.title")}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    {t("sections.informationWeCollect.automaticInfo.items.ip")}
                  </li>
                  <li>
                    {t(
                      "sections.informationWeCollect.automaticInfo.items.browser"
                    )}
                  </li>
                  <li>
                    {t(
                      "sections.informationWeCollect.automaticInfo.items.usage"
                    )}
                  </li>
                  <li>
                    {t(
                      "sections.informationWeCollect.automaticInfo.items.cookies"
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.howWeUseInfo.title")}
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t("sections.howWeUseInfo.purposes.access")}</li>
              <li>{t("sections.howWeUseInfo.purposes.payments")}</li>
              <li>{t("sections.howWeUseInfo.purposes.emails")}</li>
              <li>{t("sections.howWeUseInfo.purposes.progress")}</li>
              <li>{t("sections.howWeUseInfo.purposes.improve")}</li>
              <li>{t("sections.howWeUseInfo.purposes.comply")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.thirdPartyServices.title")}
            </h2>
            <div className="mb-4">
              <p className="leading-relaxed">
                <strong>{t("sections.thirdPartyServices.stripe.title")}</strong>{" "}
                {t("sections.thirdPartyServices.stripe.content")}
              </p>
            </div>
            <p className="leading-relaxed">
              {t("sections.thirdPartyServices.others")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.dataSecurity.title")}
            </h2>
            <p className="leading-relaxed">
              {t("sections.dataSecurity.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.yourRights.title")}
            </h2>
            <p className="leading-relaxed mb-4">
              {t("sections.yourRights.intro")}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t("sections.yourRights.rights.access")}</li>
              <li>{t("sections.yourRights.rights.correct")}</li>
              <li>{t("sections.yourRights.rights.delete")}</li>
              <li>{t("sections.yourRights.rights.object")}</li>
              <li>{t("sections.yourRights.rights.portability")}</li>
              <li>{t("sections.yourRights.rights.withdraw")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.cookies.title")}
            </h2>
            <p className="leading-relaxed">{t("sections.cookies.content")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.dataRetention.title")}
            </h2>
            <p className="leading-relaxed">
              {t("sections.dataRetention.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.changesToPolicy.title")}
            </h2>
            <p className="leading-relaxed">
              {t("sections.changesToPolicy.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.contactUs.title")}
            </h2>
            <p className="leading-relaxed">{t("sections.contactUs.intro")}</p>
            <div className="mt-4">
              <p>
                <strong>{t("sections.contactUs.email")}</strong>{" "}
                info@alinasavcenko.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
