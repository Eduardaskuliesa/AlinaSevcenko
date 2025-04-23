"use server";
import { cloudFrontDomain, s3BucketName, s3Client } from "@/app/services/s3client";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getUploadVideoUrl(fileName: string, fileType: string) {
  try {
    const id = uuidv4();
    const s3Key = `videos/${id}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: s3Key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 120 });

    const videoUrl = `https://${cloudFrontDomain}/videos/${id}/${fileName}`;

    return {
      success: true,
      message: "Upload URL generated successfully",
      uploadUrl,
      videoUrl,
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate upload URL");
  }
}
