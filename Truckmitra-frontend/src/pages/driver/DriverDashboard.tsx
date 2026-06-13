import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth.hook';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
import { useGpsTracker } from '../../hooks/useGpsTracker';
import { tripService } from '../../services/api/trip.service';
import { toast } from 'react-hot-toast';
import {
  HiChartBar, HiTruck, HiCurrencyDollar, HiCog,
  HiLogout, HiDocumentText, HiLocationMarker,
  HiCheckCircle, HiXCircle, HiUpload,
  HiChevronRight, HiDownload, HiRefresh, HiClock,
  HiUser, HiExclamationCircle, HiClipboardList, HiSpeakerphone,
  HiPhotograph, HiX, HiPlay, HiPause, HiBadgeCheck,
  HiShieldCheck, HiMap, HiLightningBolt, HiFire
} from 'react-icons/hi';
import NotificationDropdown from '../../Components/common/NotificationDropdown';
import LRPreview from '../../Components/common/LRPreview';
import DriverOverview from '../../Components/dashboard/DriverOverview';

/* ─────────────────────────────────────────────────────────────
   TRIP STEP ORDER
────────────────────────────────────────────────────────────── */
const STEP_ORDER = [
  'ASSIGNED', 'ACCEPTED', 'STARTED', 'AT_PICKUP', 'LOADED',
  'IN_TRANSIT', 'AT_DESTINATION', 'DELIVERED', 'POD_UPLOADED',
  'AWAITING_TRANSPORTER_APPROVAL', 'COMPLETED'
];

const TRIP_STEPS = [
  { key: 'ASSIGNED',                      label: 'Assigned',       emoji: '📋' },
  { key: 'ACCEPTED',                      label: 'Accepted',       emoji: '🤝' },
  { key: 'STARTED',                       label: 'Started',        emoji: '🚀' },
  { key: 'AT_PICKUP',                     label: 'At Pickup',      emoji: '📍' },
  { key: 'LOADED',                        label: 'Loaded',         emoji: '📦' },
  { key: 'IN_TRANSIT',                    label: 'In Transit',     emoji: '🚛' },
  { key: 'AT_DESTINATION',               label: 'At Dest',        emoji: '🏢' },
  { key: 'DELIVERED',                     label: 'Delivered',      emoji: '🛑' },
  { key: 'AWAITING_TRANSPORTER_APPROVAL', label: 'Under Review',   emoji: '⏳' },
  { key: 'COMPLETED',                     label: 'Completed',      emoji: '✅' },
];

/* ─── STATUS PILL ────────────────────────────────────────────── */
const STATUS_CFG: Record<string, string> = {
  ASSIGNED:                      'bg-indigo-50 text-indigo-600 border-indigo-100',
  ACCEPTED:                      'bg-teal-50 text-teal-600 border-teal-100',
  STARTED:                       'bg-blue-50 text-blue-600 border-blue-100',
  AT_PICKUP:                     'bg-amber-50 text-amber-600 border-amber-100',
  LOADED:                        'bg-yellow-50 text-yellow-600 border-yellow-100',
  IN_TRANSIT:                    'bg-purple-50 text-purple-600 border-purple-100',
  PAUSED:                        'bg-rose-50 text-rose-600 border-rose-100',
  AT_DESTINATION:                'bg-indigo-50 text-indigo-600 border-indigo-100',
  DELIVERED:                     'bg-pink-50 text-pink-600 border-pink-100',
  POD_UPLOADED:                  'bg-teal-50 text-teal-600 border-teal-100',
  AWAITING_TRANSPORTER_APPROVAL: 'bg-amber-50 text-amber-600 border-amber-100',
  VERIFICATION_REJECTED:         'bg-rose-50 text-rose-600 border-rose-100',
  COMPLETED:                     'bg-emerald-50 text-emerald-600 border-emerald-100',
  REJECTED:                      'bg-rose-50 text-rose-600 border-rose-100',
  REJECTED_BY_DRIVER:            'bg-rose-50 text-rose-600 border-rose-100',
  CANCELLED:                     'bg-slate-100 text-slate-500 border-slate-200',
};

const StatusPill = ({ status, large }: { status: string; large?: boolean }) => (
  <span className={`px-3 ${large ? 'py-2 text-xs' : 'py-1 text-[10px]'} rounded-full font-black uppercase border tracking-tight ${STATUS_CFG[status] || 'bg-slate-50 text-slate-500 border-slate-100'}`}>
    {status?.replace(/_/g, ' ')}
  </span>
);

