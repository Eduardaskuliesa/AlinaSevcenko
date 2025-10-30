import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import CourseSection from "./components/Course/CourseSection";
import CourseSectionSkeleton from "./components/Course/CourseSectionSkeleton";

export function generateStaticParams() {
  return [{ locale: "lt" }, { locale: "ru" }];
}

export const dynamic = "force-dynamic";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return (
    <>
      <main className="bg-background min-h-screen py-12 px-6 lg:px-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-[300px] h-[300px] lg:h-[400px] lg:w-[400px] mx-auto mb-6 lg:mb-12">
            <Image
              alt="Alina Photo"
              src="/AlinaPhoto.jpg"
              fill
              sizes="(max-width: 768px) 300px, 400px"
              priority
              quality={90}
              className="object-cover rounded-t-full"
            />
          </div>
          <div className="mb-6 lg:mb-12 space-y-6">
            <p className="text-2xl md:text-3xl lg:text-4xl font-times leading-relaxed text-gray-950 text-center">
              {t("heroTitle")}
            </p>

            <p className="text-lg md:text-xl font-times leading-relaxed text-gray-800 text-center max-w-3xl mx-auto">
              {t("paragraph1")}
            </p>

            <p className="text-lg md:text-xl font-times leading-relaxed text-gray-800 text-center max-w-3xl mx-auto">
              {t("paragraph2")}
            </p>

            <p className="text-lg md:text-xl font-times leading-relaxed text-gray-800 text-center max-w-3xl mx-auto">
              {t("paragraph3")}
            </p>

            <p className="text-lg md:text-xl font-times leading-relaxed text-gray-800 text-center max-w-3xl mx-auto">
              {t("paragraph4")}
            </p>

            <p className="text-xl md:text-2xl font-times font-semibold leading-relaxed text-gray-900 text-center">
              {t("welcomeHome")}
            </p>
          </div>

          <div className="w-full h-1 bg-primary mx-auto mb-6"></div>

          <Suspense fallback={<CourseSectionSkeleton />}>
            <CourseSection locale={locale} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
