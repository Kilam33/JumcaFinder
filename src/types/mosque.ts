export interface Location {
  id: string;
  zip_code: string;
  city: string;
  state: string;
  created_at: string;
}

export interface Mosque {
  id: string;
  location_id: string;
  name: string;
  first_prayer_time: string;
  second_prayer_time: string;
  address: string;
  created_at: string;
}

export interface MosqueWithLocation extends Mosque {
  location: Location;
}

export interface SearchResult {
  type: 'zip' | 'mosque';
  location: Location;
  mosques: Mosque[];
  matchedMosque?: Mosque;
}