/* ─── TRIP STEPPER ───────────────────────────────────────────── */
const TripStepper = ({ status }: { status: string }) => {
  const currentIdx = STEP_ORDER.indexOf(status);
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-x-auto">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Trip Progress</h3>
      <div className="relative min-w-[700px]">
        <div className="absolute top-7 left-7 right-7 h-1 bg-slate-100 rounded-full" />
        <div
          className="absolute top-7 left-7 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
          style={{ width: currentIdx <= 0 ? '0%' : `${(currentIdx / (TRIP_STEPS.length - 1)) * 87}%` }}
        />
        <div className="relative flex items-start justify-between">
          {TRIP_STEPS.map((step, i) => {
            const done    = i < currentIdx;
            const current = i === currentIdx;
            return (
              <div key={step.key} className="flex flex-col items-center z-10" style={{ flex: 1 }}>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl border-4 transition-all duration-300 ${
                  done    ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-200' :
                  current ? 'bg-slate-900 border-slate-900 shadow-xl animate-pulse' :
                  'bg-white border-slate-200'
                }`}>
                  <span>{done ? '✅' : step.emoji}</span>
                </div>
                <span className={`mt-3 text-[10px] font-black text-center uppercase tracking-wider leading-tight ${
                  current ? 'text-slate-900' : done ? 'text-emerald-600' : 'text-slate-300'
                }`}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─── ROUTE INTELLIGENCE CARD ────────────────────────────────── */
const RouteIntelCard = ({ trip }: { trip: any }) => {
  if (!trip.distance && !trip.estimatedTravelTimeMins) return null;
  const etaHours = trip.estimatedTravelTimeMins ? Math.floor(trip.estimatedTravelTimeMins / 60) : null;
  const etaMins  = trip.estimatedTravelTimeMins ? trip.estimatedTravelTimeMins % 60 : null;
  const etaText  = etaHours !== null ? `${etaHours}h ${etaMins}m` : '–';

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 border border-slate-700">
      <div className="flex items-center space-x-2 mb-5">
        <HiMap className="text-emerald-400 w-5 h-5" />
        <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Route Intelligence</h3>
        <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">OSRM</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-white">{trip.distance?.toFixed(0) || '–'}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">KM Distance</div>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-amber-400">{etaText}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Est. Travel Time</div>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-indigo-400">{trip.tollPlazaCount ?? '–'}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Toll Plazas</div>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
          <div className="text-lg font-black text-yellow-400">₹{trip.estimatedTollCost?.toFixed(0) ?? trip.totalTollCost?.toFixed(0) ?? '–'}</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Est. Toll Cost</div>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
          <div className="text-lg font-black text-blue-400">{trip.fuelEstimateLiters?.toFixed(1) ?? '–'} L</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Fuel Estimate</div>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
          <div className="text-lg font-black text-green-400">{trip.carbonEmission?.toFixed(1) ?? '–'} kg</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">CO₂ Emission</div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const DriverDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  type Menu = 'overview' | 'driver-management' | 'financial' | 'settings';
  const [activeMenu, setActiveMenu] = useState<Menu>('overview');

  const [trips, setTrips]               = useState<any[]>([]);
  const [activeTripId, setActiveTripId] = useState<number | null>(null);
  const [loading, setLoading]           = useState(true);

  // Modal states
  const [podOpen, setPodOpen]     = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [pickupOpen, setPickupOpen]     = useState(false);
  const [lrOpen, setLrOpen]       = useState(false);
  const [lrData, setLrData]       = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [podData, setPodData]     = useState({ imageUrl: '', signatureUrl: '', remarks: '' });
  const [deliveryData, setDeliveryData] = useState({ deliveryReceiptUrl: '', podUrl: '' });
  const [pickupReceiptUrl, setPickupReceiptUrl] = useState('');
  const [resubmitData, setResubmitData] = useState({ deliveryReceiptUrl: '', podUrl: '' });
  const [resubmitOpen, setResubmitOpen] = useState(false);

  /* ── AUTH GUARD */
  useEffect(() => {
    if (user && user.role !== 'DRIVER') navigate('/dashboard');
  }, [user, navigate]);

  /* ── GPS TRACKING */
  const { isTracking, startTracking, stopTracking } = useGpsTracker(activeTripId);

  /* ── LOAD TRIPS */
  const fetchTrips = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await protectedApi.get(`/api/trips/driver/${user.id}`);
      const data: any[] = res.data || [];
      setTrips(data);
      const active = data.find(t =>
        !['COMPLETED', 'CANCELLED', 'REJECTED', 'REJECTED_BY_DRIVER'].includes(t.status)
      );
      if (active) setActiveTripId(active.id);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [user?.id]);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  const activeTrip = trips.find(t => t.id === activeTripId) || null;

  /* ── TRACKING AUTO-CONTROL */
  useEffect(() => {
    if (activeTrip?.status === 'IN_TRANSIT') {
      if (!isTracking) startTracking();
    } else {
      if (isTracking) stopTracking();
    }
  }, [activeTrip?.status, isTracking, startTracking, stopTracking]);

  /* ── TRIP ACTION HANDLERS */
  const handleAccept = async (tripId: number) => {
    try {
      await protectedApi.post(`/api/trips/${tripId}/accept-assignment`);
      toast.success('Trip accepted! Assignment PDF is being generated.');
      fetchTrips();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to accept trip'); }
  };

  const handleReject = async (tripId: number) => {
    try {
      await protectedApi.post(`/api/trips/${tripId}/reject-assignment`);
      toast.success('Trip rejected.');
      setActiveTripId(null);
      fetchTrips();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject trip');
    }
  };

  /* ── START TRIP — validate pickup receipt + GPS */
  const handleStart = async (tripId: number) => {
    if (!activeTrip?.pickupReceiptUrl && !pickupReceiptUrl) {
      setPickupOpen(true);
      toast.error('Pickup receipt required before starting trip');
      return;
    }
    try {
      if (pickupReceiptUrl && !activeTrip?.pickupReceiptUrl) {
        await tripService.uploadTripPhoto(tripId, pickupReceiptUrl, 'PICKUP');
        await protectedApi.post(`/api/trips/${tripId}/upload-pickup-receipt`, null, {
          params: { receiptUrl: pickupReceiptUrl }
        });
        toast.success('Pickup receipt saved.');
      }
      await protectedApi.post(`/api/trips/${tripId}/location-enabled`);
      await protectedApi.post(`/api/trips/${tripId}/start`);
      toast.success('Trip started! GPS tracking enabled.');
      setPickupReceiptUrl('');
      fetchTrips();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg?.toLowerCase().includes('pickup receipt')) {
        toast.error('Pickup receipt required before starting trip');
      } else if (msg?.toLowerCase().includes('gps') || msg?.toLowerCase().includes('location')) {
        toast.error('Live location must be enabled before starting trip');
      } else {
        toast.error(msg || 'Failed to start trip. Please try again.');
      }
    }
  };

  const handleUpdateStatus = async (tripId: number, status: string) => {
    try {
      await protectedApi.patch(`/api/trips/${tripId}/status`, null, { params: { status } });
      toast.success(`Status updated to ${status.replace(/_/g, ' ')}`);
      fetchTrips();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handlePause = async (tripId: number) => {
    try {
      await protectedApi.post(`/api/trips/${tripId}/pause`);
      toast.success('Trip paused.');
      fetchTrips();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to pause trip');
    }
  };

  const handleResume = async (tripId: number) => {
    try {
      await protectedApi.post(`/api/trips/${tripId}/resume`);
      toast.success('Trip resumed.');
      fetchTrips();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resume trip');
    }
  };

  const handleDeliver = async (tripId: number) => {
    try {
      await protectedApi.post(`/api/trips/${tripId}/deliver`);
      toast.success('Cargo marked as delivered.');
      fetchTrips();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to deliver cargo');
    }
  };

  const handleFileUpload = async (file: File, type: 'pod' | 'signature' | 'deliveryReceipt' | 'deliveryPod' | 'pickup' | 'resubmitReceipt' | 'resubmitPod') => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const res = await protectedApi.post('/api/cloudinary/upload', formData);
      const url = res.data.url || res.data;
      if (type === 'pod') setPodData(prev => ({ ...prev, imageUrl: url }));
      else if (type === 'signature') setPodData(prev => ({ ...prev, signatureUrl: url }));
      else if (type === 'deliveryReceipt') setDeliveryData(prev => ({ ...prev, deliveryReceiptUrl: url }));
      else if (type === 'deliveryPod') setDeliveryData(prev => ({ ...prev, podUrl: url }));
      else if (type === 'pickup') setPickupReceiptUrl(url);
      else if (type === 'resubmitReceipt') setResubmitData(prev => ({ ...prev, deliveryReceiptUrl: url }));
      else if (type === 'resubmitPod') setResubmitData(prev => ({ ...prev, podUrl: url }));
      toast.success('File uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handlePODUpload = async (tripId: number) => {
    if (!podData.imageUrl) { toast.error('Please upload a delivery photo first'); return; }
    setUploading(true);
    try {
      await protectedApi.post(`/api/trips/${tripId}/pod`, podData);
      toast.success('Delivery proof submitted!');
      setPodOpen(false);
      setPodData({ imageUrl: '', signatureUrl: '', remarks: '' });
      fetchTrips();
    } catch { toast.error('Failed to upload delivery proof'); }
    finally { setUploading(false); }
  };

  /* ── SUBMIT DELIVERY (both receipt + POD mandatory) */
  const handleSubmitDelivery = async (tripId: number) => {
    if (!deliveryData.deliveryReceiptUrl) { toast.error('Delivery receipt photo is required'); return; }
    if (!deliveryData.podUrl) { toast.error('POD (Proof of Delivery) is required'); return; }
    setUploading(true);
    try {
      // Upload Destination Photo
      await tripService.uploadTripPhoto(tripId, deliveryData.deliveryReceiptUrl, 'DESTINATION');
      
      // Submit Delivery
      await tripService.submitDelivery(tripId, {
        deliveryReceiptUrl: deliveryData.deliveryReceiptUrl,
        podUrl: deliveryData.podUrl
      });
      toast.success('Delivery submitted for transporter approval!');
      setDeliveryOpen(false);
      setDeliveryData({ deliveryReceiptUrl: '', podUrl: '' });
      fetchTrips();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to submit delivery'); }
    finally { setUploading(false); }
  };

  /* ── UPLOAD PICKUP RECEIPT + ENABLE LOCATION */
  const handlePickupReceiptSave = async (tripId: number) => {
    if (!pickupReceiptUrl) { toast.error('Please upload pickup receipt first'); return; }
    try {
      await tripService.uploadTripPhoto(tripId, pickupReceiptUrl, 'PICKUP');
      await protectedApi.post(`/api/trips/${tripId}/upload-pickup-receipt`, null, {
        params: { receiptUrl: pickupReceiptUrl }
      });
      toast.success('Pickup receipt saved! Now enable GPS and start trip.');
      setPickupOpen(false);
      fetchTrips();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed to save receipt'); }
  };

  /* ── DRIVER RESUBMITS */
  const handleDriverResubmit = async (tripId: number) => {
    if (!resubmitData.deliveryReceiptUrl) { toast.error('Corrected delivery receipt required'); return; }
    if (!resubmitData.podUrl) { toast.error('Corrected POD required'); return; }
    setUploading(true);
    try {
      await tripService.uploadTripPhoto(tripId, resubmitData.deliveryReceiptUrl, 'DESTINATION');
      await tripService.driverResubmit(tripId, {
        deliveryReceiptUrl: resubmitData.deliveryReceiptUrl,
        podUrl: resubmitData.podUrl
      });
      toast.success('Documents re-submitted for transporter approval!');
      setResubmitOpen(false);
      setResubmitData({ deliveryReceiptUrl: '', podUrl: '' });
      fetchTrips();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Re-submission failed'); }
    finally { setUploading(false); }
  };

  const downloadAssignmentPdf = async (tripId: number) => {
    try {
      const res = await protectedApi.get(`/api/trips/${tripId}/assignment-pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      Object.assign(document.createElement('a'), { href: url, download: `assignment_${tripId}.pdf` }).click();
      window.URL.revokeObjectURL(url);
    } catch { toast.error('Assignment PDF not available yet'); }
  };

  const downloadFinalInvoice = async (tripId: number) => {
    try {
      const res = await protectedApi.get(`/api/trips/${tripId}/final-invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      Object.assign(document.createElement('a'), { href: url, download: `final_invoice_${tripId}.pdf` }).click();
      window.URL.revokeObjectURL(url);
    } catch { toast.error('Final invoice not available'); }
  };

  const downloadPdf = async (tripId: number) => {
    try {
      const res = await protectedApi.get(`/api/trips/${tripId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      Object.assign(document.createElement('a'), { href: url, download: `invoice_trip_${tripId}.pdf` }).click();
      window.URL.revokeObjectURL(url);
    } catch { toast.error('Failed to download PDF'); }
  };

  const triggerSOS = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    toast.loading('Sending SOS…', { id: 'sos-toast' });
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        await protectedApi.post('/api/emergency/sos', {
          driverId: user?.id,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        toast.success('SOS Alert Sent!', { id: 'sos-toast' });
      } catch { toast.error('SOS failed', { id: 'sos-toast' }); }
    }, () => toast.error('Location error', { id: 'sos-toast' }));
  };

  const completedTrips = trips.filter(t => t.status === 'COMPLETED');
  const totalEarnings  = completedTrips.reduce((s, t) => s + (t.freightAmount || t.load?.budget || 0), 0);

  /* ── RENDER */
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">

      {/* ─── SIDEBAR */}
      <aside className="w-64 bg-slate-50 min-h-screen text-slate-600 flex flex-col border-r border-slate-200 z-20">
        <div className="p-8 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-center">
            <img src="/logo-transparent.png" alt="TruckMitra" className="w-[180px] h-auto object-contain" />
          </div>
        </div>

        {/* Driver Info */}
        <div className="px-6 py-5 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
              {user?.profileImageUrl
                ? <img src={user.profileImageUrl} alt="" className="w-full h-full object-cover" />
                : <HiUser className="w-7 h-7 text-slate-400" />
              }
            </div>
            <div>
              <div className="text-sm font-black text-slate-900">{user?.fullName}</div>
              <div className="flex items-center space-x-1 mt-0.5">
                <HiBadgeCheck className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Verified Driver</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 mt-6 px-4 space-y-1">
          <SLink icon={<HiChartBar />}      label="Overview"         active={activeMenu === 'overview'}          onClick={() => setActiveMenu('overview')} />
          <SLink
            icon={<HiClipboardList />}
            label={
              <span className="flex items-center w-full justify-between">
                Active Trip
                {activeTrip && !['COMPLETED', 'CANCELLED'].includes(activeTrip.status) && (
                  <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block ml-2 animate-pulse" />
                )}
              </span>
            }
            active={activeMenu === 'driver-management'}
            onClick={() => setActiveMenu('driver-management')}
          />
          <SLink icon={<HiCurrencyDollar />} label="Financial"        active={activeMenu === 'financial'}         onClick={() => setActiveMenu('financial')} />
          <SLink icon={<HiCog />}            label="Settings"         active={activeMenu === 'settings'}          onClick={() => setActiveMenu('settings')} />
        </nav>

        {/* GPS Tracking Status */}
        {isTracking && (
          <div className="mx-4 mb-2 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
            <span className="text-xs font-black text-emerald-700">GPS Active</span>
          </div>
        )}

        {/* SOS Button */}
        <div className="px-4 py-4">
          <button onClick={triggerSOS}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-rose-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all">
            <HiSpeakerphone className="w-5 h-5" />
            <span>EMERGENCY SOS</span>
          </button>
        </div>

        {/* Sign Out */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <button onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center w-full px-4 py-3 text-sm font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
            <HiLogout className="w-5 h-5 mr-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white px-10 py-6 flex items-center justify-between border-b border-slate-200 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900 capitalize">{activeMenu.replace(/-/g, ' ')}</h1>
            <p className="text-slate-500 text-sm font-medium">Driver Control Panel</p>
          </div>
          <div className="flex items-center space-x-3">
            <NotificationDropdown />
            <button onClick={fetchTrips} className="p-2 text-slate-400 hover:text-emerald-500 transition rounded-xl hover:bg-emerald-50">
              <HiRefresh className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        <div className="p-10">

          {/* ══ OVERVIEW ════════════════════════════════════ */}
          {activeMenu === 'overview' && (
            <div className="animate-fadeIn">
              <DriverOverview 
                trips={trips}
                activeTrip={activeTrip}
                completedTrips={completedTrips}
                totalEarnings={totalEarnings}
                setActiveMenu={setActiveMenu}
                downloadAssignmentPdf={downloadAssignmentPdf}
                downloadFinalInvoice={downloadFinalInvoice}
              />
            </div>
          )}

          {/* ══ ACTIVE TRIP MANAGEMENT ═══════════════════════ */}
          {activeMenu === 'driver-management' && (
            <div className="space-y-8 max-w-4xl">
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
                </div>
              ) : !activeTrip ? (
                <div className="space-y-6">
                  <EmptyState icon={<HiClipboardList />} message="No active trip right now. Your transporter will assign you one soon." />
                  {trips.filter(t => t.status === 'ASSIGNED').length > 0 && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
                      <p className="text-blue-700 font-bold text-sm">
                        You have {trips.filter(t => t.status === 'ASSIGNED').length} pending trip assignment(s). Go to Overview to respond.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Trip Info Card */}
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 border-b-4 border-b-emerald-500 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Trip #{activeTrip.id} · {activeTrip.tripNumber}</div>
                        <h2 className="text-2xl font-black text-slate-900">
                          {activeTrip.load?.source} → {activeTrip.load?.destination}
                        </h2>
                      </div>
                      <StatusPill status={activeTrip.status} large />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <InfoChip label="Material"  value={activeTrip.load?.materialType || 'General'} />
                      <InfoChip label="Weight"    value={`${activeTrip.load?.weight || '–'} Tons`} />
                      <InfoChip label="Distance"  value={`${activeTrip.distance?.toFixed(0) || '–'} km`} />
                      <InfoChip label="Freight"   value={`₹${activeTrip.freightAmount || activeTrip.load?.budget || '–'}`} />
                    </div>

                    {/* Route Intelligence */}
                    <RouteIntelCard trip={activeTrip} />

                    {/* Assignment PDF Download */}
                    {activeTrip.assignmentPdfUrl && (
                      <div className="pt-4 border-t border-slate-100 mt-6 flex items-center space-x-4">
                        <button onClick={() => downloadAssignmentPdf(activeTrip.id)}
                          className="flex items-center space-x-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition">
                          <HiDownload className="w-4 h-4" />
                          <span>Assignment PDF</span>
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              // Fetch LR metadata first
                              const res = await protectedApi.get(`/api/lr/trip/${activeTrip.id}`);
                              const lr = res.data;
                              if (lr?.pdfUrl) {
                                // Cloudinary URL exists — open directly in new tab
                                window.open(lr.pdfUrl, '_blank', 'noopener,noreferrer');
                              } else {
                                // Fallback: stream PDF directly from backend (no Cloudinary dependency)
                                const token = localStorage.getItem('accessToken') ?? localStorage.getItem('token');
                                const pdfUrl = `http://localhost:8080/api/lr/trip/${activeTrip.id}/pdf`;
                                // Open with auth — use anchor trick with blob
                                const pdfRes = await protectedApi.get(`/api/lr/trip/${activeTrip.id}/pdf`, {
                                  responseType: 'blob'
                                });
                                const blob = new Blob([pdfRes.data], { type: 'application/pdf' });
                                const blobUrl = window.URL.createObjectURL(blob);
                                window.open(blobUrl, '_blank');
                                setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
                              }
                              // Also show the LR modal with metadata
                              setLrData(res.data);
                              setLrOpen(true);
                            } catch (err: any) {
                              const status = err.response?.status;
                              if (status === 404) {
                                toast.error('Digital LR not generated yet. Try accepting the trip again.');
                              } else if (status === 500) {
                                toast.error('LR generation failed on server. Check backend logs.');
                              } else {
                                toast.error('Could not open Digital LR: ' + (err.response?.data || err.message));
                              }
                            }
                          }}
                          className="flex items-center text-indigo-600 font-black text-sm hover:underline">
                          <HiDocumentText className="w-5 h-5 mr-2" /> View Digital LR
                        </button>
                      </div>
                    )}

                    {/* GPS tracking status */}
                    {activeTrip.status === 'IN_TRANSIT' && (
                      <div className={`p-4 rounded-2xl border flex items-center space-x-3 mt-4 ${isTracking ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${isTracking ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                        <span className={`text-sm font-black ${isTracking ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {isTracking ? 'GPS Location Tracking Active — Transporter can monitor your position' : 'GPS tracking inactive'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* STEP 1: Respond to Assignment (ASSIGNED) */}
                  {activeTrip.status === 'ASSIGNED' && (
                    <StepCard step={1} title="Respond to Assignment" color="blue">
                      <p className="text-slate-500 font-medium text-sm mb-6">
                        Review the trip details above and confirm your availability.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => handleAccept(activeTrip.id)}
                          className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-slate-900 transition-all shadow-lg shadow-emerald-100">
                          ✓ Accept Trip
                        </button>
                        <button onClick={() => handleReject(activeTrip.id)}
                          className="flex-1 py-5 bg-rose-50 text-rose-600 border-2 border-rose-100 rounded-2xl font-black text-lg hover:bg-rose-600 hover:text-white transition-all">
                          ✗ Reject
                        </button>
                      </div>
                    </StepCard>
                  )}

                  {/* STEP 2: Start Trip (ACCEPTED) — requires pickup receipt + GPS */}
                  {activeTrip.status === 'ACCEPTED' && (
                    <StepCard step={2} title="Prepare & Start Journey" color="amber">
                      <div className="space-y-4 mb-6">
                        {/* Pickup Receipt Status */}
                        <div className={`p-4 rounded-2xl border flex items-center justify-between ${activeTrip.pickupReceiptUrl || pickupReceiptUrl ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                          <div className="flex items-center space-x-3">
                            {activeTrip.pickupReceiptUrl || pickupReceiptUrl
                              ? <HiCheckCircle className="w-6 h-6 text-emerald-500" />
                              : <HiExclamationCircle className="w-6 h-6 text-amber-500" />
                            }
                            <div>
                              <div className={`font-black text-sm ${activeTrip.pickupReceiptUrl || pickupReceiptUrl ? 'text-emerald-700' : 'text-amber-700'}`}>
                                Pickup Receipt
                              </div>
                              <div className="text-xs text-slate-500">Required before starting trip</div>
                            </div>
                          </div>
                          {!(activeTrip.pickupReceiptUrl || pickupReceiptUrl) && (
                            <button onClick={() => setPickupOpen(true)}
                              className="px-4 py-2 bg-amber-500 text-white rounded-xl font-black text-sm hover:bg-amber-600 transition">
                              Upload
                            </button>
                          )}
                        </div>

                        {/* GPS Status */}
                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center space-x-3">
                          <HiLocationMarker className="w-6 h-6 text-indigo-500" />
                          <div>
                            <div className="font-black text-sm text-slate-700">GPS Location</div>
                            <div className="text-xs text-slate-500">Will be enabled automatically when you start the trip</div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleStart(activeTrip.id)}
                        disabled={!(activeTrip.pickupReceiptUrl || pickupReceiptUrl)}
                        className="w-full py-6 bg-amber-500 text-white rounded-[20px] text-xl font-black hover:bg-slate-900 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        <HiPlay className="inline w-6 h-6 mr-2" /> START JOURNEY
                      </button>
                    </StepCard>
                  )}

                  {/* STEP 3: Arrived at Pickup (STARTED) */}
                  {activeTrip.status === 'STARTED' && (
                    <StepCard step={3} title="Arrived at Pickup Point" color="blue">
                      <p className="text-slate-500 font-medium text-sm mb-6">
                        Click below once you have arrived at the source/pickup location.
                      </p>
                      <button onClick={() => handleUpdateStatus(activeTrip.id, 'AT_PICKUP')}
                        className="w-full py-6 bg-blue-600 text-white rounded-[20px] text-xl font-black hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center space-x-2">
                        <HiLocationMarker className="w-6 h-6" /> <span>ARRIVED AT PICKUP</span>
                      </button>
                    </StepCard>
                  )}

                  {/* STEP 4: Confirm Cargo Loaded (AT_PICKUP) */}
                  {activeTrip.status === 'AT_PICKUP' && (
                    <StepCard step={4} title="Confirm Cargo Loaded" color="yellow">
                      <p className="text-slate-500 font-medium text-sm mb-6">
                        Confirm once all goods have been loaded onto the vehicle.
                      </p>
                      <button onClick={() => handleUpdateStatus(activeTrip.id, 'LOADED')}
                        className="w-full py-6 bg-yellow-500 text-white rounded-[20px] text-xl font-black hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center space-x-2">
                        <HiCheckCircle className="w-6 h-6" /> <span>CARGO LOADED</span>
                      </button>
                    </StepCard>
                  )}

                  {/* STEP 5: Start Transit (LOADED) */}
                  {activeTrip.status === 'LOADED' && (
                    <StepCard step={5} title="Start Transit to Destination" color="purple">
                      <p className="text-slate-500 font-medium text-sm mb-6">
                        Start transit to activate live tracking.
                      </p>
                      <button onClick={() => handleUpdateStatus(activeTrip.id, 'IN_TRANSIT')}
                        className="w-full py-6 bg-indigo-600 text-white rounded-[20px] text-xl font-black hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center space-x-2">
                        <HiPlay className="w-6 h-6" /> <span>START TRANSIT</span>
                      </button>
                    </StepCard>
                  )}

                  {/* STEP 6: In Transit */}
                  {activeTrip.status === 'IN_TRANSIT' && (
                    <StepCard step={6} title="On Trip — Active Tracking" color="emerald">
                      <div className="flex flex-col gap-4 mt-6">
                        <button onClick={() => handlePause(activeTrip.id)}
                          className="w-full py-5 bg-slate-100 text-slate-700 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all flex items-center justify-center space-x-2">
                          <HiPause className="w-5 h-5" /> <span>PAUSE TRIP</span>
                        </button>
                        <button onClick={() => handleUpdateStatus(activeTrip.id, 'AT_DESTINATION')}
                          className="w-full py-6 bg-emerald-600 text-white rounded-[20px] text-xl font-black hover:bg-slate-900 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center space-x-2">
                          <HiLocationMarker className="w-6 h-6" /> <span>ARRIVED AT DESTINATION</span>
                        </button>
                      </div>
                    </StepCard>
                  )}

                  {/* STEP 6 PAUSED */}
                  {activeTrip.status === 'PAUSED' && (
                    <StepCard step={6} title="Trip Paused" color="rose">
                      <p className="text-slate-500 font-medium text-sm mb-6">Trip is currently paused.</p>
                      <button onClick={() => handleResume(activeTrip.id)}
                        className="w-full py-6 bg-emerald-600 text-white rounded-[20px] text-xl font-black hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center space-x-2">
                        <HiPlay className="w-6 h-6" /> <span>RESUME TRIP</span>
                      </button>
                    </StepCard>
                  )}

                  {/* STEP 7: Arrived at Destination */}
                  {activeTrip.status === 'AT_DESTINATION' && (
                    <StepCard step={7} title="Arrived at Destination" color="pink">
                      <p className="text-slate-500 font-medium text-sm mb-6">
                        Mark cargo as delivered to proceed to document upload.
                      </p>
                      <button onClick={() => handleDeliver(activeTrip.id)}
                        className="w-full py-6 bg-pink-600 text-white rounded-[20px] text-xl font-black hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center space-x-2">
                        <HiCheckCircle className="w-6 h-6" /> <span>MARK CARGO DELIVERED</span>
                      </button>
                    </StepCard>
                  )}

                  {/* STEP 8: Submit Delivery (both receipt + POD mandatory) */}
                  {(activeTrip.status === 'DELIVERED' || activeTrip.status === 'POD_UPLOADED') && (
                    <StepCard step={8} title="Submit Delivery Documents" color="purple">
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                        <p className="text-amber-800 font-black text-sm">⚠️ Both documents are mandatory to complete submission:</p>
                        <ul className="text-amber-700 text-sm mt-2 space-y-1">
                          <li>• Delivery Receipt Photo</li>
                          <li>• Proof of Delivery (POD) Photo</li>
                        </ul>
                      </div>
                      <button onClick={() => setDeliveryOpen(true)}
                        className="w-full py-6 bg-purple-600 text-white rounded-[20px] text-xl font-black hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center space-x-2">
                        <HiUpload className="w-6 h-6" /> <span>UPLOAD & SUBMIT DELIVERY</span>
                      </button>
                    </StepCard>
                  )}

                  {/* STEP 9: Awaiting Transporter Approval */}
                  {activeTrip.status === 'AWAITING_TRANSPORTER_APPROVAL' && (
                    <StepCard step={9} title="Awaiting Transporter Approval" color="teal">
                      <div className="flex flex-col items-center py-8 space-y-4">
                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
                          <HiClock className="w-10 h-10 text-amber-500 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Documents Under Review</h3>
                        <p className="text-slate-500 font-medium text-center max-w-sm">
                          Your delivery receipt and POD have been submitted. The transporter is reviewing your documents.
                          You will be notified once they accept or reject.
                        </p>
                      </div>
                    </StepCard>
                  )}

                  {/* STEP 9b: Rejected by Transporter — Show reason + re-submit */}
                  {activeTrip.status === 'REJECTED_BY_TRANSPORTER' && (
                    <StepCard step={9} title="Trip Rejected By Transporter" color="rose">
                      {/* Alert Banner */}
                      <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-5 mb-6 text-white">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <HiExclamationCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase tracking-widest">Delivery Rejected</p>
                            <p className="text-rose-100 text-xs font-medium">You must correct and re-submit your documents</p>
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                          <p className="text-[10px] font-black uppercase tracking-widest text-rose-200 mb-1">Rejection Reason from Transporter:</p>
                          <p className="text-white font-bold text-sm leading-relaxed">
                            "{activeTrip.rejectionReason || 'No reason provided. Please contact your transporter.'}"
                          </p>
                        </div>
                      </div>

                      {/* What to do next */}
                      <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Steps to Re-Submit</p>
                        <div className="space-y-2">
                          {[
                            { n: '1', t: 'Upload a clearer Delivery Photo / Receipt' },
                            { n: '2', t: 'Upload a valid Proof of Delivery (POD)' },
                            { n: '3', t: 'Click Re-Submit for Transporter Approval' },
                          ].map(s => (
                            <div key={s.n} className="flex items-center space-x-3">
                              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-black flex items-center justify-center flex-shrink-0">{s.n}</div>
                              <p className="text-sm font-medium text-slate-600">{s.t}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button onClick={() => setResubmitOpen(true)}
                        className="w-full py-6 bg-indigo-600 text-white rounded-[20px] text-xl font-black hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center space-x-2">
                        <HiUpload className="w-6 h-6" /> <span>RESUBMIT CORRECTED DOCUMENTS</span>
                      </button>
                    </StepCard>
                  )}

                  {/* STEP 10: Completed */}
                  {activeTrip.status === 'COMPLETED' && (
                    <StepCard step={10} title="Trip Successfully Completed!" color="emerald">
                      {/* Success Banner */}
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 mb-6 text-white text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <HiCheckCircle className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-black mb-1">Excellent Work!</h3>
                        <p className="text-emerald-100 font-medium text-sm">Transporter has verified and accepted your delivery.</p>
                        {activeTrip.completedAt && (
                          <div className="mt-3 inline-block bg-white/15 rounded-xl px-4 py-2">
                            <p className="text-xs font-black uppercase tracking-widest text-emerald-100">Completion Date</p>
                            <p className="font-black text-white">{new Date(activeTrip.completedAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                        )}
                      </div>

                      {/* Download Links */}
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Download Documents</p>
                        <div className="grid grid-cols-1 gap-3">
                          <button onClick={() => downloadFinalInvoice(activeTrip.id)}
                            className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl hover:border-emerald-400 hover:bg-emerald-100 transition-all group">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                <HiDownload className="w-5 h-5 text-white" />
                              </div>
                              <div className="text-left">
                                <p className="font-black text-slate-900 text-sm">Final Invoice PDF</p>
                                <p className="text-xs text-slate-400 font-medium">Complete payment invoice</p>
                              </div>
                            </div>
                            <HiDownload className="w-5 h-5 text-emerald-500 group-hover:text-emerald-700" />
                          </button>
                          <button onClick={() => downloadAssignmentPdf(activeTrip.id)}
                            className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl hover:border-indigo-400 hover:bg-indigo-100 transition-all group">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                                <HiDocumentText className="w-5 h-5 text-white" />
                              </div>
                              <div className="text-left">
                                <p className="font-black text-slate-900 text-sm">Assignment PDF</p>
                                <p className="text-xs text-slate-400 font-medium">Trip assignment letter</p>
                              </div>
                            </div>
                            <HiDownload className="w-5 h-5 text-indigo-500 group-hover:text-indigo-700" />
                          </button>
                          {activeTrip.podImageUrl && (
                            <a href={activeTrip.podImageUrl} target="_blank" rel="noreferrer"
                              className="flex items-center justify-between p-4 bg-purple-50 border border-purple-100 rounded-2xl hover:border-purple-400 hover:bg-purple-100 transition-all group">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                                  <HiPhotograph className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                  <p className="font-black text-slate-900 text-sm">Proof of Delivery (POD)</p>
                                  <p className="text-xs text-slate-400 font-medium">Delivery photo / signature</p>
                                </div>
                              </div>
                              <HiDownload className="w-5 h-5 text-purple-500 group-hover:text-purple-700" />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-center text-sm text-emerald-600 font-black">🎉 Payment will be released as per agreement</p>
                    </StepCard>
                  )}

                  {/* Trip Stepper */}
                  <TripStepper status={activeTrip.status} />

                  {/* ── PICKUP RECEIPT MODAL */}
                  {pickupOpen && (
                    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
                      <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl relative">
                        <button onClick={() => setPickupOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900">
                          <HiXCircle className="w-8 h-8" />
                        </button>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Upload Pickup Receipt</h3>
                        <p className="text-slate-500 text-sm font-medium mb-8">
                          Required before starting the trip. Confirm you've picked up the cargo.
                        </p>
                        <div className="space-y-6">
                          {pickupReceiptUrl ? (
                            <div className="relative">
                              <img src={pickupReceiptUrl} alt="Pickup Receipt" className="w-full h-40 object-cover rounded-2xl" />
                              <button onClick={() => setPickupReceiptUrl('')}
                                className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1">
                                <HiX className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all">
                              <HiPhotograph className="w-10 h-10 text-slate-300 mb-2" />
                              <span className="text-sm font-bold text-slate-400">Click to upload pickup receipt</span>
                              <input type="file" accept="image/*" className="hidden"
                                onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pickup')} />
                            </label>
                          )}
                          <button
                            disabled={!pickupReceiptUrl || uploading}
                            onClick={() => handlePickupReceiptSave(activeTrip.id)}
                            className="w-full py-5 bg-amber-500 text-white rounded-2xl font-black text-lg disabled:opacity-50 hover:bg-slate-900 transition-all">
                            {uploading ? 'Saving…' : 'SAVE PICKUP RECEIPT'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── DELIVERY SUBMISSION MODAL */}
                  {deliveryOpen && (
                    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
                      <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setDeliveryOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900">
                          <HiXCircle className="w-8 h-8" />
                        </button>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Submit Delivery</h3>
                        <p className="text-slate-500 text-sm font-medium mb-8">Both documents are mandatory for completion.</p>
                        <div className="space-y-6">
                          {/* Delivery Receipt */}
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">
                              Delivery Receipt <span className="text-rose-500">*</span>
                            </label>
                            {deliveryData.deliveryReceiptUrl ? (
                              <div className="relative mb-3">
                                <img src={deliveryData.deliveryReceiptUrl} alt="Receipt" className="w-full h-40 object-cover rounded-2xl" />
                                <button onClick={() => setDeliveryData(prev => ({ ...prev, deliveryReceiptUrl: '' }))}
                                  className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1">
                                  <HiX className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all">
                                <HiPhotograph className="w-10 h-10 text-slate-300 mb-2" />
                                <span className="text-sm font-bold text-slate-400">Upload delivery receipt</span>
                                <input type="file" accept="image/*" className="hidden"
                                  onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'deliveryReceipt')} />
                              </label>
                            )}
                          </div>
                          {/* POD */}
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">
                              Proof of Delivery (POD) <span className="text-rose-500">*</span>
                            </label>
                            {deliveryData.podUrl ? (
                              <div className="relative mb-3">
                                <img src={deliveryData.podUrl} alt="POD" className="w-full h-40 object-cover rounded-2xl" />
                                <button onClick={() => setDeliveryData(prev => ({ ...prev, podUrl: '' }))}
                                  className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1">
                                  <HiX className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all">
                                <HiPhotograph className="w-10 h-10 text-slate-300 mb-2" />
                                <span className="text-sm font-bold text-slate-400">Upload POD photo</span>
                                <input type="file" accept="image/*" className="hidden"
                                  onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'deliveryPod')} />
                              </label>
                            )}
                          </div>
                          <button
                            disabled={!deliveryData.deliveryReceiptUrl || !deliveryData.podUrl || uploading}
                            onClick={() => handleSubmitDelivery(activeTrip.id)}
                            className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black text-lg disabled:opacity-50 hover:bg-slate-900 transition-all shadow-lg">
                            {uploading ? 'Submitting…' : 'SUBMIT FOR TRANSPORTER APPROVAL'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── RESUBMIT MODAL */}
                  {resubmitOpen && (
                    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
                      <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setResubmitOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900">
                          <HiXCircle className="w-8 h-8" />
                        </button>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Re-Submit Documents</h3>
                        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6">
                          <p className="text-rose-700 font-bold text-sm">Rejection Reason: {activeTrip.rejectionReason}</p>
                        </div>
                        <div className="space-y-6">
                          {/* Corrected Receipt */}
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Corrected Delivery Receipt <span className="text-rose-500">*</span></label>
                            {resubmitData.deliveryReceiptUrl ? (
                              <div className="relative mb-3">
                                <img src={resubmitData.deliveryReceiptUrl} alt="Receipt" className="w-full h-40 object-cover rounded-2xl" />
                                <button onClick={() => setResubmitData(prev => ({ ...prev, deliveryReceiptUrl: '' }))}
                                  className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1"><HiX className="w-4 h-4" /></button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-rose-200 rounded-2xl cursor-pointer hover:border-rose-400 transition-all">
                                <HiPhotograph className="w-10 h-10 text-slate-300 mb-2" />
                                <span className="text-sm font-bold text-slate-400">Upload corrected receipt</span>
                                <input type="file" accept="image/*" className="hidden"
                                  onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'resubmitReceipt')} />
                              </label>
                            )}
                          </div>
                          {/* Corrected POD */}
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Corrected POD <span className="text-rose-500">*</span></label>
                            {resubmitData.podUrl ? (
                              <div className="relative mb-3">
                                <img src={resubmitData.podUrl} alt="POD" className="w-full h-40 object-cover rounded-2xl" />
                                <button onClick={() => setResubmitData(prev => ({ ...prev, podUrl: '' }))}
                                  className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1"><HiX className="w-4 h-4" /></button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-rose-200 rounded-2xl cursor-pointer hover:border-rose-400 transition-all">
                                <HiPhotograph className="w-10 h-10 text-slate-300 mb-2" />
                                <span className="text-sm font-bold text-slate-400">Upload corrected POD</span>
                                <input type="file" accept="image/*" className="hidden"
                                  onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'resubmitPod')} />
                              </label>
                            )}
                          </div>
                          <button
                            disabled={!resubmitData.deliveryReceiptUrl || !resubmitData.podUrl || uploading}
                            onClick={() => handleDriverResubmit(activeTrip.id)}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg disabled:opacity-50 hover:bg-slate-900 transition-all shadow-lg">
                            {uploading ? 'Submitting…' : 'RE-SUBMIT FOR APPROVAL'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Legacy POD Modal */}
                  {podOpen && (
                    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
                      <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setPodOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900">
                          <HiXCircle className="w-8 h-8" />
                        </button>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Proof of Delivery</h3>
                        <p className="text-slate-500 text-sm font-medium mb-8">Upload delivery evidence.</p>
                        <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Delivery Photo <span className="text-rose-500">*</span></label>
                            {podData.imageUrl ? (
                              <div className="relative mb-3">
                                <img src={podData.imageUrl} alt="POD" className="w-full h-40 object-cover rounded-2xl" />
                                <button onClick={() => setPodData(prev => ({ ...prev, imageUrl: '' }))}
                                  className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1"><HiX className="w-4 h-4" /></button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all">
                                <HiPhotograph className="w-10 h-10 text-slate-300 mb-2" />
                                <span className="text-sm font-bold text-slate-400">Click to upload photo</span>
                                <input type="file" accept="image/*" className="hidden"
                                  onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pod')} />
                              </label>
                            )}
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Remarks (optional)</label>
                            <textarea
                              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-medium text-sm resize-none"
                              placeholder="Any delivery notes…"
                              rows={3}
                              value={podData.remarks}
                              onChange={e => setPodData(prev => ({ ...prev, remarks: e.target.value }))}
                            />
                          </div>
                          <button
                            disabled={!podData.imageUrl || uploading}
                            onClick={() => handlePODUpload(activeTrip.id)}
                            className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg disabled:opacity-50 hover:bg-slate-900 transition-all shadow-lg">
                            {uploading ? 'Processing…' : 'CONFIRM DELIVERY'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ FINANCIAL ════════════════════════════════════ */}
          {activeMenu === 'financial' && (
            <div className="space-y-8 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Earned"    value={`₹${totalEarnings.toLocaleString()}`}
                  icon={<HiCurrencyDollar />} color="bg-emerald-500" />
                <StatCard label="Completed Trips" value={completedTrips.length}
                  icon={<HiCheckCircle />}    color="bg-indigo-600" />
                <StatCard label="Avg per Trip"    value={completedTrips.length ? `₹${Math.round(totalEarnings / completedTrips.length).toLocaleString()}` : '₹0'}
                  icon={<HiChartBar />}       color="bg-amber-500" />
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-black mb-6">Trip History / Completed Trips</h3>
                {completedTrips.length === 0 ? (
                  <EmptyState icon={<HiCheckCircle />} message="No completed trips yet." />
                ) : (
                  <div className="space-y-4">
                    {completedTrips.map((t: any) => (
                      <div key={t.id} className="flex flex-col p-5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md bg-emerald-50/10 transition-all space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-black text-slate-900 text-lg">{t.load?.source} → {t.load?.destination}</div>
                            <div className="flex items-center flex-wrap gap-2 mt-1.5">
                              <span className="text-xs font-bold text-slate-400">Trip #{t.id}</span>
                              {t.vehicle?.vehicleNumber && (
                                <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                                  <HiTruck className="w-3 h-3" />
                                  <span>{t.vehicle.vehicleNumber}</span>
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 mt-2 font-bold flex items-center space-x-2">
                              <span>Completed: {t.completedAt ? new Date(t.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                            </div>
                          </div>
                          <div className="text-xl font-black text-emerald-600">₹{(t.freightAmount || t.load?.budget || 0).toLocaleString()}</div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                          {/* LR Actions */}
                          <div className="flex space-x-1">
                            <button onClick={() => t.assignmentPdfUrl ? window.open(t.assignmentPdfUrl, '_blank') : downloadAssignmentPdf(t.id)} className="px-3 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all border border-blue-100">View LR</button>
                            <button onClick={() => downloadAssignmentPdf(t.id)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100" title="Download LR"><HiDownload className="w-4 h-4" /></button>
                          </div>
                          {/* POD Actions */}
                          {t.podUrl && (
                            <div className="flex space-x-1">
                              <button onClick={() => window.open(t.podUrl, '_blank')} className="px-3 py-2 bg-amber-50 text-amber-600 rounded-xl font-bold text-xs hover:bg-amber-600 hover:text-white transition-all border border-amber-100">View POD</button>
                              <button onClick={() => {
                                const a = document.createElement('a');
                                a.href = t.podUrl;
                                a.target = '_blank';
                                a.download = `POD_Trip_${t.id}`;
                                a.click();
                              }} className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all border border-amber-100" title="Download POD"><HiDownload className="w-4 h-4" /></button>
                            </div>
                          )}
                          {/* Invoice Actions */}
                          <div className="flex space-x-1">
                            <button onClick={() => (t.finalInvoicePdfUrl || t.tripPdfUrl) ? window.open(t.finalInvoicePdfUrl || t.tripPdfUrl, '_blank') : downloadFinalInvoice(t.id)} className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100">View Invoice</button>
                            <button onClick={() => downloadFinalInvoice(t.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100" title="Download Invoice"><HiDownload className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ SETTINGS ════════════════════════════════════ */}
          {activeMenu === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-black mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <SettingRow label="Full Name"      value={user?.fullName || '–'} />
                  <SettingRow label="Mobile"         value={user?.mobile || '–'} />
                  <SettingRow label="Email"          value={user?.email || '–'} />
                  <SettingRow label="Account Status" value={user?.accountStatus || 'VERIFIED'} />
                </div>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-black mb-2 text-rose-600">Danger Zone</h3>
                <p className="text-slate-400 font-medium text-sm mb-6">These actions are irreversible.</p>
                <button onClick={() => { logout(); navigate('/login'); }}
                  className="flex items-center space-x-3 px-8 py-4 bg-rose-50 text-rose-600 border-2 border-rose-100 rounded-2xl font-black hover:bg-rose-600 hover:text-white transition-all">
                  <HiLogout className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* LR Preview Modal */}
      {lrOpen && <LRPreview lr={lrData} onClose={() => setLrOpen(false)} />}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
────────────────────────────────────────────────────────────── */
const SLink = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick}
    className={`flex items-center w-full px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 ${
      active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'hover:bg-slate-100/80 hover:text-slate-900 text-slate-600'
    }`}>
    <span className={`text-xl mr-3 ${active ? 'text-white' : 'text-slate-400'}`}>{icon}</span>
    {label}
  </button>
);

const StatCard = ({ label, value, icon, color }: any) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 border-b-4 hover:border-emerald-500 transition-all group overflow-hidden relative">
    <div className={`p-4 rounded-2xl ${color} text-white shadow-lg inline-flex mb-4`}>{icon}</div>
    <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-black text-slate-900">{value}</div>
  </div>
);

const StepCard = ({ step, title, color, children }: any) => {
  const borders: any = {
    blue:   'border-b-blue-500',
    amber:  'border-b-amber-500',
    yellow: 'border-b-yellow-500',
    purple: 'border-b-purple-600',
    rose:   'border-b-rose-500',
    emerald:'border-b-emerald-500',
    pink:   'border-b-pink-500',
    teal:   'border-b-teal-500',
  };
  return (
    <div className={`bg-white rounded-3xl p-8 border border-slate-200 border-b-4 shadow-sm ${borders[color] || ''}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">{step}</div>
        <h3 className="text-xl font-black text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const InfoChip = ({ label, value }: any) => (
  <div className="bg-slate-50 rounded-2xl p-4 text-center">
    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</div>
    <div className="text-sm font-black text-slate-900">{value}</div>
  </div>
);

const EmptyState = ({ icon, message }: any) => (
  <div className="bg-slate-50 rounded-3xl p-20 flex flex-col items-center justify-center text-center border border-slate-100">
    <div className="text-slate-200 text-6xl mb-4">{icon}</div>
    <p className="text-slate-400 font-bold text-lg">{message}</p>
  </div>
);

const SettingRow = ({ label, value }: any) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-black text-slate-900">{value}</span>
  </div>
);

export default DriverDashboard;