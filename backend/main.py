from fastapi import FastAPI
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access the API key
API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise ValueError("API Key not found. Please check your .env file.")

# Debugging: Print the loaded API key
print(f"Loaded API Key: {API_KEY}")

# Initialize FastAPI app
app = FastAPI()

# Routes
@app.get("/")
async def read_root():
    return {"message": "Hello from FastAPI backend!"}

@app.get("/api-key")
async def get_api_key():
    return {"api_key": API_KEY}