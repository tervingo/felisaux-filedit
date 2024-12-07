import React, { useState, useEffect, useCallback } from 'react';
import { SERVER_IP } from './constants';

// const response = await fetch(`${SERVER_IP}/api/upload`
const FileEditor = () => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState('');
  
    const loadFile = useCallback(async () => {
      try {
        setIsLoading(true);
        const CORS_PROXY = "https://api.allorigins.win/raw?url=";
        const targetUrl = "http://tervingo.com/Felisarium/input.txt";
        const response = await fetch(CORS_PROXY + encodeURIComponent(targetUrl));
        
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.status}`);
        }
  
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading file:', err);
      } finally {
        setIsLoading(false);
      }
    }, []);
  
    useEffect(() => {
      loadFile();
    }, [loadFile]);
  
    const handleDownload = () => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'input.txt';
      a.click();
      window.URL.revokeObjectURL(url);
    };
  
    const handleFileSelect = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const text = await file.text();
        setContent(text);
        if (window.confirm('Would you like to upload this file to the server?')) {
          handleUpload(text);
        }
      }
    };
  
    const handleUpload = async (textContent) => {
      try {
        setSaveStatus('Uploading...');
        const response = await fetch(`http://localhost:5000/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: textContent }),
        });
  
        if (!response.ok) {
          throw new Error('Upload failed');
        }
  
        setSaveStatus('File uploaded successfully!');
      } catch (err) {
        setSaveStatus('Upload failed: ' + err.message);
        console.error('Upload error:', err);
      }
    };
  
    if (isLoading) {
      return <div className="p-6">Loading...</div>;
    }
  
    if (error) {
      return <div className="p-6 text-red-600">Error: {error}</div>;
    }
  
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">File Editor</h1>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <button 
            onClick={handleDownload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download File
          </button>
  
          <button 
            onClick={() => handleUpload(content)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Upload Current Text
          </button>
  
          <div className="flex items-center">
            <span className="mr-2">Or upload local file:</span>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileSelect}
              className="mt-2"
            />
          </div>
        </div>
  
        {saveStatus && (
          <div className={`mb-4 text-sm p-2 rounded ${
            saveStatus.includes('failed') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {saveStatus}
          </div>
        )}
  
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-96 p-4 border rounded font-mono"
        />
      </div>
    );
  };
  
  export default FileEditor;