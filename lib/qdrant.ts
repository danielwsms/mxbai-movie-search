import { QdrantClient } from "@qdrant/js-client-rest";

const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6335";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

interface QdrantClientConfig {
  url: string;
  apiKey?: string;
  timeout?: number;
}

class QdrantClientSingleton {
  private static instance: QdrantClient | null = null;

  private constructor() {
  }

  public static getInstance(): QdrantClient {
    if (!QdrantClientSingleton.instance) {
      const config: QdrantClientConfig = {
        url: QDRANT_URL,
      };

      if (QDRANT_API_KEY) {
        config.apiKey = QDRANT_API_KEY;
      }

      QdrantClientSingleton.instance = new QdrantClient(config);
    }

    return QdrantClientSingleton.instance;
  }
}

export const getQdrantClient = (): QdrantClient => {
  return QdrantClientSingleton.getInstance();
};
