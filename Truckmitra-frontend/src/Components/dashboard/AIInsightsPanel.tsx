import React from 'react';
import { HiLightningBolt, HiBadgeCheck, HiStar, HiHeart, HiLightBulb } from 'react-icons/hi';

interface AIInsightsPanelProps {
  averageScore?: number;
  totalRecommendations?: number;
  subscriptionPlan?: string;
  driverRating?: number;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  averageScore = 78.5,
  totalRecommendations = 12,
  subscriptionPlan = 'Premium VIP Plan',
  driverRating = 4.8,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center space-x-2">
        <HiLightningBolt className="w-6 h-6 text-amber-400 animate-pulse" />
        <h3 className="text-lg font-black tracking-tight">AI Matching Insights</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
          <div className="text-2xl font-black text-amber-300">{averageScore}%</div>
          <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider mt-1">Avg Match Score</div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
          <div className="text-2xl font-black text-emerald-400">{totalRecommendations}</div>
          <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider mt-1">Total Matches</div>
        </div>
      </div>

      <div className="space-y-3.5">
        <div className="flex items-center space-x-3 bg-white/5 rounded-2xl p-3 border border-white/5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <HiBadgeCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Subscription Boost</div>
            <div className="text-sm font-bold text-slate-200">{subscriptionPlan} (+15% score weight)</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-white/5 rounded-2xl p-3 border border-white/5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <HiStar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Driver Rating Impact</div>
            <div className="text-sm font-bold text-slate-200">{driverRating} / 5.0 Rating (Strong Match Factor)</div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-start space-x-2">
          <HiLightBulb className="w-5 h-5 text-amber-300 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-black text-slate-300">Smart Recommendation Tips</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Transporters with completed preferences get up to <strong className="text-white">50% higher confidence levels</strong> on matching recommendations. Make sure your preferred cities and vehicle types are kept up to date!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AIInsightsPanel;
