"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import ValidateBox from "./ValidateBox";
import { Checkbox } from "@/components/ui/checkbox";
import Divider from "./Divider";
import SocialLoginButtons from "./SocialLoginButtons";
import { useTranslations } from "next-intl";

const RegisterForm = () => {
  const t = useTranslations("RegisterPage");

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Validation states
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isLengthValid, setIsLengthValid] = useState<boolean | null>(null);
  const [hasCapital, setHasCapital] = useState<boolean | null>(null);

  useEffect(() => {
    if (email.length === 0) {
      setIsEmailValid(null);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    if (password.length === 0) {
      setIsLengthValid(null);
      setHasCapital(null);
      return;
    }

    setIsLengthValid(password.length >= 8);
    setHasCapital(/[A-Z]/.test(password));
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted", { email, password, agreeToTerms });
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="mb-6">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("email")}
        </label>
        <Input
          id="email"
          type="email"
          className="w-full h-12 border-gray-800 lg:text-lg ring-secondary"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("password")}
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full h-12 border-gray-800 ring-secondary pr-10 lg:text-lg"
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Validation box */}
      <ValidateBox
        isEmailValid={isEmailValid}
        isLengthValid={isLengthValid}
        hasCapital={hasCapital}
      />

      {/* Terms and conditions checkbox */}
      <div className="mt-4 mb-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
            className="data-[state=checked]:bg-secondary data-[state=checked]:text-gray-800 border-gray-800"
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-700  cursor-pointer"
          >
            {t("agreePrefix")}{" "}
            <a href="#" className="font-bold hover:underline">
              {t("termsLink")}
            </a>{" "}
            {t("and")}{" "}
            <a href="#" className="font-bold hover:underline">
              {t("privacyLink")}
            </a>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full h-12 cursor-pointer bg-secondary rounded-lg text-lg text-gray-800 font-medium py-2 px-4 mt-2 hover:bg-secondary-light transition"
        disabled={!agreeToTerms}
      >
        {t("createAccount")}
      </button>

      <Divider />
      <SocialLoginButtons />
    </form>
  );
};

export default RegisterForm;
