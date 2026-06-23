import React, { useState, useEffect } from 'react';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
import { toast } from 'react-hot-toast';
import { HiSave, HiAdjustments, HiInformationCircle } from 'react-icons/hi';

interface TransporterPreference {
  id?: number;
  preferredPickupCities: string;
  preferredDestinationCities: string;
  vehicleTypes: string;
  minWeight: number;
  maxWeight: number;
  preferredRoutes: string;
  maxDistanceRadius: number;
  preferredTripFrequency: number;
  active: boolean;
}

export const PreferenceSettings: React.FC = () => {
  const [prefs, setPrefs] = useState<TransporterPreference>({
    preferredPickupCities: '',
    preferredDestinationCities: '',
    vehicleTypes: '',
    minWeight: 0,
    maxWeight: 20,
    preferredRoutes: '',
    maxDistanceRadius: 500,
    preferredTripFrequency: 10,
    active: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const response = await protectedApi.get('/ai/preferences');
        if (response.data) {
          setPrefs({
            preferredPickupCities: response.data.preferredPickupCities || '',
            preferredDestinationCities: response.data.preferredDestinationCities || '',
            vehicleTypes: response.data.vehicleTypes || '',
            minWeight: response.data.minWeight || 0,
            maxWeight: response.data.maxWeight || 20,
            preferredRoutes: response.data.preferredRoutes || '',
            maxDistanceRadius: response.data.maxDistanceRadius || 500,
            preferredTripFrequency: response.data.preferredTripFrequency || 10,
            active: response.data.active !== false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch preferences', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await protectedApi.put('/ai/preferences', prefs);
      toast.success('🎉 Preferences saved successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl mx-auto">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
          <HiAdjustments className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">AI Matching Preferences</h3>
          <p className="text-xs text-slate-400 font-bold">Customize how the AI Load Matching engine finds loads for your fleet.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Preferred Pickup Cities</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-700"
              placeholder="e.g. Delhi, Mumbai, Jaipur"
              value={prefs.preferredPickupCities}
              onChange={e => setPrefs({ ...prefs, preferredPickupCities: e.target.value })}
            />
            <p className="text-[10px] font-bold text-slate-400 mt-1">Comma-separated list of pickup cities.</p>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Preferred Destination Cities</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-700"
              placeholder="e.g. Pune, Bangalore, Chennai"
              value={prefs.preferredDestinationCities}
              onChange={e => setPrefs({ ...prefs, preferredDestinationCities: e.target.value })}
            />
            <p className="text-[10px] font-bold text-slate-400 mt-1">Comma-separated list of destination cities.</p>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Vehicle Types Compatible</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-700"
              placeholder="e.g. TATA ACE, TRUCK 10T, Container"
              value={prefs.vehicleTypes}
              onChange={e => setPrefs({ ...prefs, vehicleTypes: e.target.value })}
            />
            <p className="text-[10px] font-bold text-slate-400 mt-1">Vehicle types you own and want to match.</p>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Preferred Routes</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-700"
              placeholder="e.g. Delhi-Mumbai, Jaipur-Ajmer"
              value={prefs.preferredRoutes}
              onChange={e => setPrefs({ ...prefs, preferredRoutes: e.target.value })}
            />
            <p className="text-[10px] font-bold text-slate-400 mt-1">Format: City-City (comma-separated).</p>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Weight Range (Tons)</label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                step="0.1"
                className="w-1/2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-700"
                placeholder="Min Weight"
                value={prefs.minWeight}
                onChange={e => setPrefs({ ...prefs, minWeight: parseFloat(e.target.value) || 0 })}
              />
              <span className="text-slate-400 font-bold">to</span>
              <input
                type="number"
                step="0.1"
                className="w-1/2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-700"
                placeholder="Max Weight"
                value={prefs.maxWeight}
                onChange={e => setPrefs({ ...prefs, maxWeight: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Max Distance Radius (KM)</label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-700"
              value={prefs.maxDistanceRadius}
              onChange={e => setPrefs({ ...prefs, maxDistanceRadius: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Preferred Trip Frequency (Trips/Month)</label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-700"
              value={prefs.preferredTripFrequency}
              onChange={e => setPrefs({ ...prefs, preferredTripFrequency: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex items-center pt-8">
            <input
              type="checkbox"
              id="active"
              className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              checked={prefs.active}
              onChange={e => setPrefs({ ...prefs, active: e.target.checked })}
            />
            <label htmlFor="active" className="ml-2.5 text-sm font-bold text-slate-700">Enable AI matching recommendations</label>
          </div>

        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start space-x-3.5">
          <HiInformationCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            Matching score calculations happen automatically in the background. Changes to your preferences will be applied to newly posted loads immediately.
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-emerald-600 hover:bg-slate-900 text-white rounded-xl font-black text-sm transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
          >
            <HiSave className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default PreferenceSettings;
