# Mxbai Movie Search

A semantic movie search application built with Next.js and MixedBread AI, allowing users to search for movies using natural language queries and find semantically similar films based on plot, themes, and other features.

## Features

- **Semantic Search**: Find movies based on themes, concepts, and plot elements using natural language
- **Similar Movie Recommendations**: Get movie recommendations based on semantic similarity

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Qdrant running locally or remotely (see docker-compose.yml)
- [Mixedbread API key](https://www.mixedbread.com/)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/mxbai-movie-search.git
   cd mxbai-movie-search
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   MIXEDBREAD_API_KEY=your_api_key_here
   QDRANT_URL=http://localhost:6333
   ```

4. Start Qdrant using Docker:

   ```bash
   docker-compose up -d
   ```

5. Ingest movie data:

   ```bash
   npm run ingest
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) to view the application

## Data Ingestion

The project includes a data ingestion script that:

1. Creates a vector collection in Qdrant
2. Processes the data from the movie dataset
3. Generates embeddings using MixedBread's mixedbread-ai/mxbai-embed-large-v1 model
4. Stores vectors and metadata in Qdrant

### Embeddings

The application uses `mixedbread-ai/mxbai-embed-large-v1` to convert movie descriptions into vector embeddings for semantic search.

- [Mixedbread Embeddings Overview](https://www.mixedbread.com/docs/embeddings/overview)
- [Embedding Models Reference](https://www.mixedbread.com/docs/embeddings/models)
