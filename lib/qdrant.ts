import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.QDRANT_URL) {
  throw new Error("QDRANT_URL is not set");
}

if (!process.env.QDRANT_API_KEY) {
  throw new Error("QDRANT_API_KEY is not set");
}

export const qdrantClient = new QdrantClient({
  url: "https://06ed4f29-e89b-49a0-946b-70af126dfea9.eu-central-1-0.aws.cloud.qdrant.io:6333",
  apiKey: process.env.QDRANT_API_KEY,
  checkCompatibility: false,
});
