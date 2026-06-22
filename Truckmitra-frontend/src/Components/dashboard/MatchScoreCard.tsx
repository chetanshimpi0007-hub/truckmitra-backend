import React from 'react';
import { HiTrendingUp, HiBadgeCheck, HiStar } from 'react-icons/hi';

interface MatchScoreCardProps {
  score: number;
  confidence: number;
  reasons: string[];
}

export const MatchScoreCard: React.FC<MatchScoreCardProps> = ({ score, confidence, reasons }) => {
  // Determine color theme based on score level
  const isHigh = score >= 80;
  const isMed = score >= 50 && score < 80;
  
  const scoreColor = isHigh 
    ? 'text-emerald-600 border-emerald-100 bg-emerald-50' 
    : isMed 
      ? 'text-amber-500 border-amber-100 bg-amber-50' 
      : 'text-rose-500 border-rose-100 bg-rose-50';

  const progressStroke = isHigh ? '#10B981' : isMed ? '#F59E0B' : '#EF4444';

  // Circle dimensions for radial progress bar
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 shadow-sm hover:shadow-md transition-all">
      {/* Circle Score visualization */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#F1F5F9"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={progressStroke}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute text-sm font-black text-slate-800">{Math.round(score)}%</span>
      </div>

      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2">
          <span className={`px-2.5 py-1 text-[10px] rounded-full font-black uppercase tracking-wider border ${scoreColor}`}>
            Match Score
          </span>
          <span className="px-2.5 py-1 text-[10px] rounded-full font-black uppercase tracking-wider bg-indigo-50 border border-indigo-100 text-indigo-600">
            Confidence {confidence}%
          </span>
        </div>

        <div className="space-y-1.5 mt-3">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Match Reasons</p>
          <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
            {reasons.map((reason, i) => (
              <span 
                key={i} 
                className="inline-flex items-center text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100"
              >
                <HiTrendingUp className="w-3.5 h-3.5 text-emerald-500 mr-1 shrink-0" />
                {reason}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MatchScoreCard;
