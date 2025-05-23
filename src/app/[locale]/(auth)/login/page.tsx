import React from "react";
import { getTranslations } from "next-intl/server";
import SocialLoginButtons from "../register/components/SocialLoginButtons";
import LoginForm from "./components/LoginForm";
import CardHeader from "../components/CardHeader";
import CardWrapper from "../components/CardWrapper";

export const dynamic = "force-static";

const Page = async () => {
  const t = await getTranslations("LoginPage");

  return (
    <CardWrapper>
      <div className="flex flex-col">
        <div className="space-y-3 mb-6">
          <CardHeader text={t("title")} />
        </div>
        <SocialLoginButtons />
        <div className="bg-gray-600 h-0.5 my-4"></div>
        <LoginForm />
      </div>
    </CardWrapper>
  );
};

export default Page;
