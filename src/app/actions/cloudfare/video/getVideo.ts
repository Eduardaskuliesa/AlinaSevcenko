"use server";
export async function getVideo(videoId: string) {
  try {
    const token = process.env.CLOUDFLARE_STREAM_TOKEN || "";
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "";

    if (!accountId || !token) {
      return {
        success: false,
        error: "Missing Cloudflare credentials",
      };
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.errors[0].message,
      };
    }

    return {
      success: true,
      video: data.result,
    };
  } catch (error) {
    return {
      success: false,
      error: `Video not found: ${error}`,
    };
  }
}
