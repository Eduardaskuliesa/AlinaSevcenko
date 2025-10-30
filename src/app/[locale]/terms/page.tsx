import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TermsActions } from "./TermsActions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TermsPage.metadata" });

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

export default async function TermsOfService({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TermsPage" });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 pt-12 pb-14">
        {/* Document Content */}
        <div id="terms-content" className="space-y-8 text-black">
          <div className="text-left mb-12">
            <h1 className="text-4xl font-bold mb-4">{t("mainTitle")}</h1>
            <p className="text-gray-600">{t("lastUpdated")}</p>
            <TermsActions />
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.agreementToTerms.title")}
            </h2>
            <p className="leading-relaxed">
              {t("sections.agreementToTerms.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.courseAccess.title")}
            </h2>
            <div className="space-y-4">
              <p className="leading-relaxed">
                {t("sections.courseAccess.intro")}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>
                    1{" "}
                    {t("sections.courseAccess.options.oneMonth").split(":")[0]}:
                  </strong>{" "}
                  {t("sections.courseAccess.options.oneMonth").split(":")[1]}
                </li>
                <li>
                  <strong>
                    3{" "}
                    {
                      t("sections.courseAccess.options.threeMonths").split(
                        ":"
                      )[0]
                    }
                    :
                  </strong>{" "}
                  {t("sections.courseAccess.options.threeMonths").split(":")[1]}
                </li>
                <li>
                  <strong>
                    {t("sections.courseAccess.options.lifetime").split(":")[0]}:
                  </strong>{" "}
                  {t("sections.courseAccess.options.lifetime").split(":")[1]}
                </li>
              </ul>
              <p className="leading-relaxed">
                {t("sections.courseAccess.expiration")}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.paymentTerms.title")}
            </h2>
            <div className="space-y-4">
              <p className="leading-relaxed">
                {t("sections.paymentTerms.stripe")}
              </p>
              <p className="leading-relaxed">
                {t("sections.paymentTerms.currency")}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.noRefund.title")}
            </h2>
            <p className="leading-relaxed font-medium">
              {t("sections.noRefund.policy")}
            </p>
            <p className="leading-relaxed mt-4">
              {t("sections.noRefund.acknowledgment")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.userAccount.title")}
            </h2>
            <p className="leading-relaxed mb-4">
              {t("sections.userAccount.intro")}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t("sections.userAccount.responsibilities.credentials")}</li>
              <li>{t("sections.userAccount.responsibilities.activities")}</li>
              <li>{t("sections.userAccount.responsibilities.unauthorized")}</li>
              <li>{t("sections.userAccount.responsibilities.accurate")}</li>
            </ul>
            <p className="leading-relaxed mt-4">
              {t("sections.userAccount.sharing")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.intellectualProperty.title")}
            </h2>
            <div className="space-y-4">
              <p className="leading-relaxed">
                {t("sections.intellectualProperty.intro")}
              </p>
              <p className="leading-relaxed">
                {t("sections.intellectualProperty.prohibited")}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t("sections.intellectualProperty.actions.download")}</li>
                <li>{t("sections.intellectualProperty.actions.share")}</li>
                <li>{t("sections.intellectualProperty.actions.record")}</li>
                <li>{t("sections.intellectualProperty.actions.commercial")}</li>
                <li>{t("sections.intellectualProperty.actions.resell")}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.prohibited.title")}
            </h2>
            <p className="leading-relaxed mb-4">
              {t("sections.prohibited.intro")}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
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
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.contentUpdates.title")}
            </h2>
            <p className="leading-relaxed">
              {t("sections.contentUpdates.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.accountTermination.title")}
            </h2>
            <p className="leading-relaxed">
              {t("sections.accountTermination.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.limitationOfLiability.title")}
            </h2>
            <p className="leading-relaxed">
              {t("sections.limitationOfLiability.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.disclaimerOfWarranties.title")}
            </h2>
            <p className="leading-relaxed">
              {t("sections.disclaimerOfWarranties.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.indemnification.title")}
            </h2>
            <p className="leading-relaxed">
              {t("sections.indemnification.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.changesToTerms.title")}
            </h2>
            <p className="leading-relaxed">
              {t("sections.changesToTerms.content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {t("sections.contactInformation.title")}
            </h2>
            <p className="leading-relaxed">
              {t("sections.contactInformation.intro")}
            </p>
            <div className="mt-4">
              <p>
                <strong>{t("sections.contactInformation.email")}</strong>{" "}
                info@alinasavcenko.com
                <br />
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
