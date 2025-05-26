import streamlit as st
import os
from dotenv import load_dotenv
from mixedbread import Mixedbread
from qdrant_client import QdrantClient
import logging

load_dotenv()

st.set_page_config(page_title="Semantic Movie Search", layout="wide", page_icon="🍞")

logging.basicConfig(level=logging.WARNING)

def load_config():
    mixedbread_api_key = os.getenv("MXBAI_API_KEY")
    
    errors = []
    if not mixedbread_api_key:
        errors.append("MXBAI_API_KEY not found in .env file")
    
    return {
        "mixedbread_api_key": mixedbread_api_key,
        "errors": errors,
    }

def search_movies(query, mixedbread_api_key, top_k=10):
    try:
        mxbai = Mixedbread(api_key=mixedbread_api_key)
        qdrant_client = QdrantClient(url="http://localhost:6335")
        
        response = mxbai.embed(
            model="mixedbread-ai/mxbai-embed-large-v1",
            input=[query],
            normalized=True,
            encoding_format="float",
        )
        
        query_embedding = response.data[0].embedding
        
        search_results = qdrant_client.query_batch_points(
            collection_name="movies",
            query_vector=query_embedding,
            limit=top_k,
            with_payload=True
        )
        
        results = [
            {
                "score": result.score,
                "movie": result.payload
            }
            for result in search_results
        ]
        
        return sorted(results, key=lambda x: x["movie"].get("vote_count", 0), reverse=True)
        
    except Exception as e:
        st.error(f"Error searching movies: {str(e)}")
        return []

def display_movie_card(movie_data):
    movie = movie_data["movie"]
    
    poster_path = movie.get('poster_path')
    if poster_path:
        poster_url = f"https://image.tmdb.org/t/p/original{poster_path}"
        st.image(poster_url, use_container_width=True)
    
    title = movie.get('title', 'Unknown Title')
    release_date = movie.get('release_date')
    
    if release_date:
        year = release_date.split('-')[0]
        st.write(f"**{title} - {year}**")
    else:
        st.write(f"**{title}**")

def main():
    st.title("Semantic Movie Search")
    
    
    config = load_config()
    
    if config["errors"]:
        for error in config["errors"]:
            st.error(error)
    
    with st.sidebar:
        st.header("Search Settings")
        top_k = st.slider(
            "Number of movies to retrieve", 
            min_value=1, 
            max_value=50, 
            value=10
        )
    
        
        st.divider()
        st.subheader("Resources")
        st.link_button("Documentation", "https://www.mixedbread.com/docs")
        st.link_button("GitHub", "https://github.com/danielwsms/mxbai-movie-search")
    
    query = st.text_input(
        "Search for movies:", 
        placeholder="e.g. space adventure with robots, romantic comedy in paris, superhero movie..."
    )
    
    if query:
        if config["errors"]:
            st.error("Please fix configuration errors before searching")
            return
        
        st.divider()
        with st.spinner("Searching through movies..."):
            search_results = search_movies(query, config["mixedbread_api_key"], top_k)
        
        if search_results:
            cols_per_row = 4
            for i in range(0, len(search_results), cols_per_row):
                cols = st.columns(cols_per_row)
                
                for j, col in enumerate(cols):
                    result_index = i + j
                    if result_index < len(search_results):
                        with col:
                            result = search_results[result_index]
                            display_movie_card(result)
        else:
            st.warning("No movies found for your query. Try rephrasing your search or check if the Qdrant database is running.")

if __name__ == "__main__":
    main()
