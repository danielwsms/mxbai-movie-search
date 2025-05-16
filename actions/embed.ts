"use server";

import { mxbai } from "@/lib/mxbai";

export async function generateEmbeddings(
  inputs: string[],
  options: {
    model?: string;
    normalized?: boolean;
    encoding_format?: "float" | "int8";
  } = {}
) {
  if (!inputs || inputs.length === 0) {
    throw new Error("No inputs provided for embedding");
  }

  const {
    model = "mixedbread-ai/mxbai-embed-large-v1",
    normalized = true,
    encoding_format = "int8",
  } = options;

  const embeddingResponse = await mxbai.embed({
    model,
    input: inputs,
    normalized,
    encoding_format,
  });

  return embeddingResponse;
}
