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
import cohere
import string
from textstat import flesch_reading_ease

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

# ✅ Initialize Cohere client
co = cohere.Client(API_KEY)

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Only for debugging, NOT for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ArticleRequest(BaseModel):
    prompt: str
    user_id: str
    keywords: str = ""

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
async def generate_article(request: ArticleRequest):
    """
    Generates a news article using Cohere AI, incorporating the journalist's detailed writing style.
    """
    print(f"🔎 Received request: {request}")

    prompt = request.prompt
    user_id = request.user_id
    keywords = request.keywords

    # Fetch Linguistic Print
    doc_ref = firestore_client.collection("Journalists").document(user_id)
    doc = doc_ref.get()

    linguistic_print = {}

    if doc.exists:
        data = doc.to_dict()
        previous_articles = data.get("previousArticles", [])
        if previous_articles:
            linguistic_print = extract_linguistic_print(previous_articles)
            print("\n✅ DEBUG: Extracted Linguistic Print:", linguistic_print)

    # Apply Linguistic Print to AI Prompt
    cohere_prompt = f"""
You are an AI journalist writing in the style of a specific journalist.
Analyze and replicate their unique **writing structure, tone, and word usage**.

# Writing Style:
- **Tone:** {linguistic_print.get("tone", "Neutral")}
- **Sentence Length:** {linguistic_print.get("avg_sentence_length", "Moderate")}
- **Readability Score:** {linguistic_print.get("readability_score", "Standard")}
- **Common Words:** {", ".join([word[0] for word in linguistic_print.get("most_common_words", [])])}
- **Common Punctuation:** {", ".join([punct[0] for punct in linguistic_print.get("most_common_punctuation", [])])}
- **Voice Preference:** {linguistic_print.get("voice_preference", "Balanced")}
- **Personal vs. Impersonal Style:** {linguistic_print.get("personal_vs_impersonal", "Neutral")}

# Instructions:
- **Generate a fully structured news article**.
- Ensure the article **matches the journalist's writing style**.
- Incorporate **keywords naturally**: {keywords}.
- Maintain **coherence and factual accuracy**.

**Topic:** {prompt}
"""

    try:
        response = co.generate(
            model="command",
            prompt=cohere_prompt,
            max_tokens=4096,
            temperature=0.7,
            frequency_penalty=0.1,
            presence_penalty=0.2
        )

        generated_article = response.generations[0].text.strip()

        # ✅ Ensure Full Article is Set
        generated_article = generated_article.replace("[+2728 chars]", "")

        print("\n📝 Full Generated Article Preview:\n", generated_article)

        return {"article": generated_article}  # ✅ Full text returned to frontend

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Cohere API Error: {str(e)}")




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
    cred = credentials.Certificate("./credentials/gennews-2e5b4-firebase-adminsdk-k3adz-af7308d3ec2.json")
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
                #"savedArticles": data.get("savedArticles", [])
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


#import nltk
#import os

# Tell NLTK where to find the data
nltk.data.path.append(os.path.join(os.getcwd(), "nltk_data"))

#import nltk
#import os

# Set the path where NLTK should look for the data
NLTK_DATA_PATH = os.path.join(os.getcwd(), "venv", "lib", "python3.12", "site-packages", "nltk_data")
nltk.data.path.append(NLTK_DATA_PATH)

# Ensure necessary NLTK components are available
nltk.download("punkt", download_dir=NLTK_DATA_PATH)
nltk.download("averaged_perceptron_tagger", download_dir=NLTK_DATA_PATH)
nltk.download("stopwords", download_dir=NLTK_DATA_PATH)


def extract_linguistic_print(articles):
    """
    Extracts a detailed linguistic profile from previous articles.
    This captures deeper writing patterns beyond basic word and sentence statistics.
    """

    all_text = " ".join(articles)#without content________________________________________

    if not all_text:
        return {}

    # Tokenize sentences & words
    sentences = sent_tokenize(all_text)
    words = word_tokenize(all_text.lower())

    # Remove punctuation & stopwords
    stop_words = set(stopwords.words("english"))
    words_cleaned = [word for word in words if word.isalpha() and word not in stop_words]

    # **Sentence Length & Complexity**
    avg_sentence_length = sum(len(word_tokenize(sentence)) for sentence in sentences) / len(sentences)
    readability_score = flesch_reading_ease(all_text)  # Measures writing complexity

    # **Most Common Words & Phrases**
    word_freq = Counter(words_cleaned)
    most_common_words = word_freq.most_common(15)  # 🔹 Increased to 15 words
    bigrams = Counter(zip(words_cleaned[:-1], words_cleaned[1:]))
    most_common_phrases = bigrams.most_common(15)  # 🔹 Increased to 15 phrases

    # **Punctuation & Writing Style**
    punctuation_freq = Counter(char for char in all_text if char in string.punctuation)
    most_common_punctuation = punctuation_freq.most_common(5)

    # **Tone Analysis**
    formal_words = {"hence", "thus", "therefore", "moreover", "consequently", "furthermore"}
    casual_words = {"lol", "hey", "gonna", "wanna", "gotta", "idk", "omg"}
    storytelling_words = {"once", "upon", "suddenly", "moment", "felt", "realized", "narrative"}

    formal_count = sum(1 for word in words_cleaned if word in formal_words)
    casual_count = sum(1 for word in words_cleaned if word in casual_words)
    storytelling_count = sum(1 for word in words_cleaned if word in storytelling_words)

    if max(formal_count, casual_count, storytelling_count) == formal_count:
        tone = "Formal"
    elif max(formal_count, casual_count, storytelling_count) == casual_count:
        tone = "Casual"
    else:
        tone = "Storytelling"

    # **Active vs. Passive Voice**
    passive_voice_count = sum(1 for word in words if word in {"by", "was", "were", "had been"})
    active_voice_count = sum(1 for word in words if word in {"do", "does", "did", "has", "have", "had"})

    if active_voice_count > passive_voice_count:
        voice_preference = "Active Voice"
    else:
        voice_preference = "Passive Voice"

    # **Personal vs. Impersonal Writing**
    personal_words = {"i", "we", "me", "my", "mine", "our", "ours"}
    personal_count = sum(1 for word in words_cleaned if word in personal_words)

    if personal_count > len(words_cleaned) * 0.02:
        personal_vs_impersonal = "Personal"
    else:
        personal_vs_impersonal = "Impersonal"

    return {
        "avg_sentence_length": avg_sentence_length,
        "readability_score": readability_score,
        "most_common_words": most_common_words,
        "most_common_phrases": most_common_phrases,
        "most_common_punctuation": most_common_punctuation,
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
            articles = data.get("previousArticles", [])
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