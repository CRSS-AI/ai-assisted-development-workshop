'use client';

import { useState } from 'react';

// Mockup todo list
const mockupTodos = [
  "Review quarterly reports",
  "Schedule team meeting for project planning",
  "Update documentation for new features",
  "Respond to client emails",
  "Prepare presentation for stakeholders",
  "Test new software deployment",
  "Order office supplies",
  "Plan team building activities"
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [todos, setTodos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showMockup, setShowMockup] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check if file is .txt or .md
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'txt' || fileExtension === 'md') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a .txt or .md file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const text = await file.text();
      
      const response = await fetch('/api/extract-todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract todos');
      }

      const result = await response.json();
      setTodos(result.todos);
      setShowMockup(false);
    } catch (err) {
      console.error('Error extracting todos:', err);
      setError('Failed to extract todos. Showing mockup instead.');
      setTodos(mockupTodos);
      setShowMockup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMockup = () => {
    setTodos(mockupTodos);
    setShowMockup(true);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Todo List Extractor
          </h1>
          <p className="text-lg text-gray-600">
            Upload a .txt or .md file to extract todo items using AI
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Choose file (.txt or .md)
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".txt,.md"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!file || loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Extracting...' : 'Extract Todos'}
              </button>
              
              <button
                type="button"
                onClick={handleShowMockup}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                Show Mockup
              </button>
            </div>
          </form>
        </div>

        {todos.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Extracted Todo Items
              </h2>
              {showMockup && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Mockup Data
                </span>
              )}
            </div>
            
            <ul className="space-y-2">
              {todos.map((todo, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                  </div>
                  <span className="text-gray-800 flex-1">{todo}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-2">JSON Output:</h3>
              <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
                {JSON.stringify(todos, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
