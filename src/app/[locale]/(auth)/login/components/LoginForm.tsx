/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { getSession, signIn } from "next-auth/react";

const LoginForm = () => {
  const t = useTranslations("LoginPage");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (emailError) {
      setEmailError("");
    }
    if (formError) {
      setFormError("");
    }
  }, [email]);

  useEffect(() => {
    if (passwordError) {
      setPasswordError("");
    }
    if (formError) {
      setFormError("");
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setFormError("");

    let hasError = false;

    if (!email.trim()) {
      setEmailError(t("emailRequired"));
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError(t("invalidEmailFormat"));
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError(t("passwordRequired"));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        setTimeout(async () => {
          const session = await getSession();
          if (session?.user.role === "STUDENT") {
            window.location.href = "/user/profile";
          } else if (session?.user.role === "ADMIN") {
            window.location.href = "/admin/courses";
          }
        }, 50);
      } else {
        if (result?.error === "INVALID_CREDENTIALS") {
          setIsLoading(false);
          setPasswordError(t("invalidCredentials"));
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const emailInputClasses = `w-full h-12 lg:text-lg ${
    emailError || formError
      ? "border-red-500 ring-red-300 focus:ring-red-300 focus:border-red-500"
      : "border-gray-800 ring-secondary bg-gray-50"
  }`;

  const passwordInputClasses = `w-full h-12 pr-10 lg:text-lg ${
    passwordError || formError
      ? "border-red-500 ring-red-300 focus:ring-red-300 focus:border-red-500"
      : "border-gray-800 ring-secondary bg-gray-50"
  }`;

  return (
    <form className="flex flex-col mt-4" onSubmit={handleSubmit}>
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
            aria-invalid={!!emailError || !!formError}
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
            className="mt-1 text-base font-medium text-red-500"
          >
            {emailError}
          </p>
        )}
      </div>

      <div className="mb-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
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
            aria-invalid={!!passwordError || !!formError}
            aria-describedby={passwordError ? "password-error" : undefined}
          />
          {passwordError ? (
            <div className="absolute right-3 top-3 text-red-500">
              <AlertCircle size={20} />
            </div>
          ) : (
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {passwordError && (
          <p
            id="password-error"
            className="mt-1 text-base font-medium text-red-500"
          >
            {passwordError}
          </p>
        )}
      </div>
      <div className="flex justify-between items-center mt-2">
        <Link
          href="/forgot-password"
          className="text-sm text-violet-800 font-medium hover:underline"
        >
          {t("forgotPassword")}
        </Link>
      </div>
      <button
        type="submit"
        className="w-full h-12 cursor-pointer bg-secondary rounded-lg text-lg text-gray-800 font-medium py-2 px-4 hover:bg-secondary-light transition flex items-center justify-center mt-6"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            {t("loading")}
          </>
        ) : (
          t("login")
        )}
      </button>
    </form>
  );
};

export default LoginForm;
