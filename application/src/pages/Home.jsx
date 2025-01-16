import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentation } from '../context/DocumentationContext';
import FileUpload from '../components/FileUpload';
import UrlInput from '../components/UrlInput';

function Home() {
  const navigate = useNavigate();
  const { 
    processDocumentFile, 
    crawlDocumentationUrl,
    loading, 
    error: contextError,
    crawlingStatus 
  } = useDocumentation();
  
  const [error, setError] = useState(null);

  const handleFileUpload = useCallback(async (file) => {
    try {
      setError(null);
      
      if (!file) {
        setError('No file selected');
        return;
      }

      console.log('Processing file:', file.name);
      
      const success = await processDocumentFile(file);
      
      if (success) {
        console.log('Document processed successfully, navigating to documentation page');
        navigate('/documentation', { replace: true });
      } else {
        setError('Failed to process document. Please try again.');
      }
    } catch (err) {
      console.error('Error in handleFileUpload:', err);
      setError(err.message || 'An error occurred while processing the file');
    }
  }, [processDocumentFile, navigate]);

  const handleUrlSubmit = useCallback(async (url) => {
    try {
      setError(null);
      const success = await crawlDocumentationUrl(url);
      
      if (success) {
        navigate('/documentation', { replace: true });
      }
    } catch (err) {
      console.error('Error in handleUrlSubmit:', err);
      setError(err.message || 'An error occurred while processing the documentation');
    }
  }, [crawlDocumentationUrl, navigate]);

  return (
    <div className="min-h-screen bg-black py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-black shadow-lg sm:rounded-3xl sm:p-20 border border-green-500/30">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-green-500/30">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-300 sm:text-lg sm:leading-7">
                <h2 className="text-3xl font-bold mb-8 text-center text-green-400">
                  Upload Your Documentation
                </h2>
                <FileUpload onFileUpload={handleFileUpload} loading={loading} />
                
                <UrlInput 
                  onUrlSubmit={handleUrlSubmit} 
                  loading={loading}
                  crawlingStatus={crawlingStatus}
                />
                
                {(error || contextError) && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
                    <p className="text-red-400 text-sm">
                      {error || contextError}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
