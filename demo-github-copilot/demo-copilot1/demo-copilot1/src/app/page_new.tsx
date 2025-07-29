'use client';

import { useState } from 'react';

interface TodoResponse {
  success: boolean;
  todos: string[];
  filename?: string;
  error?: string;
}

// Mockup todo list for fallback
const mockupTodos = [
  "Buy groceries for the week",
  "Schedule dentist appointment",
  "Finish quarterly report",
  "Call mom for her birthday",
  "Update resume",
  "Plan weekend trip",
  "Read new book chapter",
  "Exercise for 30 minutes",
  "Organize desktop files",
  "Review monthly budget"
];

export default function TodoExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [todos, setTodos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [showMockup, setShowMockup] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setTodos([]);
      setShowMockup(false);
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

      const data: TodoResponse = await response.json();

      if (data.success) {
        setTodos(data.todos);
        setFilename(data.filename || '');
        setShowMockup(false);
      } else {
        setError(data.error || 'Failed to extract todos');
        // Show mockup as fallback
        setTodos(mockupTodos);
        setFilename('Mockup Todo List');
        setShowMockup(true);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Showing mockup instead.');
      // Show mockup as fallback
      setTodos(mockupTodos);
      setFilename('Mockup Todo List');
      setShowMockup(true);
    } finally {
      setLoading(false);
    }
  };

  const showMockupTodos = () => {
    setTodos(mockupTodos);
    setFilename('Mockup Todo List');
    setShowMockup(true);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Todo List Extractor
          </h1>
          
          <div className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload a text or markdown file (.txt or .md)
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt,.md,text/plain,text/markdown"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md p-3"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={!file || loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Extracting Todos...' : 'Extract Todos'}
                </button>
                
                <button
                  type="button"
                  onClick={showMockupTodos}
                  className="bg-gray-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-700 transition-colors"
                >
                  Show Mockup
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {todos.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Extracted Todo Items
                </h2>
                {showMockup && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    MOCKUP
                  </span>
                )}
              </div>
              
              {filename && (
                <p className="text-sm text-gray-600 mb-4">
                  From: <span className="font-medium">{filename}</span>
                </p>
              )}
              
              <ul className="space-y-3">
                {todos.map((todo, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-white rounded-md border border-gray-200"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 bg-blue-100 rounded border border-blue-300 flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <span className="text-gray-900 flex-1">{todo}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h3 className="text-sm font-medium text-blue-900 mb-2">JSON Output:</h3>
                <pre className="text-xs text-blue-800 bg-blue-100 p-3 rounded overflow-x-auto">
                  {JSON.stringify(todos, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
