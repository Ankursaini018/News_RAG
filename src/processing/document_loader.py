"""
document_loader.py
------------------
Converts processed news articles into LangChain Documents.
"""

import json

from pathlib import Path

from langchain_core.documents import Document

BASE_DIR = Path(__file__).resolve().parents[2]

PROCESSED_DATA = BASE_DIR / "data" / "processed" / "bbc_articles.json"

def load_articles(path):

    with open(
        path,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)
    
def create_document(article):

    return Document(

        page_content=article["content"],

        metadata={

            "title": article["title"],

            "url": article["url"],

            "source": article.get("source", "BBC")

        }

    )

def convert_to_documents(articles):

    documents = []

    for article in articles:

        document = create_document(article)

        documents.append(document)

    return documents

def main():

    articles = load_articles(PROCESSED_DATA)

    documents = convert_to_documents(articles)

    print(f"Loaded {len(documents)} documents.")

    return documents

if __name__ == "__main__":

    docs = main()

    print(docs[0])
    
        