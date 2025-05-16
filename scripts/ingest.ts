import { getQdrantClient } from "../lib/qdrant";
import { Mixedbread } from "@mixedbread/sdk";
import fs from "fs";
import { parse } from "csv-parse/sync";
import path from "path";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

if (!process.env.MIXEDBREAD_API_KEY) {
  throw new Error("MIXEDBREAD_API_KEY is not set");
}

const mxbai = new Mixedbread({
  apiKey: process.env.MIXEDBREAD_API_KEY,
});

const qdrantClient = getQdrantClient();

const COLLECTION_NAME = "movies";

const VECTOR_SIZE = 1024;

const createMovieTemplate = (title: string, overview: string): string => {
  return `${title}: ${overview}`;
};

interface MovieData {
  Poster_Link: string;
  Series_Title: string;
  Released_Year: string;
  Certificate: string;
  Runtime: string;
  Genre: string;
  IMDB_Rating: string;
  Overview: string;
  Meta_score: string;
  Director: string;
  Star1: string;
  Star2: string;
  Star3: string;
  Star4: string;
  No_of_Votes: string;
  Gross: string;
  id?: string;
}

async function createCollection() {
  try {
    const collections = await qdrantClient.getCollections();

    if (
      !collections.collections.some(
        (collection) => collection.name === COLLECTION_NAME
      )
    ) {
      console.log(`Creating collection: ${COLLECTION_NAME}`);

      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: "Cosine",
          on_disk: true,
        },
        optimizers_config: {
          default_segment_number: 2,
        },
        replication_factor: 1,
      });

      console.log("Collection created successfully!");
    } else {
      console.log(`Collection ${COLLECTION_NAME} already exists.`);
    }
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
}

async function processMovies() {
  try {
    const filePath = path.join(process.cwd(), "data", "imdb_top_1000.csv");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const movies: MovieData[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Processing ${movies.length} movies...`);

    const BATCH_SIZE = 10;
    for (let i = 0; i < movies.length; i += BATCH_SIZE) {
      const batch = movies.slice(i, i + BATCH_SIZE);

      const templates = batch.map((movie) =>
        createMovieTemplate(movie.Series_Title, movie.Overview)
      );

      console.log(
        `Embedding batch ${i / BATCH_SIZE + 1}/${Math.ceil(
          movies.length / BATCH_SIZE
        )}`
      );

      const embeddingResponse = await mxbai.embed({
        model: "mixedbread-ai/mxbai-embed-large-v1",
        input: templates,
        normalized: true,
        encoding_format: "int8",
      });

      console.log("Sample embedding format:", {
        type: typeof embeddingResponse.data[0].embedding,
        isArray: Array.isArray(embeddingResponse.data[0].embedding),
        length: Array.isArray(embeddingResponse.data[0].embedding)
          ? embeddingResponse.data[0].embedding.length
          : "unknown",
      });

      const points = batch.map((movie, index) => {
        const id = uuidv4();
        const movieIndex = i + index;
        const embedding = embeddingResponse.data[index].embedding;
        const vector = Array.isArray(embedding) ? embedding : [];

        return {
          id,
          vector,
          payload: {
            ...movie,
            original_index: movieIndex,
            template: templates[index],
          },
        };
      });

      await qdrantClient.upsert(COLLECTION_NAME, {
        points,
      });

      console.log(`Uploaded ${points.length} movies to Qdrant`);
    }
    console.log("All movies have been processed and uploaded to Qdrant!");
  } catch (error) {
    console.error("Error processing movies:", error);
    throw error;
  }
}

async function main() {
  console.log("Starting ingestion process...");

  try {
    await createCollection();

    await processMovies();

    console.log("Ingestion process completed successfully!");
  } catch (error) {
    console.error("Ingestion process failed:", error);
    process.exit(1);
  }
}

main();
