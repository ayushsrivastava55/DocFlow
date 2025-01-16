const API_BASE_URL = 'http://localhost:8000/api';

export const crawlDocumentation = async (url, onStatusUpdate) => {
  try {
    // If the URL doesn't end with sitemap.xml, append it
    const sitemapUrl = url.toLowerCase().endsWith('sitemap.xml') 
      ? url 
      : `${url.replace(/\/$/, '')}/sitemap.xml`;

    onStatusUpdate?.({ message: 'Starting documentation crawl...' });

    const response = await fetch(`${API_BASE_URL}/crawl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: [sitemapUrl],
        max_concurrent: 5
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to crawl documentation');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error_message || 'Failed to process documentation');
    }

    // Update memory stats if available
    if (data.memory_stats) {
      onStatusUpdate?.({
        message: `Processing documentation... (Memory: ${data.memory_stats.current_mb}MB)`,
        memoryStats: data.memory_stats
      });
    }

    // Process the crawled data
    const processedContent = data.data.reduce((acc, item) => {
      if (item.success) {
        return acc + '\n\n' + (item.content || '');
      }
      return acc;
    }, '').trim();

    if (!processedContent) {
      throw new Error('No content found in crawled documentation');
    }

    onStatusUpdate?.({ message: 'Documentation crawled successfully!' });

    return {
      content: processedContent,
      metadata: {
        source: url,
        crawlTime: new Date().toISOString(),
        memoryStats: data.memory_stats
      }
    };
  } catch (error) {
    console.error('Error in crawlDocumentation:', error);
    onStatusUpdate?.({ message: `Error: ${error.message}`, error: true });
    throw error;
  }
};
