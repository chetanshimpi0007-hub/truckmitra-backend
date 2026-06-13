import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { HiCurrencyDollar, HiGlobe, HiChartBar, HiTrendingUp } from 'react-icons/hi';
import StatWidget from '../ui/StatWidget';
import GlassCard from '../ui/GlassCard';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

export default function AnalyticsDashboard({ stats, trips, myBids }: any) {
  // Simulated Analytics Data
  const revenueData = [
    { name: 'Jan', revenue: 150000 },
    { name: 'Feb', revenue: 180000 },
    { name: 'Mar', revenue: 220000 },
    { name: 'Apr', revenue: 190000 },
    { name: 'May', revenue: 250000 },
    { name: 'Jun', revenue: 310000 },
  ];

  const utilizationData = [
    { name: 'On Trip', value: 65 },
    { name: 'Available', value: 25 },
    { name: 'Maintenance', value: 10 },
  ];

  const emissionsData = [
    { name: 'Jan', saved: 120 },
    { name: 'Feb', saved: 150 },
    { name: 'Mar', saved: 190 },
    { name: 'Apr', saved: 210 },
    { name: 'May', saved: 250 },
    { name: 'Jun', saved: 300 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget title="Total Revenue" value={1300000} icon={<HiCurrencyDollar />} color="success" trend={15} />
        <StatWidget title="Avg Profit Margin" value={22} suffix="%" icon={<HiTrendingUp />} color="primary" trend={5} />
        <StatWidget title="Bid Win Rate" value={45} suffix="%" icon={<HiChartBar />} color="warning" trend={-2} />
        <StatWidget title="CO₂ Saved (kg)" value={1220} icon={<HiGlobe />} color="secondary" trend={28} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Revenue Chart */}
        <GlassCard className="p-8 lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Revenue Trend</h3>
            <select className="bg-slate-100 dark:bg-slate-800 text-sm font-bold px-4 py-2 rounded-xl outline-none text-slate-700 dark:text-slate-300">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} tick={{fill: '#94a3b8'}} />
                <RechartsTooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={4} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Fleet Utilization Pie */}
        <GlassCard className="p-8">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Fleet Utilization</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={utilizationData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                  {utilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Carbon Emission Savings */}
        <GlassCard className="p-8">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Green Logistics: CO₂ Savings</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emissionsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <RechartsTooltip formatter={(value: any) => [`${value} kg`, 'CO₂ Saved']} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="saved" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Top Routes Performance */}
        <GlassCard className="p-8">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Top Performing Routes</h3>
          <div className="space-y-4">
            {[
              { route: 'Mumbai → Pune', revenue: 450000, trips: 32 },
              { route: 'Delhi → Jaipur', revenue: 380000, trips: 28 },
              { route: 'Bangalore → Chennai', revenue: 310000, trips: 21 },
              { route: 'Ahmedabad → Surat', revenue: 250000, trips: 15 },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-lg">{r.route}</div>
                  <div className="text-sm text-slate-500">{r.trips} Trips Completed</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-emerald-600 text-lg">₹{(r.revenue/1000).toFixed(0)}k</div>
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
