"use client";
import { seoActions } from "@/app/actions/seo";
import { useGetCourseId } from "@/app/hooks/useGetCourseId";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import SeoForm from "./SeoForm";
import PageActions from "./PageActions";
import { SaveActionState } from "@/app/types/actions";
import { coursesAction } from "@/app/actions/coursers";
import { Language } from "@/app/types/course";
import LocaleSelector from "./LocaleSelector";

const ClientSeoPage = () => {
  const courseId = useGetCourseId();
  const [locale, setLocale] = useState<Language>("lt");
  const [actionState, setActionState] = useState<SaveActionState>("idle");
  const [formDataCache, setFormDataCache] = useState<
    Record<Language, { metaTitle: string; metaDescription: string }>
  >({
    lt: { metaTitle: "", metaDescription: "" },
    ru: { metaTitle: "", metaDescription: "" },
  });

  const { data: seoData, isLoading } = useQuery({
    queryKey: ["seoData", courseId.courseId, locale],
    queryFn: async () =>
      await seoActions.getCourseSeo({
        courseId: courseId.courseId,
        locale: locale,
      }),
  });

  const { data: courseData } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesAction.courses.getCourse(courseId.courseId),
  });

  useEffect(() => {
    if (seoData?.courseSeo) {
      setFormDataCache((prev) => ({
        ...prev,
        [locale]: {
          metaTitle: seoData.courseSeo.metaTitle || "",
          metaDescription: seoData.courseSeo.metaDescription || "",
        },
      }));
    }
  }, [seoData, locale]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    setFormDataCache((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [id]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    const ltResponse = await seoActions.updateCourseSeo({
      courseId: courseId.courseId,
      locale: "lt",
      metaTitle: formDataCache.lt.metaTitle,
      metaDescription: formDataCache.lt.metaDescription,
    });

    const ruResponse = await seoActions.updateCourseSeo({
      courseId: courseId.courseId,
      locale: "ru",
      metaTitle: formDataCache.ru.metaTitle,
      metaDescription: formDataCache.ru.metaDescription,
    });

    if (ltResponse?.success && ruResponse?.success) {
      toast.success("SEO data updated successfully for all languages");
      setActionState("idle");
    } else {
      toast.error("Failed to update SEO data for some languages");
      setActionState("idle");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Suspense>
        <PageActions
          isPublsihed={courseData?.cousre?.isPublished || false}
          setActionState={setActionState}
          actionState={actionState}
          handleSubmit={handleSubmit}
        />
      </Suspense>
      <LocaleSelector value={locale} onChange={setLocale} />
      <SeoForm formData={formDataCache[locale]} handleChange={handleChange} />
    </div>
  );
};

export default ClientSeoPage;
