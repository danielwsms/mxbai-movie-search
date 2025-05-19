"use server";

import { mxbai } from "@/lib/mxbai";

export async function rerankPassages(
  query: string,
  passages: string[],
  options: {
    model?: string;
    top_k?: number;
    return_input?: boolean;
  } = {}
) {
  if (!query.trim()) {
    throw new Error("Query cannot be empty");
  }

  if (!passages || passages.length === 0) {
    throw new Error("No passages provided for reranking");
  }

  const {
    model = "mixedbread-ai/mxbai-rerank-large-v2",
    top_k = passages.length,
    return_input = false,
  } = options;

  const rerankResponse = await mxbai.rerank({
    model,
    query,
    input: passages,
    top_k,
    return_input,
  });

  return rerankResponse;
}
