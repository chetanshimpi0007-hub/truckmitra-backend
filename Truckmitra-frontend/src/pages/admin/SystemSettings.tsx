import React, { useState, useEffect } from 'react';
import { 
  HiSave, 
  HiOfficeBuilding, 
  HiColorSwatch, 
  HiUpload,
  HiDocumentText,
  HiKey
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';

interface SettingsState {
  companyName: string;
  gstNumber: string;
  companyAddress: string;
  invoicePrefix: string;
  themeColors: string;
  companyLogo: string;
}

const SystemSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [settings, setSettings] = useState<SettingsState>({
    companyName: 'TruckMitra',
    gstNumber: '',
    companyAddress: '',
    invoicePrefix: 'TM',
    themeColors: '#1E3A8A',
    companyLogo: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await protectedApi.get('/api/admin/settings');
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to load settings', error);
      toast.error('Could not load enterprise settings.');
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await protectedApi.post('/api/admin/settings', settings);
      toast.success('Enterprise configuration updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-10 flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-10 animate-fadeIn bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">System Configuration</h1>
              <p className="text-slate-500 font-medium">Global platform settings, branding, and billing preferences.</p>
            </div>
            <div className={`p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3`}>
               <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Live</span>
            </div>
          </div>
        </header>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Identity Section */}
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3 text-indigo-600 mb-8 font-black uppercase tracking-widest text-xs">
              <HiOfficeBuilding />
              <span>Platform Identity</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Platform Name</label>
                <input 
                  type="text" 
                  value={settings.companyName}
                  onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold text-slate-700" 
                  placeholder="TruckMitra"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tax ID / GSTIN</label>
                <input 
                  type="text" 
                  value={settings.gstNumber}
                  onChange={(e) => setSettings({...settings, gstNumber: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold text-slate-700" 
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Corporate Address (Footer / Invoices)</label>
                <textarea 
                   value={settings.companyAddress}
                   onChange={(e) => setSettings({...settings, companyAddress: e.target.value})}
                   rows={3}
                   className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                   placeholder="123 Logistics Park, Cyber City, Bangalore - 560001"
                />
              </div>
            </div>
          </section>

          {/* Branding Section */}
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3 text-indigo-600 mb-8 font-black uppercase tracking-widest text-xs">
              <HiColorSwatch />
              <span>White-label & Visuals</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Platform Logo</label>
                <div className="flex items-center space-x-6">
                   <div className="w-24 h-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                      {settings.companyLogo ? (
                        <img src={settings.companyLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <HiUpload className="text-slate-300 text-3xl" />
                      )}
                   </div>
                   <div className="flex-1">
                      <button type="button" className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition">
                         Upload New Logo
                      </button>
                      <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight">SVG, PNG or JPG (Max 2MB)</p>
                   </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Primary Brand Color</label>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl shadow-inner border border-slate-200 flex-shrink-0" style={{ backgroundColor: settings.themeColors }} />
                  <input 
                    type="text" 
                    value={settings.themeColors}
                    onChange={(e) => setSettings({...settings, themeColors: e.target.value})}
                    className="flex-grow p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-mono font-bold text-slate-700" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Billing Section */}
          <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3 text-indigo-600 mb-8 font-black uppercase tracking-widest text-xs">
              <HiDocumentText />
              <span>Invoicing Configuration</span>
            </div>

            <div className="max-w-md">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Invoice Number Prefix</label>
              <div className="relative">
                <HiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={settings.invoicePrefix}
                  onChange={(e) => setSettings({...settings, invoicePrefix: e.target.value.toUpperCase()})}
                  maxLength={5}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-black text-indigo-600" 
                />
              </div>
              <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-tighter bg-slate-50 p-3 rounded-xl border border-slate-100">
                Preview: {settings.invoicePrefix}-{new Date().getFullYear()}-000001
              </p>
            </div>
          </section>

          <div className="flex items-center justify-end pt-4 pb-10">
            <button 
              type="submit" 
              disabled={loading}
              className="px-12 py-5 bg-indigo-600 text-white rounded-[32px] font-black flex items-center space-x-3 hover:bg-indigo-700 transition shadow-2xl shadow-indigo-200 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <HiSave className="text-xl" />
                  <span>Update Global Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemSettings;
