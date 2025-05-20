"use server";

import { mxbai } from "@/lib/mxbai";
import { MovieData } from "@/types";

export interface MovieRecommendationItem {
  id: string | number;
  score: number;
  movie: MovieData;
}

export async function rerankRecommendations(
  filter: string,
  recommendations: MovieRecommendationItem[]
): Promise<MovieRecommendationItem[]> {
  if (!filter || !filter.trim() || !recommendations.length) {
    return recommendations;
  }

  const passages = recommendations.map((item) => {
    const movie = item.movie;
    const genres = movie.genres?.length
      ? `Genres: ${movie.genres.join(", ")}. `
      : "";
    const keywords = movie.keywords?.length
      ? `Keywords: ${movie.keywords.join(", ")}. `
      : "";

    return `${movie.title}. ${movie.overview || ""} ${genres}${keywords}`;
  });

  try {
    if (!filter.trim()) {
      throw new Error("Filter cannot be empty");
    }

    if (!passages || passages.length === 0) {
      throw new Error("No passages provided for reranking");
    }

    const model = "mixedbread-ai/mxbai-rerank-large-v2";
    const top_k = passages.length;
    const return_input = true;

    const rerankResponse = await mxbai.rerank({
      model,
      query: filter,
      input: passages,
      top_k,
      return_input,
    });

    return rerankResponse.data.map((item) => {
      const originalIndex = item.index;
      const originalItem = recommendations[originalIndex];

      return {
        ...originalItem,
        score: item.score,
      };
    });
  } catch (error) {
    console.error("Error reranking recommendations:", error);
    return recommendations;
  }
}
