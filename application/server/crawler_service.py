import asyncio
import os
import psutil
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import xml.etree.ElementTree as ET
import aiohttp
import logging
import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urljoin, urlparse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CrawlRequest(BaseModel):
    urls: List[str]
    session_id: str = "default_session"
    max_concurrent: int = 5

class CrawlResponse(BaseModel):
    success: bool
    data: List[Dict[str, Any]]
    error_message: str = None
    memory_stats: Dict[str, int] = None

class DocumentationCrawler:
    def __init__(self):
        self.process = psutil.Process(os.getpid())
        self.peak_memory = 0
        self.session = requests.Session()
        self.executor = ThreadPoolExecutor(max_workers=10)

    def log_memory(self, prefix: str = "") -> Dict[str, int]:
        current_mem = self.process.memory_info().rss
        if current_mem > self.peak_memory:
            self.peak_memory = current_mem
        
        memory_stats = {
            "current_mb": current_mem // (1024 * 1024),
            "peak_mb": self.peak_memory // (1024 * 1024)
        }
        logger.info(f"{prefix} Memory (MB) - Current: {memory_stats['current_mb']}, Peak: {memory_stats['peak_mb']}")
        return memory_stats

    async def extract_urls_from_sitemap(self, sitemap_url: str) -> List[str]:
        try:
            response = self.session.get(sitemap_url)
            response.raise_for_status()
            
            root = ET.fromstring(response.content)
            namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
            urls = []
            
            for url in root.findall('.//ns:loc', namespace):
                if url.text.endswith('.xml'):
                    # This is a sitemap index, recursively fetch URLs
                    sub_urls = await self.extract_urls_from_sitemap(url.text)
                    urls.extend(sub_urls)
                else:
                    urls.append(url.text)
            
            return urls
        except Exception as e:
            logger.error(f"Error fetching sitemap {sitemap_url}: {e}")
            raise HTTPException(status_code=400, detail=f"Failed to fetch sitemap: {str(e)}")

    def crawl_page(self, url: str) -> Dict[str, Any]:
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'lxml')
            
            # Remove unwanted elements
            for element in soup.select('nav, header, footer, .navigation, .menu, .sidebar'):
                element.decompose()
            
            # Extract title
            title = soup.title.string if soup.title else ''
            if not title and soup.h1:
                title = soup.h1.get_text(strip=True)
            
            # Extract main content
            main_content = soup.find('main') or soup.find('article') or soup.find(class_=['documentation', 'docs-content'])
            content = main_content.get_text(strip=True) if main_content else soup.get_text(strip=True)
            
            # Extract meta description
            meta_desc = ''
            meta_tag = soup.find('meta', attrs={'name': 'description'})
            if meta_tag:
                meta_desc = meta_tag.get('content', '')

            return {
                "url": url,
                "content": content,
                "success": True,
                "metadata": {
                    "title": title,
                    "description": meta_desc
                }
            }
        except Exception as e:
            logger.error(f"Error crawling {url}: {e}")
            return {
                "url": url,
                "success": False,
                "error": str(e)
            }

    async def crawl_urls(self, urls: List[str], max_concurrent: int = 5) -> Dict[str, Any]:
        try:
            results = []
            success_count = 0
            fail_count = 0
            memory_stats = []

            # Process URLs in batches
            for i in range(0, len(urls), max_concurrent):
                batch = urls[i:i + max_concurrent]
                memory_stats.append(self.log_memory(f"Before batch {i//max_concurrent + 1}"))

                # Use ThreadPoolExecutor for parallel processing
                batch_results = list(self.executor.map(self.crawl_page, batch))
                
                memory_stats.append(self.log_memory(f"After batch {i//max_concurrent + 1}"))

                # Process results
                for result in batch_results:
                    if result["success"]:
                        success_count += 1
                    else:
                        fail_count += 1
                    results.append(result)

            logger.info(f"\nCrawling Summary:")
            logger.info(f"Successfully crawled: {success_count}")
            logger.info(f"Failed: {fail_count}")

            final_memory = self.log_memory("Final")
            return {
                "results": results,
                "stats": {
                    "success_count": success_count,
                    "fail_count": fail_count,
                    "memory_stats": final_memory
                }
            }

        except Exception as e:
            logger.error(f"Error in crawl_urls: {e}")
            raise
        finally:
            self.executor.shutdown(wait=False)

# Create a singleton instance
crawler_manager = DocumentationCrawler()

@app.post("/api/crawl", response_model=CrawlResponse)
async def crawl_documentation(request: CrawlRequest):
    try:
        # Extract URLs from sitemap if needed
        all_urls = []
        for url in request.urls:
            if url.lower().endswith('sitemap.xml'):
                sitemap_urls = await crawler_manager.extract_urls_from_sitemap(url)
                all_urls.extend(sitemap_urls)
            else:
                all_urls.append(url)

        logger.info(f"Starting crawl of {len(all_urls)} URLs")
        result = await crawler_manager.crawl_urls(all_urls, request.max_concurrent)
        
        successful_crawls = [r for r in result["results"] if r["success"]]
        if not successful_crawls:
            raise HTTPException(
                status_code=400,
                detail="Failed to crawl any of the provided URLs"
            )
        
        return {
            "success": True,
            "data": result["results"],
            "memory_stats": result["stats"]["memory_stats"]
        }
    except Exception as e:
        logger.error(f"Error in crawl_documentation: {e}")
        return {
            "success": False,
            "data": [],
            "error_message": str(e),
            "memory_stats": crawler_manager.log_memory("Error state")
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
