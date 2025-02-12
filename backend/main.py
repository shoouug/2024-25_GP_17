# main.py
#SHI
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import os
import requests
import json
from pydantic import BaseModel#----------task3Correction
# Pinecone - NEW USAGE
from pinecone import Pinecone, ServerlessSpec
# Firestore (Firebase)
from google.cloud import firestore
import re
import nltk
from collections import Counter
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Query
from services.news_api_service import fetch_trending_news_by_topic

env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path, override=True) 

print("DEBUG: NEWS_API_KEY =", os.getenv("NEWS_API_KEY"))  # ✅ Should print the key
print("DEBUG: API_KEY =", os.getenv("API_KEY"))

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
if not NEWS_API_KEY:
    raise ValueError("NEWS_API_KEY is missing! Check your .env file.")


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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Only for debugging, NOT for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
async def generate_article(prompt: str, user_id: str, keywords: str = ""):
    """
    Generates a properly structured news article using RAG-enhanced data.
    """
    headers = {"Authorization": f"Bearer {API_KEY}"}

    # Fetch user writing style
    doc_ref = firestore_client.collection("Journalists").document(user_id)
    doc = doc_ref.get()
    linguistic_print = {}

    if doc.exists:
        articles = doc.to_dict().get("savedArticles", [])
        linguistic_print = extract_linguistic_print(articles)

    # Retrieve relevant news content via RAG
    news_response = fetch_trending_news_by_topic(prompt)

    if not news_response or "error" in news_response:
        return {"error": "No relevant news found for the topic."}

    # Select the best-matching article
    selected_article = news_response[0]

    # Extract content and clean unnecessary formatting
    raw_content = selected_article["content"].split("Read more")[0] if "Read more" in selected_article["content"] else selected_article["content"]
    
    # **New Prompt: Enforce a Clear Narrative Flow**
    ai_prompt = f"""
    You are an AI journalist. Rewrite the given information into a properly **structured news article**.

    **Guidelines:**
    - Avoid using markdown headers (e.g., 'Introduction', 'Main Content').
    - Instead, structure it **organically like a professional news article**.
    - The **opening paragraph** should introduce the event concisely.
    - The **middle section** should elaborate with details, including background and expert insights.
    - The **final section** should summarize the impact or future implications.
    - Ensure a **smooth narrative flow**, avoiding robotic formatting.
    - Integrate the following **keywords naturally**: {keywords}

    **Relevant Information:**
    - **Title**: {selected_article["title"]}
    - **Source**: {selected_article["source"]}
    - **Published Date**: {selected_article["publishedAt"]}
    - **Extracted Content**: "{raw_content}"

    🎯 **Generate a fully written article that reads like professional journalism.**
    """

    payload = {"prompt": ai_prompt}

    try:
        response = requests.post("https://api.deepseek.ai/v1/generate", json=payload, headers=headers)
        ai_data = response.json()

        # 🚀 **Log AI Response for Debugging**
        print("\n\n🛠 DEBUG: AI Response from DeepSeek API 🛠\n", json.dumps(ai_data, indent=2))

        return ai_data
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

#----------------------------------------------------------------------------task3

import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
if not firebase_admin._apps:  # Prevent initializing multiple times
    cred = credentials.Certificate("./credentials/gennews-2e5b4-firebase-adminsdk-k3adz-af7308d3ec.json")
    firebase_admin.initialize_app(cred)

