// src/fonts/index.ts
import { Roboto } from "next/font/google";

export const geistSans = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});
