"use server";

import { rerankPassages } from "./rerank";
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
    return `${movie.title}. ${movie.overview || ""}`;
  });

  try {
    const rerankResult = await rerankPassages(filter, passages, {
      top_k: passages.length,
      return_input: true,
    });

    return rerankResult.data.map((item) => {
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
