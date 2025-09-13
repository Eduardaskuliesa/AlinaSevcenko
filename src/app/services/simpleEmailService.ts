import { SESClient } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY || process.env.DYNAMO_ACCESS_KEY!,
    secretAccessKey:
      process.env.SES_SECRET_KEY || process.env.DYNAMO_SECRET_KEY!,
  },
  region: process.env.REGION,
});

export default sesClient;
