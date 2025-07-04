import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { SearchInput } from './components/SearchInput';
import { SearchResults } from './components/SearchResults';
import { EmptyState } from './components/EmptyState';
import { ErrorMessage } from './components/ErrorMessage';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { useMosqueSearch } from './hooks/useMosqueSearch';
import { useAuth } from './hooks/useAuth';
import type { SearchResult } from './types/mosque';

function App() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [noResults, setNoResults] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { search, loading, error } = useMosqueSearch();
  const { user, signOut, isAuthenticated, isEmailConfirmed } = useAuth();

  const handleSearch = async (query: string) => {
    setNoResults(false);
    setSearchResult(null);
    
    const result = await search(query);
    
    if (result) {
      setSearchResult(result);
    } else if (!error) {
      setNoResults(true);
    }
  };

  const handleAdminClick = () => {
    if (isAuthenticated && isEmailConfirmed) {
      setShowAdminPanel(true);
    } else if (isAuthenticated && !isEmailConfirmed) {
      alert('Please confirm your email before accessing the admin panel.');
      setShowAuthModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowAdminPanel(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-green-50/50">
      {/* Header with glassmorphism effect */}
      <div className="bg-white/70 backdrop-blur-md border-b border-white/20 shadow-lg shadow-black/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-6 shadow-lg shadow-emerald-500/25">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Mosque Finder
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                Find local mosques by ZIP code or search for specific mosques to discover Jummuah prayer times
              </p>
            </div>
            
            {/* Admin Button */}
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
              {isAuthenticated && (
                <button
                  onClick={signOut}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100/50"
                >
                  Sign Out
                </button>
              )}
              <button
                onClick={handleAdminClick}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 sm:px-6 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
              >
                {isAuthenticated ? 'Admin Panel' : 'Admin Login'}
              </button>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <SearchInput onSearch={handleSearch} loading={loading} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {noResults && !loading && (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No Results Found
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
              No matching ZIP code or mosque found. Try a different search term.
            </p>
          </div>
        )}

        {searchResult ? (
          <SearchResults result={searchResult} />
        ) : !loading && !noResults && !error ? (
          <EmptyState />
        ) : null}
      </div>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
}

export default App;