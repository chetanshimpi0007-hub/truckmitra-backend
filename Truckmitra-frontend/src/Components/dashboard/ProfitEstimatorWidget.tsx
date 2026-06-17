import React, { useEffect, useState } from 'react';
import { fuelProfitService } from '../../services/api/fuelProfit.service';
import { FuelProfitCalculationResponse } from '../../types/load';
import { HiCurrencyDollar, HiChartBar } from 'react-icons/hi';
import { FaGasPump } from 'react-icons/fa';
import GlassCard from '../ui/GlassCard';

interface ProfitEstimatorWidgetProps {
  loadId?: number;
  tripId?: number;
}

export const ProfitEstimatorWidget: React.FC<ProfitEstimatorWidgetProps> = ({ loadId, tripId }) => {
  const [data, setData] = useState<FuelProfitCalculationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loadId && !tripId) return;
    
    const fetchEstimate = async () => {
      try {
        setLoading(true);
        let res;
        if (loadId) {
          res = await fuelProfitService.getLoadProfitEstimate(loadId);
        } else if (tripId) {
          res = await fuelProfitService.getTripProfitEstimate(tripId);
        }
        if (res && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch profit estimate', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEstimate();
  }, [loadId, tripId]);

  if (loading) {
    return (
      <GlassCard className="animate-pulse">
        <div className="h-6 w-1/3 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 rounded"></div>
          <div className="h-10 bg-slate-100 rounded"></div>
        </div>
      </GlassCard>
    );
  }

  if (!data) return null;

  const classificationConfig = {
    GOOD: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Highly Profitable' },
    MEDIUM: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Average Profit' },
    LOW: { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', label: 'Low Margin' }
  };

  const config = classificationConfig[data.profitClassification] || classificationConfig.MEDIUM;

  return (
    <GlassCard>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center">
          <HiChartBar className="w-5 h-5 mr-2 text-indigo-500" />
          Smart Profit Estimator
        </h3>
        <span className={`px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-full border ${config.bg} ${config.color} ${config.border}`}>
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center">
            <FaGasPump className="w-3 h-3 mr-1" /> Fuel Cost
          </div>
          <div className="text-xl font-black text-slate-900">₹{data.estimatedFuelCost?.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            {data.estimatedFuelConsumption}L @ ₹{data.dieselRate}/L
          </div>
        </div>
        
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center">
            <HiCurrencyDollar className="w-4 h-4 mr-0.5" /> Est. Profit
          </div>
          <div className={`text-xl font-black ${data.estimatedProfit > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            ₹{data.estimatedProfit?.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Dist: {data.distanceKm} km
          </div>
        </div>
      </div>
      
      <p className="text-[10px] text-slate-400 text-center italic">
        *Based on average vehicle mileage of {data.averageMileage} km/l.
      </p>
    </GlassCard>
  );
};
