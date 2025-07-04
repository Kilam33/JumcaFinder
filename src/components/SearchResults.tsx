import React from 'react';
import { MapPin, Building2 } from 'lucide-react';
import { MosqueCard } from './MosqueCard';
import type { SearchResult } from '../types/mosque';

interface SearchResultsProps {
  result: SearchResult;
}

export function SearchResults({ result }: SearchResultsProps) {
  const { type, location, mosques, matchedMosque } = result;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Location Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-100">
        <div className="flex items-center mb-2">
          <MapPin className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">
            {location.city}, {location.state}
          </h2>
        </div>
        <p className="text-gray-600 flex items-center">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium mr-2">
            ZIP {location.zip_code}
          </span>
          {type === 'mosque' && matchedMosque && (
            <span className="text-sm">
              Found "{matchedMosque.name}" in this area
            </span>
          )}
        </p>
      </div>

      {/* Mosques Grid */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Building2 className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Local Mosques ({mosques.length})
          </h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mosques.map((mosque) => (
            <MosqueCard
              key={mosque.id}
              mosque={mosque}
              isHighlighted={matchedMosque?.id === mosque.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}