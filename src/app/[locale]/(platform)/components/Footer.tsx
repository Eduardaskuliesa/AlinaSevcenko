"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t border-secondary text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-white text-xl lg:text-2xl font-bold mb-3">
              Alina Savcenko
            </h3>
            <p className="text-sm lg:text-base leading-relaxed">
              {t("brandDescription")}
            </p>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-base lg:text-lg">
              {t("coursesTitle")}
            </h4>
            <ul className="space-y-1.5 text-sm lg:text-base">
              <li>
                <Link
                  href="/courses"
                  className="hover:text-white transition-colors"
                >
                  {t("allCourses")}
                </Link>
              </li>
              <li>
                <Link
                  href="/my-courses/courses"
                  className="hover:text-white transition-colors"
                >
                  {t("myLearning")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-base lg:text-lg">
              {t("supportTitle")}
            </h4>
            <ul className="space-y-1.5 text-sm lg:text-base">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  {t("contactUs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-base lg:text-lg">
              {t("legalTitle")}
            </h4>
            <ul className="space-y-1.5 text-sm lg:text-base">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  {t("termsOfService")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-light/60 mt-8 pt-6 text-sm lg:text-base text-center">
          <p>{t("copyright", { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
