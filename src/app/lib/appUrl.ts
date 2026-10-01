const PRODUCTION_URL = "https://www.alinasavcenko.lt";

export function getAppUrl(): string {
  const url =
    process.env.APP_URL ||
    (process.env.VERCEL_ENV === "production"
      ? PRODUCTION_URL
      : process.env.NEXTAUTH_URL) ||
    "http://localhost:3000";
  return url.replace(/\/+$/, "");
}
