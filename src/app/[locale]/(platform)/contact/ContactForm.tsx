"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/app/actions/contact/sendContactMessage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Partial<Record<"name" | "email" | "message" | "form", string>>;

export default function ContactForm({
  initialSubject,
}: {
  initialSubject: string;
}) {
  const t = useTranslations("ContactPage");
  const { data: session } = useSession();

  const [name, setName] = useState(session?.user?.fullName ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Session loads after first render; prefill only fields the user hasn't typed in.
  useEffect(() => {
    if (session?.user?.fullName) setName((v) => v || session.user.fullName);
    if (session?.user?.email) setEmail((v) => v || session.user.email || "");
  }, [session?.user?.fullName, session?.user?.email]);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!name.trim()) next.name = t("nameRequired");
    if (!EMAIL_REGEX.test(email.trim())) next.email = t("invalidEmail");
    if (message.trim().length < 10) next.message = t("messageTooShort");
    return next;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);
    try {
      const result = await sendContactMessage({
        name,
        email,
        subject,
        message,
        website,
      });

      if (result.success) {
        setIsSent(true);
        return;
      }
      setErrors({
        form:
          result.error === "TOO_MANY_REQUESTS"
            ? t("tooManyRequests")
            : t("sendError"),
      });
    } catch {
      setErrors({ form: t("sendError") });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = (hasError: boolean) =>
    `w-full h-12 lg:text-lg bg-gray-50 ${
      hasError
        ? "border-red-500 ring-red-300 focus:ring-red-300 focus:border-red-500"
        : "border-gray-800 ring-secondary"
    }`;

  if (isSent) {
    return (
      <div className="bg-white rounded-lg border-2 border-primary-light/60 p-6 lg:p-8 flex flex-col items-center text-center gap-3">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <h2 className="text-2xl font-semibold text-gray-800">
          {t("successTitle")}
        </h2>
        <p className="text-gray-600">{t("successMessage")}</p>
        <button
          type="button"
          onClick={() => {
            setMessage("");
            setIsSent(false);
          }}
          className="mt-2 text-violet-800 font-medium text-sm hover:underline"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-lg border-2 border-primary-light/60 p-4 lg:p-6 flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("name")}
          </label>
          <Input
            id="contact-name"
            autoComplete="name"
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            className={inputClasses(!!errors.name)}
          />
          {errors.name && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("email")}
          </label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            className={inputClasses(!!errors.email)}
          />
          {errors.email && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("subject")}{" "}
          <span className="text-gray-400 font-normal">({t("optional")})</span>
        </label>
        <Input
          id="contact-subject"
          maxLength={150}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputClasses(false)}
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("message")}
        </label>
        <Textarea
          id="contact-message"
          rows={6}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("messagePlaceholder")}
          aria-invalid={!!errors.message}
          className={`w-full lg:text-lg bg-gray-50 min-h-40 ${
            errors.message
              ? "border-red-500 ring-red-300 focus:ring-red-300 focus:border-red-500"
              : "border-gray-800 ring-secondary"
          }`}
        />
        {errors.message && (
          <p className="mt-1 text-sm font-medium text-red-500">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people, bots fill it in */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
      />

      {errors.form && (
        <p className="text-sm font-medium text-red-500">{errors.form}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto sm:self-end h-12 bg-secondary rounded-lg text-lg text-gray-800 font-medium px-8 hover:bg-secondary-light transition flex items-center justify-center disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            {t("sending")}
          </>
        ) : (
          t("send")
        )}
      </button>
    </form>
  );
}
