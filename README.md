# Movie Search App

A Streamlit application that enables semantic movie discovery using natural language queries powered by Mixedbread AI embeddings and Qdrant vector database.

## Features

- **Semantic Movie Search**: Search through 10,000+ movies using natural language queries like "space adventure with robots"
- **AI-Powered Embeddings**: Leverage Mixedbread AI's high-quality `mxbai-embed-large-v1` model for semantic search.
- **Interactive Interface**: Clean, user-friendly Streamlit interface with adjustable search parameters

## Prerequisites

- Python 3.11+
- Docker (for Qdrant database)
- Mixedbread AI API key
- Movie dataset

## Resources

- **[Mixedbread Documentation](https://www.mixedbread.com/docs)** - Complete API documentation and guides
- **[Mixedbread Platform](https://www.mixedbread.com/)** - Sign up and manage your API keys

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/danielwsms/mxbai-movie-search
   cd mxbai-movie-search
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   MXBAI_API_KEY=your_mixedbread_api_key
   ```

4. **Start Qdrant database**
   ```bash
   docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
   ```

5. **Ingest the movie data**
   ```bash
   python ingest.py
   ```
   This script will:
   - Create embeddings for all movies using Mixedbread AI
   - Set up a Qdrant collection for vector storage
   - Upload movie data and embeddings to the vector database

6. **Run the application**
   ```bash
   streamlit run app.py
   ```

## Usage

1. Open the application in your browser (typically `http://localhost:8501`)
2. Enter your movie search query in the text input using natural language:
   - "space adventure with robots"
   - "romantic comedy in Paris"
   - "superhero movie with dark themes"
3. Adjust the number of movies to retrieve using the sidebar slider

## How It Works

1. **Query Processing**: Your search query is processed and embedded using Mixedbread AI's model
2. **Movie Retrieval**: The most relevant movies are retrieved from the Qdrant vector database using cosine similarity
3. **Visual Display**: Retrieved movies are displayed as cards