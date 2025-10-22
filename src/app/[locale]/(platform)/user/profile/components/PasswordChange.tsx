"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { userActions } from "@/app/actions/user";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

const PasswordChange = () => {
  const { data: session } = useSession();
  const t = useTranslations("UserProfilePage");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      const errorMsg = t("passwordsDoNotMatch");
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!session?.user?.id) {
      const errorMsg = t("userNotFound");
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);

    const result = await userActions.authentication.changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      userId: session.user.id,
    });

    setLoading(false);

    if (result.success) {
      toast.success(t("passwordChangedSuccess"));
      setIsOpen(false);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setError("");
    } else {
      const errorMsg = result.error || t("passwordChangedError");
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{t("password")}</Label>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            {t("changePassword")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("changePassword")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-500 bg-red-50 border-red-200 border p-2 rounded">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="current">{t("currentPassword")}</Label>
              <div className="relative">
                <Input
                  id="current"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      current: !showPasswords.current,
                    })
                  }
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">{t("newPassword")}</Label>
              <div className="relative">
                <Input
                  id="new"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                {t("passwordRequirements")}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">{t("confirmNewPassword")}</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("updating") : t("updatePassword")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PasswordChange;
