"use server";
import { logger } from "@/app/utils/logger";

export async function getUploadUrl() {
  const token = process.env.CLOUDFLARE_STREAM_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!accountId || !token) {
    logger.error("Missing Cloudflare credentials");
    return {
      success: false,
      error: "Missing Cloudflare credentials",
      uploadUrl: "",
    };
  }
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maxDurationSeconds: 3600,
          expiry: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      logger.error(`Error fetching upload URL: ${data.errors[0].message}`);
      return {
        success: false,
        error: data.errors[0].message,
        uploadUrl: "",
      };
    }

    logger.success(`Upload URL fetched successfully: ${data.result.uploadURL}`);

    return {
      success: true,
      id: data.result.uid,
      uploadUrl: data.result.uploadURL,
    };
  } catch (error) {
    logger.error(`Error fetching upload URL: ${error}`);
    return {
      success: false,
      error: `Error fetching upload URL : ${error}`,
      uploadUrl: "",
    };
  }
}
