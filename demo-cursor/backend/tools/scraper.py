"""
Simple web scraper for CRSS using Selenium
Extracts all visible content from the CRSS website
"""

from firecrawl import FirecrawlApp
import json
import os
from datetime import datetime
import re
from bs4 import BeautifulSoup

API_KEY = "MY_API_KEY"

# Initialize Firecrawl app
app = FirecrawlApp(api_key=API_KEY)

# Target URL to scrape
target_url = "https://costaricasoftwareservices.com/"

print(f"Scraping {target_url} ...")
result = app.scrape_url(target_url, formats=['markdown', 'html'])

if result.success:
    def clean_html(html):
        soup = BeautifulSoup(html, 'html.parser')
        for tag in soup(['script', 'style', 'noscript']):
            tag.decompose()
        text = soup.get_text(separator='\n')
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        return lines
    clean_text = clean_html(result.html)
    # Create 'data' directory if it doesn't exist
    os.makedirs("data", exist_ok=True)
    filename = f"data/scraped_data.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump({
            "clean_text": clean_text
        }, f, ensure_ascii=False, indent=2)
    print(f"Scraping complete. File saved at: {filename}")
else:
    print("Error while scraping:", result) 