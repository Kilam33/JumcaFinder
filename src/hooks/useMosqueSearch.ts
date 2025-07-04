import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { SearchResult, MosqueWithLocation } from '../types/mosque';

export function useMosqueSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByZipCode = useCallback(async (zipCode: string): Promise<SearchResult | null> => {
    try {
      // First get the location
      const { data: location, error: locationError } = await supabase
        .from('locations')
        .select('*')
        .eq('zip_code', zipCode)
        .single();

      if (locationError || !location) {
        return null;
      }

      // Then get all mosques for this location
      const { data: mosques, error: mosqueError } = await supabase
        .from('mosques')
        .select('*')
        .eq('location_id', location.id)
        .order('first_prayer_time');

      if (mosqueError) {
        throw mosqueError;
      }

      return {
        type: 'zip',
        location,
        mosques: mosques || []
      };
    } catch (err) {
      console.error('Error searching by zip code:', err);
      throw err;
    }
  }, []);

  const searchByMosqueName = useCallback(async (mosqueName: string): Promise<SearchResult | null> => {
    try {
      const { data: mosquesWithLocation, error } = await supabase
        .from('mosques')
        .select(`
          *,
          location:locations(*)
        `)
        .ilike('name', `%${mosqueName}%`)
        .limit(1);

      if (error) {
        throw error;
      }

      if (!mosquesWithLocation || mosquesWithLocation.length === 0) {
        return null;
      }

      const mosqueWithLocation = mosquesWithLocation[0] as MosqueWithLocation;
      
      // Get all mosques in the same location
      const { data: allMosques, error: allMosquesError } = await supabase
        .from('mosques')
        .select('*')
        .eq('location_id', mosqueWithLocation.location_id)
        .order('first_prayer_time');

      if (allMosquesError) {
        throw allMosquesError;
      }

      return {
        type: 'mosque',
        location: mosqueWithLocation.location,
        mosques: allMosques || [],
        matchedMosque: mosqueWithLocation
      };
    } catch (err) {
      console.error('Error searching by mosque name:', err);
      throw err;
    }
  }, []);

  const search = useCallback(async (query: string): Promise<SearchResult | null> => {
    if (!query.trim()) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const trimmedQuery = query.trim();
      
      // Check if it's a ZIP code (5 digits)
      if (/^\d{5}$/.test(trimmedQuery)) {
        const result = await searchByZipCode(trimmedQuery);
        return result;
      } else {
        // Search by mosque name
        const result = await searchByMosqueName(trimmedQuery);
        return result;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      return null;
    } finally {
      setLoading(false);
    }
  }, [searchByZipCode, searchByMosqueName]);

  return {
    search,
    loading,
    error
  };
}