import os
import requests
from fastapi import APIRouter, Query
router = APIRouter()
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")

NEWS_API_ENDPOINT = "https://newsapi.org/v2/top-headlines"

def fetch_trending_news(country="us"):
    api_key = os.getenv("NEWS_API_KEY")
    params = {
        "country": country,
        "apiKey": api_key
    }
    response = requests.get(NEWS_API_ENDPOINT, params=params)
    response.raise_for_status()
    data = response.json()
    # data["articles"] is typically the array of news articles
    return data["articles"]


@router.get("/news")
def get_news(topic: str = Query(..., description="The topic to search for")):
    """
    Example route: /news?topic=Technology
    Calls the News API to get top headlines or articles about the specified topic.
    """
    if not NEWS_API_KEY:
        return {"error": "Missing NEWS_API_KEY"}

    url = "https://newsapi.org/v2/everything"
    params = {
        "apiKey": NEWS_API_KEY,
        "q": topic,          # Search for articles matching the topic
        "sortBy": "relevancy",
        "language": "en"
    }
    response = requests.get(url, params=params)
    data = response.json()

    # Potential error checking
    if data.get("status") != "ok":
        return {"error": data.get("message", "Unknown error")}

    return {"articles": data.get("articles", [])}

#for test
if __name__ == "__main__":
    articles = fetch_trending_news(country="us")
    print(articles)
