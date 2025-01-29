# main.py

from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import os
import requests
import json

# Pinecone - NEW USAGE
from pinecone import Pinecone, ServerlessSpec

# Firestore (Firebase)
from google.cloud import firestore

# Load environment variables
load_dotenv()

API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise ValueError("API Key not found. Please check your .env file.")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")  # e.g. "us-east-1"

if not PINECONE_API_KEY or not PINECONE_ENVIRONMENT:
    raise ValueError(
        "Pinecone API Key or Environment is missing in the .env file.\n"
        "Check PINECONE_API_KEY and PINECONE_ENVIRONMENT."
    )

# Initialize FastAPI app
app = FastAPI()

# Set the path for Google credentials (for Firebase/Firestore)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./credentials/gennews-2e5b4-f984c5782159-1.json"
if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
    raise EnvironmentError(
        "The GOOGLE_APPLICATION_CREDENTIALS environment variable is not set. "
        "Please set it to point to your service account JSON file."
    )

# Initialize Firestore (Firebase)
firestore_client = firestore.Client()

###############################################################################
# PINECONE INITIALIZATION - NEW SYNTAX
###############################################################################
# Create a Pinecone instance (no more pinecone.init())
pc = Pinecone(api_key=PINECONE_API_KEY)

# Define your Pinecone Index name
INDEX_NAME = "retrieval-engine"

# Check if the index exists; if not, create it.
existing_indexes = pc.list_indexes()  # returns a list of IndexSummary objects
existing_index_names = [i.name for i in existing_indexes]

if INDEX_NAME not in existing_index_names:
    # If you're on a Serverless (Starter) plan, you'll typically use ServerlessSpec
    # Make sure your region is correct, e.g., "us-east-1" or "us-west-2"
    # If you have a Dedicated plan or a different setup, adapt accordingly.
    pc.create_index(
        name=INDEX_NAME,
        dimension=1536,       # adjust dimension to match your embeddings
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",            # or 'gcp' depending on your Pinecone project
            region=PINECONE_ENVIRONMENT
        )
    )

# Now connect to the existing (or newly created) index
index = pc.Index(INDEX_NAME)

print(f"Successfully set up Pinecone Index: {INDEX_NAME}")

###############################################################################
# FASTAPI ROUTES
###############################################################################

@app.get("/")
async def read_root():
    """
    Health-check endpoint to verify the server is running.
    """
    return {"message": "FastAPI backend for retrieval engine and DeepSeek integration is running!"}

@app.post("/ingest-data/")
async def ingest_data(items: list[dict]):
    """
    Accepts a list of items with the structure:
    {
        "id": "unique_id",
        "content": "text to embed",
        "metadata": { "source": "Firecrawl", "category": "news" }
    }

    Then upserts them into the Pinecone index.
    """
    try:
        vectors = []
        for item in items:
            item_id = item["id"]
            text_content = item["content"]
            metadata = item.get("metadata", {})

            # Convert text to a vector (embedding)
            vector_values = generate_vector(text_content)  # Replace with real embedding

            vectors.append({
                "id": item_id,
                "values": vector_values,
                "metadata": metadata
            })

        # Upsert vectors into Pinecone
        index.upsert(vectors=vectors)
        return {"message": "Data ingested successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/search/")
async def search_pinecone(query: str, top_k: int = 5):
    """
    Searches Pinecone for relevant vectors given a query text.
    Returns the top_k matches from the index.
    """
    try:
        # Convert the query to an embedding vector
        query_vector = generate_vector(query)
        results = index.query(vector=query_vector, top_k=top_k, include_metadata=True)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-article/")
async def generate_article(prompt: str):
    """
    Example route to call DeepSeek-V3 (or any other LLM) using your API_KEY.
    Adjust the endpoint if your actual DeepSeek URL differs.
    """
    headers = {"Authorization": f"Bearer {API_KEY}"}
    payload = {"prompt": prompt}

    try:
        # Example placeholder URL (update with the real DeepSeek endpoint)
        response = requests.post("https://api.deepseek.ai/v1/generate", json=payload, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/save-preferences/")
async def save_preferences(user_id: str, preferences: dict):
    """
    Stores user preferences in Firestore under the 'users' collection.
    """
    try:
        doc_ref = firestore_client.collection("users").document(user_id)
        doc_ref.set(preferences)
        return {"message": "Preferences saved successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get-preferences/{user_id}")
async def get_preferences(user_id: str):
    """
    Retrieves user preferences from Firestore.
    """
    try:
        doc_ref = firestore_client.collection("users").document(user_id)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            return {"message": "No preferences found for this user."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


###############################################################################
# HELPER FUNCTION: generate_vector
###############################################################################
def generate_vector(text: str):
    """
    Replace this function with a real embedding model call.
    E.g. using OpenAI:
    
    import openai
    openai.api_key = "YOUR_OPENAI_KEY"
    response = openai.Embedding.create(
        model="text-embedding-ada-002",
        input=text
    )
    embedding = response['data'][0]['embedding']
    return embedding
    """
    # Return a mock vector of zeros for demonstration (1536 dims).
    return [0.0] * 1536
