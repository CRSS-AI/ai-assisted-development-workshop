"""
Simple web scraper for CRSS using Selenium
Extracts all visible content from the CRSS website
"""

from firecrawl import FirecrawlApp
import json
import os
from datetime import datetime

API_KEY = "MY_API_KEY"

# Initialize Firecrawl app
app = FirecrawlApp(api_key=API_KEY)

# Target URL to scrape
target_url = "https://costaricasoftwareservices.com/"

print(f"🌐 Scraping {target_url} ...")
result = app.scrape_url(target_url, formats=['markdown', 'html'])

if result.success:
    # Create 'data' directory if it doesn't exist
    os.makedirs("data", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"data/crss_firecrawl_{timestamp}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump({
            "success": result.success,
            "url": result.url,
            "markdown": result.markdown,
            "html": result.html
        }, f, ensure_ascii=False, indent=2)
    print(f"Scraping complete. File saved at: {filename}")
else:
    print("Error while scraping:", result) 