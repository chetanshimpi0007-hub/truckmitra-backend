import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { useProfile } from '../../hooks/useProfile';
import { 
  HiChartBar, 
  HiTruck, 
  HiShoppingCart, 
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiLogout,
  HiSearch,
  HiEye,
  HiChevronRight,
  HiLocationMarker,
  HiCalendar,
  HiTag,
  HiPlus,
  HiUserAdd,
  HiRefresh,
  HiStar,
  HiUsers,
  HiBadgeCheck,
  HiDocumentText,
  HiDownload,
  HiDocumentDownload,
  HiCash} from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
import LiveMap from '../../Components/common/LiveMap';
import NotificationDropdown from '../../Components/common/NotificationDropdown';
import BillingDashboard from '../billing/BillingDashboard';
import ChatWidget from '../../Components/common/ChatWidget';
import ProfileHeader from '../../Components/dashboard/ProfileHeader';
import { EmptyState } from '../../Components/illustrations/EmptyState';

/* ── Types ─────────────────────────────────────────────────────────────────── */
interface BidDto {
  id: number;
  amount: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  comment?: string;
  vehicleType?: string;
  estimatedDeliveryDays?: number;
  createdAt?: string;
  transporterId?: number;
  transporterName?: string;
  agencyName?: string;
  averageRating?: number;
  totalRatings?: number;
  totalDrivers?: number;
  fleetSize?: number;
  mobile?: string;
  city?: string;
  profileImageUrl?: string;
}

interface LoadRow {
  id: number;
  materialType: string;
  source: string;
  destination: string;
  weight: number;
  budget: number;
  status: string;
  pickupDate?: string;
  bidCount?: number;
}

const ShipperDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { shipperProfile } = useProfile();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<'overview' | 'add-transporter' | 'bids' | 'tracking' | 'billing'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transporterSearch, setTransporterSearch] = useState('');
  const [transporters, setTransporters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loads, setLoads] = useState<LoadRow[]>([]);
  const [selectedLoad, setSelectedLoad] = useState<LoadRow | null>(null);
  const [loadBids, setLoadBids] = useState<BidDto[]>([]);
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [activeTrips, setActiveTrips] = useState<any[]>([]);
  const [completedTrips, setCompletedTrips] = useState<any[]>([]);
  const [chatRecipient, setChatRecipient] = useState<{id: number, fullName: string} | null>(null);
  const [acceptingBidId, setAcceptingBidId] = useState<number | null>(null);

  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [documentTrip, setDocumentTrip] = useState<any>(null);
  const [documentLoading, setDocumentLoading] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  const [bidForm, setBidForm] = useState({
    itemNames: '',
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    weight: '',
    budget: '',
    notes: '',
    truckTypes: [] as string[],
    isBiddingEnabled: true
  });

  useEffect(() => {
    if (user && user.role !== 'SHIPPER') navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => { 
    fetchLoads(); 
    fetchShipperTrips();
  }, []);

  /* ── Data fetch ──────────────────────────────────────────────────────────── */
  const fetchShipperTrips = async () => {
    try {
      const response = await protectedApi.get('/api/trips/shipper');
      const allTrips = response.data || [];
      const completed = allTrips.filter((t: any) => t.status === 'COMPLETED' || t.status === 'DELIVERED');
      setCompletedTrips(completed);
    } catch { /* silent */ }
  };

  const fetchLoads = async () => {
    try {
      const response = await protectedApi.get('/api/loads/shipper');
      const rawLoads: any[] = response.data || [];

      // Fetch bid counts for all loads in parallel
      const loadsWithCounts = await Promise.all(
        rawLoads.map(async (load: any) => {
          try {
            const countRes = await protectedApi.get(`/api/bids/load/${load.id}/count`);
            return { ...load, bidCount: Number(countRes.data?.data ?? 0) };
          } catch {
            return { ...load, bidCount: 0 };
          }
        })
      );
      setLoads(loadsWithCounts);
    } catch {
      // silent
    }
  };

  const fetchActiveTrips = async () => {
    try {
      const response = await protectedApi.get('/api/tracking/shipper/active');
      setActiveTrips(response.data || []);
    } catch { /* silent */ }
  };

  useEffect(() => {
    if (activeMenu === 'tracking') {
      fetchActiveTrips();
      const interval = setInterval(fetchActiveTrips, 10000);
      return () => clearInterval(interval);
    }
  }, [activeMenu]);

  const fetchDocumentsForLoad = async (load: LoadRow) => {
    setSelectedLoad(load);
    setShowDocumentsModal(true);
    setDocumentLoading(true);
    setDocumentTrip(null);
    try {
      const response = await protectedApi.get(`/api/trips/load/${load.id}`);
      setDocumentTrip(response.data);
    } catch {
      toast.error('Failed to fetch trip documents. Trip may not be fully initialized.');
    } finally {
      setDocumentLoading(false);
    }
  };

  const handleDownloadLr = async (tripId: number) => {
    try {
      const response = await protectedApi.get(`/api/lr/trip/${tripId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `LR_Trip_${tripId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch {
      toast.error('Failed to download LR');
    }
  };

  const handleDownloadInvoice = async (tripId: number) => {
    try {
      const response = await protectedApi.get(`/api/trips/${tripId}/final-invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_Trip_${tripId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch {
      toast.error('Failed to download Invoice');
    }
  };

  const fetchBidsForLoad = async (load: LoadRow) => {
    setSelectedLoad(load);
    setShowBidsModal(true);
    setBidsLoading(true);
    setLoadBids([]);
    try {
      const response = await protectedApi.get(`/api/bids/load/${load.id}`);
      const bids: BidDto[] = response.data?.data || [];
      // Sort: PENDING first, then by amount ASC
      bids.sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        return a.amount - b.amount;
      });
      setLoadBids(bids);
    } catch {
      toast.error('Failed to fetch bids');
    } finally {
      setBidsLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: number) => {
    setAcceptingBidId(bidId);
    try {
      await protectedApi.put(`/api/bids/${bidId}/accept`);
      toast.success('✅ Bid accepted! Transporter assigned to load.');
      setShowBidsModal(false);
      setSelectedLoad(null);
      fetchLoads();
    } catch {
      toast.error('Failed to accept bid');
    } finally {
      setAcceptingBidId(null);
    }
  };

  const handleRejectBid = async (bidId: number) => {
    try {
      await protectedApi.put(`/api/bids/${bidId}/reject`);
      toast.success('Bid rejected.');
      if (selectedLoad) await fetchBidsForLoad(selectedLoad);
    } catch {
      toast.error('Failed to reject bid');
    }
  };

  const handleTransporterSearch = async () => {
    if (!transporterSearch) return;
    setLoading(true);
    try {
      const response = await protectedApi.get(`/api/search/transporters?query=${transporterSearch}`);
      setTransporters(response.data || []);
      if ((response.data || []).length === 0) toast.error('No transporters found');
    } catch {
      toast.error('Error searching transporters');
    } finally {
      setLoading(false);
    }
  };

  const handlePostBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidForm.itemNames.trim())   { toast.error('Item / Material name is required'); return; }
    if (!bidForm.source.trim())      { toast.error('Source location is required');      return; }
    if (!bidForm.destination.trim()) { toast.error('Destination location is required'); return; }
    if (!bidForm.startDate)          { toast.error('Start date is required');           return; }
    if (!bidForm.startTime)          { toast.error('Start time is required');           return; }
    if (!bidForm.weight)             { toast.error('Weight is required');               return; }
    if (!bidForm.budget)             { toast.error('Budget is required');               return; }

    setLoading(true);
    try {
      const pickupDate = `${bidForm.startDate}T${bidForm.startTime}`;
      const loadData = {
        materialType:     bidForm.itemNames.trim(),
        source:           bidForm.source.trim(),
        destination:      bidForm.destination.trim(),
        pickupDate,
        weight:           parseFloat(bidForm.weight)  || 0,
        budget:           parseFloat(bidForm.budget)  || 0,
        isBiddingEnabled: bidForm.isBiddingEnabled};
      await protectedApi.post('/api/loads', loadData);
      toast.success('Load posted! Transporters are being notified.');
      setBidForm({ itemNames:'', source:'', destination:'', startDate:'', endDate:'',
                   startTime:'', endTime:'', weight:'', budget:'', notes: '', truckTypes: [], isBiddingEnabled: true });
      fetchLoads();
      setActiveMenu('overview');
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to post load.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Derived stats ───────────────────────────────────────────────────────── */
  const totalBids    = loads.reduce((s, l) => s + (l.bidCount ?? 0), 0);

  const activeLoads = loads.filter(l => !['COMPLETED', 'DELIVERED', 'CANCELLED', 'REJECTED'].includes(l.status)).length;
  const totalSpend = completedTrips.reduce((s, t) => s + (t.shipperAmount || t.freightAmount || 0), 0);

  /* ── Sub-components ─────────────────────────────────────────────────────── */
  const Sidebar = () => (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 w-[80vw] sm:w-80 lg:w-64 bg-slate-50 min-h-screen text-slate-600 flex flex-col border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <div className="p-8 border-b border-slate-200 bg-white flex justify-between items-center">
          <div className="flex items-center justify-center">
            <img src="/logo-transparent.png" alt="TruckMitra" className="w-[180px] h-auto object-contain" />
          </div>
          <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}>
            <HiXCircle className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          <SidebarLink icon={<HiChartBar />}       label="Overview"          active={activeMenu === 'overview'}        onClick={() => { setActiveMenu('overview'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={<HiLocationMarker />} label="Live Tracking"     active={activeMenu === 'tracking'}        onClick={() => { setActiveMenu('tracking'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={<HiUserAdd />}        label="Add Transporter"   active={activeMenu === 'add-transporter'} onClick={() => { setActiveMenu('add-transporter'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={<HiTag />}            label="Post New Load"     active={activeMenu === 'bids'}            onClick={() => { setActiveMenu('bids'); setIsSidebarOpen(false); }} />
          <SidebarLink icon={<HiCash />}           label="Billing & Invoices" active={activeMenu === 'billing'}        onClick={() => { setActiveMenu('billing'); setIsSidebarOpen(false); }} />
        </nav>
        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
          <button onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center w-full px-4 py-3 text-sm font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
            <HiLogout className="w-5 h-5 mr-3" /> Sign Out
          </button>
        </div>
      </div>
    </>
  );

  const SidebarLink = ({ icon, label, active, onClick }: any) => (
    <button onClick={onClick}
      className={`flex items-center w-full px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 ${
        active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'hover:bg-slate-100/80 hover:text-slate-900 text-slate-600'
      }`}>
      <span className={`text-xl mr-3 ${active ? 'text-white' : 'text-slate-400'}`}>{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full">
        {/* Header */}
        <ProfileHeader
          user={shipperProfile || user}
          roleBadgeText="Verified Shipper"
          roleBadgeClasses="bg-indigo-50 text-indigo-600 border-indigo-100"
          welcomeMessage={`Welcome back, ${user?.fullName?.split(' ')[0] || 'Shipper'}`}
          onMenuToggle={() => setIsSidebarOpen(true)}
          stats={[
            { label: 'Active Loads', value: activeLoads, icon: <HiTruck /> },
            { label: 'Completed', value: completedTrips.length, icon: <HiCheckCircle /> },
            { label: 'Total Bids', value: totalBids, icon: <HiTag /> },
            { label: 'Total Spend', value: `₹${totalSpend.toLocaleString('en-IN')}`, icon: <HiShoppingCart /> }
          ]}
        >
          <NotificationDropdown />
          <button onClick={fetchLoads} className="p-2 text-slate-400 hover:text-indigo-500 transition rounded-xl hover:bg-indigo-50">
            <HiRefresh className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </ProfileHeader>

        <div className="p-10">

          {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
          {activeMenu === 'overview' && (
            <div className="animate-fadeIn space-y-10">

              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Active Loads"   value={activeLoads}  icon={<HiTruck />}       color="bg-indigo-600" />
                <StatCard label="Completed Loads" value={completedTrips.length} icon={<HiCheckCircle />}  color="bg-emerald-500" />
                <StatCard label="Total Spend (₹)"  value={totalSpend.toLocaleString('en-IN')}     icon={<HiShoppingCart />}           color="bg-amber-500" />
                <StatCard label="Total Bids In"  value={totalBids}     icon={<HiTag />}           color="bg-violet-600" />
              </div>

              {/* Load Table */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm border-b-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black">Recent Load Status</h3>
                    <p className="text-slate-400 text-sm mt-1">Click "View Bids" to review and accept transporter offers</p>
                  </div>
                  <button onClick={fetchLoads} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <HiRefresh className="w-6 h-6" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <th className="px-6 py-4 rounded-l-2xl">Item & Weight</th>
                        <th className="px-6 py-4">Route</th>
                        <th className="px-6 py-4">Budget</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right rounded-r-2xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {loads.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center space-y-3">
                            <EmptyState type="loads" className="w-32 h-32 mx-auto" />
                            <p className="text-slate-400 font-bold">No loads posted yet.</p>
                            <button onClick={() => setActiveMenu('bids')}
                              className="px-6 py-2 bg-indigo-600 text-white text-sm rounded-xl font-bold hover:bg-indigo-700 transition">
                              + Post Your First Load
                            </button>
                          </div>
                        </td></tr>
                      ) : loads.map(load => (
                        <tr key={load.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-sm text-slate-900">{load.materialType}</div>
                            <div className="text-[10px] text-slate-400 font-black uppercase">{load.weight} Tons</div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-600">
                            {load.source} <HiChevronRight className="inline mx-1" /> {load.destination}
                          </td>
                          <td className="px-6 py-4 font-black text-indigo-600 text-sm">₹{load.budget}</td>
                          <td className="px-6 py-4">
                            <StatusPill status={load.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end space-x-2">
                              {['ASSIGNED', 'IN_TRANSIT', 'COMPLETED', 'DELIVERED'].includes(load.status) ? (
                                <button
                                  onClick={() => fetchDocumentsForLoad(load)}
                                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-black text-sm transition-all bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                                >
                                  <HiDocumentText className="w-4 h-4" />
                                  <span>Documents</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => fetchBidsForLoad(load)}
                                  className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-black text-sm transition-all ${
                                    (load.bidCount ?? 0) > 0
                                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  <HiEye className="w-4 h-4" />
                                  <span>
                                    {(load.bidCount ?? 0) > 0
                                      ? `View Bids (${load.bidCount})`
                                      : 'No Bids Yet'}
                                  </span>
                                  {(load.bidCount ?? 0) > 0 && (
                                    <span className="bg-white text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">
                                      {load.bidCount}
                                    </span>
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Completed History Table */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm border-b-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black">Completed Delivery History</h3>
                    <p className="text-slate-400 text-sm mt-1">Review your successfully delivered loads</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <th className="px-6 py-4 rounded-l-2xl">Trip No.</th>
                        <th className="px-6 py-4">Transporter</th>
                        <th className="px-6 py-4">Driver</th>
                        <th className="px-6 py-4">Final Amount</th>
                        <th className="px-6 py-4">Delivery Date</th>
                        <th className="px-6 py-4">POD Status</th>
                        <th className="px-6 py-4 rounded-r-2xl">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {completedTrips.length === 0 ? (
                        <tr><td colSpan={7} className="px-6 py-10 text-center text-slate-500 font-bold">No completed trips yet.</td></tr>
                      ) : completedTrips.map(trip => (
                        <tr key={trip.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-4 font-black text-slate-900 text-sm">{trip.tripNumber}</td>
                          <td className="px-6 py-4 font-medium text-slate-700 text-sm">{trip.transporter?.companyName || trip.transporter?.fullName || 'N/A'}</td>
                          <td className="px-6 py-4 font-medium text-slate-700 text-sm">{trip.driver?.fullName || 'N/A'}</td>
                          <td className="px-6 py-4 font-black text-indigo-600 text-sm">₹{trip.shipperAmount || trip.freightAmount}</td>
                          <td className="px-6 py-4 font-medium text-slate-500 text-sm">
                            {trip.completedAt ? new Date(trip.completedAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            {trip.podUrl ? (
                              <a href={trip.podUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">View POD</a>
                            ) : <span className="text-slate-400 font-medium text-sm">Pending</span>}
                          </td>
                          <td className="px-6 py-4"><StatusPill status={trip.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── BIDS MODAL ────────────────────────────────────────────────── */}
              {showBidsModal && selectedLoad && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
                    onClick={() => { setShowBidsModal(false); setSelectedLoad(null); }} />
                  <div className="relative bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[32px] shadow-2xl">

                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white z-10 px-10 pt-10 pb-6 border-b border-slate-100 rounded-t-[32px]">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                              Load #{selectedLoad.id}
                            </span>
                            <StatusPill status={selectedLoad.status} />
                          </div>
                          <h2 className="text-2xl font-black text-slate-900">
                            {selectedLoad.materialType}
                          </h2>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500 font-medium">
                            <span className="flex items-center"><HiLocationMarker className="mr-1 text-indigo-400" />{selectedLoad.source} → {selectedLoad.destination}</span>
                            <span className="flex items-center"><HiTruck className="mr-1 text-amber-400" />{selectedLoad.weight} Tons</span>
                            <span className="flex items-center font-black text-indigo-600">Budget: ₹{selectedLoad.budget}</span>
                          </div>
                        </div>
                        <button onClick={() => { setShowBidsModal(false); setSelectedLoad(null); }}
                          className="p-3 hover:bg-slate-100 rounded-2xl transition-colors flex-shrink-0">
                          <HiXCircle className="w-8 h-8 text-slate-400" />
                        </button>
                      </div>

                      {/* Bid summary pills */}
                      {!bidsLoading && loadBids.length > 0 && (
                        <div className="flex items-center space-x-3 mt-4">
                          <span className="px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-amber-100">
                            {loadBids.filter(b => b.status === 'PENDING').length} Pending
                          </span>
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-100">
                            {loadBids.filter(b => b.status === 'ACCEPTED').length} Accepted
                          </span>
                          <span className="px-3 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-rose-100">
                            {loadBids.filter(b => b.status === 'REJECTED').length} Rejected
                          </span>
                          <span className="text-slate-400 text-xs font-bold ml-2">Sorted: Lowest bid first</span>
                        </div>
                      )}
                    </div>

                    {/* Modal Body */}
                    <div className="p-10">
                      {bidsLoading ? (
                        <div className="flex items-center justify-center py-20">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                            <p className="text-slate-400 font-bold">Loading bids...</p>
                          </div>
                        </div>
                      ) : loadBids.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl">
                          <HiClock className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-slate-400">No bids yet</h3>
                          <p className="text-slate-400 mt-1">Transporters will see your load in the marketplace.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {loadBids.map((bid, index) => (
                            <BidCard
                              key={bid.id}
                              bid={bid}
                              rank={index + 1}
                              isLowest={index === 0 && bid.status === 'PENDING'}
                              onAccept={() => handleAcceptBid(bid.id)}
                              onReject={() => handleRejectBid(bid.id)}
                              onChat={() => bid.transporterId && setChatRecipient({ id: bid.transporterId, fullName: bid.transporterName || 'Transporter' })}
                              accepting={acceptingBidId === bid.id}
                              loadAccepted={selectedLoad.status === 'ASSIGNED'}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── DOCUMENTS MODAL ────────────────────────────────────────────── */}
          {showDocumentsModal && selectedLoad && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
                onClick={() => { setShowDocumentsModal(false); setSelectedLoad(null); }} />
              <div className="relative bg-white w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden">
                <div className="px-10 pt-10 pb-6 border-b border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          Trip Documents
                        </span>
                        <StatusPill status={selectedLoad.status} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900">
                        Load #{selectedLoad.id} • {selectedLoad.materialType}
                      </h2>
                    </div>
                    <button onClick={() => { setShowDocumentsModal(false); setSelectedLoad(null); }}
                      className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                      <HiXCircle className="w-8 h-8 text-slate-400" />
                    </button>
                  </div>
                </div>
                
                <div className="p-10 bg-slate-50/50">
                  {documentLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                  ) : !documentTrip ? (
                    <div className="text-center py-10 text-slate-500 font-medium">
                      Could not load trip documents.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Lorry Receipt */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                          <HiDocumentText className="w-8 h-8" />
                        </div>
                        <h4 className="font-black text-slate-900 mb-1">Lorry Receipt (LR)</h4>
                        <p className="text-xs text-slate-500 font-medium mb-6">Generated on assignment</p>
                        <div className="flex w-full space-x-2 mt-auto">
                          <button onClick={() => window.open(`/api/lr/trip/${documentTrip.id}/pdf`, '_blank')}
                            className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition">
                            View
                          </button>
                          <button onClick={() => handleDownloadLr(documentTrip.id)}
                            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 transition flex items-center justify-center space-x-1">
                            <HiDownload className="w-4 h-4" /> <span>DL</span>
                          </button>
                        </div>
                      </div>

                      {/* Proof of Delivery */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                          <HiDocumentDownload className="w-8 h-8" />
                        </div>
                        <h4 className="font-black text-slate-900 mb-1">Proof of Delivery</h4>
                        <p className="text-xs text-slate-500 font-medium mb-6">Uploaded by driver</p>
                        {documentTrip.podUrl ? (
                          <div className="flex w-full space-x-2 mt-auto">
                            <button onClick={() => window.open(documentTrip.podUrl, '_blank')}
                              className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition">
                              View
                            </button>
                          </div>
                        ) : (
                          <div className="mt-auto py-2.5 w-full bg-slate-50 text-slate-400 rounded-xl font-bold text-sm border border-slate-100">
                            Not Available Yet
                          </div>
                        )}
                      </div>

                      {/* Invoice */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-violet-50 text-violet-500 rounded-2xl flex items-center justify-center mb-4">
                          <HiDocumentText className="w-8 h-8" />
                        </div>
                        <h4 className="font-black text-slate-900 mb-1">Final Invoice</h4>
                        <p className="text-xs text-slate-500 font-medium mb-6">Available after completion</p>
                        {documentTrip.finalInvoicePdfUrl || documentTrip.status === 'COMPLETED' ? (
                          <div className="flex w-full space-x-2 mt-auto">
                            <button onClick={() => window.open(`/api/trips/${documentTrip.id}/final-invoice`, '_blank')}
                              className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition">
                              View
                            </button>
                            <button onClick={() => handleDownloadInvoice(documentTrip.id)}
                              className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl font-bold text-sm shadow-md shadow-violet-200 hover:bg-violet-700 transition flex items-center justify-center space-x-1">
                              <HiDownload className="w-4 h-4" /> <span>DL</span>
                            </button>
                          </div>
                        ) : (
                          <div className="mt-auto py-2.5 w-full bg-slate-50 text-slate-400 rounded-xl font-bold text-sm border border-slate-100">
                            Not Available Yet
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── ADD TRANSPORTER ──────────────────────────────────────────── */}
          {activeMenu === 'add-transporter' && (
            <div className="animate-fadeIn max-w-4xl">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-10 border-b-4">
                <h3 className="text-xl font-black mb-6">Direct Transporter Assignment</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1 group">
                    <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input type="text" placeholder="Search transporters by agency name or city..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-indigo-600 transition-all font-medium"
                      value={transporterSearch}
                      onChange={(e) => setTransporterSearch(e.target.value)} />
                  </div>
                  <button onClick={handleTransporterSearch} disabled={loading}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-50">
                    {loading ? 'Searching...' : 'Search Agency'}
                  </button>
                </div>
              </div>
              {transporters.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {transporters.map((t: any) => (
                    <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-600 border-b-4 transition-all flex items-center justify-between group">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold border-2 border-white shadow-sm overflow-hidden">
                          {t.profileImageUrl ? <img src={t.profileImageUrl} alt="" /> : <HiTruck className="w-8 h-8" />}
                        </div>
                        <div>
                          <div className="text-lg font-black text-slate-900">{t.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t.city || 'Pan India'} • Transporter</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => setChatRecipient({ id: t.id, fullName: t.fullName })}
                          className="px-6 h-12 bg-blue-50 text-blue-600 rounded-xl font-black hover:bg-blue-600 hover:text-white transition-all">
                          Chat
                        </button>
                        <button className="px-6 h-12 bg-emerald-50 text-emerald-600 rounded-xl font-black hover:bg-emerald-600 hover:text-white transition-all">
                          Assign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── POST NEW LOAD ─────────────────────────────────────────────── */}
          {activeMenu === 'bids' && (
            <div className="animate-fadeIn max-w-4xl">
              <div className="bg-white rounded-[40px] p-6 md:p-12 border border-slate-200 shadow-xl border-b-8 hover:border-indigo-600 transition-all">
                <div className="flex items-center space-x-4 mb-10">
                  <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-lg shadow-indigo-200">
                    <HiPlus className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Bidding Load</h2>
                    <p className="text-slate-500 font-semibold italic">Broadcast your load to all registered transporters</p>
                  </div>
                </div>
                <form onSubmit={handlePostBid} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <FormInput icon={<HiTag />} label="Item Names / Material" placeholder="e.g. Iron Rods, Cotton Bales"
                      value={bidForm.itemNames} onChange={(v: string) => setBidForm({...bidForm, itemNames: v})} required />
                    <FormInput icon={<HiTruck />} label="Total Weight (Tons)" placeholder="e.g. 24.5" type="number"
                      value={bidForm.weight} onChange={(v: string) => setBidForm({...bidForm, weight: v})} required />
                    <FormInput icon={<HiLocationMarker />} label="Pickup Location (Source)" placeholder="e.g. Mumbai, Maharashtra"
                      value={bidForm.source} onChange={(v: string) => setBidForm({...bidForm, source: v})} required />
                    <FormInput icon={<HiLocationMarker />} label="Delivery Location (Destination)" placeholder="e.g. Delhi, DL"
                      value={bidForm.destination} onChange={(v: string) => setBidForm({...bidForm, destination: v})} required />
                    <FormInput icon={<HiCalendar />} label="Pickup Date" type="date"
                      value={bidForm.startDate} onChange={(v: string) => setBidForm({...bidForm, startDate: v})} required />
                    <FormInput icon={<HiCalendar />} label="Expected Delivery Date" type="date"
                      value={bidForm.endDate} onChange={(v: string) => setBidForm({...bidForm, endDate: v})} />
                    <FormInput icon={<HiClock />} label="Pickup Time" type="time"
                      value={bidForm.startTime} onChange={(v: string) => setBidForm({...bidForm, startTime: v})} required />
                    <FormInput icon={<HiClock />} label="Expected Delivery Time" type="time"
                      value={bidForm.endTime} onChange={(v: string) => setBidForm({...bidForm, endTime: v})} />
                    <div className="md:col-span-2">
                      <FormInput icon={<HiCheckCircle />} label="Maximum Budget (₹)" placeholder="Enter maximum price you can pay"
                        value={bidForm.budget} onChange={(v: string) => setBidForm({...bidForm, budget: v})} required />
                    </div>
                  </div>
                  <div className="pt-8">
                    <button type="submit" disabled={loading}
                      className="w-full bg-indigo-600 text-white rounded-[20px] py-6 text-xl font-black shadow-2xl shadow-indigo-200 hover:bg-slate-900 transition-all flex items-center justify-center space-x-3 disabled:opacity-50">
                      {loading ? 'Posting Load...' : <><span>Submit Bidding Load</span><HiChevronRight className="w-6 h-6" /></>}
                    </button>
                    <p className="mt-4 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                      Load will be visible to all verified transporters instantly
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── LIVE TRACKING ─────────────────────────────────────────────── */}
          {activeMenu === 'tracking' && (
            <div className="animate-fadeIn max-w-5xl h-[70vh] md:h-[600px] flex flex-col">
              <div className="bg-white rounded-t-[32px] p-6 md:p-8 border-x border-t border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h3 className="text-xl font-black">Live Fleet Tracking</h3>
                  <p className="text-slate-500 text-sm">Monitor your ongoing shipments in real-time</p>
                </div>
              </div>
              <div className="flex-1 rounded-b-[32px] overflow-hidden border border-slate-200 shadow-sm relative">
                <LiveMap
                  markers={activeTrips.map(trip => ({
                    id: trip.id,
                    lat: trip.currentLat || trip.load?.sourceLat || 28.6139,
                    lng: trip.currentLng || trip.load?.sourceLng || 77.2090,
                    label: `Trip ${trip.id}`
                  }))}
                />
              </div>
            </div>
          )}

          {activeMenu === 'billing' && (
            <div className="animate-fadeIn max-w-6xl mx-auto">
              <BillingDashboard rolePath="/shipper" />
            </div>
          )}

        </div>
      </main>

      {chatRecipient && user && (
        <ChatWidget
          currentUserId={user.id}
          recipientId={chatRecipient.id}
          recipientName={chatRecipient.fullName}
        />
      )}
    </div>
  );
};

/* ── BidCard ─────────────────────────────────────────────────────────────── */
const BidCard = ({ bid, rank, isLowest, onAccept, onReject, onChat, accepting, loadAccepted }: {
  bid: BidDto;
  rank: number;
  isLowest: boolean;
  onAccept: () => void;
  onReject: () => void;
  onChat: () => void;
  accepting: boolean;
  loadAccepted: boolean;
}) => {
  const stars = Math.round(bid.averageRating ?? 0);
  const isPending = bid.status === 'PENDING';
  const isAccepted = bid.status === 'ACCEPTED';

  return (
    <div className={`relative bg-white rounded-[24px] border-2 transition-all overflow-hidden ${
      isAccepted  ? 'border-emerald-400 shadow-xl shadow-emerald-50' :
      isLowest && isPending ? 'border-indigo-400 shadow-xl shadow-indigo-50' :
      'border-slate-100 hover:border-slate-200'
    }`}>
      {isLowest && isPending && (
        <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
          ⚡ Lowest Bid
        </div>
      )}
      {isAccepted && (
        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
          ✓ Accepted
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left: Transporter Info */}
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-100">
              {bid.profileImageUrl
                ? <img src={bid.profileImageUrl} alt="" className="w-full h-full object-cover" />
                : <HiTruck className="w-7 h-7 text-slate-400" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-slate-900 text-lg leading-tight truncate">
                {bid.agencyName || bid.transporterName || 'Unknown Agency'}
              </div>
              <div className="text-slate-500 text-sm font-medium truncate">{bid.transporterName}</div>
              {/* Stars */}
              <div className="flex items-center space-x-1 mt-1">
                {[1,2,3,4,5].map(s => (
                  <HiStar key={s} className={`w-3.5 h-3.5 ${s <= stars ? 'text-amber-400' : 'text-slate-200'}`} />
                ))}
                <span className="text-[10px] text-slate-400 font-bold ml-1">
                  {bid.averageRating?.toFixed(1) ?? '0.0'} ({bid.totalRatings ?? 0})
                </span>
              </div>
            </div>
          </div>

          {/* Center: Bid Amount */}
          <div className="flex flex-col items-center px-6 py-2 bg-slate-50 rounded-2xl flex-shrink-0">
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Bid Amount</div>
            <div className={`text-3xl font-black ${isAccepted ? 'text-emerald-600' : isLowest && isPending ? 'text-indigo-600' : 'text-slate-800'}`}>
              ₹{bid.amount?.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <StatPill icon={<HiUsers />} label="Drivers" value={`${bid.totalDrivers ?? 0}`} />
          <StatPill icon={<HiTruck />} label="Fleet Size" value={`${bid.fleetSize ?? 0} Trucks`} />
          {bid.vehicleType && <StatPill icon={<HiTruck />} label="Vehicle Type" value={bid.vehicleType} />}
          {bid.estimatedDeliveryDays != null && (
            <StatPill icon={<HiClock />} label="Est. Delivery" value={`${bid.estimatedDeliveryDays} days`} />
          )}
          {bid.city && <StatPill icon={<HiLocationMarker />} label="Location" value={bid.city} />}
          {bid.createdAt && (
            <StatPill icon={<HiCalendar />} label="Bid Date"
              value={new Date(bid.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })} />
          )}
        </div>

        {/* Comment */}
        {bid.comment && (
          <div className="mt-4 px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-600 italic border-l-4 border-indigo-100">
            "{bid.comment}"
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-3 mt-5 pt-5 border-t border-slate-50">
          <button onClick={onChat}
            className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-black text-sm hover:bg-blue-600 hover:text-white transition-all">
            💬 Chat
          </button>
          {isPending && !loadAccepted && (
            <>
              <button onClick={onReject}
                className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-black text-sm hover:bg-rose-600 hover:text-white transition-all">
                ✕ Reject
              </button>
              <button onClick={onAccept} disabled={accepting}
                className="flex-1 px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-2">
                {accepting
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Accepting...</span></>
                  : <><HiBadgeCheck className="w-4 h-4" /><span>Accept Offer</span></>
                }
              </button>
            </>
          )}
          {isAccepted && (
            <span className="flex-1 text-center text-emerald-600 font-black text-sm bg-emerald-50 py-2.5 rounded-xl border border-emerald-100">
              ✓ This Bid Was Accepted
            </span>
          )}
          {bid.status === 'REJECTED' && (
            <span className="flex-1 text-center text-rose-400 font-black text-sm bg-rose-50 py-2.5 rounded-xl border border-rose-100">
              ✕ Bid Rejected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Shared UI components ────────────────────────────────────────────────── */
const StatPill = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-3 py-2">
    <span className="text-slate-400 text-sm">{icon}</span>
    <div>
      <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">{label}</div>
      <div className="text-xs font-black text-slate-700 leading-tight">{value}</div>
    </div>
  </div>
);

const StatCard = ({ label, value, icon, color }: any) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 border-b-4 hover:border-indigo-600 transition-all group overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:scale-110`} />
    <div className="flex items-center justify-between mb-4">
      <div className={`p-4 rounded-2xl ${color} text-white shadow-lg`}>{icon}</div>
    </div>
    <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{label}</div>
    <div className="text-4xl font-black text-slate-900">{value}</div>
  </div>
);

const FormInput = ({ icon, label, placeholder, type = 'text', value, onChange, required = false }: any) => (
  <div className="flex flex-col space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
        {icon}
      </div>
      <input type={type} required={required} placeholder={placeholder}
        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-semibold text-slate-700 placeholder:text-slate-300 shadow-inner"
        value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  </div>
);

const StatusPill = ({ status }: any) => {
  const styles: any = {
    'PENDING':    'bg-amber-50 text-amber-600 border-amber-100',
    'ASSIGNED':   'bg-blue-50 text-blue-600 border-blue-100',
    'IN_TRANSIT': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'COMPLETED':  'bg-emerald-50 text-emerald-600 border-emerald-100',
    'CANCELLED':  'bg-rose-50 text-rose-600 border-rose-100'};
  return (
    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-tight ${styles[status] || 'bg-slate-50 text-slate-500'}`}>
      {status}
    </span>
  );
};

export default ShipperDashboard;
