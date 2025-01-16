import React, { createContext, useContext, useState, useEffect } from 'react';
import { worqhat } from '../services/worqhatService';
import { crawlDocumentation } from '../services/crawlerService';

const DocumentationContext = createContext();

export function useDocumentation() {
  const context = useContext(DocumentationContext);
  if (!context) {
    throw new Error('useDocumentation must be used within a DocumentationProvider');
  }
  return context;
}

export function DocumentationProvider({ children }) {
  const [documentation, setDocumentation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [crawlingStatus, setCrawlingStatus] = useState(null);

  useEffect(() => {
    if (documentFile) {
      processStoredFile();
    }
  }, [documentFile]);

  const processDocumentFile = async (file) => {
    try {
      setLoading(true);
      setError(null);
      const result = await worqhat.processDocument(file);
      setDocumentation(result);
      setDocumentFile(file);
      return true;
    } catch (error) {
      console.error('Error processing document:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const processStoredFile = async () => {
    if (!documentFile) return;
    try {
      setLoading(true);
      setError(null);
      const result = await worqhat.processDocument(documentFile);
      setDocumentation(result);
    } catch (error) {
      console.error('Error processing stored document:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const crawlDocumentationUrl = async (url) => {
    try {
      setLoading(true);
      setError(null);
      setCrawlingStatus({ message: 'Starting documentation crawl...' });

      const crawledData = await crawlDocumentation(url, (status) => {
        setCrawlingStatus(status);
      });

      if (!crawledData || !crawledData.content) {
        throw new Error('No content found in crawled documentation');
      }

      // Create a text file from the crawled content
      const textContent = new Blob([crawledData.content], { type: 'text/plain' });
      const documentFile = new File([textContent], 'crawled-documentation.txt', {
        type: 'text/plain',
        lastModified: new Date().getTime()
      });

      // Process the file
      const success = await processDocumentFile(documentFile);
      
      if (!success) {
        throw new Error('Failed to process crawled documentation');
      }

      setCrawlingStatus({ message: 'Documentation processed successfully!' });
      return true;
    } catch (err) {
      console.error('Error crawling documentation:', err);
      setError(err.message || 'Failed to process documentation');
      setCrawlingStatus(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    documentation,
    loading,
    error,
    crawlingStatus,
    processDocumentFile,
    documentFile,
    crawlDocumentationUrl
  };

  return (
    <DocumentationContext.Provider value={value}>
      {children}
    </DocumentationContext.Provider>
  );
}
