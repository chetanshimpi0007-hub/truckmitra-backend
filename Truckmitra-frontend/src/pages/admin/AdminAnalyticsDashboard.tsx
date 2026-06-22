import React, { useState, useEffect } from 'react';
import { 
    AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { 
    HiUsers, HiTruck, HiCash, HiShoppingCart, HiDocumentText, 
    HiDownload, HiSearch, HiRefresh
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminAnalyticsDashboard() {
    const [overview, setOverview] = useState<any>(null);
    const [usersAnalytics, setUsersAnalytics] = useState<any>(null);
    const [revenueAnalytics, setRevenueAnalytics] = useState<any>(null);
    const [loadsAnalytics, setLoadsAnalytics] = useState<any>(null);
    const [tripsAnalytics, setTripsAnalytics] = useState<any>(null);
    const [walletAnalytics, setWalletAnalytics] = useState<any>(null);
    const [invoicesAnalytics, setInvoicesAnalytics] = useState<any>(null);
    const [subscriptionAnalytics, setSubscriptionAnalytics] = useState<any>(null);
    
    const [loading, setLoading] = useState(true);
    
    // Table states
    const [activeTab, setActiveTab] = useState<'users' | 'loads' | 'trips' | 'wallet' | 'invoices'>('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        setLoading(true);
        try {
            const [overviewRes, usersRes, revenueRes, loadsRes, tripsRes, walletRes, invoicesRes, subscriptionsRes] = await Promise.all([
                protectedApi.get('/api/admin/analytics/overview').catch(() => ({ data: {} })),
                protectedApi.get('/api/admin/analytics/users').catch(() => ({ data: {} })),
                protectedApi.get('/api/admin/analytics/revenue').catch(() => ({ data: {} })),
                protectedApi.get('/api/admin/analytics/loads').catch(() => ({ data: {} })),
                protectedApi.get('/api/admin/analytics/trips').catch(() => ({ data: {} })),
                protectedApi.get('/api/admin/analytics/wallet').catch(() => ({ data: {} })),
                protectedApi.get('/api/invoices').catch(() => ({ data: { content: [] } })),
                protectedApi.get('/api/admin/analytics/subscriptions').catch(() => ({ data: {} }))
            ]);
            
            setOverview(overviewRes.data);
            setUsersAnalytics(usersRes.data);
            setRevenueAnalytics(revenueRes.data);
            setLoadsAnalytics(loadsRes.data);
            setTripsAnalytics(tripsRes.data);
            setWalletAnalytics(walletRes.data);
            setInvoicesAnalytics({ recentInvoices: invoicesRes.data?.content || invoicesRes.data || [] });
            setSubscriptionAnalytics(subscriptionsRes.data);
        } catch (error) {
            toast.error("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helper to extract table data based on active tab
    const getTableData = () => {
        let rawData: any[] = [];
        if (activeTab === 'users') rawData = usersAnalytics?.recentUsers || [];
        if (activeTab === 'loads') rawData = loadsAnalytics?.recentLoads || [];
        if (activeTab === 'trips') rawData = tripsAnalytics?.recentTrips || [];
        if (activeTab === 'wallet') rawData = walletAnalytics?.recentTransactions || [];
        if (activeTab === 'invoices') rawData = invoicesAnalytics?.recentInvoices || [];
        
        // Filter by search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            rawData = rawData.filter(item => JSON.stringify(item).toLowerCase().includes(term));
        }
        return rawData;
    };

    const tableData = getTableData();
    const paginatedData = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Dynamic Export Handler
    const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
        if (tableData.length === 0) {
            toast.error("No data to export");
            return;
        }
        
        // Sanitize data for export (remove nested objects/arrays for simple tables)
        const exportData = tableData.map(item => {
            const flat: any = {};
            for (let key in item) {
                if (typeof item[key] !== 'object') {
                    flat[key] = item[key];
                }
            }
            return flat;
        });

        const title = `Admin_${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}_Report`;

        if (type === 'csv') exportToCSV(exportData, title);
        if (type === 'excel') exportToExcel(exportData, title);
        if (type === 'pdf') exportToPDF(exportData, title, `${activeTab.toUpperCase()} REPORT`);
        
        toast.success(`Exported as ${type.toUpperCase()}`);
    };

    if (loading || !overview) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="animate-fadeIn space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900">Analytics Overview</h2>
                <button onClick={fetchData} className="p-2 bg-white text-indigo-600 rounded-xl font-bold shadow-sm border border-slate-200 hover:bg-indigo-50 transition flex items-center space-x-2">
                    <HiRefresh className="w-5 h-5" />
                    <span>Refresh</span>
                </button>
            </div>

            {/* KEY METRICS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <MetricCard title="Total Users" value={overview.totalUsers || 0} icon={<HiUsers />} color="bg-blue-500" />
                <MetricCard title="Active Loads" value={overview.activeLoads || 0} icon={<HiShoppingCart />} color="bg-emerald-500" />
                <MetricCard title="Completed Trips" value={overview.completedTrips || 0} icon={<HiTruck />} color="bg-indigo-500" />
                <MetricCard title="Revenue" value={`₹${(overview.totalRevenue || 0).toLocaleString()}`} icon={<HiCash />} color="bg-amber-500" />
                <MetricCard title="Subscriptions" value={overview.activeSubscriptions} icon={<HiDocumentText />} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <SubMetricCard title="Shippers" value={overview.totalShippers || 0} />
                <SubMetricCard title="Transporters" value={overview.totalTransporters || 0} />
                <SubMetricCard title="Drivers" value={overview.totalDrivers || 0} />
                <SubMetricCard title="Pending Deliveries" value={overview.pendingDeliveries || 0} />
            </div>

            {/* SUBSCRIPTION METRICS */}
            {subscriptionAnalytics && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-3xl text-white relative overflow-hidden">
                        <div className="absolute -right-3 -top-3 w-16 h-16 bg-white opacity-10 rounded-full" />
                        <div className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-2">MRR</div>
                        <div className="text-3xl font-black">₹{Math.round(subscriptionAnalytics.mrr || 0).toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-br from-violet-600 to-violet-800 p-6 rounded-3xl text-white relative overflow-hidden">
                        <div className="absolute -right-3 -top-3 w-16 h-16 bg-white opacity-10 rounded-full" />
                        <div className="text-xs font-black uppercase tracking-widest text-violet-200 mb-2">ARR</div>
                        <div className="text-3xl font-black">₹{Math.round(subscriptionAnalytics.arr || 0).toLocaleString()}</div>
                    </div>
                    <SubMetricCard title="Active Subscriptions" value={subscriptionAnalytics.activeSubscriptions} />
                    <SubMetricCard title="Cancelled" value={subscriptionAnalytics.cancelledSubscriptions} />
                    <SubMetricCard title="Failed Payments" value={subscriptionAnalytics.failedPayments} />
                </div>
            )}

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Revenue Chart */}
                <ChartContainer title="Monthly Revenue Trends">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueAnalytics?.revenueChart || []}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '16px' }} formatter={(val: any) => `₹${val.toLocaleString()}`} />
                            <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={4} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Subscription Revenue Trend */}
                <ChartContainer title="Subscription Revenue Trends">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={subscriptionAnalytics?.revenueTrendsChart || []}>
                            <defs>
                                <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '16px' }} formatter={(val: any) => `₹${val.toLocaleString()}`} />
                            <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={4} fill="url(#colorSub)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Loads Chart */}
                <ChartContainer title="Load Volumes">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={loadsAnalytics?.loadTrendsChart || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '16px' }} cursor={{fill: '#f1f5f9'}} />
                            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* User Registrations */}
                <ChartContainer title="User Registrations">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={usersAnalytics?.registrationsChart || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '16px' }} />
                            <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={4} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Load Status Distribution */}
                <ChartContainer title="Load Status Distribution">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={loadsAnalytics?.loadStatusDistribution || []} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                {(loadsAnalytics?.loadStatusDistribution || []).map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '16px' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>

            {/* DYNAMIC DATA TABLES WITH EXPORTS */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200 mt-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h3 className="text-xl font-black">Data Explorer</h3>
                        <p className="text-sm text-slate-500">View and export recent platform activity</p>
                    </div>
                    <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 overflow-x-auto">
                        {['users', 'loads', 'trips', 'wallet', 'invoices'].map(tab => (
                            <button key={tab} onClick={() => { setActiveTab(tab as any); setCurrentPage(1); }}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${
                                    activeTab === tab ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:bg-slate-100'
                                }`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full md:w-96">
                        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <ExportButton format="csv" onClick={() => handleExport('csv')} />
                        <ExportButton format="excel" onClick={() => handleExport('excel')} />
                        <ExportButton format="pdf" onClick={() => handleExport('pdf')} />
                    </div>
                </div>

                {paginatedData.length === 0 ? (
                    <div className="py-10 text-center text-slate-500 font-bold">No records found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 font-black uppercase tracking-wider text-[10px]">
                                    {Object.keys(paginatedData[0] || {})
                                        .filter(k => typeof paginatedData[0][k] !== 'object')
                                        .map(key => (
                                        <th key={key} className="px-4 py-3">{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-indigo-50/30 transition">
                                        {Object.keys(row)
                                            .filter(k => typeof row[k] !== 'object')
                                            .map(key => (
                                            <td key={key} className="px-4 py-4 font-medium text-slate-700">
                                                {String(row[key])}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Pagination */}
                {tableData.length > itemsPerPage && (
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
                        <span className="text-sm text-slate-500">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, tableData.length)} of {tableData.length}
                        </span>
                        <div className="flex space-x-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-slate-100 rounded text-sm disabled:opacity-50">Prev</button>
                            <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(tableData.length / itemsPerPage), p + 1))} disabled={currentPage === Math.ceil(tableData.length / itemsPerPage)} className="px-3 py-1 bg-slate-100 rounded text-sm disabled:opacity-50">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// UI Sub-components
const MetricCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className={`absolute -right-4 -top-4 w-16 h-16 ${color} opacity-10 rounded-full`} />
        <div className={`text-2xl ${color.replace('bg-', 'text-')} mb-3`}>{icon}</div>
        <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</div>
    </div>
);

const SubMetricCard = ({ title, value }: any) => (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="text-lg font-black text-slate-700">{value}</div>
        <div className="text-[10px] font-bold text-slate-500 uppercase">{title}</div>
    </div>
);

const ChartContainer = ({ title, children }: any) => (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200 h-96 flex flex-col">
        <h3 className="text-xl font-black mb-6">{title}</h3>
        <div className="flex-1 min-h-0">
            {children}
        </div>
    </div>
);

const ExportButton = ({ format, onClick }: any) => {
    const colors = {
        csv: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white border-emerald-100',
        excel: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white border-indigo-100',
        pdf: 'text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border-rose-100'
    };
    return (
        <button onClick={onClick} className={`px-4 py-2 border rounded-xl font-black text-xs uppercase tracking-wide transition flex items-center space-x-1 ${colors[format as keyof typeof colors]}`}>
            <HiDownload className="w-4 h-4" /> <span>{format}</span>
        </button>
    );
};
