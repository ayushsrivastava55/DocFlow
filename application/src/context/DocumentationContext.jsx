import React, { createContext, useContext, useState } from 'react';
import { processDocument } from '../services/worqhatService';

const DocumentationContext = createContext();

export function useDocumentation() {
  return useContext(DocumentationContext);
}

export function DocumentationProvider({ children }) {
  const [documentation, setDocumentation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processDocumentFile = async (file) => {
    try {
      setLoading(true);
      setError(null);

      const result = await processDocument(file);
      
      if (!result || (!result.content && !result.sections)) {
        throw new Error('Invalid document processing result');
      }

      setDocumentation(result);
      return true;
    } catch (err) {
      console.error('Error processing document:', err);
      setError(err.message || 'Failed to process document');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    documentation,
    loading,
    error,
    processDocumentFile
  };

  return (
    <DocumentationContext.Provider value={value}>
      {children}
    </DocumentationContext.Provider>
  );
}
