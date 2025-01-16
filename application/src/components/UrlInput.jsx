import React, { useState } from 'react';

function UrlInput({ onUrlSubmit, loading }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [crawlingStatus, setCrawlingStatus] = useState(null);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getSitemapUrl = (baseUrl) => {
    // Remove trailing slash if present
    const cleanUrl = baseUrl.replace(/\/$/, '');
    return `${cleanUrl}/sitemap.xml`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCrawlingStatus(null);

    if (!url) {
      setError('Please enter a documentation URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      // Convert the homepage URL to sitemap URL
      const sitemapUrl = getSitemapUrl(url);
      setCrawlingStatus({
        message: 'Starting documentation crawl...',
        memoryUsage: null
      });

      // Submit the sitemap URL for crawling
      await onUrlSubmit(sitemapUrl);
    } catch (err) {
      setError(err.message || 'Failed to process documentation');
      setCrawlingStatus(null);
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setError('');
    setCrawlingStatus(null);
  };

  return (
    <div className="mt-8 pt-8 border-t border-green-500/30">
      <h3 className="text-xl font-semibold mb-4 text-green-400">
        Or Crawl Documentation
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="docUrl" className="block text-sm font-medium text-gray-300 mb-2">
            Documentation Homepage URL
          </label>
          <input
            id="docUrl"
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter documentation homepage URL (e.g., https://docs.example.com)"
            className="w-full px-4 py-2 rounded-md bg-black border border-green-500/30 text-gray-300 focus:outline-none focus:border-green-500 placeholder-gray-600"
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            We'll automatically crawl the documentation using its sitemap
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {crawlingStatus && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-md p-3">
            <p className="text-green-400 text-sm">{crawlingStatus.message}</p>
            {crawlingStatus.memoryUsage && (
              <p className="text-gray-400 text-xs mt-1">
                Memory usage: {crawlingStatus.memoryUsage.current_mb}MB 
                (Peak: {crawlingStatus.memoryUsage.peak_mb}MB)
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Crawling Documentation...' : 'Start Crawling'}
        </button>
      </form>
    </div>
  );
}

export default UrlInput;
