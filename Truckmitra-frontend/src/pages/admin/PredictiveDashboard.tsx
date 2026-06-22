import React, { useState, useEffect, useCallback } from 'react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, RadialBarChart, RadialBar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────────
// TypeScript interfaces matching backend DTOs exactly
// ─────────────────────────────────────────────────────────────────
interface TrendPoint {
    period: string;
    value: number;
    change: number;
}

interface LoadForecastDTO {
    currentVolume: number;
    forecastedVolume: number;
    growthPercentage: number;
    confidencePercentage: number;
    peakDay: string;
    peakHour: string;
    loadTrends: TrendPoint[];
}

interface RevenueForecastDTO {
    currentRevenue: number;
    forecastedRevenue: number;
    growthPercentage: number;
    confidencePercentage: number;
    monthlyTrends: TrendPoint[];
}

interface RouteAnalyticsDTO {
    topRoutes: {
        label: string;
        predictedValue: number;
        confidence: number;
        unit: string;
        metadata: Record<string, unknown>;
    }[];
    seasonalDemand: Record<string, number>;
    mostDemandedCities: Record<string, number>;
    topRoute: string;
}

interface UtilizationDTO {
    overallUtilizationRate: number;
    activeVehiclePercentage: number;
    idleVehiclePercentage: number;
    averageTripsPerVehicle: number;
    predictedUtilizationRate: number;
    utilizationByVehicleType: Record<string, number>;
    weeklyTrends: TrendPoint[];
    topPerformingVehicleType: string;
    tripCompletionProbability: number;
    lateDeliveryProbability: number;
}

type ActiveTab = 'loads' | 'revenue' | 'routes' | 'utilization';

// ─────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

const TABS = [
    { id: 'loads' as const,       label: '📦 Load Volume',  desc: 'Next month demand forecast' },
    { id: 'revenue' as const,     label: '💰 Revenue',      desc: 'Projected earnings' },
    { id: 'routes' as const,      label: '🗺️ Routes',       desc: 'Demand by route & city' },
    { id: 'utilization' as const, label: '🚛 Utilization',  desc: 'Fleet efficiency metrics' },
];

