import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-2xl border border-slate-200">
      <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
        <div className="text-5xl">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-primary-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-sm font-medium text-slate-500 mb-6 max-w-md text-center">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
