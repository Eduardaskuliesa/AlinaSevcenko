import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Load main translations and nested translations
  const mainMessages = (await import(`../messages/${locale}.json`)).default;
  const termsMessages = (await import(`../messages/terms/${locale}.json`))
    .default;
  const privacyMessages = (await import(`../messages/privacy/${locale}.json`))
    .default;

  return {
    locale,
    messages: {
      ...mainMessages,
      ...termsMessages,
      ...privacyMessages,
    },
  };
});