// ─────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────
export default function PredictiveDashboard() {
    const [loadForecast, setLoadForecast]     = useState<LoadForecastDTO | null>(null);
    const [revenueForecast, setRevenueForecast] = useState<RevenueForecastDTO | null>(null);
    const [routeAnalytics, setRouteAnalytics]  = useState<RouteAnalyticsDTO | null>(null);
    const [utilization, setUtilization]        = useState<UtilizationDTO | null>(null);
    const [loading, setLoading]  = useState(true);
    const [activeTab, setActiveTab] = useState<ActiveTab>('loads');

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [lf, rf, ra, ut] = await Promise.all([
                protectedApi.get<LoadForecastDTO>('/api/analytics/predictive/load-volume').catch(() => ({ data: null as unknown as LoadForecastDTO })),
                protectedApi.get<RevenueForecastDTO>('/api/analytics/predictive/revenue').catch(() => ({ data: null as unknown as RevenueForecastDTO })),
                protectedApi.get<RouteAnalyticsDTO>('/api/analytics/predictive/routes').catch(() => ({ data: null as unknown as RouteAnalyticsDTO })),
                protectedApi.get<UtilizationDTO>('/api/analytics/predictive/utilization').catch(() => ({ data: null as unknown as UtilizationDTO })),
            ]);
            setLoadForecast(lf.data);
            setRevenueForecast(rf.data);
            setRouteAnalytics(ra.data);
            setUtilization(ut.data);
        } catch {
            toast.error('Failed to load predictive analytics');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    if (loading) return <SkeletonLoader />;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                        🔮 Predictive Analytics
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        AI-driven forecasts powered by historical TruckMitra data · Weighted Moving Average engine
                    </p>
                </div>
                <button
                    id="predictive-refresh-btn"
                    onClick={fetchAll}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95 shrink-0"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                >
                    <span className="text-base">↻</span> Refresh Forecasts
                </button>
            </div>

            {/* ── KPI Cards grid: 1 col → 2 col → 4 col ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <KPICard
                    id="kpi-load-volume"
                    title="Forecasted Load Volume"
                    value={loadForecast?.forecastedVolume != null ? loadForecast.forecastedVolume.toFixed(0) : '—'}
                    subtitle={`${(loadForecast?.growthPercentage ?? 0) >= 0 ? '↑' : '↓'} ${Math.abs(loadForecast?.growthPercentage ?? 0).toFixed(1)}% vs last month`}
                    confidence={loadForecast?.confidencePercentage}
                    gradient="linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)"
                    icon="📦"
                />
                <KPICard
                    id="kpi-revenue"
                    title="Forecasted Revenue"
                    value={revenueForecast?.forecastedRevenue != null
                        ? `₹${revenueForecast.forecastedRevenue.toLocaleString('en-IN')}`
                        : '—'}
                    subtitle={`${(revenueForecast?.growthPercentage ?? 0) >= 0 ? '↑' : '↓'} ${Math.abs(revenueForecast?.growthPercentage ?? 0).toFixed(1)}% vs last month`}
                    confidence={revenueForecast?.confidencePercentage}
                    gradient="linear-gradient(135deg,#10b981 0%,#059669 100%)"
                    icon="💰"
                />
                <KPICard
                    id="kpi-top-route"
                    title="Top Demand Route"
                    value={routeAnalytics?.topRoute
                        ? routeAnalytics.topRoute.split('→')[0]?.trim().substring(0, 16) + (routeAnalytics.topRoute.length > 16 ? '…' : '')
                        : '—'}
                    subtitle={routeAnalytics?.topRoute ?? 'Analysing data…'}
                    confidence={routeAnalytics?.topRoutes?.[0]?.confidence}
                    gradient="linear-gradient(135deg,#8b5cf6 0%,#ec4899 100%)"
                    icon="🗺️"
                />
                <KPICard
                    id="kpi-completion"
                    title="Trip Completion Rate"
                    value={utilization?.tripCompletionProbability != null
                        ? `${utilization.tripCompletionProbability}%`
                        : '—'}
                    subtitle={`Late delivery risk: ${utilization?.lateDeliveryProbability ?? '—'}%`}
                    confidence={utilization?.overallUtilizationRate}
                    gradient="linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)"
                    icon="✅"
                />
            </div>

            {/* ── Tab bar ── */}
            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        id={`predictive-tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 min-w-max px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                        style={activeTab === tab.id
                            ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }
                            : {}}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab content panels ── */}
            {activeTab === 'loads'       && <LoadVolumePanel data={loadForecast} />}
            {activeTab === 'revenue'     && <RevenuePanel data={revenueForecast} />}
            {activeTab === 'routes'      && <RoutesPanel data={routeAnalytics} />}
            {activeTab === 'utilization' && <UtilizationPanel data={utilization} />}

            {/* ── Algorithm legend ── */}
            <AlgorithmLegend />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// PANEL: Load Volume
// ─────────────────────────────────────────────────────────────────
function LoadVolumePanel({ data }: { data: LoadForecastDTO | null }) {
    if (!data) return <EmptyPanel message="No load volume data available" />;

    const chartData = [
        ...[...(data.loadTrends || [])].reverse().map(t => ({
            name: t.period, actual: t.value, forecasted: undefined as number | undefined
        })),
        { name: 'Forecast ▶', actual: undefined as number | undefined, forecasted: data.forecastedVolume }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trend + forecast chart — full width on mobile, 2/3 on desktop */}
            <div className="lg:col-span-2">
                <ChartCard title="Load Volume Trend &amp; Forecast">
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="ldActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="ldForecast" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
                            <Legend iconType="circle" />
                            <Area type="monotone" dataKey="actual"    name="Actual"     stroke="#6366f1" strokeWidth={3} fill="url(#ldActual)"    connectNulls />
                            <Area type="monotone" dataKey="forecasted" name="Forecasted" stroke="#f59e0b" strokeWidth={3} strokeDasharray="6 3" fill="url(#ldForecast)" connectNulls />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Side info */}
            <div className="flex flex-col gap-4">
                <InfoCard title="⏰ Peak Period">
                    <InfoRow label="Peak Day"       value={data.peakDay} highlight />
                    <InfoRow label="Peak Hour"      value={data.peakHour} highlight />
                    <InfoRow label="Current Volume" value={data.currentVolume?.toFixed(0)} />
                    <InfoRow label="Next Forecast"  value={data.forecastedVolume?.toFixed(0)} highlight />
                    <InfoRow
                        label="MoM Growth"
                        value={`${data.growthPercentage?.toFixed(1)}%`}
                        positive={data.growthPercentage > 0}
                        negative={data.growthPercentage < 0}
                    />
                </InfoCard>
                <ConfidenceRing confidence={data.confidencePercentage} label="Forecast Confidence" color="#6366f1" />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// PANEL: Revenue
// ─────────────────────────────────────────────────────────────────
function RevenuePanel({ data }: { data: RevenueForecastDTO | null }) {
    if (!data) return <EmptyPanel message="No revenue forecast data available" />;

    const chartData = [
        ...[...(data.monthlyTrends || [])].reverse().map(t => ({
            name: t.period, revenue: t.value, change: t.change
        })),
        { name: 'Forecast ▶', revenue: data.forecastedRevenue, change: 0 }
    ];

    const changeOnly = chartData.filter(d => d.name !== 'Forecast ▶');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <ChartCard title="Monthly Revenue &amp; Forecast (₹)">
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={v => `₹${(Number(v) / 1000).toFixed(0)}k`} />
                            <Tooltip 
                                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                                formatter={(v: any) => [`₹${Number(v || 0).toLocaleString('en-IN')}`, 'Revenue']}
                            />
                            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} fill="url(#revGrad)" connectNulls />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="flex flex-col gap-4">
                <InfoCard title="💹 Revenue Forecast">
                    <InfoRow label="Current Revenue"    value={`₹${data.currentRevenue?.toLocaleString('en-IN')}`} />
                    <InfoRow label="Next Month Forecast" value={`₹${data.forecastedRevenue?.toLocaleString('en-IN')}`} highlight />
                    <InfoRow
                        label="MoM Growth"
                        value={`${data.growthPercentage?.toFixed(1)}%`}
                        positive={data.growthPercentage > 0}
                        negative={data.growthPercentage < 0}
                    />
                </InfoCard>
                <ConfidenceRing confidence={data.confidencePercentage} label="Revenue Confidence" color="#10b981" />
            </div>

            {/* MoM % change bars — full width */}
            <div className="lg:col-span-3">
                <ChartCard title="Month-over-Month Change (%)">
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={changeOnly}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                            <Tooltip 
                                contentStyle={{ borderRadius: 12 }}
                                formatter={(v: any) => [`${Number(v || 0).toFixed(1)}%`, 'Change']}
                            />
                            <Bar dataKey="change" radius={[4, 4, 0, 0]}>
                                {changeOnly.map((entry, i) => (
                                    <Cell key={i} fill={(entry.change ?? 0) >= 0 ? '#10b981' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// PANEL: Routes
// ─────────────────────────────────────────────────────────────────
function RoutesPanel({ data }: { data: RouteAnalyticsDTO | null }) {
    if (!data) return <EmptyPanel message="No route analytics data available" />;

    const seasonalData = Object.entries(data.seasonalDemand || {}).map(([k, v]) => ({ name: k, demand: v }));
    const cityData     = Object.entries(data.mostDemandedCities || {}).map(([k, v]) => ({ name: k, loads: v }));
    const routes = data.topRoutes || [];

    return (
        <div className="space-y-6">
            {/* Top Routes table — scrollable on mobile */}
            <ChartCard title="🏆 Top Routes by Demand Score">
                <div className="overflow-x-auto -mx-1">
                    <table className="w-full text-sm min-w-[480px]">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {['#', 'Route', 'Demand Score', 'Confidence'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {routes.slice(0, 8).map((r, i) => (
                                <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-4 py-3 font-bold text-slate-400">{i + 1}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-800">{r.label}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{ width: `${Math.min(100, r.predictedValue)}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }}
                                                />
                                            </div>
                                            <span className="font-bold text-indigo-600 min-w-[32px] text-right">
                                                {r.predictedValue?.toFixed(0)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
                                            {r.confidence?.toFixed(0)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {routes.length === 0 && (
                        <p className="text-center text-slate-400 py-8 text-sm">
                            No route data yet — add loads to see demand predictions.
                        </p>
                    )}
                </div>
            </ChartCard>

            {/* Charts side by side on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="📅 Seasonal Load Demand">
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={seasonalData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: 12 }} />
                            <Bar dataKey="demand" radius={[4, 4, 0, 0]}>
                                {seasonalData.map((_, i) => (
                                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="🏙️ Most Demanded Pickup Cities">
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={cityData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={84} />
                            <Tooltip contentStyle={{ borderRadius: 12 }} />
                            <Bar dataKey="loads" radius={[0, 4, 4, 0]}>
                                {cityData.map((_, i) => (
                                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// PANEL: Utilization
// ─────────────────────────────────────────────────────────────────
function UtilizationPanel({ data }: { data: UtilizationDTO | null }) {
    if (!data) return <EmptyPanel message="No utilization data available" />;

    const radialData = [
        { name: 'Active',  value: data.activeVehiclePercentage, fill: '#6366f1' },
        { name: 'Idle',    value: data.idleVehiclePercentage,   fill: '#e2e8f0' },
    ];
    const vehicleTypeData = Object.entries(data.utilizationByVehicleType || {}).map(([k, v]) => ({ name: k, utilization: v }));
    const weeklyData = [...(data.weeklyTrends || [])].reverse().map(t => ({ name: t.period, trips: t.value }));

    return (
        <div className="space-y-6">
            {/* Top row: 2 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Radial chart */}
                <ChartCard title="🚛 Fleet Utilization Rate">
                    <div className="flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={200}>
                            <RadialBarChart cx="50%" cy="50%" innerRadius={50} outerRadius={90} data={radialData} startAngle={180} endAngle={-180}>
                                <RadialBar dataKey="value" cornerRadius={4} />
                                <Tooltip />
                                <Legend />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="text-center -mt-2">
                            <div className="text-3xl font-black text-indigo-600">{data.overallUtilizationRate}%</div>
                            <div className="text-xs font-bold text-slate-500">Current Utilization</div>
                            <div className="text-sm font-bold text-violet-600 mt-0.5">
                                Predicted next period: {data.predictedUtilizationRate}%
                            </div>
                        </div>
                    </div>
                </ChartCard>

                {/* Delivery KPIs */}
                <InfoCard title="📊 Delivery Performance">
                    <ProbabilityBar label="Trip Completion Probability" value={data.tripCompletionProbability} color="#10b981" />
                    <ProbabilityBar label="Late Delivery Risk"          value={data.lateDeliveryProbability}   color="#ef4444" />
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                        <InfoRow label="Avg Trips / Vehicle"  value={data.averageTripsPerVehicle?.toFixed(1)} highlight />
                        <InfoRow label="Top Vehicle Type"     value={data.topPerformingVehicleType || '—'} />
                        <InfoRow label="Active %"             value={`${data.activeVehiclePercentage?.toFixed(1)}%`} />
                        <InfoRow label="Idle %"               value={`${data.idleVehiclePercentage?.toFixed(1)}%`} />
                    </div>
                </InfoCard>
            </div>

            {/* Bottom row: 2 charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="📋 Utilization by Vehicle Type">
                    {vehicleTypeData.length === 0
                        ? <EmptyPanel message="No vehicle data yet" />
                        : (
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={vehicleTypeData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                                    <Tooltip formatter={(v: any) => [`${Number(v || 0)}%`, 'Utilization']} contentStyle={{ borderRadius: 12 }} />
                                    <Bar dataKey="utilization" radius={[4, 4, 0, 0]}>
                                        {vehicleTypeData.map((_, i) => (
                                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )
                    }
                </ChartCard>

                <ChartCard title="📈 Weekly Trip Trend">
                    {weeklyData.length === 0
                        ? <EmptyPanel message="No trip data for last 8 weeks" />
                        : (
                            <ResponsiveContainer width="100%" height={240}>
                                <LineChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                    <Tooltip contentStyle={{ borderRadius: 12 }} />
                                    <Line type="monotone" dataKey="trips" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )
                    }
                </ChartCard>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// Algorithm legend
// ─────────────────────────────────────────────────────────────────
function AlgorithmLegend() {
    const algos = [
        { name: 'Weighted Moving Average',     desc: 'Recent months weighted higher for accuracy', icon: '📐' },
        { name: 'Historical Trend Analysis',   desc: 'Month-over-month growth rates extrapolated',  icon: '📊' },
        { name: 'Seasonal Pattern Detection',  desc: 'Monthly demand patterns from full history',   icon: '🌊' },
        { name: 'Confidence Scoring (60–100%)', desc: 'Based on data completeness — no estimates',  icon: '🎯' },
    ];
    return (
        <div className="rounded-2xl border border-slate-200 p-5" style={{ background: 'linear-gradient(135deg,#f8faff 0%,#faf5ff 100%)' }}>
            <h3 className="font-extrabold text-slate-800 text-sm mb-4">⚙️ Internal Prediction Algorithms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {algos.map(a => (
                    <div key={a.name} className="flex gap-3 p-3 bg-white rounded-xl border border-slate-100">
                        <span className="text-xl shrink-0">{a.icon}</span>
                        <div>
                            <div className="font-bold text-slate-800 text-xs">{a.name}</div>
                            <div className="text-slate-500 text-xs mt-0.5">{a.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// Reusable sub-components
// ─────────────────────────────────────────────────────────────────

function KPICard({ id, title, value, subtitle, confidence, gradient, icon }: {
    id: string; title: string; value: string; subtitle: string;
    confidence?: number; gradient: string; icon: string;
}) {
    return (
        <div id={id} className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg" style={{ background: gradient }}>
            <div className="absolute right-3 top-3 text-5xl opacity-10 pointer-events-none select-none">{icon}</div>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{title}</div>
            <div className="text-2xl font-black leading-tight mb-1">{value}</div>
            <div className="text-xs opacity-75 mb-3">{subtitle}</div>
            {confidence != null && (
                <>
                    <div className="flex justify-between text-[10px] opacity-80 mb-1">
                        <span>Confidence</span>
                        <span>{confidence.toFixed(0)}%</span>
                    </div>
                    <div className="h-1 bg-white/30 rounded-full">
                        <div className="h-full bg-white/80 rounded-full transition-all" style={{ width: `${Math.min(100, confidence)}%` }} />
                    </div>
                </>
            )}
        </div>
    );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-sm mb-4" dangerouslySetInnerHTML={{ __html: title }} />
            {children}
        </div>
    );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm h-full">
            <h3 className="font-extrabold text-slate-800 text-sm mb-4">{title}</h3>
            <div className="space-y-2.5">{children}</div>
        </div>
    );
}

function InfoRow({ label, value, highlight, positive, negative }: {
    label: string; value: string | number | undefined;
    highlight?: boolean; positive?: boolean; negative?: boolean;
}) {
    const color = positive ? 'text-emerald-600' : negative ? 'text-rose-600' : highlight ? 'text-indigo-600' : 'text-slate-800';
    return (
        <div className="flex justify-between items-center">
            <span className="text-slate-500 text-xs">{label}</span>
            <span className={`font-bold text-sm ${color}`}>{value ?? '—'}</span>
        </div>
    );
}

function ConfidenceRing({ confidence, label, color }: { confidence: number; label: string; color: string }) {
    const r = 38;
    const circ = 2 * Math.PI * r;
    const filled = circ * Math.min(100, confidence || 0) / 100;
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center gap-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</div>
            <div className="relative w-24 h-24">
                <svg width="96" height="96" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
                    <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="10"
                        strokeDasharray={`${filled} ${circ}`}
                        strokeLinecap="round"
                        transform="rotate(-90 48 48)"
                        style={{ transition: 'stroke-dasharray 0.8s ease' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-black text-lg" style={{ color }}>{confidence?.toFixed(0)}%</span>
                </div>
            </div>
        </div>
    );
}

function ProbabilityBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="mb-4">
            <div className="flex justify-between mb-1.5">
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-sm font-bold" style={{ color }}>{value?.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, value || 0)}%`, background: color }}
                />
            </div>
        </div>
    );
}

function EmptyPanel({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-14 text-slate-400">
            <span className="text-4xl mb-3">📭</span>
            <p className="font-semibold">{message}</p>
            <p className="text-sm mt-1 text-slate-300">Data will appear as platform activity grows.</p>
        </div>
    );
}

function SkeletonLoader() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-slate-200 rounded-xl" />
                    <div className="h-4 w-96 bg-slate-100 rounded-lg" />
                </div>
                <div className="h-10 w-40 bg-slate-200 rounded-xl" />
            </div>

            {/* KPI skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-36 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100" />
                ))}
            </div>

            {/* Tab skeleton */}
            <div className="h-12 bg-slate-100 rounded-2xl" />

            {/* Chart skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-72 bg-slate-100 rounded-2xl" />
                <div className="space-y-4">
                    <div className="h-44 bg-slate-100 rounded-2xl" />
                    <div className="h-24 bg-slate-100 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
