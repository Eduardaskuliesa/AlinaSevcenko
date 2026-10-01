import type { Metadata } from "next";
import { adminPageMetadata } from "@/app/lib/seo";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return adminPageMetadata(locale, "editor");
}

const page = () => {
  return <SimpleEditor />;
};

export default page;
