import { qdrantClient } from "../lib/qdrant";
import { generateEmbeddings } from "../actions/embed";
import fs from "fs";
import path from "path";
import { MovieData } from "../types";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const COLLECTION_NAME = "movies";

const VECTOR_SIZE = 1024;

const createMovieTemplate = (title: string, overview: string): string => {
  return `${title}: ${overview}`;
};

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
    const filePath = path.join(process.cwd(), "data", "top_10k_movies.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const movies = JSON.parse(fileContent) as MovieData[];

    console.log(`Processing ${movies.length} movies...`);

    const BATCH_SIZE = 10;
    for (let i = 0; i < movies.length; i += BATCH_SIZE) {
      const batch = movies.slice(i, i + BATCH_SIZE);

      const templates = batch.map((movie) =>
        createMovieTemplate(movie.title, movie.overview)
      );

      console.log(
        `Embedding batch ${i / BATCH_SIZE + 1}/${Math.ceil(
          movies.length / BATCH_SIZE
        )}`
      );

      const embeddingResponse = await generateEmbeddings(templates);

      console.log("Sample embedding format:", {
        type: typeof embeddingResponse.data[0].embedding,
        isArray: Array.isArray(embeddingResponse.data[0].embedding),
        length: Array.isArray(embeddingResponse.data[0].embedding)
          ? embeddingResponse.data[0].embedding.length
          : "unknown",
      });

      const points = batch.map((movie, index) => {
        const embedding = embeddingResponse.data[index].embedding;
        const vector = Array.isArray(embedding) ? embedding : [];

        return {
          id: uuidv4(),
          vector,
          payload: {
            ...movie,
            original_index: i + index,
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
