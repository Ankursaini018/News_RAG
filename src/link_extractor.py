"""
link_extractor.py
-----------------
Extracts news article links from the BBC News homepage.
"""

import json
import requests

from bs4 import BeautifulSoup

from urllib.parse import urljoin

def fetch_homepage(url: str) -> str:
    """
    Downloads the homepage HTML.
    """

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
    """
    Converts raw HTML into BeautifulSoup object.
    """

    return BeautifulSoup(
        html,
        "html.parser"
    )

def extract_links(soup):

    links = []

    for tag in soup.find_all("a", href=True):

        href = tag["href"]

        full_url = urljoin(
            "https://www.bbc.com",
            href
        )

        links.append(full_url)

    return links

def remove_duplicates(links):

    return list(set(links))

def filter_article_links(links):

    filtered = []

    for link in links:

        if "/news/articles/" in link:

            filtered.append(link)

    return filtered

def save_links(links, output_path):

    with open(
        output_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            links,
            file,
            indent=4
        )

def main():

    homepage = "https://www.bbc.com/news"

    html = fetch_homepage(homepage)

    soup = parse_html(html)

    links = extract_links(soup)

    links = remove_duplicates(links)

    article_links = filter_article_links(links)

    print(f"Total Articles : {len(article_links)}")

    save_links(
        article_links,
        "../data/raw/article_links.json"
    )

    print("Article links saved successfully.")

if __name__ == "__main__":

    main()
        
