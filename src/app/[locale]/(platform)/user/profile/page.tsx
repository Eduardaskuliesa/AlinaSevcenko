import React from "react";
import PageWrapper from "../../components/PageWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AccountSettingsCard from "./components/AccountSettingsCard";

const ProfilePage = async () => {
  const user = await getServerSession(authOptions).then(
    (session) => session?.user
  );

  return (
    <PageWrapper>
      <div className="px-2 flex-col flex md:flex-row h-auto gap-4">
        <Card className="w-full gap-4 h-full bg-white border-primary-light/60 border-2">
          <CardHeader className="px-4">
            <CardTitle className="text-xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4">
            <div className="space-y-2 text-base">
              <Label htmlFor="name">Display Name</Label>
              <Input
                className="border-primary-light/60 border-2 bg-slate-50"
                id="name"
                value={user?.fullName || ""}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                className="border-primary-light/60 border-2 bg-slate-50"
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
              />
            </div>
          </CardContent>
        </Card>
        <AccountSettingsCard />
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
