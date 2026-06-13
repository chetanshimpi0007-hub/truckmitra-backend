import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiTruck, HiUser, HiLocationMarker, HiDocumentText, HiChartPie, 
  HiSearch, HiFilter, HiViewGrid, HiViewList, HiPhone, 
  HiCheckCircle, HiExclamationCircle, HiXCircle, HiDownload, HiEye
} from 'react-icons/hi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import StatWidget from '../ui/StatWidget';
import GlassCard from '../ui/GlassCard';
import LiveMap from '../common/LiveMap';
import { format, differenceInDays } from 'date-fns';

// ─── TYPES ──────────────────────────────────────────────────────────────────
type TabOption = 'overview' | 'vehicles' | 'analytics' | 'map' | 'documents';
type ViewMode = 'grid' | 'list';

interface FleetProps {
  vehicles: any[];
  drivers: any[];
  trips: any[];
  onAddVehicle?: () => void;
  onRegisterDriver?: () => void;
  onNavigateDriver?: (driverId: number) => void;
}

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

// ─── UTILITIES ──────────────────────────────────────────────────────────────
const getExpiryStatus = (dateStr: string | null | undefined) => {
  if (!dateStr) return { status: 'missing', color: 'bg-slate-100 text-slate-500', icon: <HiExclamationCircle /> };
  const daysLeft = differenceInDays(new Date(dateStr), new Date());
  if (daysLeft < 0) return { status: 'expired', color: 'bg-rose-100 text-rose-600', icon: <HiXCircle /> };
  if (daysLeft <= 30) return { status: 'expiring', color: 'bg-amber-100 text-amber-600', icon: <HiExclamationCircle /> };
  return { status: 'valid', color: 'bg-emerald-100 text-emerald-600', icon: <HiCheckCircle /> };
};

