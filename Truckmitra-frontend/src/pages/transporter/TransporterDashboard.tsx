import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
import { toast } from 'react-hot-toast';
import {
  HiChartBar, HiTruck, HiCurrencyDollar, HiCog,
  HiLogout, HiDocumentText, HiLocationMarker,
  HiCheckCircle, HiXCircle,
  HiDownload, HiRefresh, HiClock,
  HiUser, HiClipboardList, HiPlus, HiIdentification,
  HiEye, HiPhotograph, HiExclamationCircle, HiX,
  HiTag, HiBadgeCheck,
} from 'react-icons/hi';
import NotificationDropdown from '../../Components/common/NotificationDropdown';
import VoiceAssistant from '../../Components/common/VoiceAssistant';
import LiveMap from '../../Components/common/LiveMap';
import DriverSelectionModal from '../../Components/loads/DriverSelectionModal';
import TransporterOverview from '../../Components/dashboard/TransporterOverview';
import ProfileHeader from '../../Components/dashboard/ProfileHeader';
import FleetManagement from '../../Components/dashboard/FleetManagement';
import AnalyticsDashboard from '../../Components/dashboard/AnalyticsDashboard';
import LiveTrackingCenter from '../../Components/common/LiveTrackingCenter';
import DeliveryVerificationCenter from '../../Components/loads/DeliveryVerificationCenter';
import { ProfitEstimatorWidget } from '../../Components/dashboard/ProfitEstimatorWidget';
import { BusinessHealthWidget } from '../../Components/dashboard/BusinessHealthWidget';
import BillingDashboard from '../billing/BillingDashboard';

/* ─── STATUS PILL ────────────────────────────────────────────── */
const STATUS_CFG: Record<string, string> = {
  PENDING:                       'bg-amber-50 text-amber-600 border-amber-100',
  ACCEPTED:                      'bg-emerald-50 text-emerald-600 border-emerald-100',
  REJECTED:                      'bg-rose-50 text-rose-600 border-rose-100',
  ASSIGNED:                      'bg-indigo-50 text-indigo-600 border-indigo-100',
  DRIVER_ASSIGNED:               'bg-purple-50 text-purple-600 border-purple-100',
  ACCEPTED_BY_DRIVER:            'bg-teal-50 text-teal-600 border-teal-100',
  IN_TRANSIT:                    'bg-blue-50 text-blue-600 border-blue-100',
  PAUSED:                        'bg-rose-50 text-rose-600 border-rose-100',
  DELIVERED:                     'bg-purple-50 text-purple-600 border-purple-100',
  COMPLETED:                     'bg-emerald-50 text-emerald-600 border-emerald-100',
  CANCELLED:                     'bg-slate-100 text-slate-500 border-slate-200',
  REJECTED_BY_DRIVER:            'bg-rose-50 text-rose-600 border-rose-100',
  REJECTED_BY_TRANSPORTER:       'bg-red-50 text-red-700 border-red-200',
  STARTED:                       'bg-indigo-50 text-indigo-600 border-indigo-100',
  AT_PICKUP:                     'bg-yellow-50 text-yellow-600 border-yellow-100',
  LOADED:                        'bg-orange-50 text-orange-600 border-orange-100',
  AT_DESTINATION:                'bg-teal-50 text-teal-600 border-teal-100',
  POD_UPLOADED:                  'bg-purple-50 text-purple-600 border-purple-100',
  AWAITING_TRANSPORTER_APPROVAL: 'bg-orange-50 text-orange-600 border-orange-200',
};

const StatusPill = ({ status }: { status: string }) => (
  <span className={`px-3 py-1 text-[10px] rounded-full font-black uppercase border tracking-tight ${STATUS_CFG[status] || 'bg-slate-50 text-slate-500 border-slate-100'}`}>
    {status?.replace(/_/g, ' ')}
  </span>
);

/* ─── TRIP TIMELINE ─────────────────────────────────────────── */
const TRIP_STEPS = [
  { key: 'ASSIGNED',           label: 'Assigned',   emoji: '👤' },
  { key: 'ACCEPTED',           label: 'Accepted',   emoji: '🤝' },
  { key: 'STARTED',            label: 'Started',    emoji: '🚀' },
  { key: 'AT_PICKUP',          label: 'At Pickup',  emoji: '📍' },
  { key: 'LOADED',             label: 'Loaded',     emoji: '📦' },
  { key: 'IN_TRANSIT',         label: 'Transit',    emoji: '🚛' },
  { key: 'AT_DESTINATION',     label: 'Arrived',    emoji: '🏁' },
  { key: 'DELIVERED',          label: 'Delivered',  emoji: '📥' },
  { key: 'POD_UPLOADED',       label: 'Proof',      emoji: '📸' },
  { key: 'COMPLETED',          label: 'Completed',  emoji: '✅' },
];
const STEP_KEYS = TRIP_STEPS.map(s => s.key);

