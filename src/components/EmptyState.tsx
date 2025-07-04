import React from 'react';
import { Search, MapPin, Building2 } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Search className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Find Local Mosques
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Search by ZIP code to see all mosques in an area, or search by mosque name to find specific locations with Jummuah prayer times.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="bg-green-50 rounded-lg p-6 border border-green-100">
          <MapPin className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Search by ZIP Code</h4>
          <p className="text-sm text-gray-600">
            Enter a 5-digit ZIP code to discover all mosques in that area with their Jummuah prayer times
          </p>
          <div className="mt-3 text-xs text-green-600 font-medium">
            Try: 10001, 60601, 73301
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Search by Mosque Name</h4>
          <p className="text-sm text-gray-600">
            Enter a mosque name to find its location and nearby mosques with prayer schedules
          </p>
          <div className="mt-3 text-xs text-blue-600 font-medium">
            Try: Masjid Al-Noor, Islamic Center
          </div>
        </div>
      </div>
    </div>
  );
}