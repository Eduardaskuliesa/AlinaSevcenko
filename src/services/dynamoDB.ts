import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.DYNAMO_ACCESS_KEY!,
    secretAccessKey: process.env.DYNAMO_SECRET_KEY!,
  },
  region: process.env.REGION,
});

export const dynamoDb = DynamoDBDocumentClient.from(client);

export const dynamoTableName = process.env.DYNAMODB_TABLE_NAME;

