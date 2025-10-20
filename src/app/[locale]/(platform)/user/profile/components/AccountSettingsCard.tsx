import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";
import PasswordChange from "./PasswordChange";
import LanguagePreference from "./LanguagePreferences";

const AccountSettingsCard = () => {
  return (
    <Card className="w-full gap-4 bg-white border-primary-light/60 border-2">
      <CardHeader className="px-4">
        <CardTitle className="text-xl">Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4">
        <PasswordChange />
        <LanguagePreference />
      </CardContent>
    </Card>
  );
};

export default AccountSettingsCard;
