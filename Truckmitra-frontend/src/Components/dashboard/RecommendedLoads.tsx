import React, { useState, useEffect } from 'react';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
import { MatchScoreCard } from './MatchScoreCard';
import { AIInsightsPanel } from './AIInsightsPanel';
import { toast } from 'react-hot-toast';
import { HiDocumentText, HiTrendingUp, HiBadgeCheck, HiTruck, HiSparkles } from 'react-icons/hi';

interface Recommendation {
  id: number;
  loadId: number;
  matchScore: number;
  confidencePercentage: number;
  reasons: string[];
  status: string;
  source: string;
  destination: string;
  weight: number;
  materialType: string;
  budget: number;
  pickupDate: string;
  estimatedDistanceKm?: number;
  isBiddingEnabled?: boolean;
}

interface RecommendedLoadsProps {
  onBid: (
    loadId: number,
    amount: number,
    vehicleType: string,
    estimatedDeliveryDays: number,
    remarks: string
  ) => Promise<void>;
  alreadyBid: (loadId: number) => boolean;
}

export const RecommendedLoads: React.FC<RecommendedLoadsProps> = ({ onBid, alreadyBid }) => {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick bidding form state
  const [biddingLoadId, setBiddingLoadId] = useState<number | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [estDays, setEstDays] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [comment, setComment] = useState('');

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await protectedApi.get('/api/ai/recommendations');
      if (response.data) {
        setRecs(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handlePlaceBidSubmit = async (e: React.FormEvent, loadId: number) => {
    e.preventDefault();
    if (!bidAmount || !estDays || !vehicleType) {
      toast.error('Please fill in all bid details.');
      return;
    }
    try {
      await onBid(loadId, parseFloat(bidAmount), vehicleType, parseInt(estDays), comment);
      setBiddingLoadId(null);
      setBidAmount('');
      setEstDays('');
      setVehicleType('');
      setComment('');
      fetchRecommendations();
    } catch (error) {
      // Toast error is handled in parent
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const averageScore = recs.length > 0 
    ? Math.round(recs.reduce((acc, curr) => acc + curr.matchScore, 0) / recs.length * 10) / 10
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HiSparkles className="w-6 h-6 text-emerald-500 animate-pulse" />
            <h3 className="text-xl font-black text-slate-900">AI Matched Tenders</h3>
          </div>
          <span className="text-xs font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
            {recs.length} Recommendations
          </span>
        </div>

        {recs.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <HiDocumentText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">No Matched Tenders</h3>
            <p className="text-slate-400 mt-2 text-sm">
              We couldn't find any recommendations matching your current settings. Update your AI Preferences to help us match loads!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {recs.map(rec => {
              const bidPlaced = alreadyBid(rec.loadId);
              return (
                <div key={rec.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="text-base font-black text-slate-800">
                        {rec.source} → {rec.destination}
                      </h4>
                      <p className="text-xs text-slate-400 font-bold mt-1">
                        Material: {rec.materialType} · Weight: {rec.weight} T · Budget: ₹{rec.budget?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      {bidPlaced ? (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-black uppercase tracking-wider">
                          Bid Submitted
                        </span>
                      ) : (
                        <button
                          onClick={() => setBiddingLoadId(biddingLoadId === rec.loadId ? null : rec.loadId)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-slate-900 transition-all shadow-sm"
                        >
                          {biddingLoadId === rec.loadId ? 'Cancel Bid' : 'Quick Bid'}
                        </button>
                      )}
                    </div>
                  </div>

                  <MatchScoreCard 
                    score={rec.matchScore} 
                    confidence={rec.confidencePercentage} 
                    reasons={rec.reasons} 
                  />

                  {biddingLoadId === rec.loadId && (
                    <form onSubmit={e => handlePlaceBidSubmit(e, rec.loadId)} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 animate-slideDown">
                      <div className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-2">
                        Submit Quick Bid for load
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Bid Amount (₹)</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Amount"
                            value={bidAmount}
                            onChange={e => setBidAmount(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Delivery Time (Days)</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Days"
                            value={estDays}
                            onChange={e => setEstDays(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Vehicle Model/Type</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g. TATA ACE"
                            value={vehicleType}
                            onChange={e => setVehicleType(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Remarks / Comments</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Special instructions or details..."
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-black hover:bg-emerald-600 transition-all shadow-sm"
                        >
                          Submit Bid
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="lg:col-span-1 space-y-6">
        <AIInsightsPanel 
          averageScore={averageScore} 
          totalRecommendations={recs.length} 
        />
      </div>
    </div>
  );
};
export default RecommendedLoads;
