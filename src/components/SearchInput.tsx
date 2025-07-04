import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

export function SearchInput({ onSearch, loading }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter ZIP code or mosque name..."
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm hover:shadow-md"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute inset-y-0 right-0 pr-4 flex items-center"
        >
          <div className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed">
            Search
          </div>
        </button>
      </div>
    </form>
  );
}