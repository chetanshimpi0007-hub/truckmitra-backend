import React, { useEffect, useState } from 'react';
import { HiUser, HiLocationMarker, HiTruck } from 'react-icons/hi';
import { driverAvailabilityService } from '../../services/api/driverAvailability.service';
import { DriverAvailabilitySummaryResponse } from '../../types/load';
import GlassCard from '../ui/GlassCard';

export const LiveDriverAvailabilityWidget: React.FC = () => {
  const [summary, setSummary] = useState<DriverAvailabilitySummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await driverAvailabilityService.getAvailabilitySummary();
        setSummary(res.data);
      } catch (error) {
        console.error('Failed to fetch driver availability summary', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
    
    // Auto refresh every 2 minutes
    const interval = setInterval(fetchSummary, 120000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <GlassCard className="h-full flex items-center justify-center min-h-[200px]">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </GlassCard>
    );
  }

  if (!summary) {
    return (
      <GlassCard className="h-full">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Driver Availability Board</h3>
        <div className="text-center py-8 text-slate-500">Failed to load data</div>
      </GlassCard>
    );
  }

  const total = (summary.availableDriversCount || 0) + (summary.onTripDriversCount || 0) + (summary.offlineDriversCount || 0);

  return (
    <GlassCard className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">Live Driver Availability</h3>
        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">{total} Total Drivers</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
          <div className="text-2xl font-black text-emerald-600">{summary.availableDriversCount || 0}</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 mt-1">Available</div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
          <div className="text-2xl font-black text-blue-600">{summary.onTripDriversCount || 0}</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-blue-500 mt-1">On Trip</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
          <div className="text-2xl font-black text-slate-600">{summary.offlineDriversCount || 0}</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">Offline</div>
        </div>
      </div>

      {summary.cityWiseAvailableDrivers && Object.keys(summary.cityWiseAvailableDrivers).length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Available by City</h4>
          <div className="space-y-2">
            {Object.entries(summary.cityWiseAvailableDrivers).map(([city, count]) => (
              <div key={city} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center text-sm font-medium text-slate-700">
                  <HiLocationMarker className="w-4 h-4 text-emerald-500 mr-2" />
                  {city}
                </div>
                <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                  {count as number} Driver{(count as number) !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
};
