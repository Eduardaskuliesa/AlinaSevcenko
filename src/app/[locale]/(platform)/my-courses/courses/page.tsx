import React from "react";
import PageWrapper from "../../components/PageWrapper";
import { getQueryClient } from "@/app/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { enrolledCourseActions } from "@/app/actions/enrolled-course";
import { getUserIdServer } from "@/app/lib/getUserIdServer";
import MyLearningPage from "./components/MyLearningPage";

export const dynamic = "force-dynamic";

const page = async () => {
  const queryClient = getQueryClient();
  const userId = await getUserIdServer();
  console.log(userId);
  queryClient.prefetchQuery({
    queryKey: ["user-client-courses"],
    queryFn: () => enrolledCourseActions.getUsersCourses(userId as string),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageWrapper>
        <MyLearningPage userId={userId as string} />
      </PageWrapper>
    </HydrationBoundary>
  );
};

export default page;
