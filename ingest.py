import os
import json
from typing import List, Dict, Any
from dotenv import load_dotenv

from mixedbread import Mixedbread
from qdrant_client import QdrantClient
from qdrant_client.http import models as rest

load_dotenv()

MXBAI_API_KEY = os.getenv("MXBAI_API_KEY")
mxbai = Mixedbread(api_key=MXBAI_API_KEY)

qdrant = QdrantClient(url=os.getenv("QDRANT_URL"))

COLLECTION_NAME = "movies"
EMBEDDING_DIM = 1024

def create_template_string(movie: Dict[str, Any]) -> str:
    """
    Create a template string from movie data that will be embedded.
    
    Args:
        movie: Movie data dictionary
        
    Returns:
        Template string for embedding
    """
    title = movie.get("title", "")
    overview = movie.get("overview", "")
    
    keywords = movie.get("keywords", [])
    if isinstance(keywords, list):
        keywords_str = ", ".join(keywords)
    else:
        keywords_str = str(keywords)
    
    template = f"Title: {title}\nOverview: {overview}\nKeywords: {keywords_str}"
    
    return template

def embed_movie(movie: Dict[str, Any]) -> List[float]:
    """
    Embed a movie using MixedBread SDK.
    
    Args:
        movie: Movie data dictionary
        
    Returns:
        Embedding vector
    """
    template_string = create_template_string(movie)
    
    res = mxbai.embed(
        model="mixedbread-ai/mxbai-embed-large-v1",
        input=[template_string],
        normalized=True,
        encoding_format="float",
    )
    
    return res.data[0].embedding

def ensure_collection_exists():
    """
    Create the movies collection in Qdrant if it doesn't exist.
    """
    collections = qdrant.get_collections().collections
    collection_names = [collection.name for collection in collections]
    
    if COLLECTION_NAME not in collection_names:
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=rest.VectorParams(
                size=EMBEDDING_DIM,
                distance=rest.Distance.COSINE,
            )
        )
        print(f"Created collection '{COLLECTION_NAME}'")
    else:
        print(f"Collection '{COLLECTION_NAME}' already exists")

def ingest_movies(movies: List[Dict[str, Any]]):
    """
    Ingest movies into Qdrant.
    
    Args:
        movies: List of movie dictionaries
    """
    ensure_collection_exists()
    
    points = []
    for i, movie in enumerate(movies):
        if not movie.get("title"):
            print(f"Skipping movie at index {i} due to missing title")
            continue
        
        try:
            embedding = embed_movie(movie)
            
            point_id = movie.get("id", i)
            points.append(rest.PointStruct(
                id=point_id,
                vector=embedding,
                payload=movie
            ))
            
            print(f"Processed movie: {movie.get('title')}")
            
            if len(points) >= 100:
                qdrant.upsert(
                    collection_name=COLLECTION_NAME,
                    points=points
                )
                print(f"Uploaded batch of {len(points)} movies")
                points = []
                
        except Exception as e:
            print(f"Error processing movie {movie.get('title', 'unknown')}: {e}")
    
    if points:
        qdrant.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )
        print(f"Uploaded final batch of {len(points)} movies")

def load_movies_from_file(filepath: str) -> List[Dict[str, Any]]:
    """
    Load movies from a JSON file.
    
    Args:
        filepath: Path to the JSON file
        
    Returns:
        List of movie dictionaries
    """
    with open(filepath, 'r') as f:
        return json.load(f)

if __name__ == "__main__":
    file_path = "./data/top_10k_movies.json"
    
    movies = load_movies_from_file(file_path)
    
    print(f"Ingesting {len(movies)} movies...")
    ingest_movies(movies)
    print("Ingestion complete")
