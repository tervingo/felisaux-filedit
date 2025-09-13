import React, { useState, useEffect, useCallback } from 'react';

const FileEditor = () => {
  const [felisadasContent, setFelisadasContent] = useState('');
  const [otrosContent, setOtrosContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  const loadFile = useCallback(async (url, setContent) => {
    try {
      setIsLoading(true);
//      const CORS_PROXY = "https://api.allorigins.win/raw?url=";
      const CORS_PROXY = "https://corsproxy.io/?";
      const response = await fetch(CORS_PROXY + encodeURIComponent(url));
      
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
    loadFile("http://tervingo.com/Felisarium/felisadas.txt", setFelisadasContent);
    loadFile("http://tervingo.com/Felisarium/otros.txt", setOtrosContent);
  }, [loadFile]);

  const handleUpload = async (url, textContent) => {
    if (!window.confirm(`Are you sure you want to upload the following content?\n\n${textContent}`)) {
      return;
    }
    try {
      setSaveStatus('Uploading...');
      const response = await fetch(url, {
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
    <div className="max-w-4xl mx-auto p-6" style={{ backgroundColor: 'lightgrey'}}>
      <h1 className="text-4xl font-bold mb-4 text-blue-600">File Editor</h1>
      <div className="flex flex-wrap gap-4 mb-4" style={{ marginLeft: '50px'}}>
        <div>
          <h2 className="text-2xl font-bold mb-2">Felisadas</h2>
          <textarea
            value={felisadasContent}
            onChange={(e) => setFelisadasContent(e.target.value)}
            className="p-4 border rounded font-mono"
            style={{ width: '800px', height: '300px', marginBottom: '20px' }}
          />
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={() => handleUpload('https://felisaux-upload.onrender.com/upload-felisadas', felisadasContent)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Upload Felisadas Text
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Otros</h2>
          <textarea
            value={otrosContent}
            onChange={(e) => setOtrosContent(e.target.value)}
            className="p-4 border rounded font-mono"
            style={{ width: '800px', height: '300px', marginBottom: '20px' }}
          />
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={() => handleUpload('https://felisaux-upload.onrender.com/upload-otros', otrosContent)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Upload Otros Text
            </button>
          </div>
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
    </div>
  );
};


export default FileEditor;