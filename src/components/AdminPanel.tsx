import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, MapPin, Building2, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Location, Mosque } from '../types/mosque';

interface AdminPanelProps {
  onClose: () => void;
}

interface MosqueFormData {
  name: string;
  first_prayer_time: string;
  second_prayer_time: string;
  address: string;
  location_id: string;
}

interface LocationFormData {
  zip_code: string;
  city: string;
  state: string;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mosques' | 'locations'>('mosques');
  const [showMosqueForm, setShowMosqueForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [editingMosque, setEditingMosque] = useState<Mosque | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const [mosqueForm, setMosqueForm] = useState<MosqueFormData>({
    name: '',
    first_prayer_time: '',
    second_prayer_time: '',
    address: '',
    location_id: ''
  });

  const [locationForm, setLocationForm] = useState<LocationFormData>({
    zip_code: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [locationsResult, mosquesResult] = await Promise.all([
        supabase.from('locations').select('*').order('state', { ascending: true }),
        supabase.from('mosques').select('*').order('name', { ascending: true })
      ]);

      if (locationsResult.data) setLocations(locationsResult.data);
      if (mosquesResult.data) setMosques(mosquesResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMosqueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMosque) {
        const { error } = await supabase
          .from('mosques')
          .update(mosqueForm)
          .eq('id', editingMosque.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('mosques')
          .insert([mosqueForm]);
        if (error) throw error;
      }
      
      resetMosqueForm();
      loadData();
    } catch (error) {
      console.error('Error saving mosque:', error);
      alert('Error saving mosque. Please try again.');
    }
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLocation) {
        const { error } = await supabase
          .from('locations')
          .update(locationForm)
          .eq('id', editingLocation.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('locations')
          .insert([locationForm]);
        if (error) throw error;
      }
      
      resetLocationForm();
      loadData();
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Error saving location. Please try again.');
    }
  };

  const deleteMosque = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mosque?')) return;
    
    try {
      const { error } = await supabase
        .from('mosques')
        .delete()
        .eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting mosque:', error);
      alert('Error deleting mosque. Please try again.');
    }
  };

  const deleteLocation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location? This will also delete all associated mosques.')) return;
    
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Error deleting location. Please try again.');
    }
  };

  const resetMosqueForm = () => {
    setMosqueForm({
      name: '',
      first_prayer_time: '',
      second_prayer_time: '',
      address: '',
      location_id: ''
    });
    setShowMosqueForm(false);
    setEditingMosque(null);
  };

  const resetLocationForm = () => {
    setLocationForm({
      zip_code: '',
      city: '',
      state: ''
    });
    setShowLocationForm(false);
    setEditingLocation(null);
  };

  const startEditMosque = (mosque: Mosque) => {
    setMosqueForm({
      name: mosque.name,
      first_prayer_time: mosque.first_prayer_time,
      second_prayer_time: mosque.second_prayer_time,
      address: mosque.address,
      location_id: mosque.location_id
    });
    setEditingMosque(mosque);
    setShowMosqueForm(true);
  };

  const startEditLocation = (location: Location) => {
    setLocationForm({
      zip_code: location.zip_code,
      city: location.city,
      state: location.state
    });
    setEditingLocation(location);
    setShowLocationForm(true);
  };

  const getLocationName = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    return location ? `${location.city}, ${location.state} (${location.zip_code})` : 'Unknown Location';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-700 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('mosques')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'mosques'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building2 className="h-4 w-4 inline mr-2" />
              Mosques ({mosques.length})
            </button>
            <button
              onClick={() => setActiveTab('locations')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'locations'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MapPin className="h-4 w-4 inline mr-2" />
              Locations ({locations.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'mosques' && (
            <div>
              {/* Add Mosque Button */}
              <div className="mb-6">
                <button
                  onClick={() => setShowMosqueForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Mosque
                </button>
              </div>

              {/* Mosque Form */}
              {showMosqueForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingMosque ? 'Edit Mosque' : 'Add New Mosque'}
                  </h3>
                  <form onSubmit={handleMosqueSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mosque Name
                        </label>
                        <input
                          type="text"
                          value={mosqueForm.name}
                          onChange={(e) => setMosqueForm({ ...mosqueForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <select
                          value={mosqueForm.location_id}
                          onChange={(e) => setMosqueForm({ ...mosqueForm, location_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Location</option>
                          {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                              {location.city}, {location.state} ({location.zip_code})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Prayer Time
                        </label>
                        <input
                          type="text"
                          value={mosqueForm.first_prayer_time}
                          onChange={(e) => setMosqueForm({ ...mosqueForm, first_prayer_time: e.target.value })}
                          placeholder="e.g., 12:15 PM"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Second Prayer Time
                        </label>
                        <input
                          type="text"
                          value={mosqueForm.second_prayer_time}
                          onChange={(e) => setMosqueForm({ ...mosqueForm, second_prayer_time: e.target.value })}
                          placeholder="e.g., 1:30 PM"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={mosqueForm.address}
                        onChange={(e) => setMosqueForm({ ...mosqueForm, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {editingMosque ? 'Update' : 'Save'} Mosque
                      </button>
                      <button
                        type="button"
                        onClick={resetMosqueForm}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Mosques List */}
              <div className="space-y-4">
                {mosques.map((mosque) => (
                  <div key={mosque.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900">{mosque.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{getLocationName(mosque.location_id)}</p>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                          First: {mosque.first_prayer_time} | Second: {mosque.second_prayer_time}
                        </div>
                        <p className="text-sm text-gray-600">{mosque.address}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEditMosque(mosque)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteMosque(mosque.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'locations' && (
            <div>
              {/* Add Location Button */}
              <div className="mb-6">
                <button
                  onClick={() => setShowLocationForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Location
                </button>
              </div>

              {/* Location Form */}
              {showLocationForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingLocation ? 'Edit Location' : 'Add New Location'}
                  </h3>
                  <form onSubmit={handleLocationSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={locationForm.zip_code}
                          onChange={(e) => setLocationForm({ ...locationForm, zip_code: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={locationForm.city}
                          onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={locationForm.state}
                          onChange={(e) => setLocationForm({ ...locationForm, state: e.target.value })}
                          placeholder="e.g., MN"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {editingLocation ? 'Update' : 'Save'} Location
                      </button>
                      <button
                        type="button"
                        onClick={resetLocationForm}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Locations List */}
              <div className="space-y-4">
                {locations.map((location) => {
                  const locationMosques = mosques.filter(m => m.location_id === location.id);
                  return (
                    <div key={location.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-900">
                            {location.city}, {location.state}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">ZIP Code: {location.zip_code}</p>
                          <p className="text-sm text-gray-500">
                            {locationMosques.length} mosque{locationMosques.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => startEditLocation(location)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteLocation(location.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}