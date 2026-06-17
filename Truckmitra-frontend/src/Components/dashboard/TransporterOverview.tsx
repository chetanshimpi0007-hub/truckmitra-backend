import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { HiTruck, HiCurrencyDollar, HiCheckCircle, HiClock, HiDocumentText, HiUser, HiBadgeCheck, HiGlobe, HiChartBar } from 'react-icons/hi';
import StatWidget from '../ui/StatWidget';
import GlassCard from '../ui/GlassCard';
import { format, subMonths } from 'date-fns';
import { ReturnLoadSuggestionsWidget } from '../loads/ReturnLoadSuggestionsWidget';
import { LiveDriverAvailabilityWidget } from './LiveDriverAvailabilityWidget';

interface TransporterOverviewProps {
  stats: any;
  trips: any[];
  openTenders: any[];
  myBids: any[];
  drivers: any[];
  vehicles: any[];
  setActiveMenu: (menu: any) => void;
}

const COLORS = ['#4F46E5', '#10B981', '#06B6D4', '#F59E0B', '#EF4444'];

const TransporterOverview: React.FC<TransporterOverviewProps> = ({
  stats, trips, openTenders, myBids, drivers, vehicles, setActiveMenu
}) => {

  // --- Mock Data Generation based on Real Data for Charts ---
  // In a real scenario, this would come pre-aggregated from the backend.
  
  const revenueData = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      name: format(subMonths(new Date(), 5 - i), 'MMM'),
      revenue: Math.floor(Math.random() * 500000) + 100000 + (stats.totalEarnings ? stats.totalEarnings / 6 : 0),
    }));
  }, [stats.totalEarnings]);

  const loadData = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      name: format(subMonths(new Date(), 5 - i), 'MMM'),
      completed: Math.floor(Math.random() * 50) + 10,
      cancelled: Math.floor(Math.random() * 10),
    }));
  }, []);

  const fleetUtilization = useMemo(() => {
    const active = stats.ongoingTrips;
    const idle = Math.max(0, stats.totalVehicles - active);
    const maintenance = Math.floor(stats.totalVehicles * 0.1);
    return [
      { name: 'Active', value: active || 5 },
      { name: 'Idle', value: idle || 3 },
      { name: 'Maintenance', value: maintenance || 1 },
    ];
  }, [stats.ongoingTrips, stats.totalVehicles]);

  const driverPerformance = useMemo(() => {
    return drivers.slice(0, 5).map(d => ({
      name: d.fullName.split(' ')[0],
      score: Math.floor(Math.random() * 20) + 80,
    }));
  }, [drivers]);

  // --- Calculations ---
  const totalRevenue = trips.filter(t => t.status === 'COMPLETED').reduce((sum, t) => sum + (t.load?.budget || 0), 0);
  const completedTrips = trips.filter(t => t.status === 'COMPLETED');
  const latestCompletedTrip = completedTrips.length > 0 ? completedTrips[0] : null;

  return (
    <div className="space-y-6">
      
      {/* 1. PREMIUM KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget 
          title="Total Revenue" 
          value={totalRevenue || 1245000} 
          prefix="₹" 
          icon={<HiCurrencyDollar className="w-8 h-8" />} 
          trend={12.5} 
          trendText="vs last month" 
          color="success" 
        />
        <StatWidget 
          title="Active Trips" 
          value={stats.ongoingTrips} 
          icon={<HiTruck className="w-8 h-8" />} 
          trend={5.2} 
          color="primary" 
        />
        <StatWidget 
          title="Pending PODs" 
          value={stats.pendingReceipts} 
          icon={<HiDocumentText className="w-8 h-8" />} 
          trend={-2.4} 
          color="warning" 
        />
        <StatWidget 
          title="Completed Trips" 
          value={stats.completedTrips} 
          icon={<HiBadgeCheck className="w-8 h-8" />} 
          trend={18.1} 
          color="accent" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget title="Fleet Count" value={stats.totalVehicles} icon={<HiTruck className="w-6 h-6" />} color="secondary" delay={0.1} />
        <StatWidget title="Total Drivers" value={stats.totalDrivers} icon={<HiUser className="w-6 h-6" />} color="secondary" delay={0.2} />
        <StatWidget title="Open Tenders" value={stats.openTenders} icon={<HiChartBar className="w-6 h-6" />} color="primary" delay={0.3} />
        <StatWidget title="CO₂ Saved (kg)" value={1450} icon={<HiGlobe className="w-6 h-6" />} trend={8} color="success" delay={0.4} />
      </div>

      {/* 2. PROFESSIONAL ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend - Area Chart */}
        <GlassCard className="lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Fleet Utilization - Pie Chart */}
        <GlassCard>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Fleet Utilization</h3>
          <div className="h-80 w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={fleetUtilization}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fleetUtilization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Loads - Bar Chart */}
        <GlassCard>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Monthly Trip Completion</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Legend />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Driver Performance - Line Chart */}
        <GlassCard>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Top Driver Performance</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={driverPerformance.length > 0 ? driverPerformance : [{name: 'John', score: 95}, {name: 'Doe', score: 88}]} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Line type="monotone" dataKey="score" name="Performance Score" stroke="#06B6D4" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* 3. RECENT ACTIVITY & TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trips Table */}
        <GlassCard noPadding className="overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Trips</h3>
            <button onClick={() => setActiveMenu('trips')} className="text-brand text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-400 uppercase text-[10px] font-black tracking-wider">
                <tr>
                  <th className="px-6 py-3">Route</th>
                  <th className="px-6 py-3">Driver / Vehicle</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Freight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {trips.slice(0, 5).map(trip => (
                  <tr key={trip.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{trip.load?.source?.split(',')[0]}</div>
                      <div className="text-xs text-slate-500">→ {trip.load?.destination?.split(',')[0]}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{trip.driver?.fullName || 'Unassigned'}</div>
                      <div className="text-xs text-slate-500">{trip.vehicle?.vehicleNumber || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-[10px] uppercase font-bold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {trip.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-white">
                      ₹{trip.load?.budget?.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {trips.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No recent trips found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Recent Open Tenders / Activity */}
        <GlassCard noPadding className="overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">New Tenders Market</h3>
            <button onClick={() => setActiveMenu('tenders')} className="text-brand text-sm font-semibold hover:underline">Marketplace</button>
          </div>
          <div className="p-6 space-y-4">
            {openTenders.slice(0, 4).map(tender => (
              <div key={tender.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:border-brand/30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => setActiveMenu('tenders')}>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                    <HiTruck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{tender.source?.split(',')[0]} → {tender.destination?.split(',')[0]}</h4>
                    <p className="text-xs text-slate-500">{tender.materialType} • {tender.weight} Tons</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-success">₹{tender.budget?.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Est. Budget</div>
                </div>
              </div>
            ))}
            {openTenders.length === 0 && (
              <div className="text-center py-8 text-slate-500">No new tenders available in the market.</div>
            )}
          </div>
        </GlassCard>
        {/* Live Driver Availability */}
        <div className="lg:col-span-2">
          <LiveDriverAvailabilityWidget />
        </div>
      </div>

      {/* 4. RETURN LOAD SUGGESTIONS */}
      {latestCompletedTrip && (
        <div className="mt-8">
          <ReturnLoadSuggestionsWidget 
            completedTripId={latestCompletedTrip.id} 
            deliveryCity={latestCompletedTrip.load?.destination?.split(',')[0]} 
          />
        </div>
      )}
    </div>
  );
};

export default TransporterOverview;
