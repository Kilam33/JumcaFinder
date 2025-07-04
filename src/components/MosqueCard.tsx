import React from 'react';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import type { Mosque } from '../types/mosque';

interface MosqueCardProps {
  mosque: Mosque;
  isHighlighted?: boolean;
}

export function MosqueCard({ mosque, isHighlighted = false }: MosqueCardProps) {
  const handleAddressClick = () => {
    const encodedAddress = encodeURIComponent(mosque.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleMosqueNameClick = () => {
    const encodedMosqueName = encodeURIComponent(`${mosque.name} ${mosque.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedMosqueName}`, '_blank');
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
      isHighlighted ? 'ring-2 ring-green-500 border-green-200' : 'border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <button
            onClick={handleMosqueNameClick}
            className={`text-xl font-semibold text-left hover:text-green-600 transition-colors duration-200 group ${
              isHighlighted ? 'text-green-900' : 'text-gray-900'
            }`}
          >
            {mosque.name}
            <ExternalLink className="h-4 w-4 ml-1 inline opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
          {isHighlighted && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Match
            </span>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <h4 className="text-sm font-semibold text-green-900 mb-2">Jummuah Prayer Times</h4>
            <div className="space-y-2">
              <div className="flex items-center text-green-700">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">First Prayer: {mosque.first_prayer_time}</span>
              </div>
              <div className="flex items-center text-green-700">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">Second Prayer: {mosque.second_prayer_time}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start text-gray-600">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <button
                onClick={handleAddressClick}
                className="text-sm text-left hover:text-green-600 transition-colors duration-200 group"
              >
                {mosque.address}
                <ExternalLink className="h-3 w-3 ml-1 inline opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}