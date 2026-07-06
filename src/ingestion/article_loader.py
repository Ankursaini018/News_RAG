"""
article_loader.py
-----------------
Downloads BBC news articles and stores them as JSON.
"""

import json
import requests
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

RAW_DATA = BASE_DIR / "data" / "raw" / "article_links.json"

PROCESSED_DATA = BASE_DIR / "data" / "processed" / "bbc_articles.json"


from bs4 import BeautifulSoup

def load_links(path):

    with open(path, "r", encoding="utf-8") as file:

        return json.load(file)
    
def download_article(url: str):

    response = requests.get(
        url,
        headers={
            "User-Agent": "Mozilla/5.0"
        },
        timeout=20
    )

    response.raise_for_status()

    return response.text

def parse_html(html: str):

    return BeautifulSoup(
        html,
        "html.parser"
    )

def extract_title(soup):

    if soup.title:

        return soup.title.text.strip()

    return "No Title"

def extract_body(soup):

    paragraphs = soup.find_all("p")

    article = []

    for paragraph in paragraphs:

        text = paragraph.get_text(strip=True)

        if text:

            article.append(text)

    return "\n".join(article)

def create_article(url, title, content):

    return {

        "url": url,

        "title": title,

        "content": content
    }

def save_articles(articles, output_path):

    with open(
        output_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            articles,
            file,
            indent=4,
            ensure_ascii=False
        )

def main():

    links = load_links(RAW_DATA)
    articles = []

    for index, link in enumerate(links, start=1):

        try:

            print(f"[{index}/{len(links)}] {link}")

            html = download_article(link)

            soup = parse_html(html)

            title = extract_title(soup)

            body = extract_body(soup)

            article = create_article(
                link,
                title,
                body
            )

            articles.append(article)

        except Exception as error:

            print(f"Failed: {link}")

            print(error)

    save_articles(
    articles,
    PROCESSED_DATA
)

    print(f"\nSaved {len(articles)} articles successfully.")


if __name__ == "__main__":

    main()
