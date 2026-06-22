import React, { useState, useEffect } from 'react';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
import GlassCard from '../ui/GlassCard';
import { HiTrendingUp, HiTruck, HiExclamationCircle, HiCheckCircle } from 'react-icons/hi';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

export const PredictiveInsightsWidget: React.FC = () => {
    const [utilization, setUtilization] = useState<any>(null);
    const [revenue, setRevenue] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPredictiveData = async () => {
            try {
                const [utilRes, revRes] = await Promise.all([
                    protectedApi.get('/api/analytics/predictive/utilization'),
                    protectedApi.get('/api/analytics/predictive/revenue')
                ]);
                setUtilization(utilRes.data);
                setRevenue(revRes.data);
            } catch (err) {
                console.error("Failed to fetch predictive insights", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPredictiveData();
    }, []);

    if (loading) {
        return (
            <GlassCard className="animate-pulse flex items-center justify-center h-48">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </GlassCard>
        );
    }

    if (!utilization && !revenue) return null;

    const radialData = [
        { name: 'Active', value: utilization?.activeVehiclePercentage || 0, fill: '#6366f1' },
        { name: 'Idle', value: utilization?.idleVehiclePercentage || 0, fill: '#e2e8f0' }
    ];

    return (
        <GlassCard>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                <span className="text-xl mr-2">🔮</span> AI Predictive Insights
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue Forecast Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                            <HiTrendingUp className="w-5 h-5" />
                        </div>
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${revenue?.growthPercentage >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {revenue?.growthPercentage >= 0 ? '↑' : '↓'} {Math.abs(revenue?.growthPercentage || 0).toFixed(1)}% Growth
                        </span>
                    </div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Next Month Forecast</div>
                    <div className="text-3xl font-black text-slate-900 mb-2">₹{(revenue?.forecastedRevenue || 0).toLocaleString('en-IN')}</div>
                    <div className="text-xs font-semibold text-slate-500">
                        Confidence Score: <span className="text-emerald-600">{revenue?.confidencePercentage || 0}%</span>
                    </div>
                </div>

                {/* Utilization Summary Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-100 flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm mb-4">
                            <HiTruck className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Fleet Utilization</div>
                        <div className="text-3xl font-black text-slate-900 mb-2">{(utilization?.predictedUtilizationRate || 0)}%</div>
                        <div className="text-xs font-semibold text-slate-500">
                            Predicted active rate next week
                        </div>
                    </div>
                    <div className="w-24 h-24 flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius={30} outerRadius={50} data={radialData} startAngle={180} endAngle={-180}>
                                <RadialBar dataKey="value" cornerRadius={4} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-sm font-semibold text-slate-600">
                    <HiCheckCircle className="text-emerald-500 w-5 h-5" />
                    <span>Est. Trip Completion: {utilization?.tripCompletionProbability || 0}%</span>
                </div>
                <div className="flex items-center space-x-2 text-sm font-semibold text-slate-600">
                    <HiExclamationCircle className="text-amber-500 w-5 h-5" />
                    <span>Late Delivery Risk: {utilization?.lateDeliveryProbability || 0}%</span>
                </div>
            </div>
        </GlassCard>
    );
};