#--------------------retrave articles
@app.get("/get-user-articles/{user_id}")
async def get_user_articles(user_id: str):
    """
    Retrieves all saved articles and previous articles from Firestore for a specific journalist.
    """
    try:
        doc_ref = firestore_client.collection("Journalists").document(user_id)
        doc = doc_ref.get()
        if doc.exists:
            data = doc.to_dict()
            return {
                "previousArticles": data.get("previousArticles", []),
                "savedArticles": data.get("savedArticles", [])
            }
        else:
            return {"message": "No articles found for this user."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#----------------------------extract linguistic print
# Average sentence length
# Most common words
# Most common phrases
'''
import collections 
import re 

def extract_linguistic_print(articles):
    """
    Extracts linguistic characteristics from past articles.
    """
    total_sentences = 0
    total_words = 0
    word_frequency = collections.Counter()
    sentence_lengths = []
    phrase_patterns = collections.Counter()

    for article in articles:
        content = article.get("content", "")
        sentences = re.split(r"[.!?]", content)  # Split by sentence endings
        sentences = [s.strip() for s in sentences if s.strip()]
        total_sentences += len(sentences)

        for sentence in sentences:
            words = sentence.split()
            total_words += len(words)
            sentence_lengths.append(len(words))
            word_frequency.update(words)

        # Extract common phrases (bigrams & trigrams)
        words = content.split()
        bigrams = [" ".join(pair) for pair in zip(words, words[1:])]
        trigrams = [" ".join(pair) for pair in zip(words, words[1:], words[2:])]
        phrase_patterns.update(bigrams)
        phrase_patterns.update(trigrams)

    # Calculate statistics
    avg_sentence_length = total_words / total_sentences if total_sentences > 0 else 0
    most_common_words = word_frequency.most_common(10)
    most_common_phrases = phrase_patterns.most_common(10)

    return {
        "avg_sentence_length": avg_sentence_length,
        "most_common_words": most_common_words,
        "most_common_phrases": most_common_phrases,
    }
'''

#----------------------------extract linguistic print UPDATED



text = "This is a test sentence. Let's see if NLTK works properly!" #working check
print(sent_tokenize(text))


import nltk
import os

# Tell NLTK where to find the data
nltk.data.path.append(os.path.join(os.getcwd(), "nltk_data"))

import nltk
import os

# Set the path where NLTK should look for the data
NLTK_DATA_PATH = os.path.join(os.getcwd(), "venv", "lib", "python3.12", "site-packages", "nltk_data")
nltk.data.path.append(NLTK_DATA_PATH)

# Ensure necessary NLTK components are available
nltk.download("punkt", download_dir=NLTK_DATA_PATH)
nltk.download("averaged_perceptron_tagger", download_dir=NLTK_DATA_PATH)
nltk.download("stopwords", download_dir=NLTK_DATA_PATH)


def extract_linguistic_print(articles):
    """
    Analyzes linguistic patterns from saved articles.
    Returns:
    - avg_sentence_length: The average length of sentences.
    - most_common_words: The most frequent words used.
    - most_common_phrases: The most frequent 2-word phrases.
    - tone: Estimated writing tone (formal, casual, storytelling, news-style).
    - voice_preference: Active vs. passive voice usage.
    - personal_vs_impersonal: Determines if the user writes with personal pronouns.
    """
    
    all_text = " ".join([article["content"] for article in articles if "content" in article])
    
    if not all_text:
        return {}

    # Tokenize sentences & words
    sentences = sent_tokenize(all_text)
    words = word_tokenize(all_text.lower())

    # Calculate sentence length
    avg_sentence_length = sum(len(word_tokenize(sentence)) for sentence in sentences) / len(sentences)

    # Count most common words (excluding stopwords)
    stop_words = set(stopwords.words("english"))
    word_freq = Counter([word for word in words if word.isalpha() and word not in stop_words])
    most_common_words = word_freq.most_common(10)

    # Find most common phrases (bigrams)
    bigrams = Counter(zip(words[:-1], words[1:]))
    most_common_phrases = bigrams.most_common(10)

    # **Tone Detection**
    formal_words = {"hence", "thus", "therefore", "moreover", "consequently", "furthermore"}
    casual_words = {"lol", "hey", "gonna", "wanna", "gotta", "idk", "omg"}
    storytelling_words = {"once", "upon", "suddenly", "moment", "felt", "realized"}

    formal_count = sum(1 for word in words if word in formal_words)
    casual_count = sum(1 for word in words if word in casual_words)
    storytelling_count = sum(1 for word in words if word in storytelling_words)

    if max(formal_count, casual_count, storytelling_count) == formal_count:
        tone = "Formal"
    elif max(formal_count, casual_count, storytelling_count) == casual_count:
        tone = "Casual"
    else:
        tone = "Storytelling"

    # **Active vs. Passive Voice Detection**
    active_voice_count = sum(1 for word in words if word in {"is", "was", "were", "been", "being"})
    passive_voice_count = sum(1 for word in words if word in {"by", "was", "were", "had been"})

    if active_voice_count > passive_voice_count:
        voice_preference = "Active Voice"
    else:
        voice_preference = "Passive Voice"

    # **Personal vs. Impersonal Writing**
    personal_words = {"i", "we", "me", "my", "mine", "our", "ours"}
    personal_count = sum(1 for word in words if word in personal_words)

    if personal_count > len(words) * 0.02:  # If more than 2% of words are personal
        personal_vs_impersonal = "Personal"
    else:
        personal_vs_impersonal = "Impersonal"

    return {
        "avg_sentence_length": avg_sentence_length,
        "most_common_words": most_common_words,
        "most_common_phrases": most_common_phrases,
        "tone": tone,
        "voice_preference": voice_preference,
        "personal_vs_impersonal": personal_vs_impersonal,
    }


#-------------Modify the API to return the linguistic print
#hhhhhhh

@app.get("/get-linguistic-print/{user_id}")
async def get_linguistic_print(user_id: str):
    """
    Retrieves past articles and analyzes linguistic style.
    """
    try:
        doc_ref = firestore_client.collection("Journalists").document(user_id)
        doc = doc_ref.get()
        if doc.exists:
            data = doc.to_dict()
            articles = data.get("savedArticles", [])
            linguistic_print = extract_linguistic_print(articles)
            return {"linguistic_print": linguistic_print}
        else:
            return {"message": "No articles found for this user."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/news")
def get_news(topic: str = Query(..., description="The topic to search for")):
    """
    Fetches news articles based on a given topic.
    Example usage: /news?topic=Technology
    """
    articles = fetch_trending_news_by_topic(topic)

    if "error" in articles:
        raise HTTPException(status_code=500, detail=articles["error"])

    return {"articles": articles}