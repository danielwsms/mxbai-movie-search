# MxBai Movie Search

A semantic movie search application using MixedBread AI embeddings and Qdrant vector database.

## Setup

1. Create a `.env` file with the following variables:

   ```
   MXBAI_API_KEY=your_mixedbread_api_key
   QDRANT_URL=your_qdrant_url_or_localhost
   ```

2. Install the required packages:

   ```
   pip install -r requirements.txt
   ```

3. Prepare your movie data in JSON format in `data/top_10k_movies.json`

4. Run the ingest script to embed movies and store them in Qdrant:

   ```
   python ingest.py
   ```

5. Run the Streamlit app:
   ```
   streamlit run app.py
   ```

## Usage

1. Enter a search query in the text input field
2. The app will find the 20 most semantically similar movies to your query
3. Results will be displayed in a grid showing movie posters and titles

## Data Format

Your movie data should include at least:

- `title`: Movie title
- `overview`: Movie description
- `poster_path`: Relative path to the movie poster (used with TMDB API)
- `keywords`: List of keywords or tags for the movie (optional)
