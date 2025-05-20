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

  const { limit = 24 } = options;
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

    const results = searchResults.map((point) => ({
      id: point.id,
      score: point.score,
      movie: point.payload as unknown as MovieData & {
        original_index?: number;
        template?: string;
      },
    }));

    return results.sort((a, b) => b.movie.vote_count - a.movie.vote_count);
  } catch (error: unknown) {
    console.error("Error searching movies:", error);
    throw new Error(
      `Search failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function getMovieById(
  id: string | number
): Promise<MovieData | null> {
  const qdrantClient = getQdrantClient();
  const COLLECTION_NAME = "movies";

  try {
    const retrieveResponse = await qdrantClient.retrieve(COLLECTION_NAME, {
      ids: [id],
      with_payload: true,
      with_vector: true,
    });

    if (!retrieveResponse.length) {
      return null;
    }

    return retrieveResponse[0].payload as unknown as MovieData;
  } catch (error: unknown) {
    console.error("Error retrieving movie:", error);
    throw new Error(
      `Retrieve failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function getSimilarMovies(
  id: string | number,
  options: SearchOptions = {}
): Promise<MovieSearchResult[]> {
  const { limit = 20 } = options;
  const qdrantClient = getQdrantClient();
  const COLLECTION_NAME = "movies";

  try {
    const retrieveResponse = await qdrantClient.retrieve(COLLECTION_NAME, {
      ids: [id],
      with_payload: true,
      with_vector: true,
    });

    if (!retrieveResponse.length || !retrieveResponse[0].vector) {
      throw new Error("Movie not found or vector not available");
    }

    const vector = retrieveResponse[0].vector as number[];
    const searchResults = await qdrantClient.search(COLLECTION_NAME, {
      vector: vector,
      limit: limit + 1,
      with_payload: true,
    });

    const filteredResults = searchResults.filter(
      (result) => result.id.toString() !== id.toString()
    );

    const limitedResults = filteredResults.slice(0, limit);

    const results = limitedResults.map((point) => ({
      id: point.id,
      score: point.score,
      movie: point.payload as unknown as MovieData & {
        original_index?: number;
        template?: string;
      },
    }));

    return results.sort((a, b) => b.movie.popularity - a.movie.popularity);
  } catch (error: unknown) {
    console.error("Error finding similar movies:", error);
    throw new Error(
      `Similar movies search failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
