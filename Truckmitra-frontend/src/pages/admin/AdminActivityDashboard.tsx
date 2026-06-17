import React, { useState, useEffect } from 'react';
import { 
  HiOutlineCube, HiOutlineTruck, HiOutlineClipboardCheck,
  HiOutlineUserGroup, HiOutlineClock, HiSearch, HiRefresh,
  HiOutlineIdentification
} from 'react-icons/hi';
import adminActivityService, { AdminActivityStats, AuditLog, PageResponse } from '../../services/adminActivity.service';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: string | number, icon: any, colorClass: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
    <div>
      <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{value}</h3>
    </div>
    <div className={`p-4 rounded-2xl ${colorClass}`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
  </div>
);

const AdminActivityDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminActivityStats | null>(null);
  const [timeline, setTimeline] = useState<AuditLog[]>([]);
  const [tripsData, setTripsData] = useState<PageResponse<any> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, t, m] = await Promise.all([
        adminActivityService.getDashboardStats(),
        adminActivityService.getTimeline(30),
        adminActivityService.getTripsMaster(searchTerm, 0, 50)
      ]);
      setStats(s);
      setTimeline(t);
      setTripsData(m);
    } catch (e) {
      toast.error("Failed to load activity data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  if (loading && !stats) {
    return <div className="p-8 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Activity Monitoring</h2>
          <p className="text-slate-500 mt-2 font-medium">Real-time overview of all platform operations</p>
        </div>
        <button onClick={loadData} className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition flex items-center gap-2">
          <HiRefresh className="w-5 h-5" /> Refresh
        </button>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Loads" value={stats.totalLoads} icon={HiOutlineCube} colorClass="bg-blue-500" />
          <StatCard title="Total Trips" value={stats.totalTrips} icon={HiOutlineTruck} colorClass="bg-indigo-500" />
          <StatCard title="Active Trips" value={stats.activeTrips} icon={HiOutlineClock} colorClass="bg-emerald-500" />
          <StatCard title="Completed Trips" value={stats.completedTrips} icon={HiOutlineClipboardCheck} colorClass="bg-teal-500" />
          
          <StatCard title="Available Drivers" value={stats.availableDrivers} icon={HiOutlineIdentification} colorClass="bg-cyan-500" />
          <StatCard title="Drivers On Trip" value={stats.driversOnTrip} icon={HiOutlineTruck} colorClass="bg-amber-500" />
          <StatCard title="Pending PODs" value={stats.pendingPod} icon={HiOutlineClipboardCheck} colorClass="bg-rose-500" />
          <StatCard title="Approved Users" value={stats.approvedUsers} icon={HiOutlineUserGroup} colorClass="bg-violet-500" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Master Trips Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h3 className="text-xl font-bold text-slate-900">Trip Master Trace</h3>
              <form onSubmit={handleSearch} className="relative w-full md:w-96">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search trips, loads, names, vehicles..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white outline-none transition-all text-sm font-medium"
                />
              </form>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="pb-4 font-bold text-slate-500 text-sm">TRIP / LOAD</th>
                    <th className="pb-4 font-bold text-slate-500 text-sm">ROUTE</th>
                    <th className="pb-4 font-bold text-slate-500 text-sm">PARTICIPANTS</th>
                    <th className="pb-4 font-bold text-slate-500 text-sm">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(tripsData?.content || []).map((trip: any) => (
                    <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-slate-900">{trip.tripNumber}</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">Load ID: {trip.load?.id}</div>
                        <div className="text-xs text-slate-400 mt-1">{format(new Date(trip.createdAt), 'PP')}</div>
                      </td>
                      <td className="py-4">
                        <div className="font-bold text-slate-700">{trip.source}</div>
                        <div className="text-xs font-medium text-slate-400 my-1">↓</div>
                        <div className="font-bold text-slate-700">{trip.destination}</div>
                      </td>
                      <td className="py-4">
                        <div className="text-sm font-medium"><span className="text-slate-400 w-6 inline-block">S:</span> {trip.shipper?.firstName || 'Direct'}</div>
                        <div className="text-sm font-medium mt-1"><span className="text-slate-400 w-6 inline-block">T:</span> {trip.transporter?.companyName || trip.transporter?.firstName || 'N/A'}</div>
                        <div className="text-sm font-medium mt-1"><span className="text-slate-400 w-6 inline-block">D:</span> {trip.driver?.firstName || 'Unassigned'}</div>
                        <div className="text-xs font-semibold text-indigo-600 mt-1 px-2 py-0.5 bg-indigo-50 rounded-md inline-block">
                          {trip.vehicle?.vehicleNumber || 'No Vehicle'}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          trip.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                          trip.status === 'IN_TRANSIT' ? 'bg-amber-100 text-amber-700' :
                          trip.status === 'STARTED' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {trip.status.replace(/_/g, ' ')}
                        </span>
                        {trip.podUrl && (
                          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-teal-600">
                            <HiOutlineClipboardCheck className="w-4 h-4" /> POD Uploaded
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {tripsData?.content.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">No trips found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Audit Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 text-white h-[800px] flex flex-col">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-white">
              <HiOutlineClock className="text-indigo-400 w-6 h-6" /> Live Timeline
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              {(timeline || []).map((log) => (
                <div key={log.id} className="relative pl-6 pb-2 border-l-2 border-slate-700 last:border-0">
                  <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-slate-900" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 mb-1">
                      {format(new Date(log.timestamp), 'PPp')}
                    </span>
                    <span className="text-sm font-semibold text-slate-100 leading-relaxed">
                      {log.details}
                    </span>
                    <span className="inline-block mt-2 px-2 py-1 bg-slate-800 rounded-md text-[10px] font-black text-indigo-300 w-fit">
                      {log.action}
                    </span>
                  </div>
                </div>
              ))}
              {timeline.length === 0 && (
                <div className="text-center text-slate-500 mt-10">No recent activity</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminActivityDashboard;
