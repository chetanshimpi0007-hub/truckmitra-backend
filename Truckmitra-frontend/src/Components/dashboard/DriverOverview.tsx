import React from 'react';
import { HiTruck, HiCurrencyDollar, HiCheckCircle, HiClock, HiLocationMarker, HiMap, HiChevronRight, HiDownload, HiDocumentText } from 'react-icons/hi';
import StatWidget from '../ui/StatWidget';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { ReturnLoadSuggestionsWidget } from '../loads/ReturnLoadSuggestionsWidget';

interface DriverOverviewProps {
  trips: any[];
  activeTrip: any;
  completedTrips: any[];
  totalEarnings: number;
  setActiveMenu: (menu: any) => void;
  downloadAssignmentPdf: (id: number) => void;
  downloadFinalInvoice: (id: number) => void;
}

const DriverOverview: React.FC<DriverOverviewProps> = ({
  trips, activeTrip, completedTrips, totalEarnings, setActiveMenu, downloadAssignmentPdf, downloadFinalInvoice
}) => {
  return (
    <div className="space-y-6">
      
      {/* 1. MOBILE FIRST STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatWidget 
          title="Assigned Trips" 
          value={trips.filter(t => t.status === 'ASSIGNED').length} 
          icon={<HiTruck className="w-6 h-6 md:w-8 md:h-8" />} 
          color="primary" 
        />
        <StatWidget 
          title="Active Trip" 
          value={activeTrip ? 1 : 0} 
          icon={<HiClock className="w-6 h-6 md:w-8 md:h-8" />} 
          color="warning" 
        />
        <StatWidget 
          title="Completed Trips" 
          value={completedTrips.length} 
          icon={<HiCheckCircle className="w-6 h-6 md:w-8 md:h-8" />} 
          color="success" 
        />
        <StatWidget 
          title="Total Earned" 
          value={totalEarnings} 
          prefix="₹" 
          icon={<HiCurrencyDollar className="w-6 h-6 md:w-8 md:h-8" />} 
          color="accent" 
        />
      </div>

      {/* 2. ACTIVE TRIP WIDGET (Mobile friendly) */}
      {activeTrip && !['COMPLETED', 'CANCELLED'].includes(activeTrip.status) && (
        <GlassCard className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-none !p-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  Current Assignment
                </span>
                <span className="text-slate-400 text-sm font-medium">Trip #{activeTrip.id}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                {activeTrip.load?.source?.split(',')[0]} 
                <span className="text-slate-500 mx-2">→</span> 
                {activeTrip.load?.destination?.split(',')[0]}
              </h2>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-slate-800 text-slate-300 border border-slate-700`}>
                  {activeTrip.status?.replace(/_/g, ' ')}
                </span>
                {activeTrip.distance && (
                  <span className="text-slate-400 text-sm flex items-center">
                    <HiLocationMarker className="mr-1" /> {activeTrip.distance?.toFixed(0)} km
                  </span>
                )}
                <span className="text-emerald-400 font-bold text-sm">₹{activeTrip.driverAmount || activeTrip.freightAmount || activeTrip.load?.budget}</span>
              </div>
            </div>
            
            <Button 
              onClick={() => setActiveMenu('driver-management')}
              variant="success"
              size="lg"
              className="w-full md:w-auto shrink-0 shadow-emerald-500/30 font-black tracking-wide"
              rightIcon={<HiChevronRight />}
            >
              Manage Trip
            </Button>
          </div>
        </GlassCard>
      )}

      {/* 3. TRIP HISTORY TABLE */}
      <GlassCard noPadding className="overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <HiMap className="mr-2 text-brand" /> Trip History
          </h3>
        </div>
        
        {trips.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <HiTruck className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">No trips assigned yet</h4>
            <p className="text-slate-500 mt-2 max-w-sm">When your transporter assigns you a load, it will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-400 uppercase text-[10px] font-black tracking-wider">
                <tr>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4 hidden md:table-cell">Material</th>
                  <th className="px-6 py-4">Freight</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {trips.map((t: any) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white truncate max-w-[150px] md:max-w-none">
                        {t.load?.source?.split(',')[0]}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[150px] md:max-w-none">
                        → {t.load?.destination?.split(',')[0]}
                      </div>
                      {/* Mobile only status badge */}
                      <div className="mt-2 sm:hidden">
                        <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {t.status?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell font-medium">
                      {t.load?.materialType || '–'}
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-600 dark:text-emerald-400">
                      ₹{t.driverAmount || t.freightAmount || t.load?.budget}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {t.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      {t.assignmentPdfUrl && (
                        <button onClick={() => downloadAssignmentPdf(t.id)}
                          className="p-2 inline-flex hover:bg-brand/10 rounded-xl transition text-slate-400 hover:text-brand"
                          title="Download Assignment">
                          <HiDocumentText className="w-5 h-5" />
                        </button>
                      )}
                      {t.status === 'COMPLETED' && (
                        <button onClick={() => downloadFinalInvoice(t.id)}
                          className="p-2 inline-flex hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                          title="Download Final Invoice">
                          <HiDownload className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* 4. RETURN LOAD SUGGESTIONS */}
      {completedTrips && completedTrips.length > 0 && (
        <div className="mt-8">
          <ReturnLoadSuggestionsWidget 
            completedTripId={completedTrips[0].id} 
            deliveryCity={completedTrips[0].load?.destination?.split(',')[0]} 
          />
        </div>
      )}
    </div>
  );
};

export default DriverOverview;
