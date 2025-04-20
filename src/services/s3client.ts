import { S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.DYNAMO_ACCESS_KEY!,
    secretAccessKey: process.env.DYNAMO_SECRET_KEY!,
  },
  region: process.env.REGION,
});

export const s3Client = client;
export const s3BucketName = process.env.S3_BUCKET_NAME
export const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN_NAME;
