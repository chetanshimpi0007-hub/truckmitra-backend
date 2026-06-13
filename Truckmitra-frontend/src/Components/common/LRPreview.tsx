import React from 'react';
import { HiX, HiDownload, HiShare } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';

interface LRPreviewProps {
  lr: any;
  onClose: () => void;
}

const LRPreview: React.FC<LRPreviewProps> = ({ lr, onClose }) => {
  if (!lr) return null;

  const handleOpenPdf = async () => {
    if (lr.pdfUrl) {
      // Cloudinary URL present — open directly in new tab
      window.open(lr.pdfUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    // Fallback: stream PDF from backend (bypasses Cloudinary)
    try {
      toast.loading('Generating PDF…', { id: 'pdf-load' });
      const tripId = lr.trip?.id;
      if (!tripId) { toast.error('Trip ID missing', { id: 'pdf-load' }); return; }
      const res = await protectedApi.get(`/api/lr/trip/${tripId}/pdf`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      toast.dismiss('pdf-load');
      window.open(blobUrl, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 30000);
    } catch (err: any) {
      toast.error('Failed to open PDF: ' + (err.response?.data || err.message), { id: 'pdf-load' });
    }
  };

  const handleWhatsAppShare = () => {
    if (!lr.pdfUrl) return toast.error('PDF URL not available for sharing');
    const text = `Digital LR #${lr.lrNumber}: ${lr.pdfUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Digital Lorry Receipt</h2>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{lr.lrNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <HiX className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-4">
          {/* LR Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">LR Number</div>
              <div className="text-sm font-black text-slate-900">{lr.lrNumber || '–'}</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Generated At</div>
              <div className="text-sm font-black text-slate-900">
                {lr.generatedAt ? new Date(lr.generatedAt).toLocaleDateString('en-IN') : '–'}
              </div>
            </div>
            {lr.trip?.source && (
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">From</div>
                <div className="text-sm font-black text-slate-900">{lr.trip.source}</div>
              </div>
            )}
            {lr.trip?.destination && (
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">To</div>
                <div className="text-sm font-black text-slate-900">{lr.trip.destination}</div>
              </div>
            )}
          </div>

          {/* QR Code */}
          {lr.qrCodeUrl && (
            <div className="flex items-center justify-center py-2">
              <div className="text-center">
                <img src={lr.qrCodeUrl} alt="LR QR Code" className="w-28 h-28 mx-auto rounded-2xl border border-slate-100" />
                <p className="text-xs text-slate-400 font-bold mt-2">Scan to verify authenticity</p>
              </div>
            </div>
          )}

          {/* PDF Status */}
          {lr.pdfUrl ? (
            <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0 animate-pulse" />
              <span className="text-sm font-black text-emerald-700">PDF ready — click "Open PDF" to view or download</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full flex-shrink-0" />
              <span className="text-sm font-black text-amber-700">PDF URL not stored — will stream directly from server</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex space-x-4">
          <button
            onClick={handleOpenPdf}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition flex items-center justify-center space-x-2"
          >
            <HiDownload className="text-xl" />
            <span>Open PDF</span>
          </button>
          <button
            onClick={handleWhatsAppShare}
            disabled={!lr.pdfUrl}
            className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
          >
            <HiShare className="text-xl" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LRPreview;
