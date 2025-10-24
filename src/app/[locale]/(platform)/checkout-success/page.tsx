import stripe from "@/app/services/stripe";
import ClearCartComponent from "./ClearCartComponent";
import { coursesAction } from "@/app/actions/coursers";
import type { Course } from "@/app/types/course";
import { Clock, BookOpen } from "lucide-react";
import { convertTime } from "@/app/utils/converToMinutes";
import Image from "next/image";
import StartLearningButton from "./StartLearningButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

const CheckoutSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  const t = await getTranslations("CheckoutSuccessPage");
  let orderDetails = null;
  let courses = [] as Course[];

  const userId = await getServerSession(authOptions).then(
    (session) => session?.user.id
  );
  const { payment_intent } = await searchParams;

  if (!payment_intent) {
    redirect("/cart");
  }

  if (payment_intent) {
    orderDetails = await stripe.paymentIntents.retrieve(payment_intent);

    if (orderDetails.status !== "succeeded") {
      redirect("/cart");
    }

    if (orderDetails.metadata?.courseIds) {
      const courseIds = orderDetails.metadata.courseIds.split(",");
      courses = await Promise.all(
        courseIds.map(async (courseId: string) => {
          return (await coursesAction.courses.getCourseClient(courseId))
            .course as Course;
        })
      );
    }
  }

  console.log(courses);
  return (
    <div className="">
      <div className="bg-primary text-gray-50">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-10 sm:px-6 sm:pt-6 sm:pb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 font-times">
            {t("paymentSuccessful")}
          </h1>
          <p className="text-2xl font-times">{t("welcomeToNewCourses")}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-6 -mt-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-primary-light text-gray-800 px-6 py-4 flex justify-between items-center">
            <span className="font-medium">{t("orderComplete")}</span>
            <span className="text-xl font-bold">
              €
              {orderDetails?.amount
                ? (orderDetails.amount / 100).toFixed(2)
                : "0.00"}
            </span>
          </div>

          <div className="p-3 lg:p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              {t("yourCourses")}
            </h2>
            <div className="grid gap-4">
              {courses.map((course) => (
                <div
                  key={course.courseId}
                  className="flex items-center p-2 lg:p-4 border border-primary-light rounded-lg"
                >
                  <div className="w-20 h-14 bg-gray-100 rounded-md overflow-hidden mr-4">
                    <Image
                      width={80}
                      height={56}
                      src={course.thumbnailImage || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {course.title}
                    </h3>
                    <div className="flex  items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course.lessonOrder?.length || 0}{" "}  
                        {t("lessons")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {convertTime(course.duration)}
                      </span>
                    </div>
                  </div>
                  <div className="text-green-600 font-medium text-sm">
                    {t("accessGranted")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-center sm:text-left">
                <p className="font-medium text-gray-900">{t("readyToStartLearning")}</p>
                <p className="text-sm text-gray-600">{t("coursesAvailableInDashboard")}</p>
              </div>
              <StartLearningButton></StartLearningButton>
            </div>
          </div>
        </div>

        <div className="text-center py-8">
          <p className="text-gray-600">{t("invoiceEmailSent")}</p>
        </div>
      </div>

      <ClearCartComponent userId={userId} />
    </div>
  );
};

export default CheckoutSuccessPage;
