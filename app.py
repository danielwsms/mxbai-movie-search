import os
import streamlit as st
from dotenv import load_dotenv
from mixedbread import Mixedbread
from qdrant_client import QdrantClient

load_dotenv()

MXBAI_API_KEY = os.getenv("MXBAI_API_KEY")
mxbai = Mixedbread(api_key=MXBAI_API_KEY)

qdrant = QdrantClient(url=os.getenv("QDRANT_URL"))

COLLECTION_NAME = "movies"

def embed_query(query: str):
    """
    Embed the search query using MixedBread
    """
    res = mxbai.embed(
        model="mixedbread-ai/mxbai-embed-large-v1",
        input=[query],
        normalized=True,
        encoding_format="float",
    )
    return res.data[0].embedding

def search_movies(query_embedding, limit=20):
    """
    Search for similar movies using the embedded query
    """
    results = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        limit=limit,
        with_vectors=True
    ).points
    return results

st.set_page_config(page_title="Movie Search", page_icon="🎬", layout="wide")

st.title("🎬 Semantic Movie Search")

search_query = st.text_input("Describe the movie you're looking for")

if search_query:
    with st.spinner("Searching for movies..."):
        query_embedding = embed_query(search_query)
        
        search_results = search_movies(query_embedding)
        
        if search_results:
            
            sorted_results = sorted(
                search_results, 
                key=lambda x: x.payload.get('vote_count', 0),
                reverse=True
            )
            
            cols = 6
            rows = (len(sorted_results) + cols - 1) // cols
            
            for row in range(rows):
                columns = st.columns(cols)
                for col in range(cols):
                    idx = row * cols + col
                    if idx < len(sorted_results):
                        movie = sorted_results[idx].payload
                        with columns[col]:
                            poster_path = movie.get("poster_path")
                            title = movie.get("title", "Unknown Title")
                            vote_count = movie.get("vote_count", 0)
                            
                            if poster_path:
                                poster_url = f"https://image.tmdb.org/t/p/original{poster_path}"
                                st.image(poster_url, caption=title, use_container_width=True )
                            else:
                                st.info(title)
                                
                           
        else:
            st.info("No movies found matching your query.")

