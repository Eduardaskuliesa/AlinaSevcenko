"use client";
import { seoActions } from "@/app/actions/seo";
import { useGetCourseId } from "@/app/hooks/useGetCourseId";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { InfoIcon, Loader } from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import SeoForm from "./SeoForm";
import PageActions from "./PageActions";
import { SaveActionState } from "@/app/types/actions";
import { Language } from "@/app/types/course";
import LocaleSelector from "./LocaleSelector";

const ClientSeoPage = () => {
  const courseId = useGetCourseId();
  const queryClient = useQueryClient();
  const [locale, setLocale] = useState<Language>("lt");
  const [actionState, setActionState] = useState<SaveActionState>("idle");
  const [formDataCache, setFormDataCache] = useState<
    Record<Language, { metaTitle: string; metaDescription: string }>
  >({
    lt: { metaTitle: "", metaDescription: "" },
    ru: { metaTitle: "", metaDescription: "" },
  });

  const { data: ltSeoData, isLoading: ltLoading } = useQuery({
    queryKey: ["seoData", courseId.courseId, "lt"],
    queryFn: async () =>
      await seoActions.getCourseSeo({
        courseId: courseId.courseId,
        locale: "lt",
      }),
  });

  const { data: ruSeoData, isLoading: ruLoading } = useQuery({
    queryKey: ["seoData", courseId.courseId, "ru"],
    queryFn: async () =>
      await seoActions.getCourseSeo({
        courseId: courseId.courseId,
        locale: "ru",
      }),
  });

  const isLoading = ltLoading || ruLoading;

  useEffect(() => {
    if (ltSeoData?.courseSeo) {
      setFormDataCache((prev) => ({
        ...prev,
        lt: {
          metaTitle: ltSeoData.courseSeo.metaTitle || "",
          metaDescription: ltSeoData.courseSeo.metaDescription || "",
        },
      }));
    }
  }, [ltSeoData]);

  useEffect(() => {
    if (ruSeoData?.courseSeo) {
      setFormDataCache((prev) => ({
        ...prev,
        ru: {
          metaTitle: ruSeoData.courseSeo.metaTitle || "",
          metaDescription: ruSeoData.courseSeo.metaDescription || "",
        },
      }));
    }
  }, [ruSeoData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    if (id === "metaDescription" && value.length > 160) {
      return;
    }

    setFormDataCache((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [id]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    const ltChanged =
      (ltSeoData?.courseSeo?.metaTitle || "") !== formDataCache.lt.metaTitle ||
      (ltSeoData?.courseSeo?.metaDescription || "") !==
        formDataCache.lt.metaDescription;

    const ruChanged =
      (ruSeoData?.courseSeo?.metaTitle || "") !== formDataCache.ru.metaTitle ||
      (ruSeoData?.courseSeo?.metaDescription || "") !==
        formDataCache.ru.metaDescription;

    if (!ltChanged && !ruChanged) {
      toast("No changes were made to save", {
        icon: (
          <InfoIcon className="h-5 w-5 text-yellow-500 animate-icon-warning" />
        ),
      });
      setActionState("idle");
      return;
    }

    const promises = [];

    if (ltChanged) {
      promises.push(
        seoActions.updateCourseSeo({
          courseId: courseId.courseId,
          locale: "lt",
          metaTitle: formDataCache.lt.metaTitle,
          metaDescription: formDataCache.lt.metaDescription,
        })
      );
    }

    if (ruChanged) {
      promises.push(
        seoActions.updateCourseSeo({
          courseId: courseId.courseId,
          locale: "ru",
          metaTitle: formDataCache.ru.metaTitle,
          metaDescription: formDataCache.ru.metaDescription,
        })
      );
    }

    const responses = await Promise.all(promises);

    if (responses.every((r) => r?.success)) {
      queryClient.invalidateQueries({
        queryKey: ["seoData", courseId.courseId, "lt"],
      });
      queryClient.invalidateQueries({
        queryKey: ["seoData", courseId.courseId, "ru"],
      });
      toast.success("SEO data updated successfully");
      setActionState("idle");
    } else {
      toast.error("Failed to update SEO data");
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
          setActionState={setActionState}
          actionState={actionState}
          handleSubmit={handleSubmit}
        />
      </Suspense>
      <div className="flex flex-col space-y-4 px-2">
        <LocaleSelector value={locale} onChange={setLocale} />
        <SeoForm formData={formDataCache[locale]} handleChange={handleChange} />
      </div>
    </div>
  );
};

export default ClientSeoPage;
