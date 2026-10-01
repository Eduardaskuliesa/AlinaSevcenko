import type { Metadata } from "next";
import { pageMetadata } from "@/app/lib/seo";
import { getTranslations } from "next-intl/server";
import { Mail } from "lucide-react";
import ContactForm from "./ContactForm";

const CONTACT_EMAIL = "info@alinasavcenko.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ locale, page: "contact", path: "/contact" });
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const t = await getTranslations("ContactPage");
  const { course } = await searchParams;

  return (
    <>
      <header className="h-[5rem] bg-primary w-full flex">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-4xl px-4 lg:px-2 sm:text-5xl font-times mt-4 font-semibold text-gray-100">
            {t("title")}
          </h1>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 lg:px-2 py-8 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <p className="text-lg text-gray-700 leading-relaxed">
            {t("intro")}
          </p>
          <div className="bg-white rounded-lg border-2 border-primary-light/60 p-4">
            <p className="text-sm text-gray-500 mb-1">{t("orWriteDirectly")}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2 font-medium text-gray-800 hover:underline break-all"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <ContactForm
          initialSubject={course ? t("subjectAboutCourse", { course }) : ""}
        />
      </section>
    </>
  );
}
