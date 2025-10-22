import React from "react";
import PageWrapper from "../../components/PageWrapper";
import MyLearningPage from "./components/MyLearningPage";
import Navigation from "../components/Navigation";
import { getTranslations } from "next-intl/server";

const page = async () => {
  const t = await getTranslations("MyCourses.CoursesPage");

  return (
    <>
      <header className="h-auto bg-primary w-full flex">
        <div className="max-w-4xl px-4 md:px-2 w-full mx-auto">
          <h1 className="text-4xl mb-[1rem] xs:text-5xl font-times mt-8 xs:mb-[1.5rem] font-semibold text-gray-100">
            {t("title")}
          </h1>
          <Navigation />
        </div>
      </header>
      <PageWrapper>
        <MyLearningPage></MyLearningPage>
      </PageWrapper>
    </>
  );
};

export default page;
