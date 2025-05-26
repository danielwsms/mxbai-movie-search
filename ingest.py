import json
import os
import logging
from typing import List, Dict, Any
from tqdm import tqdm
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from mixedbread import Mixedbread

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def load_movie_data(file_path: str) -> List[Dict[str, Any]]:
    """Load movie data from JSON file."""
    logger.info(f"Loading movie data from {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        movies = json.load(f)
    logger.info(f"Loaded {len(movies)} movies")
    return movies

def create_movie_template(movie: Dict[str, Any]) -> str:
    """Create a template string for embedding from movie data."""
    title = movie.get('title', '')
    overview = movie.get('overview', '')
    keywords = movie.get('keywords', [])
    
    keywords_str = ', '.join(keywords) if keywords else ''
    
    template = f"title: {title}, overview: {overview}, keywords: {keywords_str}"
    return template

def setup_qdrant_collection(client: QdrantClient, collection_name: str, vector_size: int) -> None:
    """Set up Qdrant collection for storing movie vectors."""
    logger.info(f"Setting up Qdrant collection: {collection_name}")
    
    try:
        collections = client.get_collections().collections
        if any(collection.name == collection_name for collection in collections):
            logger.warning(f"Collection {collection_name} already exists. Recreating...")
            client.delete_collection(collection_name)
    except Exception as e:
        logger.error(f"Error checking collections: {e}")
    
    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
    )
    logger.info(f"Created collection {collection_name} with vector size {vector_size}")

def embed_movies_batch(mxbai: Mixedbread, movie_templates: List[str], batch_size: int = 100) -> List[List[float]]:
    """Embed movie templates in batches."""
    all_embeddings = []
    
    for i in tqdm(range(0, len(movie_templates), batch_size), desc="Creating embeddings"):
        batch = movie_templates[i:i + batch_size]
        
        try:
            response = mxbai.embed(
                model="mixedbread-ai/mxbai-embed-large-v1",
                input=batch,
                normalized=True,
                encoding_format="float",
            )
            
            batch_embeddings = [item.embedding for item in response.data]
            all_embeddings.extend(batch_embeddings)
            
        except Exception as e:
            logger.error(f"Error embedding batch {i//batch_size + 1}: {e}")
            all_embeddings.extend([[] for _ in batch])
    
    return all_embeddings

def ingest_movies_to_qdrant(
    client: QdrantClient,
    collection_name: str,
    movies: List[Dict[str, Any]],
    embeddings: List[List[float]],
    batch_size: int = 100
) -> None:
    """Ingest movies and their embeddings to Qdrant."""
    logger.info(f"Ingesting {len(movies)} movies to Qdrant...")
    
    points = []
    for i, (movie, embedding) in enumerate(zip(movies, embeddings)):
        if not embedding:
            logger.warning(f"Skipping movie {i} due to embedding failure")
            continue
            
        point = PointStruct(
            id=i,
            vector=embedding,
            payload=movie
        )
        points.append(point)
        
        if len(points) >= batch_size:
            client.upsert(
                collection_name=collection_name,
                wait=True,
                points=points
            )
            points = []
    
    if points:
        client.upsert(
            collection_name=collection_name,
            wait=True,
            points=points
        )
    
    logger.info(f"Successfully ingested {len([e for e in embeddings if e])} movies to Qdrant")

def main():
    QDRANT_URL = "http://localhost:6335"
    COLLECTION_NAME = "movies"
    MOVIES_FILE = "data/top_10k_movies.json"
    BATCH_SIZE = 50
    
    api_key = os.getenv("MXBAI_API_KEY")
    if not api_key:
        raise ValueError("Please set the MXBAI_API_KEY environment variable")
    
    mxbai = Mixedbread(api_key=api_key)
    
    logger.info(f"Connecting to Qdrant at {QDRANT_URL}")
    qdrant_client = QdrantClient(url=QDRANT_URL)
    
    movies = load_movie_data(MOVIES_FILE)
    
    logger.info("Creating template strings for embedding...")
    movie_templates = [create_movie_template(movie) for movie in movies]
    
    logger.info("Creating embeddings using Mixedbread AI...")
    embeddings = embed_movies_batch(mxbai, movie_templates, batch_size=BATCH_SIZE)
    
    vector_size = None
    for embedding in embeddings:
        if embedding:
            vector_size = len(embedding)
            break
    
    if not vector_size:
        raise ValueError("No successful embeddings created")
    
    logger.info(f"Vector size: {vector_size}")
    
    setup_qdrant_collection(qdrant_client, COLLECTION_NAME, vector_size)
    
    ingest_movies_to_qdrant(qdrant_client, COLLECTION_NAME, movies, embeddings, batch_size=BATCH_SIZE)
    
    collection_info = qdrant_client.get_collection(COLLECTION_NAME)
    logger.info(f"Collection info: {collection_info}")
    logger.info("Ingestion completed successfully!")

if __name__ == "__main__":
    main()
