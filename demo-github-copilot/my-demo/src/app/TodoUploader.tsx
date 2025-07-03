'use client';

import { useState } from 'react';

export default function TodoUploader() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [todos, setTodos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTodos([]);

    try {
      const formData = new FormData();
      
      if (activeTab === 'text') {
        formData.append('text', text);
      } else if (file) {
        formData.append('file', file);
      } else {
        throw new Error('Please provide text or select a file');
      }

      const response = await fetch('/api/extract-todos', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to extract todos');
      }

      setTodos(result.todos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'text/plain',
        'text/markdown',
        'application/markdown'
      ];
      const validExtensions = ['.txt', '.md'];
      
      const isValidType = validTypes.includes(selectedFile.type) || 
                         validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));
      
      if (isValidType) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a .txt or .md file');
        setFile(null);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Extract Todo Items</h2>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'text'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'file'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Upload File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'text' ? (
            <div>
              <label htmlFor="text" className="block text-sm font-medium mb-2">
                Document Text
              </label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="Paste your document text here..."
                required={activeTab === 'text'}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="file" className="block text-sm font-medium mb-2">
                Upload Document (.txt or .md)
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                accept=".txt,.md,text/plain,text/markdown"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                required={activeTab === 'file'}
              />
              {file && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  Selected: {file.name}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (activeTab === 'text' && !text.trim()) || (activeTab === 'file' && !file)}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Extracting Todos...' : 'Extract Todo Items'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {todos.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">
            Extracted Todo Items ({todos.length})
          </h3>
          <div className="space-y-2">
            {todos.map((todo, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="flex-1 text-gray-800 dark:text-gray-200">{todo}</p>
              </div>
            ))}
          </div>
          
          {/* JSON Output */}
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-2">JSON Output</h4>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{JSON.stringify(todos, null, 2)}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
