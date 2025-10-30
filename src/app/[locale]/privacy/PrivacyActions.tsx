"use client";

import { useTranslations } from "next-intl";

export function PrivacyActions() {
  const handlePrint = () => {
    window.print();
  };
  const t = useTranslations("Buttons");

  const handleDownload = () => {
    const content = document.getElementById("privacy-content")?.innerText || "";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "privacy-policy.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-4 mt-4 print:hidden">
      <button
        onClick={handlePrint}
        className="px-6 py-1 bg-primary rounded-md text-white  hover:bg-primary/90 transition-colors"
      >
        {t("print")}
      </button>
      <button
        onClick={handleDownload}
        className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        {t("downloadAsTxt")}
      </button>
    </div>
  );
}