const TripTimeline = ({ status }: { status: string }) => {
  const idx = STEP_KEYS.indexOf(status);
  return (
    <div className="relative">
      <div className="absolute top-7 left-7 right-7 h-1 bg-slate-100 rounded-full" />
      <div className="absolute top-7 left-7 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
        style={{ width: idx <= 0 ? '0%' : `${(idx / (TRIP_STEPS.length - 1)) * 87}%` }} />
      <div className="relative flex items-start justify-between">
        {TRIP_STEPS.map((step, i) => {
          const done = i < idx;
          const current = i === idx;
          return (
            <div key={step.key} className="flex flex-col items-center z-10" style={{ flex: 1 }}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl border-4 transition-all ${
                done ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-200' :
                current ? 'bg-slate-900 border-slate-900 shadow-xl animate-pulse' :
                'bg-white border-slate-200'
              }`}>
                <span>{done ? '✅' : step.emoji}</span>
              </div>
              <span className={`mt-3 text-[9px] font-black text-center uppercase tracking-wider ${
                current ? 'text-slate-900' : done ? 'text-emerald-600' : 'text-slate-300'
              }`}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── PHOTO GALLERY CARD ─────────────────────────────────────── */


/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const TransporterDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  type Menu = 'overview' | 'tenders' | 'my-bids' | 'trips' | 'fleet' | 'financial' | 'settings' | 'calculator' | 'analytics';
  const [activeMenu, setActiveMenu] = useState<Menu>('overview');

  // Data states
  const [transporterProfile, setTransporterProfile] = useState<any>(null);
  const [openTenders, setOpenTenders]               = useState<any[]>([]);
  const [myLoads, setMyLoads]                       = useState<any[]>([]);
  const [myBids, setMyBids]                         = useState<any[]>([]);
  const [trips, setTrips]                           = useState<any[]>([]);
  const [drivers, setDrivers]                       = useState<any[]>([]);
  const [vehicles, setVehicles]                     = useState<any[]>([]);
  const [wallet, setWallet]                         = useState<any>(null);
  const [loading, setLoading]                       = useState(true);

  // Modal states
  const [verifyModalTrip, setVerifyModalTrip]       = useState<any>(null);
  const [trackingTrip, setTrackingTrip]             = useState<any>(null);
  const [tenderDetailLoad, setTenderDetailLoad]     = useState<any>(null); // tender detail modal
  const [assignDriverLoadId, setAssignDriverLoadId] = useState<number | null>(null);

  // Bid filter
  const [bidFilter, setBidFilter] = useState<'ALL'|'PENDING'|'ACCEPTED'|'REJECTED'>('ALL');

  /* ── AUTH GUARD */
  useEffect(() => {
    if (user && user.role !== 'TRANSPORTER') navigate('/dashboard');
  }, [user, navigate]);

  /* ── DATA FETCHING */
  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [profileRes, loadsRes, tendersRes, bidsRes, tripsRes, driversRes, vehiclesRes, walletRes] = await Promise.allSettled([
        protectedApi.get('/api/transporters/me'),
        protectedApi.get(`/api/loads/transporter/${user.id}`),
        protectedApi.get('/api/loads/status/PENDING?isBiddingEnabled=true'),
        protectedApi.get('/api/bids/my'),
        protectedApi.get(`/api/trips/transporter/${user.id}`),
        protectedApi.get('/api/drivers/me'),
        protectedApi.get('/api/vehicles/me'),
        protectedApi.get('/api/wallet/me'),
      ]);

      if (profileRes.status === 'fulfilled') setTransporterProfile(profileRes.value.data?.data || profileRes.value.data || null);
      if (loadsRes.status === 'fulfilled') {
        const d = loadsRes.value.data?.data || loadsRes.value.data;
        setMyLoads(Array.isArray(d) ? d : []);
      }
      if (tendersRes.status === 'fulfilled') {
        const d = tendersRes.value.data?.data || tendersRes.value.data;
        setOpenTenders(Array.isArray(d) ? d : []);
      }
      if (bidsRes.status === 'fulfilled') {
        const d = bidsRes.value.data?.data || bidsRes.value.data;
        setMyBids(Array.isArray(d) ? d : []);
      }
      if (tripsRes.status === 'fulfilled') {
        const d = tripsRes.value.data?.data || tripsRes.value.data;
        setTrips(Array.isArray(d) ? d : []);
      }
      if (driversRes.status === 'fulfilled') {
        const d = driversRes.value.data?.data || driversRes.value.data;
        setDrivers(Array.isArray(d) ? d : []);
      }
      if (vehiclesRes.status === 'fulfilled') {
        const d = vehiclesRes.value.data?.data || vehiclesRes.value.data;
        setVehicles(Array.isArray(d) ? d : []);
      }
      if (walletRes.status === 'fulfilled') setWallet(walletRes.value.data?.data || walletRes.value.data || null);
    } catch (err) { console.error('Fetch error:', err); }
    finally { setLoading(false); }
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── HANDLERS */
  const handlePlaceBid = async (
    loadId: number,
    amount: number,
    vehicleType: string,
    estimatedDeliveryDays: number,
    remarks: string
  ) => {
    try {
      await protectedApi.post('/api/bids', { loadId, amount, vehicleType, estimatedDeliveryDays, remarks });
      toast.success('🎉 Bid submitted successfully! Waiting for shipper review.');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place bid');
    }
  };

  const handleAssignFleet = async (tripId: number, driverId: number, vehicleId: number, driverAmount: number) => {
    try {
      await protectedApi.post('/api/trips/assign-fleet', null, { params: { tripId, driverId, vehicleId, driverAmount } });
      toast.success('Fleet assigned! Driver notified via email.');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to assign fleet');
    }
  };

  const handleDownloadPdf = async (tripId: number) => {
    try {
      const res = await protectedApi.get(`/api/trips/${tripId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      Object.assign(document.createElement('a'), { href: url, download: `Invoice_Trip_${tripId}.pdf` }).click();
      window.URL.revokeObjectURL(url);
    } catch { toast.error('Failed to download PDF'); }
  };

  const handleDownloadLr = async (tripId: number) => {
    try {
      const res = await protectedApi.get(`/api/lr/trip/${tripId}`);
      const pdfUrl = res.data?.pdfUrl;
      if (pdfUrl && pdfUrl.startsWith('http')) {
        window.open(pdfUrl, '_blank');
      } else {
        const response = await protectedApi.get(`/api/lr/trip/${tripId}/pdf`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        Object.assign(document.createElement('a'), { href: url, download: `LR_Trip_${tripId}.pdf` }).click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      toast.error('Lorry Receipt not generated yet or failed to fetch');
    }
  };

  /* ── CALCULATIONS */
  const stats = {
    openTenders:     openTenders.length,
    submittedBids:   myBids.filter(b => b.status === 'PENDING').length,
    wonTenders:      myBids.filter(b => b.status === 'ACCEPTED').length,
    lostTenders:     myBids.filter(b => b.status === 'REJECTED').length,
    ongoingTrips:    trips.filter(t => t.driver && !['COMPLETED', 'CANCELLED'].includes(t.status)).length,
    completedTrips:  trips.filter(t => t.status === 'COMPLETED').length,
    pendingReceipts: trips.filter(t => ['DELIVERED', 'POD_UPLOADED', 'AWAITING_TRANSPORTER_APPROVAL'].includes(t.status)).length,
    totalDrivers:    drivers.length,
    totalVehicles:   vehicles.length,
    walletBalance:   wallet?.currentBalance || 0,
  };

  const completedTripsArr = trips.filter(t => t.status === 'COMPLETED' || t.status === 'DELIVERED');
  const totalRevenue = completedTripsArr.reduce((s, t) => s + (t.shipperAmount || t.freightAmount || 0), 0);
  const totalDriverPayment = completedTripsArr.reduce((s, t) => s + (t.driverAmount || 0), 0);
  const totalProfitMargin = totalRevenue - totalDriverPayment;

  const totalEarnings = totalProfitMargin;

  const winRate = myBids.length > 0
    ? Math.round((stats.wonTenders / myBids.length) * 100)
    : 0;

  // Check if transporter already bid on a tender
  const alreadyBid = (loadId: number) =>
    myBids.some(b => b.load?.id === loadId || b.loadId === loadId);

  // Filtered bids
  const filteredBids = bidFilter === 'ALL' ? myBids : myBids.filter(b => b.status === bidFilter);

  /* ── RENDER */
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">

      {/* ─── SIDEBAR */}
      <aside className="w-64 bg-white min-h-screen border-r border-slate-200 flex flex-col z-20 sticky top-0">
        <div className="p-8 border-b border-slate-200">
          <div className="flex items-center justify-center">
            <img src="/logo-transparent.png" alt="TruckMitra" className="w-[180px] h-auto object-contain" />
          </div>
        </div>

        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <HiUser className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-black text-slate-900 truncate">{user?.fullName || 'Transporter'}</div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Fleet Owner</span>
                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                  {winRate}% WR
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-1">
          <SLink icon={<HiChartBar />}       label="Overview"      active={activeMenu === 'overview'}    onClick={() => setActiveMenu('overview')} />
          <SLink icon={<HiDocumentText />}   label="Open Tenders"  active={activeMenu === 'tenders'}     onClick={() => setActiveMenu('tenders')}
            badge={stats.openTenders > 0 ? stats.openTenders : undefined} />
          <SLink icon={<HiTag />}            label="My Bids"       active={activeMenu === 'my-bids'}     onClick={() => setActiveMenu('my-bids')}
            badge={stats.submittedBids > 0 ? stats.submittedBids : undefined} />
          <SLink icon={<HiLocationMarker />} label="Awarded & Active Trips"  active={activeMenu === 'trips'}       onClick={() => setActiveMenu('trips')}
            badge={stats.pendingReceipts > 0 ? stats.pendingReceipts : undefined} />
          <SLink icon={<HiIdentification />} label="My Fleet"      active={activeMenu === 'fleet'}       onClick={() => setActiveMenu('fleet')} />
          <SLink icon={<HiCurrencyDollar />} label="Earnings"      active={activeMenu === 'financial'}   onClick={() => setActiveMenu('financial')} />
          <SLink icon={<HiClipboardList />}  label="Calculator"    active={activeMenu === 'calculator'}  onClick={() => setActiveMenu('calculator')} />
          <SLink icon={<HiChartBar />}       label="Analytics"     active={activeMenu === 'analytics'}   onClick={() => setActiveMenu('analytics')} />
          <SLink icon={<HiCog />}            label="Settings"      active={activeMenu === 'settings'}    onClick={() => setActiveMenu('settings')} />
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center w-full px-4 py-3 text-sm font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
            <HiLogout className="w-5 h-5 mr-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN */}
      <main className="flex-1 overflow-y-auto">
        <ProfileHeader
          user={transporterProfile || user}
          roleBadgeText="Fleet Owner"
          roleBadgeClasses="bg-emerald-50 text-emerald-600 border-emerald-100"
          welcomeMessage={`Welcome back, ${user?.fullName?.split(' ')[0] || 'Transporter'}`}
          stats={[
            { label: 'Fleet', value: stats.totalVehicles, icon: <HiTruck /> },
            { label: 'Drivers', value: stats.totalDrivers, icon: <HiUser /> },
            { label: 'Active Trips', value: stats.ongoingTrips, icon: <HiLocationMarker /> },
            { label: 'Wallet', value: `₹${stats.walletBalance}`, icon: <HiCurrencyDollar /> }
          ]}
        >
          <NotificationDropdown />
          <button onClick={() => navigate('/transporter/loads/create')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-sm shadow-md hover:bg-slate-900 transition-all flex items-center space-x-2 shrink-0">
            <HiDocumentText className="w-5 h-5" />
            <span className="hidden sm:inline">Post Load</span>
          </button>
          <button onClick={fetchData}
            className="p-2 text-slate-400 hover:text-emerald-500 transition-all rounded-xl hover:bg-emerald-50 shrink-0">
            <HiRefresh className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </ProfileHeader>

        <div className="p-10">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              {/* ══ OVERVIEW ═════════════════════════════════════ */}
              {activeMenu === 'overview' && (
                <div className="animate-fadeIn space-y-6">
                  <BusinessHealthWidget />
                  <TransporterOverview 
                    stats={stats} 
                    trips={trips} 
                    openTenders={openTenders} 
                    myBids={myBids} 
                    drivers={drivers} 
                    vehicles={vehicles} 
                    setActiveMenu={setActiveMenu} 
                  />
                </div>
              )}

              {/* ══ OPEN TENDERS (MARKETPLACE) ══════════════════ */}
              {activeMenu === 'tenders' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Header Stats */}
                  <div className="grid grid-cols-3 gap-5">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
                      <div className="text-3xl font-black text-blue-600">{openTenders.length}</div>
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Open Tenders</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
                      <div className="text-3xl font-black text-amber-500">{openTenders.filter(l => alreadyBid(l.id)).length}</div>
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Bids Submitted</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
                      <div className="text-3xl font-black text-emerald-600">{openTenders.filter(l => !alreadyBid(l.id)).length}</div>
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Available to Bid</div>
                    </div>
                  </div>

                  {openTenders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
                      <HiDocumentText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-slate-400">No Open Tenders</h3>
                      <p className="text-slate-400 mt-2 text-sm">New tenders from shippers will appear here. Check back soon.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {openTenders.map(load => {
                        const bidPlaced = alreadyBid(load.id);
                        const myBidForLoad = myBids.find(b => b.load?.id === load.id || b.loadId === load.id);
                        return (
                          <TenderCard
                            key={load.id}
                            load={load}
                            bidPlaced={bidPlaced}
                            myBid={myBidForLoad}
                            onBid={handlePlaceBid}
                            onViewDetail={() => setTenderDetailLoad(load)}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ══ MY BIDS ══════════════════════════════════════ */}
              {activeMenu === 'my-bids' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Bids',     value: myBids.length,       color: 'text-slate-900',    bg: 'bg-slate-50',   border: 'border-slate-200',   filter: 'ALL' as const },
                      { label: 'Pending Review', value: stats.submittedBids, color: 'text-amber-600',    bg: 'bg-amber-50',   border: 'border-amber-200',   filter: 'PENDING' as const },
                      { label: 'Won',            value: stats.wonTenders,    color: 'text-emerald-600',  bg: 'bg-emerald-50', border: 'border-emerald-200', filter: 'ACCEPTED' as const },
                      { label: 'Lost',           value: stats.lostTenders,   color: 'text-rose-500',     bg: 'bg-rose-50',    border: 'border-rose-200',    filter: 'REJECTED' as const },
                    ].map(({ label, value, color, bg, border, filter }) => (
                      <button key={label} onClick={() => setBidFilter(filter)}
                        className={`p-5 rounded-2xl border-2 transition-all text-left ${
                          bidFilter === filter ? `${bg} ${border} shadow-sm` : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}>
                        <div className={`text-3xl font-black ${color}`}>{value}</div>
                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">{label}</div>
                      </button>
                    ))}
                  </div>

                  {/* Bid History Table */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-xl font-black text-slate-900">
                        {bidFilter === 'ALL' ? 'Complete Bid History' :
                         bidFilter === 'PENDING' ? 'Bids Under Review' :
                         bidFilter === 'ACCEPTED' ? 'Won Tenders 🏆' : 'Lost Tenders'}
                      </h3>
                      <span className="text-sm font-bold text-slate-400">{filteredBids.length} records</span>
                    </div>
                    {filteredBids.length === 0 ? (
                      <div className="p-16 text-center">
                        <EmptyState icon={<HiDocumentText />} message="No bids in this category." />
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50">
                              <th className="px-6 py-4">Tender / Route</th>
                              <th className="px-6 py-4">Material</th>
                              <th className="px-6 py-4">My Bid</th>
                              <th className="px-6 py-4">Vehicle / Days</th>
                              <th className="px-6 py-4">Bid Date</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {filteredBids.map(bid => {
                              const relatedTrip = trips.find(t => t.load?.id === bid.load?.id);
                              return (
                                <tr key={bid.id} className={`hover:bg-slate-50 transition-all ${bid.status === 'ACCEPTED' ? 'bg-emerald-50/30' : ''}`}>
                                  <td className="px-6 py-5">
                                    <div className="font-bold text-sm text-slate-900">
                                      {bid.load?.source || '–'} → {bid.load?.destination || '–'}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold">Tender #{bid.load?.id || bid.id}</div>
                                  </td>
                                  <td className="px-6 py-5 text-sm font-medium text-slate-600">
                                    <div>{bid.load?.materialType || '–'}</div>
                                    <div className="text-[10px] text-slate-400">{bid.load?.weight} T · Budget ₹{bid.load?.budget}</div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <span className={`text-lg font-black ${bid.status === 'ACCEPTED' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                      ₹{bid.amount?.toLocaleString('en-IN')}
                                    </span>
                                  </td>
                                  <td className="px-6 py-5 text-sm text-slate-600">
                                    <div className="font-bold">{bid.vehicleType || '–'}</div>
                                    <div className="text-[10px] text-slate-400">{bid.estimatedDeliveryDays ? `${bid.estimatedDeliveryDays} days` : '–'}</div>
                                  </td>
                                  <td className="px-6 py-5 text-sm text-slate-500">
                                    {bid.createdAt ? new Date(bid.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '–'}
                                  </td>
                                  <td className="px-6 py-5">
                                    <StatusPill status={bid.status} />
                                    {bid.status === 'ACCEPTED' && <div className="text-[9px] font-black text-emerald-600 mt-1">🏆 Winner</div>}
                                  </td>
                                  <td className="px-6 py-5">
                                    {bid.status === 'ACCEPTED' && relatedTrip && !relatedTrip.driver && (
                                      <AssignFleetModal
                                        trip={relatedTrip}
                                        drivers={drivers.filter(d => !d.isOnTrip)}
                                        vehicles={vehicles}
                                        onAssign={handleAssignFleet}
                                      />
                                    )}
                                    {bid.status === 'ACCEPTED' && relatedTrip?.driver && (
                                      <div className="flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                        <HiUser className="w-3 h-3" />
                                        <span>{relatedTrip.driver?.fullName || 'Driver Assigned'}</span>
                                      </div>
                                    )}
                                    {bid.status === 'PENDING' && (
                                      <span className="text-[10px] text-amber-600 font-black">Awaiting decision</span>
                                    )}
                                    {bid.status === 'REJECTED' && (
                                      <span className="text-[10px] text-rose-400 font-black">Not selected</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══ TRIPS ════════════════════════════════════════ */}
              {activeMenu === 'trips' && (
                <div className="space-y-8 animate-fadeIn">
                  {stats.pendingReceipts > 0 && (
                    <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 flex items-center space-x-4">
                      <HiExclamationCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                      <p className="text-rose-700 font-bold text-sm">
                        {stats.pendingReceipts} trip(s) awaiting receipt verification. Click <strong>Verify Receipt</strong> below.
                      </p>
                    </div>
                  )}
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    {/* UNASSIGNED POSTED LOADS */}
                    <div className="mb-10">
                      <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                        <HiDocumentText className="w-6 h-6 mr-2 text-indigo-500" /> 
                        Unassigned Posted Loads
                      </h3>
                      {myLoads.filter(l => l.status === 'PENDING').length === 0 ? (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                          <p className="text-sm font-bold text-slate-400">No unassigned posted loads.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {myLoads.filter(l => l.status === 'PENDING').map(load => (
                            <div key={load.id} className="rounded-3xl border border-indigo-200 bg-white overflow-hidden shadow-lg shadow-indigo-100">
                              <div className="flex flex-col md:flex-row md:items-center justify-between p-7">
                                <div className="flex items-center space-x-5 mb-4 md:mb-0">
                                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                                    <HiTruck className="w-7 h-7" />
                                  </div>
                                  <div>
                                    <div className="font-black text-slate-900 text-lg">{load.source} → {load.destination}</div>
                                    <div className="flex items-center flex-wrap gap-2 mt-1.5">
                                      <StatusPill status={load.status} />
                                      <span className="text-xs font-bold text-slate-400">Load #{load.id}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <button onClick={() => setAssignDriverLoadId(load.id)}
                                          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all shadow-md">
                                    Assign Driver
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* AWARDED LOADS SECTION */}
                    <div className="mb-10">
                      <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                        <HiClipboardList className="w-6 h-6 mr-2 text-indigo-500" /> 
                        Awarded Loads
                      </h3>
                      {trips.filter(t => !t.driver && (t.status === 'ASSIGNED' || t.status === 'REJECTED_BY_DRIVER')).length === 0 ? (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                          <p className="text-sm font-bold text-slate-400">No new awarded loads awaiting fleet assignment.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {trips.filter(t => !t.driver && (t.status === 'ASSIGNED' || t.status === 'REJECTED_BY_DRIVER')).map(trip => (
                            <div key={trip.id} className="rounded-3xl border border-indigo-200 bg-white overflow-hidden shadow-lg shadow-indigo-100">
                              <div className="flex flex-col md:flex-row md:items-center justify-between p-7">
                                <div className="flex items-center space-x-5 mb-4 md:mb-0">
                                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                                    <HiTruck className="w-7 h-7" />
                                  </div>
                                  <div>
                                    <div className="font-black text-slate-900 text-lg">{trip.load?.source} → {trip.load?.destination}</div>
                                    <div className="flex items-center flex-wrap gap-2 mt-1.5">
                                      <StatusPill status={trip.status} />
                                      <span className="text-xs font-bold text-slate-400">Trip #{trip.id}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <AssignFleetModal 
                                    trip={trip} 
                                    drivers={drivers.filter(d => !d.isOnTrip)} 
                                    vehicles={vehicles.filter(v => v.isAvailable)} 
                                    onAssign={handleAssignFleet} 
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ACTIVE ASSIGNMENTS SECTION */}
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                        <HiLocationMarker className="w-6 h-6 mr-2 text-emerald-500" /> 
                        Active Assignments
                      </h3>
                      {trips.filter(t => t.driver && t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length === 0 ? (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                          <p className="text-sm font-bold text-slate-400">No active assignments on the road.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {trips.filter(t => t.driver && t.status !== 'COMPLETED' && t.status !== 'CANCELLED').map(trip => (
                            <div key={trip.id} className={`rounded-3xl border bg-white overflow-hidden transition-all hover:shadow-lg ${
                              trip.status === 'DELIVERED' ? 'border-rose-200 ring-2 ring-rose-100' : 'border-slate-100'
                            }`}>
                              <div className="flex flex-col md:flex-row md:items-center justify-between p-7">
                                <div className="flex items-center space-x-5 mb-4 md:mb-0">
                                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                                    <HiTruck className="w-7 h-7" />
                                  </div>
                                  <div>
                                    <div className="font-black text-slate-900 text-lg">{trip.load?.source} → {trip.load?.destination}</div>
                                    <div className="flex items-center flex-wrap gap-2 mt-1.5">
                                      <StatusPill status={trip.status} />
                                      <span className="text-xs font-bold text-slate-400">Trip #{trip.id}</span>
                                      {trip.driver?.fullName && (
                                        <span className="text-xs font-bold text-slate-400 flex items-center space-x-1">
                                          <HiUser className="w-3 h-3" />
                                          <span>{trip.driver.fullName}</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3 flex-wrap gap-2">
                                  {['DELIVERED', 'POD_UPLOADED', 'AWAITING_TRANSPORTER_APPROVAL'].includes(trip.status) && (
                                    <button onClick={() => setVerifyModalTrip(trip)}
                                      className={`px-5 py-3 text-white rounded-2xl font-black text-sm hover:bg-slate-900 transition-all shadow-lg flex items-center space-x-1.5 ${
                                        trip.status === 'AWAITING_TRANSPORTER_APPROVAL'
                                          ? 'bg-orange-500 shadow-orange-100 animate-pulse'
                                          : 'bg-rose-600 shadow-rose-100 animate-pulse'
                                      }`}>
                                      <HiCheckCircle className="w-4 h-4" />
                                      <span>{trip.status === 'AWAITING_TRANSPORTER_APPROVAL' ? 'Review & Approve' : 'Verify Receipt'}</span>
                                    </button>
                                  )}
                                  {!['ASSIGNED', 'REJECTED_BY_DRIVER', 'CANCELLED'].includes(trip.status) && (
                                    <button onClick={() => handleDownloadLr(trip.id)}
                                      className="px-5 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-sm hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 flex items-center space-x-1">
                                      <HiDownload className="w-4 h-4" />
                                      <span>Download LR</span>
                                    </button>
                                  )}
                                  {['IN_TRANSIT', 'ACCEPTED_BY_DRIVER', 'PAUSED'].includes(trip.status) && (
                                    <button onClick={() => setTrackingTrip(trip)}
                                      className="px-5 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black text-sm hover:bg-blue-600 hover:text-white transition-all border border-blue-100">
                                      <HiLocationMarker className="inline w-4 h-4 mr-1" /> Track
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="px-7 pb-7">
                                <div className="border-t border-slate-50 pt-6">
                                  <TripTimeline status={trip.status} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* COMPLETED TRIPS SECTION */}
                    <div className="mt-10">
                      <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                        <HiCheckCircle className="w-6 h-6 mr-2 text-emerald-500" /> 
                        Completed Trips
                      </h3>
                      {trips.filter(t => t.status === 'COMPLETED').length === 0 ? (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                          <p className="text-sm font-bold text-slate-400">No completed trips yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {trips.filter(t => t.status === 'COMPLETED').map(trip => (
                            <div key={trip.id} className="rounded-3xl border border-emerald-200 bg-white overflow-hidden hover:shadow-lg transition-all ring-1 ring-emerald-50">
                              <div className="flex flex-col md:flex-row md:items-center justify-between p-7">
                                <div className="flex items-center space-x-5 mb-4 md:mb-0">
                                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-100">
                                    <HiCheckCircle className="w-7 h-7" />
                                  </div>
                                  <div>
                                    <div className="font-black text-slate-900 text-lg">{trip.load?.source} → {trip.load?.destination}</div>
                                    <div className="flex items-center flex-wrap gap-2 mt-1.5">
                                      <StatusPill status={trip.status} />
                                      <span className="text-xs font-bold text-slate-400">Trip #{trip.id}</span>
                                      {trip.driver?.fullName && (
                                        <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                                          <HiUser className="w-3 h-3" />
                                          <span>{trip.driver.fullName}</span>
                                        </span>
                                      )}
                                      {trip.vehicle?.vehicleNumber && (
                                        <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                                          <HiTruck className="w-3 h-3" />
                                          <span>{trip.vehicle.vehicleNumber}</span>
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-2 font-bold flex items-center space-x-2">
                                      <span>Completed: {trip.completedAt ? new Date(trip.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                                      {trip.assignmentPdfUrl && (
                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider text-slate-500">LR Attached</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center flex-wrap gap-2 md:justify-end">
                                  {/* LR Actions */}
                                  <div className="flex space-x-1">
                                    <button onClick={() => trip.assignmentPdfUrl ? window.open(trip.assignmentPdfUrl, '_blank') : handleDownloadLr(trip.id)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all border border-blue-100">View LR</button>
                                    <button onClick={() => handleDownloadLr(trip.id)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100" title="Download LR"><HiDownload className="w-4 h-4" /></button>
                                  </div>
                                  {/* POD Actions */}
                                  {trip.podUrl && (
                                    <div className="flex space-x-1">
                                      <button onClick={() => window.open(trip.podUrl, '_blank')} className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl font-bold text-xs hover:bg-amber-600 hover:text-white transition-all border border-amber-100">View POD</button>
                                      <button onClick={() => {
                                        const a = document.createElement('a');
                                        a.href = trip.podUrl;
                                        a.target = '_blank';
                                        a.download = `POD_Trip_${trip.id}`;
                                        a.click();
                                      }} className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all border border-amber-100" title="Download POD"><HiDownload className="w-4 h-4" /></button>
                                    </div>
                                  )}
                                  {/* Invoice Actions */}
                                  <div className="flex space-x-1">
                                    <button onClick={() => (trip.finalInvoicePdfUrl || trip.tripPdfUrl) ? window.open(trip.finalInvoicePdfUrl || trip.tripPdfUrl, '_blank') : handleDownloadPdf(trip.id)} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100">View Invoice</button>
                                    <button onClick={() => handleDownloadPdf(trip.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100" title="Download Invoice"><HiDownload className="w-4 h-4" /></button>
                                  </div>
                                  {/* View Photos Action */}
                                  <div className="flex space-x-1 ml-2">
                                    <button onClick={() => setVerifyModalTrip(trip)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-800 hover:text-white transition-all flex items-center space-x-1">
                                      <HiEye className="w-4 h-4" /> <span>View All Media</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ══ FLEET ════════════════════════════════════════ */}
              {activeMenu === 'fleet' && (
                <FleetManagement 
                  vehicles={vehicles} 
                  drivers={drivers} 
                  trips={trips} 
                  onAddVehicle={() => navigate('/transporter/register-vehicle')}
                  onRegisterDriver={() => navigate('/transporter/register-driver')}
                />
              )}

              {/* ══ FINANCIAL / EARNINGS ═════════════════════════ */}
              {activeMenu === 'financial' && (
                <div className="animate-fadeIn max-w-6xl mx-auto">
                  <BillingDashboard rolePath="/transporter" />
                </div>
              )}

              {/* ══ SETTINGS ═════════════════════════════════════ */}
              {activeMenu === 'settings' && (
                <div className="max-w-2xl space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-black mb-6 italic uppercase tracking-tight">Agency Settings</h3>
                    <div className="space-y-4">
                      <SettingRow label="Agency Name" value={transporterProfile?.agencyName || '–'} />
                      <SettingRow label="Full Name"   value={user?.fullName || '–'} />
                      <SettingRow label="Mobile"      value={user?.mobile || '–'} />
                      <SettingRow label="Email"       value={user?.email || '–'} />
                      <SettingRow label="GST Number"  value={transporterProfile?.gstNumber || '–'} />
                    </div>
                  </div>
                </div>
              )}

              {/* ══ CALCULATOR ═══════════════════════════════════ */}
              {activeMenu === 'calculator' && (
                <div className="animate-fadeIn space-y-8 max-w-4xl">
                  <div className="bg-slate-900 rounded-[40px] p-12 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <h2 className="text-4xl font-black mb-4 italic">Freight Calculator</h2>
                      <p className="text-slate-400 font-bold max-w-md">Estimate your trip costs and optimize your bidding strategy.</p>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full" />
                  </div>
                  <FreightCalculator />
                </div>
              )}

              {/* ══ ANALYTICS ════════════════════════════════════ */}
              {activeMenu === 'analytics' && (
                <AnalyticsDashboard 
                  stats={stats} 
                  trips={trips} 
                  myBids={myBids} 
                />
              )}
            </>
          )}
        </div>
        {/* Driver Selection Modal for Direct Loads */}
        {assignDriverLoadId && (
          <DriverSelectionModal 
            loadId={assignDriverLoadId}
            shipperAmount={myLoads.find(l => l.id === assignDriverLoadId)?.budget || 0}
            onClose={() => setAssignDriverLoadId(null)}
            onSuccess={() => {
              setAssignDriverLoadId(null);
              fetchData();
            }}
          />
        )}
      </main>

      <VoiceAssistant onCommand={(cmd: any) => setActiveMenu(cmd as Menu)} />

      {/* Delivery Review Modal */}
      {verifyModalTrip && (
        <DeliveryVerificationCenter
          trip={verifyModalTrip}
          onClose={() => setVerifyModalTrip(null)}
          onDone={fetchData}
        />
      )}

      {/* Live Tracking Modal */}
      {trackingTrip && (
        <LiveTrackingCenter 
          trip={trackingTrip}
          onClose={() => setTrackingTrip(null)}
        />
      )}

      {/* Tender Detail Modal */}
      {tenderDetailLoad && (
        <TenderDetailModal
          load={tenderDetailLoad}
          alreadyBid={alreadyBid(tenderDetailLoad.id)}
          myBid={myBids.find(b => b.load?.id === tenderDetailLoad.id)}
          onBid={handlePlaceBid}
          onClose={() => setTenderDetailLoad(null)}
        />
      )}
    </div>
  );
};

/* ── TENDER CARD ─────────────────────────────────────────────── */
const TenderCard = ({ load, bidPlaced, myBid, onBid, onViewDetail }: {
  load: any;
  bidPlaced: boolean;
  myBid?: any;
  onBid: (loadId: number, amount: number, vehicleType: string, estimatedDays: number, remarks: string) => void;
  onViewDetail: () => void;
}) => {
  const daysLeft = load.pickupDate
    ? Math.max(0, Math.ceil((new Date(load.pickupDate).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className={`bg-white rounded-[24px] border-2 transition-all hover:shadow-lg overflow-hidden ${
      bidPlaced ? 'border-emerald-300' : 'border-slate-100 hover:border-emerald-300'
    }`}>
      {/* Card Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 px-2 py-1 rounded-full text-white/80">
                Tender #{load.id}
              </span>
              {bidPlaced && (
                <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/30 border border-emerald-400/30 px-2 py-1 rounded-full text-emerald-300">
                  ✓ Bid Submitted
                </span>
              )}
            </div>
            <h3 className="text-lg font-black text-white">{load.materialType}</h3>
            <p className="text-slate-300 text-sm font-medium mt-1">
              {load.source} → {load.destination}
            </p>
          </div>
          {daysLeft !== null && (
            <div className={`text-center px-3 py-2 rounded-2xl ${daysLeft <= 1 ? 'bg-rose-500/30 border border-rose-400/30' : 'bg-white/10'}`}>
              <div className={`text-xl font-black ${daysLeft <= 1 ? 'text-rose-300' : 'text-white'}`}>{daysLeft}</div>
              <div className="text-[9px] text-white/60 font-bold uppercase tracking-wider">days left</div>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center bg-slate-50 rounded-xl p-3">
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Weight</div>
            <div className="text-sm font-black text-slate-900 mt-0.5">{load.weight}T</div>
          </div>
          <div className="text-center bg-emerald-50 rounded-xl p-3">
            <div className="text-[9px] text-emerald-600 font-black uppercase tracking-wider">Budget</div>
            <div className="text-sm font-black text-emerald-700 mt-0.5">₹{load.budget?.toLocaleString('en-IN')}</div>
          </div>
          <div className="text-center bg-slate-50 rounded-xl p-3">
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Pickup</div>
            <div className="text-sm font-black text-slate-900 mt-0.5">
              {load.pickupDate ? new Date(load.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '–'}
            </div>
          </div>
        </div>

        {bidPlaced && myBid && (
          <div className="mb-4 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">Your bid: <strong>₹{myBid.amount?.toLocaleString('en-IN')}</strong></span>
            <StatusPill status={myBid.status} />
          </div>
        )}

        <div className="flex space-x-2">
          <button onClick={onViewDetail}
            className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-sm hover:bg-slate-200 transition-all flex items-center justify-center space-x-1">
            <HiEye className="w-4 h-4" />
            <span>Details</span>
          </button>
          {!bidPlaced ? (
            <TenderBidModal load={load} onBid={onBid} />
          ) : (
            <div className="flex-1 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-black text-sm text-center border border-emerald-200">
              ✓ Bid Placed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── TENDER BID MODAL ────────────────────────────────────────── */
const TenderBidModal = ({ load, onBid }: {
  load: any;
  onBid: (loadId: number, amount: number, vehicleType: string, estimatedDays: number, remarks: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    vehicleType: 'TRUCK',
    estimatedDeliveryDays: '',
    remarks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount) { toast.error('Please enter your bid amount'); return; }
    onBid(
      load.id,
      Number(form.amount),
      form.vehicleType,
      Number(form.estimatedDeliveryDays) || 0,
      form.remarks
    );
    setOpen(false);
    setForm({ amount: '', vehicleType: 'TRUCK', estimatedDeliveryDays: '', remarks: '' });
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black text-sm hover:bg-slate-900 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center space-x-1">
        <HiPlus className="w-4 h-4" />
        <span>Place Bid</span>
      </button>
      {open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] p-10 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition">
              <HiXCircle className="w-8 h-8" />
            </button>
            <div className="mb-8">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Submit Tender Bid</div>
              <h3 className="text-2xl font-black text-slate-900">{load.materialType}</h3>
              <p className="text-slate-500 text-sm mt-1">
                {load.source} → {load.destination} · Budget: <span className="font-black text-emerald-600">₹{load.budget?.toLocaleString('en-IN')}</span>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Bid Amount (₹) *</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">₹</span>
                  <input type="number" required placeholder="Enter competitive bid amount"
                    value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                    className="w-full pl-10 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none font-black text-xl text-slate-900 transition" />
                </div>
                {load.budget && Number(form.amount) > 0 && (
                  <p className={`text-xs font-bold mt-1 ${Number(form.amount) <= load.budget ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {Number(form.amount) <= load.budget ? '✓ Within shipper budget' : '⚠ Above shipper budget'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Vehicle Type</label>
                <select value={form.vehicleType} onChange={e => setForm({ ...form, vehicleType: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-900">
                  {['TRUCK', 'TRAILER', 'CONTAINER', 'TANKER', 'TIPPER', 'PICKUP'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Estimated Delivery (Days)</label>
                <input type="number" min={1} max={30} placeholder="e.g. 3"
                  value={form.estimatedDeliveryDays} onChange={e => setForm({ ...form, estimatedDeliveryDays: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-900" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Message to Shipper (Optional)</label>
                <textarea rows={3} placeholder="e.g. We have experience with similar loads and can guarantee safe delivery..."
                  value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none font-medium text-slate-700 resize-none" />
              </div>
              <button type="submit"
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 hover:bg-slate-900 transition-all">
                Submit Bid →
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

/* ── TENDER DETAIL MODAL ─────────────────────────────────────── */
const TenderDetailModal = ({ load, alreadyBid, myBid, onBid, onClose }: any) => (
  <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
    <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="sticky top-0 bg-white px-8 py-6 border-b border-slate-100 flex items-center justify-between rounded-t-[32px] z-10">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">Tender #{load.id}</div>
          <h2 className="text-2xl font-black text-slate-900">{load.materialType}</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition">
          <HiX className="w-6 h-6 text-slate-400" />
        </button>
      </div>
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            { l: 'Source', v: load.source },
            { l: 'Destination', v: load.destination },
            { l: 'Material', v: load.materialType },
            { l: 'Weight', v: `${load.weight} Tons` },
            { l: 'Budget', v: `₹${load.budget?.toLocaleString('en-IN')}` },
            { l: 'Pickup Date', v: load.pickupDate ? new Date(load.pickupDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '–' },
          ].map(({ l, v }) => (
            <div key={l} className="bg-slate-50 rounded-2xl p-4">
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{l}</div>
              <div className="text-sm font-black text-slate-900">{v}</div>
            </div>
          ))}
        </div>

        {alreadyBid && myBid && (
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Your Submitted Bid</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-emerald-700">₹{myBid.amount?.toLocaleString('en-IN')}</span>
              <StatusPill status={myBid.status} />
            </div>
            {myBid.vehicleType && <p className="text-xs text-emerald-700 mt-1">Vehicle: {myBid.vehicleType} · {myBid.estimatedDeliveryDays} days</p>}
          </div>
        )}

        {!alreadyBid && (
          <TenderBidModal load={load} onBid={(id, amt, vt, days, remarks) => { onBid(id, amt, vt, days, remarks); onClose(); }} />
        )}
      </div>
    </div>
  </div>
);

/* ── SUB-COMPONENTS ─────────────────────────────────────────── */

const SLink = ({ icon, label, active, onClick, badge }: any) => (
  <button onClick={onClick}
    className={`flex items-center w-full px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 ${
      active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'hover:bg-slate-100/80 hover:text-slate-900 text-slate-600'
    }`}>
    <span className={`text-xl mr-3 ${active ? 'text-white' : 'text-slate-400'}`}>{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'}`}>
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({ label, value, icon, color, pulse, onClick }: any) => (
  <button onClick={onClick}
    className={`bg-white p-6 rounded-3xl shadow-sm border border-slate-200 border-b-4 hover:border-emerald-500 transition-all text-left w-full ${pulse ? 'ring-2 ring-rose-200' : ''}`}>
    <div className={`p-3 rounded-xl ${color} text-white shadow-lg inline-flex mb-3 ${pulse ? 'animate-pulse' : ''}`}>{icon}</div>
    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-black text-slate-900">{value}</div>
  </button>
);

const EmptyState = ({ icon, message }: any) => (
  <div className="bg-slate-50 rounded-3xl p-16 flex flex-col items-center justify-center text-center border border-slate-100">
    <div className="text-slate-200 text-5xl mb-4">{icon}</div>
    <p className="text-slate-400 font-bold text-base">{message}</p>
  </div>
);

const SettingRow = ({ label, value }: any) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-black text-slate-900">{value}</span>
  </div>
);

const AssignFleetModal: React.FC<{
  trip: any; drivers: any[]; vehicles: any[];
  onAssign: (tripId: number, driverId: number, vehicleId: number, driverAmount: number) => void;
}> = ({ trip, drivers, vehicles, onAssign }) => {
  const [open, setOpen] = useState(false);
  const [driverId, setDriverId] = useState<number | ''>('');
  const [vehicleId, setVehicleId] = useState<number | ''>('');
  const [driverAmount, setDriverAmount] = useState<number | ''>('');
  const [helperMessage, setHelperMessage] = useState<string>('');
  const [driverVehicles, setDriverVehicles] = useState<any[]>([]);

  const handleDriverChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDriverId = e.target.value === '' ? '' : Number(e.target.value);
    setDriverId(newDriverId);
    setHelperMessage('');
    setVehicleId('');
    setDriverVehicles([]);
    
    if (newDriverId !== '') {
      try {
        const response = await protectedApi.get(`/api/vehicles/driver/${newDriverId}`);
        const vList = response.data;
        setDriverVehicles(vList);
        
        if (vList.length === 1) {
          setVehicleId(vList[0].id);
        } else if (vList.length === 0) {
          setHelperMessage('No vehicle assigned to this driver.');
        } else {
          setHelperMessage('Select a vehicle from the mapped fleet.');
        }
      } catch (err) {
        setHelperMessage('Failed to fetch assigned vehicles.');
      }
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-slate-900 transition-all shadow-md">
        ASSIGN FLEET
      </button>
      {open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition">
              <HiXCircle className="w-8 h-8" />
            </button>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Assign Fleet</h3>
            <p className="text-slate-500 text-sm font-medium mb-8">
              Assign a driver and vehicle for Trip #{trip.id}.
            </p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Driver Payment Amount (₹)</label>
                <input type="number" value={driverAmount} onChange={e => setDriverAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder={`Shipper Amount: ₹${trip.freightAmount}`}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-900" />
                {driverAmount !== '' && (
                  <p className="text-xs font-bold mt-1 text-slate-500">
                    Transporter Margin: <span className="text-emerald-600">₹{(trip.freightAmount - Number(driverAmount)).toLocaleString('en-IN')}</span>
                  </p>
                )}
              </div>
              <div className="mb-4">
                <ProfitEstimatorWidget tripId={trip.id} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Driver</label>
                <select value={driverId} onChange={handleDriverChange}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-900">
                  <option value="">Select a driver…</option>
                  {drivers.map(d => <option key={d.id} value={d.id}>{d.fullName} ({d.mobile})</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Vehicle</label>
                <select value={vehicleId} onChange={e => setVehicleId(e.target.value === '' ? '' : Number(e.target.value))}
                  disabled={driverVehicles.length === 1 || driverId === ''}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-900 disabled:opacity-70">
                  <option value="">{driverId === '' ? 'Select a driver first...' : 'Select a vehicle…'}</option>
                  {driverVehicles.map(v => <option key={v.id} value={v.id}>{v.vehicleNumber} ({v.vehicleType})</option>)}
                </select> {helperMessage && <p className="text-xs text-amber-600 mt-2 font-bold">{helperMessage}</p>}
              </div>
            </div>
            <button
              disabled={
                driverId === '' || 
                vehicleId === '' || 
                driverAmount === '' || 
                Number(driverAmount) <= 0 || 
                Number(driverAmount) > trip.freightAmount
              }
              onClick={() => { onAssign(trip.id, Number(driverId), Number(vehicleId), Number(driverAmount)); setOpen(false); }}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:hover:bg-slate-900">
              Confirm Assignment
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const AddVehicleModal: React.FC<{ onAdd: (data: any) => void }> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ vehicleNumber: '', vehicleType: 'TRUCK', capacity: 10, model: '', manufacturer: '' });
  return (
    <>
      <button onClick={() => setOpen(true)} className="px-5 py-2 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-emerald-600 transition-all shadow-md uppercase">
        + Add Vehicle
      </button>
      {open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900">
              <HiXCircle className="w-8 h-8" />
            </button>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Register Vehicle</h3>
            <p className="text-slate-500 text-sm font-medium mb-8">Add a new truck to your agency fleet.</p>
            <form onSubmit={e => { e.preventDefault(); onAdd(form); setOpen(false); }} className="space-y-4">
              {[
                { label: 'Vehicle Number', key: 'vehicleNumber', placeholder: 'e.g. MH01 AB 1234' },
                { label: 'Model', key: 'model', placeholder: 'e.g. Tata 3118' },
                { label: 'Manufacturer', key: 'manufacturer', placeholder: 'e.g. Tata Motors' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">{f.label}</label>
                  <input required placeholder={f.placeholder}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none font-bold"
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Vehicle Type</label>
                <select value={form.vehicleType} onChange={e => setForm({ ...form, vehicleType: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none font-bold">
                  {['TRUCK', 'TRAILER', 'CONTAINER', 'TANKER', 'TIPPER', 'PICKUP'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Capacity (Tons)</label>
                <input type="number" min={1} max={100} value={form.capacity}
                  onChange={e => setForm({ ...form, capacity: Number(e.target.value) })}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none font-bold" />
              </div>
              <button type="submit"
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 hover:bg-slate-900 transition-all mt-4">
                Add Vehicle
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const FreightCalculator = () => {
  const [form, setForm] = useState({ distance: '', weight: '', fuelRate: 8 });
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const dist = Number(form.distance);
    const wt   = Number(form.weight);
    const fuel = Number(form.fuelRate);
    if (!dist || !wt) return;
    const fuelCost   = (dist / 4) * fuel;
    const tollCost   = dist * 1.5;
    const laborCost  = dist * 2;
    const total      = fuelCost + tollCost + laborCost;
    setResult({ fuelCost, tollCost, laborCost, total, perTon: total / wt });
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Distance (km)',    key: 'distance', placeholder: '500' },
          { label: 'Weight (Tons)',    key: 'weight',   placeholder: '24' },
          { label: 'Diesel Rate (₹/L)',key: 'fuelRate', placeholder: '8' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">{f.label}</label>
            <input type="number" placeholder={f.placeholder} value={(form as any)[f.key]}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none font-bold text-slate-900" />
          </div>
        ))}
      </div>
      <button onClick={calculate}
        className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 hover:bg-slate-900 transition-all mb-8">
        Calculate Freight Cost
      </button>
      {result && (
        <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-4">
          <h3 className="font-black text-lg mb-6 italic">Cost Breakdown</h3>
          {[
            { l: 'Fuel Cost',  v: result.fuelCost },
            { l: 'Toll Cost',  v: result.tollCost },
            { l: 'Labor Cost', v: result.laborCost },
          ].map(({ l, v }) => (
            <div key={l} className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-sm">{l}</span>
              <span className="font-black">₹{v.toFixed(0)}</span>
            </div>
          ))}
          <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
            <span className="font-black text-emerald-400 text-lg">Total Estimate</span>
            <span className="font-black text-2xl text-emerald-400">₹{result.total.toFixed(0)}</span>
          </div>
          <div className="text-slate-400 text-sm font-medium text-center">₹{result.perTon.toFixed(0)} per ton</div>
        </div>
      )}
    </div>
  );
};

export default TransporterDashboard;