export default function FleetManagement({ vehicles = [], drivers = [], trips = [], onAddVehicle, onRegisterDriver, onNavigateDriver }: FleetProps) {
  // ─── STATE ─────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabOption>('overview');
  const [viewMode, setViewMode] = useState<ViewMode>(() => (localStorage.getItem('fleetViewMode') as ViewMode) || 'grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Persist View Mode
  useEffect(() => { localStorage.setItem('fleetViewMode', viewMode); }, [viewMode]);

  // ─── DERIVED DATA ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const activeTrips = trips.filter(t => !['COMPLETED', 'CANCELLED'].includes(t.status));
    const vehiclesInTrip = new Set(activeTrips.map(t => t.vehicleId)).size;
    let expiringDocs = 0;
    
    vehicles.forEach(v => {
      ['insuranceExpiry', 'pucExpiry', 'fitnessExpiry', 'permitExpiry'].forEach(key => {
        if (v[key] && differenceInDays(new Date(v[key]), new Date()) <= 30) expiringDocs++;
      });
    });

    return {
      total: vehicles.length,
      available: vehicles.filter(v => v.isAvailable).length,
      inTrip: vehiclesInTrip,
      assignedDrivers: vehicles.filter(v => v.driverId).length,
      expiringDocs
    };
  }, [vehicles, trips]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const driver = drivers.find(d => d.id === v.driverId);
      const matchesSearch = 
        v.vehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver?.mobile?.includes(searchQuery);
      
      const matchesType = typeFilter === 'all' || v.vehicleType === typeFilter;
      const matchesStatus = statusFilter === 'all' 
        ? true 
        : statusFilter === 'available' ? v.isAvailable 
        : statusFilter === 'in_trip' ? !v.isAvailable : true;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [vehicles, drivers, searchQuery, typeFilter, statusFilter]);

  // Analytics Data Preparation
  const utilizationData = [
    { name: 'Available', value: stats.available },
    { name: 'In Trip', value: stats.inTrip },
    { name: 'Maintenance/Offline', value: stats.total - stats.available - stats.inTrip }
  ];

  // ─── RENDERERS ─────────────────────────────────────────────────────────────
  
  // Document Badge
  const DocBadge = ({ label, date }: { label: string, date?: string }) => {
    const { status, color, icon } = getExpiryStatus(date);
    return (
      <div className={`flex items-center justify-between p-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${color}`}>
        <span className="flex items-center space-x-1">{icon} <span>{label}</span></span>
        <span>{date ? format(new Date(date), 'dd MMM yy') : 'N/A'}</span>
      </div>
    );
  };

  // Render Vehicle Card (Grid View)
  const renderVehicleCard = (v: any) => {
    const driver = drivers.find(d => d.id === v.driverId);
    return (
      <GlassCard key={v.id} className="overflow-hidden flex flex-col transition-all hover:border-brand/50 hover:shadow-xl group">
        {/* Header: Vehicle Image & Basic Info */}
        <div className="relative h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
          {v.imageUrl ? (
            <img src={v.imageUrl} alt={v.vehicleNumber} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
          ) : (
            <HiTruck className="w-20 h-20 text-slate-300 dark:text-slate-600" />
          )}
          <div className="absolute top-4 right-4 flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase shadow-lg ${v.isAvailable ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
              {v.isAvailable ? 'Available' : 'In Trip'}
            </span>
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 to-transparent p-4">
            <h3 className="text-xl font-black text-white">{v.vehicleNumber}</h3>
            <p className="text-xs font-bold text-white/80 uppercase tracking-widest">{v.vehicleType} • {v.capacity} Tons</p>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          {/* Driver Linking */}
          <div className="flex items-center justify-between mb-5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => driver && onNavigateDriver?.(driver.id)}>
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center border-2 border-white dark:border-slate-600 shadow-sm">
                {driver?.photoUrl ? <img src={driver.photoUrl} alt="" className="w-full h-full object-cover" /> : <HiUser className="text-slate-400" />}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand transition-colors">
                  {driver ? driver.fullName : 'No Driver Assigned'}
                </div>
                {driver && <div className="text-xs text-slate-500">{driver.mobile}</div>}
              </div>
            </div>
            {driver && (
              <a href={`tel:${driver.mobile}`} className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center hover:bg-brand hover:text-white transition-colors">
                <HiPhone className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Health Center (Docs) */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <DocBadge label="Insurance" date={v.insuranceExpiry} />
            <DocBadge label="PUC" date={v.pucExpiry} />
            <DocBadge label="Fitness" date={v.fitnessExpiry} />
            <DocBadge label="Permit" date={v.permitExpiry} />
          </div>

          <div className="mt-auto grid grid-cols-2 gap-3">
            <button className="py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors uppercase tracking-widest">
              Documents
            </button>
            <button className="py-2.5 rounded-xl font-bold text-xs bg-brand text-white hover:bg-brand/90 shadow-lg shadow-brand/20 transition-colors uppercase tracking-widest">
              Track GPS
            </button>
          </div>
        </div>
      </GlassCard>
    );
  };

  // ─── MAIN COMPONENT RENDER ──────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* KPI Header */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatWidget title="Total Fleet" value={stats.total} icon={<HiTruck />} color="primary" />
        <StatWidget title="Available" value={stats.available} icon={<HiCheckCircle />} color="success" />
        <StatWidget title="In Trip" value={stats.inTrip} icon={<HiLocationMarker />} color="warning" />
        <StatWidget title="Assigned Drivers" value={stats.assignedDrivers} icon={<HiUser />} color="secondary" />
        <StatWidget title="Expiring Docs" value={stats.expiringDocs} icon={<HiExclamationCircle />} color="danger" />
        <div className="bg-brand text-white p-6 rounded-3xl flex flex-col justify-center cursor-pointer hover:bg-slate-900 transition-all shadow-lg shadow-brand/30" onClick={onAddVehicle}>
          <div className="text-sm font-black uppercase tracking-widest opacity-80">Action</div>
          <div className="text-xl font-black mt-1">+ Add Vehicle</div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-3xl overflow-x-auto hide-scrollbar">
        {(['overview', 'vehicles', 'map', 'analytics', 'documents'] as TabOption[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[120px] py-3 text-sm font-black uppercase tracking-widest transition-all rounded-xl relative ${
              activeTab === tab ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {activeTab === tab && (
              <motion.div layoutId="fleetTab" className="absolute inset-0 bg-slate-900 dark:bg-brand rounded-xl shadow-md" />
            )}
            <span className="relative z-10 flex items-center justify-center space-x-2">
              {tab === 'overview' && <HiViewGrid />}
              {tab === 'vehicles' && <HiTruck />}
              {tab === 'map' && <HiLocationMarker />}
              {tab === 'analytics' && <HiChartPie />}
              {tab === 'documents' && <HiDocumentText />}
              <span>{tab}</span>
            </span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {/* ──────────────────────────────────────────────────────────── */}
          {/* VEHICLES TAB (Default Roster view) */}
          {(activeTab === 'overview' || activeTab === 'vehicles') && (
            <motion.div key="vehicles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              
              {/* Controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 flex-1 max-w-md">
                  <HiSearch className="text-slate-400 w-5 h-5 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Search by vehicle, driver name or mobile..." 
                    className="bg-transparent border-none outline-none text-sm w-full font-medium"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  <select 
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none"
                    value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="in_trip">In Trip</option>
                  </select>
                  
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm dark:bg-slate-700 text-brand' : 'text-slate-500 hover:text-slate-900'}`}>
                      <HiViewGrid className="w-5 h-5" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm dark:bg-slate-700 text-brand' : 'text-slate-500 hover:text-slate-900'}`}>
                      <HiViewList className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid/List Render */}
              {filteredVehicles.length === 0 ? (
                <div className="text-center py-20 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
                  <HiTruck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-500">No vehicles found</h3>
                </div>
              ) : (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVehicles.map(renderVehicleCard)}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                          <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Vehicle</th>
                          <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Driver</th>
                          <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                          <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Health</th>
                          <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVehicles.map(v => {
                          const driver = drivers.find(d => d.id === v.driverId);
                          return (
                            <tr key={v.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                              <td className="p-4">
                                <div className="font-bold text-slate-900 dark:text-white">{v.vehicleNumber}</div>
                                <div className="text-xs text-slate-500 uppercase">{v.vehicleType}</div>
                              </td>
                              <td className="p-4">
                                {driver ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden"><img src={driver.photoUrl} alt="" className="w-full h-full object-cover" /></div>
                                    <div><div className="font-bold text-sm text-slate-900 dark:text-white">{driver.fullName}</div><div className="text-xs text-slate-500">{driver.mobile}</div></div>
                                  </div>
                                ) : <span className="text-slate-400 text-sm">Unassigned</span>}
                              </td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${v.isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                  {v.isAvailable ? 'Available' : 'In Trip'}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-1">
                                  <span className={`w-3 h-3 rounded-full ${getExpiryStatus(v.insuranceExpiry).color.split(' ')[0]}`} title="Insurance" />
                                  <span className={`w-3 h-3 rounded-full ${getExpiryStatus(v.pucExpiry).color.split(' ')[0]}`} title="PUC" />
                                  <span className={`w-3 h-3 rounded-full ${getExpiryStatus(v.fitnessExpiry).color.split(' ')[0]}`} title="Fitness" />
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button className="p-2 text-slate-400 hover:text-brand bg-slate-100 dark:bg-slate-800 hover:bg-brand/10 rounded-lg transition-colors"><HiDocumentText className="w-5 h-5" /></button>
                                  <button className="p-2 text-slate-400 hover:text-brand bg-slate-100 dark:bg-slate-800 hover:bg-brand/10 rounded-lg transition-colors"><HiLocationMarker className="w-5 h-5" /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </motion.div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* MAP TAB */}
          {activeTab === 'map' && (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[600px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
              <LiveMap 
                lat={20.5937} 
                lng={78.9629} 
                className="w-full h-full z-0" 
                markers={trips.filter(t => t.status === 'IN_TRANSIT').map(t => ({
                  id: t.id,
                  lat: t.currentLat || t.load?.sourceLat || 20.5,
                  lng: t.currentLng || t.load?.sourceLng || 78.9,
                  label: `Trip #${t.id} - ${t.vehicle?.vehicleNumber || 'Vehicle'}`
                }))}
              />
              <div className="absolute top-6 left-6 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-black text-slate-900 dark:text-white mb-2">Live Fleet</h4>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400"><span className="w-3 h-3 bg-brand rounded-full animate-pulse" /> <span>{stats.inTrip} Vehicles in Transit</span></div>
              </div>
            </motion.div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GlassCard className="p-8">
                <h3 className="text-xl font-black mb-6">Fleet Utilization</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={utilizationData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {utilizationData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard className="p-8">
                <h3 className="text-xl font-black mb-6">Monthly Fleet Activity (Simulated)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[ { name: 'Jan', trips: 40 }, { name: 'Feb', trips: 30 }, { name: 'Mar', trips: 55 }, { name: 'Apr', trips: 45 }, { name: 'May', trips: 70 } ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                      <Line type="monotone" dataKey="trips" stroke="#10B981" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Document Center</h2>
              <div className="space-y-4">
                {vehicles.map(v => (
                  <div key={v.id} className="p-4 border border-slate-100 dark:border-slate-700/50 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center"><HiTruck className="text-slate-400 w-6 h-6" /></div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-lg">{v.vehicleNumber}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest">{v.vehicleType}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:flex gap-2">
                      <DocBadge label="Insurance" date={v.insuranceExpiry} />
                      <DocBadge label="PUC" date={v.pucExpiry} />
                      <DocBadge label="Fitness" date={v.fitnessExpiry} />
                      <DocBadge label="Permit" date={v.permitExpiry} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
