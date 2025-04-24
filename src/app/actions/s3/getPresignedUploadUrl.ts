"use server";
import {
  cloudFrontDomain,
  s3BucketName,
  s3Client,
} from "@/app/services/s3client";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getPresignedUploadUrl(
  fileName: string,
  fileType: string,
  isPhoto: boolean = false
) {
  try {
    const id = uuidv4();
    const mediaType = isPhoto ? "photos" : "videos";
    const s3Key = `${mediaType}/${id}/${fileName}`;

    console.log("isPhoto:", isPhoto);
    console.log("mediaType:", mediaType);
    console.log("s3Key:", s3Key);
    const command = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: s3Key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 120 });

    const mediaUrl = `https://${cloudFrontDomain}/${mediaType}/${id}/${fileName}`;

    console.log(uploadUrl);
    console.log(mediaUrl);

    return {
      success: true,
      message: "Upload URL generated successfully",
      uploadUrl,
      mediaUrl,
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate upload URL");
  }
}
