/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import ValidateBox from "./ValidateBox";
import Divider from "./Divider";
import SocialLoginButtons from "./SocialLoginButtons";
import { useTranslations } from "next-intl";
import { userActions } from "@/app/actions/user";
import { RegisterFormData } from "@/app/actions/user/authentication/register";
import { useRouter } from "next/navigation";
import { emailActions } from "@/app/actions/email";

const RegisterForm = () => {
  const t = useTranslations("RegisterPage");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShakeInvalid, setShouldShakeInvalid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isFullnameValid, setIsFullnameValid] = useState<boolean | null>(null);
  const [isLengthValid, setIsLengthValid] = useState<boolean | null>(null);
  const [hasCapital, setHasCapital] = useState<boolean | null>(null);

  useEffect(() => {
    if (email.length === 0) {
      setIsEmailValid(null);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));

    if (emailError) {
      setEmailError("");
    }
  }, [email]);

  useEffect(() => {
    if (fullname.length === 0) {
      setIsFullnameValid(null);
      return;
    }

    const nameRegex = /^[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+.*$/;
    setIsFullnameValid(nameRegex.test(fullname.trim()));

    if (fullnameError) {
      setFullnameError("");
    }
  }, [fullname]);

  useEffect(() => {
    if (password.length === 0) {
      setIsLengthValid(null);
      setHasCapital(null);
      return;
    }

    setIsLengthValid(password.length >= 8);
    setHasCapital(/[A-Z]/.test(password));

    if (passwordError) {
      setPasswordError("");
    }
  }, [password, passwordError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");
    setFullnameError("");
    setPasswordError("");

    let hasError = false;

    if (!fullname.trim()) {
      setFullnameError(t("fullNameRequired"));
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError(t("emailRequired"));
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError(t("passwordRequired"));
      hasError = true;
    }

    if (hasError) {
      setShouldShakeInvalid(true);
      setTimeout(() => {
        setShouldShakeInvalid(false);
      }, 500);
      return;
    }

    if (!isFullnameValid || !isEmailValid || !isLengthValid || !hasCapital) {
      setShouldShakeInvalid(true);
      setTimeout(() => {
        setShouldShakeInvalid(false);
      }, 500);
      return;
    }

    setIsLoading(true);

    try {
      const formData: RegisterFormData = {
        email,
        password,
        fullName: fullname,
      };

      const emailCheckResult = await userActions.authentication.checkEmail(
        email
      );
      if (!emailCheckResult.success) {
        if (emailCheckResult.error === "EMAIL_ALREADY_EXISTS") {
          console.log("Email already exists:", emailCheckResult.error);
          setEmailError(t("emailAlreadyExists"));
        }
        return;
      }

      const result = await userActions.authentication.register(formData);

      if (result.success && result.userId) {
        console.log("Registration successful:", result.message);
        const verifyToken =
          await userActions.authentication.generateVerificationToken(
            result.userId
          );

        const htmlLang = document.documentElement.lang as string;
        const userLang =
          htmlLang === "lt" || htmlLang === "ru"
            ? (htmlLang as "lt" | "ru")
            : "lt";
        await userActions.preferences.createPreferences(
          result.userId,
          userLang
        );
        const verificationResult =
          await emailActions.authentication.sendVerificationEmail(
            email,
            verifyToken.token ?? "",
            userLang
          );
        if (verificationResult.success) {
          router.push(
            `/register?status=pending&email=${encodeURIComponent(email)}`
          );
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const emailInputClasses = `w-full h-12 lg:text-lg ${
    emailError
      ? "border-red-500 ring-red-300 focus:ring-red-300 focus:border-red-500"
      : "border-gray-800 ring-secondary bg-gray-50"
  }`;

  const fullnameInputClasses = `w-full h-12 lg:text-lg ${
    fullnameError
      ? "border-red-500 ring-red-300 focus:ring-red-300 focus:border-red-500"
      : "border-gray-800 ring-secondary bg-gray-50"
  }`;

  const passwordInputClasses = `w-full h-12 pr-10 lg:text-lg ${
    passwordError
      ? "border-red-500 ring-red-300 focus:ring-red-300 focus:border-red-500"
      : "border-gray-800 ring-secondary bg-gray-50"
  }`;

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="fullname"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("fullName")}
        </label>
        <div className="relative">
          <Input
            id="fullname"
            className={fullnameInputClasses}
            placeholder={t("fullNamePlaceholder")}
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            aria-invalid={!!fullnameError}
            aria-describedby={fullnameError ? "fullname-error" : undefined}
          />
          {fullnameError && (
            <div className="absolute right-3 top-3 text-red-500">
              <AlertCircle size={20} />
            </div>
          )}
        </div>
        {fullnameError && (
          <p
            id="fullname-error"
            className="mt-1 text-base font-semibold text-red-500"
          >
            {fullnameError}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("email")}
        </label>
        <div className="relative">
          <Input
            id="email"
            className={emailInputClasses}
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && (
            <div className="absolute right-3 top-3 text-red-500">
              <AlertCircle size={20} />
            </div>
          )}
        </div>
        {emailError && (
          <p
            id="email-error"
            className="mt-1 text-base font-semibold text-red-500"
          >
            {emailError}
          </p>
        )}
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
            className={passwordInputClasses}
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "password-error" : undefined}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {passwordError && (
          <p
            id="password-error"
            className="mt-1 text-base font-semibold text-red-500"
          >
            {passwordError}
          </p>
        )}
      </div>

      <ValidateBox
        isFullnameValid={isFullnameValid}
        isEmailValid={isEmailValid}
        isLengthValid={isLengthValid}
        hasCapital={hasCapital}
        shouldShakeInvalid={shouldShakeInvalid}
      />

      <button
        type="submit"
        className="w-full h-12 cursor-pointer bg-secondary rounded-lg text-lg text-gray-800 font-medium py-2 px-4 mt-2 hover:bg-secondary-light transition flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            {t("loading") || "Loading..."}
          </>
        ) : (
          t("createAccount")
        )}
      </button>

      <Divider />
      <SocialLoginButtons />

      <div className="mt-4 text-sm text-gray-600 text-center">
        {t("agreePrefix") || "By registering, you agree to our"}{" "}
        <a href="#" className="font-medium text-violet-800   hover:underline">
          {t("termsLink") || "Terms of Service"}
        </a>{" "}
        {t("and") || "and"}{" "}
        <a href="#" className="font-medium text-violet-800  hover:underline">
          {t("privacyLink") || "Privacy Policy"}
        </a>
      </div>
    </form>
  );
};

export default RegisterForm;
