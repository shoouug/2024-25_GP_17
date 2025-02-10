import os
import requests

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
if __name__ == "__main__":
    articles = fetch_trending_news(country="us")
    print(articles)
