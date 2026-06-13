import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, HiCheckCircle, HiXCircle, HiDownload, HiZoomIn, 
  HiDocumentText, HiPhotograph, HiClipboardList, HiInformationCircle,
  HiGlobe, HiClock, HiCurrencyDollar, HiUser
} from 'react-icons/hi';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
import { toast } from 'react-hot-toast';

type TabOption = 'summary' | 'lr' | 'pod' | 'pickup' | 'destination';

export default function DeliveryVerificationCenter({ trip, onClose, onDone }: any) {
  const [activeTab, setActiveTab] = useState<TabOption>('summary');
  const [photos, setPhotos] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);

  const podImage   = trip.podImageUrl || trip.receiptVerification?.imageUrl;
  const signature  = trip.podSignatureUrl || trip.receiptVerification?.signatureUrl;
  const remarks    = trip.podRemarks || trip.receiptVerification?.remarks;
  const lrUrl      = trip.lrPdfUrl || null;

  useEffect(() => {
    setLoadingPhotos(true);
    protectedApi.get(`/api/trips/${trip.id}/photos`)
      .then(r => setPhotos(Array.isArray(r.data) ? r.data : (r.data?.data || [])))
      .catch(() => setPhotos([]))
      .finally(() => setLoadingPhotos(false));
  }, [trip.id]);

  const pickupPhotos      = photos.filter(p => p.photoType === 'PICKUP' || p.type === 'PICKUP');
  const destinationPhotos = photos.filter(p => p.photoType === 'DESTINATION' || p.type === 'DESTINATION');

  const handleAccept = async () => {
    setLoading(true);
    try {
      await protectedApi.post(`/api/trips/${trip.id}/transporter-accept`);
      toast.success('✅ Delivery Verified! Final invoice generated & driver notified.');
      onDone(); onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to accept delivery');
    } finally { setLoading(false); }
  };

  const handleReject = async () => {
    if (!reason.trim()) { setReasonError(true); toast.error('Rejection reason is mandatory'); return; }
    setReasonError(false);
    setLoading(true);
    try {
      await protectedApi.post(`/api/trips/${trip.id}/transporter-reject`, { rejectionReason: reason });
      toast.success('❌ Delivery rejected. Driver will be notified to re-submit.');
      onDone(); onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to reject delivery');
    } finally { setLoading(false); }
  };

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    a.click();
  };

  // ─── COMPONENTS ────────────────────────────────────────────────────────
  
  const PhotoGallery = ({ items, title }: { items: any[], title: string }) => (
    items.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
        <HiPhotograph className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">No {title.toLowerCase()} uploaded</p>
      </div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((p: any, i: number) => (
          <div key={i} className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm aspect-square">
            <img src={p.photoUrl || p.url} alt={`${title} ${i+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-all duration-300 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100">
              <div className="flex justify-end space-x-2">
                <button onClick={() => setZoomedPhoto(p.photoUrl || p.url)} className="w-10 h-10 bg-white/20 hover:bg-brand backdrop-blur-md rounded-xl flex items-center justify-center text-white transition">
                  <HiZoomIn className="w-5 h-5" />
                </button>
                <button onClick={() => handleDownload(p.photoUrl || p.url, `${title}_${i+1}`)} className="w-10 h-10 bg-white/20 hover:bg-brand backdrop-blur-md rounded-xl flex items-center justify-center text-white transition">
                  <HiDownload className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <p className="text-white text-xs font-bold truncate">Uploaded By: {trip.driver?.fullName || 'Driver'}</p>
                <p className="text-slate-400 text-[10px] uppercase mt-1">{new Date(p.createdAt || new Date()).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  );

  return (
    <div className="fixed inset-0 z-[100] flex animate-fadeIn overflow-hidden bg-slate-900/90 backdrop-blur-md p-4 md:p-8">
      
      {/* Zoom Modal */}
      {zoomedPhoto && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setZoomedPhoto(null)}>
          <img src={zoomedPhoto} alt="Zoomed" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
        
        {/* HEADER */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center border border-amber-200 dark:border-amber-500/30">
              <HiClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-3">
                <span>Delivery Verification Center</span>
                {trip.status === 'COMPLETED' ? (
                  <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] uppercase tracking-widest rounded-full font-black">Verified & Completed</span>
                ) : (
                  <span className="px-3 py-1 bg-amber-500 text-white text-[10px] uppercase tracking-widest rounded-full font-black animate-pulse">Action Required</span>
                )}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Trip #{trip.id} · {trip.load?.source} → {trip.load?.destination}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-500 transition">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* METRICS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 divide-x divide-y md:divide-y-0 divide-slate-100 dark:divide-slate-800">
          <div className="p-4 text-center">
            <div className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Pending</div>
            <div className="text-2xl font-black text-amber-500">1</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Approved Today</div>
            <div className="text-2xl font-black text-emerald-500">14</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Rejected Today</div>
            <div className="text-2xl font-black text-rose-500">2</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Avg Approval Time</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">12m</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* SIDEBAR TABS */}
          <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 p-4 space-y-2 overflow-y-auto">
            {(['summary', 'lr', 'pod', 'pickup', 'destination'] as TabOption[]).map(tab => {
              const labels: Record<string, string> = { summary: 'Trip Summary', lr: 'Digital LR', pod: 'Proof of Delivery', pickup: 'Pickup Photos', destination: 'Dest Photos' };
              const icons: Record<string, any> = { summary: <HiInformationCircle/>, lr: <HiDocumentText/>, pod: <HiCheckCircle/>, pickup: <HiPhotograph/>, destination: <HiPhotograph/> };
              const counts: Record<string, number | null> = { pickup: pickupPhotos.length, destination: destinationPhotos.length };
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${activeTab === tab ? 'bg-slate-900 dark:bg-brand text-white shadow-lg shadow-slate-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-bold'}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-5 h-5 ${activeTab === tab ? 'text-white' : 'text-slate-400'}`}>{icons[tab]}</span>
                    <span className="text-sm font-black tracking-wide">{labels[tab]}</span>
                  </div>
                  {counts[tab] !== null && counts[tab] !== undefined && (
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                      {counts[tab]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-100/50 dark:bg-slate-900/50">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                
                {/* 1. SUMMARY */}
                {activeTab === 'summary' && (
                  <div className="max-w-3xl space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                      <h3 className="text-xl font-black mb-6 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Route Details</h3>
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex-1">
                          <div className="text-[10px] font-black uppercase tracking-widest text-brand mb-1">Source</div>
                          <div className="font-bold text-slate-900 dark:text-white">{trip.load?.source || 'N/A'}</div>
                        </div>
                        <div className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded-full relative mx-4">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-400 rotate-45" />
                        </div>
                        <div className="flex-1 text-right">
                          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Destination</div>
                          <div className="font-bold text-slate-900 dark:text-white">{trip.load?.destination || 'N/A'}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                          <HiClock className="w-5 h-5 text-slate-400 mb-2" />
                          <div className="text-xl font-black text-slate-900 dark:text-white">42 hrs</div>
                          <div className="text-[10px] font-bold uppercase text-slate-500">Duration</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                          <HiGlobe className="w-5 h-5 text-slate-400 mb-2" />
                          <div className="text-xl font-black text-slate-900 dark:text-white">680 km</div>
                          <div className="text-[10px] font-bold uppercase text-slate-500">Distance</div>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl">
                          <HiCurrencyDollar className="w-5 h-5 text-emerald-500 mb-2" />
                          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">12</div>
                          <div className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-500">Tolls Crossed</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                      <h3 className="text-xl font-black mb-6 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Personnel & Equipment</h3>
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600">
                          {trip.driver?.photoUrl ? <img src={trip.driver.photoUrl} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><HiUser className="text-slate-400 w-8 h-8"/></div>}
                        </div>
                        <div>
                          <div className="font-black text-xl text-slate-900 dark:text-white">{trip.driver?.fullName || 'Assigned Driver'}</div>
                          <div className="text-sm font-bold text-slate-500 mt-1">Vehicle: {trip.vehicle?.vehicleNumber || 'Unassigned'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. LR */}
                {activeTab === 'lr' && (
                  <div className="h-full min-h-[500px]">
                    {lrUrl ? (
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 h-full w-full">
                        <iframe src={lrUrl} className="w-full h-[600px] border-none" title="LR Document" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                        <HiDocumentText className="w-20 h-20 text-slate-200 dark:text-slate-700 mb-6" />
                        <h3 className="text-2xl font-black text-slate-400 dark:text-slate-500">LR Document Missing</h3>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. POD */}
                {activeTab === 'pod' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-black text-slate-900 dark:text-white mb-4">Receiver Signature</h3>
                        {signature ? (
                          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 flex justify-center">
                            <img src={signature} alt="Signature" className="max-h-32 object-contain" />
                          </div>
                        ) : (
                          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center text-slate-400 font-bold text-sm">
                            No digital signature captured.
                          </div>
                        )}
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-black text-slate-900 dark:text-white mb-4">Receiver Remarks</h3>
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 italic font-medium min-h-[100px]">
                          "{remarks || 'No remarks provided.'}"
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white mb-4">Physical POD Document</h3>
                      {podImage ? (
                        <div className="group relative bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 h-[500px]">
                          <img src={podImage} alt="POD" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/50 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex space-x-4">
                              <button onClick={() => setZoomedPhoto(podImage)} className="w-14 h-14 bg-white/20 hover:bg-brand backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition shadow-2xl">
                                <HiZoomIn className="w-6 h-6" />
                              </button>
                              <button onClick={() => handleDownload(podImage, `POD_${trip.id}`)} className="w-14 h-14 bg-white/20 hover:bg-brand backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition shadow-2xl">
                                <HiDownload className="w-6 h-6" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[500px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                          <HiPhotograph className="w-16 h-16 text-slate-200 dark:text-slate-700 mb-4" />
                          <p className="text-slate-400 font-bold">No POD image uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. PICKUP PHOTOS */}
                {activeTab === 'pickup' && (
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Pickup Evidence</h3>
                    <PhotoGallery items={pickupPhotos} title="Pickup Evidence" />
                  </div>
                )}

                {/* 5. DESTINATION PHOTOS */}
                {activeTab === 'destination' && (
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Delivery Evidence</h3>
                    <PhotoGallery items={destinationPhotos} title="Delivery Evidence" />
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        {trip.status !== 'COMPLETED' && (
          <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            
            <div className="flex-1 w-full flex space-x-4">
              <input 
                type="text" 
                placeholder="If rejecting, a reason is mandatory..." 
                value={reason}
                onChange={e => { setReason(e.target.value); if(e.target.value) setReasonError(false); }}
                className={`flex-1 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl px-6 py-4 outline-none font-bold text-slate-900 dark:text-white transition-colors ${reasonError ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-slate-200 dark:border-slate-700 focus:border-brand'}`}
              />
            </div>

            <div className="flex space-x-4 w-full md:w-auto">
              <button 
                onClick={handleReject} disabled={loading}
                className="flex-1 md:flex-none px-8 py-4 bg-white dark:bg-slate-800 text-rose-500 border-2 border-rose-100 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-2xl font-black tracking-widest uppercase transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Reject'}
              </button>
              <button 
                onClick={handleAccept} disabled={loading}
                className="flex-1 md:flex-none px-12 py-4 bg-emerald-600 hover:bg-slate-900 dark:hover:bg-brand text-white rounded-2xl font-black tracking-widest uppercase shadow-xl shadow-emerald-200 dark:shadow-none transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
              >
                <span>{loading ? 'Processing...' : 'Accept & Verify'}</span>
                {!loading && <HiCheckCircle className="w-6 h-6" />}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
