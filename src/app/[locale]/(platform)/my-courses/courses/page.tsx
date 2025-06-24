import React from "react";
import PageWrapper from "../../components/PageWrapper";
import MyLearningPage from "./components/MyLearningPage";

export const dynamic = "force-static";

const page = async () => {
  return (
    <PageWrapper>
      <MyLearningPage></MyLearningPage>
    </PageWrapper>
  );
};

export default page;
