import React from 'react';

const STEPS = [
  { key: 'ASSIGNED',           label: 'Bid Won',          emoji: '🏆' },
  { key: 'DRIVER_ASSIGNED',    label: 'Driver Assigned',  emoji: '👤' },
  { key: 'ACCEPTED_BY_DRIVER', label: 'Driver Accepted',  emoji: '🤝' },
  { key: 'IN_TRANSIT',         label: 'In Transit',       emoji: '🚛' },
  { key: 'DELIVERED',          label: 'Delivered',        emoji: '📍' },
  { key: 'COMPLETED',          label: 'Completed',        emoji: '✅' },
];

const STATUS_ORDER = STEPS.map(s => s.key);

interface TripTimelineProps {
  status: string;
  compact?: boolean;
}

const TripTimeline: React.FC<TripTimelineProps> = ({ status, compact = false }) => {
  const currentIdx = STATUS_ORDER.indexOf(status);

  if (compact) {
    return (
      <div className="flex items-center space-x-1">
        {STEPS.map((step, i) => {
          const done = i < currentIdx;
          const current = i === currentIdx;
          return (
            <React.Fragment key={step.key}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                  done ? 'bg-emerald-500 text-white' :
                  current ? 'bg-slate-900 text-white ring-4 ring-slate-200 animate-pulse' :
                  'bg-slate-100 text-slate-300'
                }`}
                title={step.label}
              >
                {done ? '✓' : step.emoji}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 ${i < currentIdx ? 'bg-emerald-400' : 'bg-slate-100'}`} style={{minWidth: 8}} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Trip Progress</h3>
      <div className="relative">
        {/* Track line */}
        <div className="absolute top-7 left-7 right-7 h-1 bg-slate-100 rounded-full" />
        <div
          className="absolute top-7 left-7 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
          style={{ width: currentIdx <= 0 ? '0%' : `${(currentIdx / (STEPS.length - 1)) * 85}%` }}
        />
        <div className="relative flex items-start justify-between">
          {STEPS.map((step, i) => {
            const done = i < currentIdx;
            const current = i === currentIdx;
            return (
              <div key={step.key} className="flex flex-col items-center z-10" style={{flex: 1}}>
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-xl border-4 transition-all duration-300 ${
                    done ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-200' :
                    current ? 'bg-slate-900 border-slate-900 shadow-xl animate-pulse' :
                    'bg-white border-slate-200'
                  }`}
                >
                  <span>{done ? '✅' : step.emoji}</span>
                </div>
                <span className={`mt-3 text-[10px] font-black text-center leading-tight uppercase tracking-wider ${
                  current ? 'text-slate-900' : done ? 'text-emerald-600' : 'text-slate-300'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TripTimeline;
