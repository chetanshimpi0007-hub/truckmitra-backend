import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  highlightColor?: string; // e.g., 'bg-accent', 'bg-success'
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, highlightColor = 'bg-primary-600' }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-1 h-full ${highlightColor} transition-all duration-300 group-hover:w-2`} />
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{label}</p>
          <p className="text-3xl font-black text-primary-950 tracking-tight">{value}</p>
          
          {trend && (
            <div className="mt-3 flex items-center space-x-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend.isUp ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                {trend.isUp ? '+' : '-'}{trend.value}%
              </span>
              <span className="text-xs font-medium text-slate-400">vs last month</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
