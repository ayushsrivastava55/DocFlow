import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function FileUpload({ onFileUpload, loading }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    disabled: loading
  });

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-green-400 bg-green-400/10' 
          : 'border-green-500/30 hover:border-green-400 hover:bg-green-400/10'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <div className="text-4xl">📄</div>
        {isDragActive ? (
          <p className="text-green-400">Drop your document here</p>
        ) : (
          <p className="text-gray-400">
            Drag and drop your document here, or click to select
          </p>
        )}
        <p className="text-sm text-gray-500">
          Supports PDF, TXT, DOC, and DOCX files
        </p>
        {loading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-green-400 mt-2">Processing document...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
