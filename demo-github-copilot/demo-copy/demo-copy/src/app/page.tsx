'use client';

import { useState } from 'react';

// Mockup todo data
const mockupTodos = [
  "Review project documentation",
  "Complete user authentication feature",
  "Write unit tests for API endpoints",
  "Update README with deployment instructions",
  "Schedule team meeting for next sprint",
  "Optimize database queries",
  "Fix responsive design issues",
  "Research new framework features"
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [todos, setTodos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [showMockup, setShowMockup] = useState(false);
  const [rawJson, setRawJson] = useState<string>('');
  const [showRawJson, setShowRawJson] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileName = selectedFile.name.toLowerCase();
      
      // Validate file type
      if (fileType === 'text/plain' || fileType === 'text/markdown' || 
          fileName.endsWith('.txt') || fileName.endsWith('.md')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a .txt or .md file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setTodos([]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-todos', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setTodos(result.todos);
        setFileName(result.fileName);
        setShowMockup(false);
        setRawJson(JSON.stringify(result.todos, null, 2));
      } else {
        setError(result.error || 'Failed to process file');
        // Show mockup if file processing fails
        setShowMockup(true);
        setTodos(mockupTodos);
        setFileName('Mockup Data');
        setRawJson(JSON.stringify(mockupTodos, null, 2));
      }
    } catch (err) {
      setError('Network error. Showing mockup data instead.');
      setShowMockup(true);
      setTodos(mockupTodos);
      setFileName('Mockup Data');
      setRawJson(JSON.stringify(mockupTodos, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const showMockupData = () => {
    setTodos(mockupTodos);
    setFileName('Mockup Data');
    setShowMockup(true);
    setError('');
    setRawJson(JSON.stringify(mockupTodos, null, 2));
  };

  return (
    <div className="font-sans min-h-screen p-8" style={{ backgroundColor: '#1e1e2e' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: '#cdd6f4' }}>
          Todo List Extractor
        </h1>
        
        {/* File Upload Section */}
        <div className="rounded-lg shadow-md p-6 mb-8" style={{ backgroundColor: '#313244' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#cdd6f4' }}>
            Upload a Text or Markdown File
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleFileChange}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:text-white hover:file:opacity-80 transition-opacity"
                style={{ 
                  color: '#a6adc8',
                  backgroundColor: '#313244'
                }}
                // Apply file input styling via style attribute for better control
              />
              <style jsx>{`
                input[type="file"]::file-selector-button {
                  background-color: #89b4fa;
                  color: #1e1e2e;
                  margin-right: 1rem;
                  padding: 0.5rem 1rem;
                  border-radius: 9999px;
                  border: none;
                  font-size: 0.875rem;
                  font-weight: 600;
                  cursor: pointer;
                  transition: opacity 0.2s;
                }
                input[type="file"]::file-selector-button:hover {
                  opacity: 0.8;
                }
              `}</style>
              <p className="mt-1 text-sm" style={{ color: '#6c7086' }}>
                Supported formats: .txt, .md
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !file}
                className="px-6 py-2 rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                style={{ 
                  backgroundColor: '#89b4fa',
                  color: '#1e1e2e'
                }}
              >
                {loading ? 'Processing...' : 'Extract Todos'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 border rounded" style={{ 
              backgroundColor: '#f38ba8',
              borderColor: '#f38ba8',
              color: '#1e1e2e'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {todos.length > 0 && (
          <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#313244' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ color: '#cdd6f4' }}>
                Extracted Todo Items
              </h2>
              <div className="flex items-center gap-2">
                {showMockup && (
                  <span className="px-3 py-1 rounded-full text-sm" style={{ 
                    backgroundColor: '#f9e2af',
                    color: '#1e1e2e'
                  }}>
                    Mockup Data
                  </span>
                )}
                <button
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="px-3 py-1 rounded-full text-sm transition-opacity hover:opacity-80"
                  style={{ 
                    backgroundColor: '#45475a',
                    color: '#cdd6f4'
                  }}
                >
                  {showRawJson ? 'Hide JSON' : 'Show JSON'}
                </button>
              </div>
            </div>
            
            {fileName && (
              <p className="text-sm mb-4" style={{ color: '#a6adc8' }}>
                Source: {fileName}
              </p>
            )}

            {/* Raw JSON Display */}
            {showRawJson && (
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#181825' }}>
                <h3 className="font-semibold mb-2" style={{ color: '#cdd6f4' }}>
                  Raw JSON Response:
                </h3>
                <pre className="text-sm whitespace-pre-wrap overflow-x-auto" style={{ color: '#a6adc8' }}>
                  {rawJson}
                </pre>
              </div>
            )}

            {/* Formatted Todo List */}
            <div className="space-y-2">
              {todos.map((todo, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 rounded-lg"
                  style={{ backgroundColor: '#181825' }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#89b4fa' }}>
                    <span className="text-sm font-medium" style={{ color: '#1e1e2e' }}>
                      {index + 1}
                    </span>
                  </div>
                  <p style={{ color: '#cdd6f4' }}>{todo}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#89b4fa' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#1e1e2e' }}>
                📊 Summary
              </h3>
              <p className="text-sm" style={{ color: '#1e1e2e' }}>
                Found {todos.length} todo item{todos.length !== 1 ? 's' : ''} 
                {showMockup ? ' in mockup data' : ` in "${fileName}"`}
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 rounded-lg shadow-md p-6" style={{ backgroundColor: '#313244' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#cdd6f4' }}>
            How to Use
          </h2>
          <ol className="list-decimal list-inside space-y-2" style={{ color: '#a6adc8' }}>
            <li>Upload a text (.txt) or markdown (.md) file containing your content</li>
            <li>Click "Extract Todos" to process the file using AI</li>
            <li>View the extracted todo items in an organized list</li>
            <li>Click "Show JSON" to view the raw JSON response from the AI</li>
            <li>If upload fails, example results will be shown automatically</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
