"use server";

import { getQdrantClient } from "@/lib/qdrant";
import { generateEmbeddings } from "./embed";
import { MovieData } from "@/types";

interface SearchOptions {
  limit?: number;
}

interface MovieSearchResult {
  id: string | number;
  score: number;
  movie: MovieData & {
    original_index?: number;
    template?: string;
  };
}

export async function searchMovies(
  query: string,
  options: SearchOptions = {}
): Promise<MovieSearchResult[]> {
  if (!query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  const { limit = 10 } = options;
  const qdrantClient = getQdrantClient();
  const COLLECTION_NAME = "movies";

  try {
    const embeddingResponse = await generateEmbeddings([query]);

    if (!embeddingResponse?.data?.[0]?.embedding) {
      throw new Error("Failed to generate embedding for search query");
    }

    const vector = Array.isArray(embeddingResponse.data[0].embedding)
      ? embeddingResponse.data[0].embedding
      : [];

    const searchResults = await qdrantClient.search(COLLECTION_NAME, {
      vector: vector,
      limit: limit,
      with_payload: true,
    });

    return searchResults.map((point) => ({
      id: point.id,
      score: point.score,
      movie: point.payload as unknown as MovieData & {
        original_index?: number;
        template?: string;
      },
    }));
  } catch (error: unknown) {
    console.error("Error searching movies:", error);
    throw new Error(
      `Search failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
