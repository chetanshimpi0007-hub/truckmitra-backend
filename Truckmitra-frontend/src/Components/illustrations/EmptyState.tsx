import React from 'react';

export const EmptyState: React.FC<{ type: 'loads' | 'trips' | 'drivers' | 'invoices' | 'search'; className?: string }> = ({ type, className = "" }) => {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="#f1f5f9" />
      {type === 'loads' && (
        <g transform="translate(60, 60)">
          <path d="M10 20 L40 10 L70 20 L70 50 L40 70 L10 50 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="4" />
          <path d="M40 10 L40 40 L70 20" stroke="#94a3b8" strokeWidth="4" />
          <path d="M10 20 L40 40" stroke="#94a3b8" strokeWidth="4" />
        </g>
      )}
      {type === 'trips' && (
        <g transform="translate(50, 60)">
          <path d="M20 60 Q 50 10 80 60" stroke="#94a3b8" strokeWidth="6" strokeDasharray="5 5" fill="none" />
          <circle cx="20" cy="60" r="8" fill="#ef4444" />
          <circle cx="80" cy="60" r="8" fill="#10b981" />
        </g>
      )}
      {type === 'drivers' && (
        <g transform="translate(60, 50)">
          <circle cx="40" cy="30" r="20" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="4" />
          <path d="M10 80 C10 60 70 60 70 80" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="4" />
        </g>
      )}
      {type === 'invoices' && (
        <g transform="translate(60, 50)">
          <rect x="15" y="10" width="50" height="70" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="4" />
          <line x1="25" y1="30" x2="55" y2="30" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          <line x1="25" y1="45" x2="45" y2="45" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="40" cy="65" r="8" fill="#10b981" />
        </g>
      )}
      {type === 'search' && (
        <g transform="translate(60, 60)">
          <circle cx="30" cy="30" r="20" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="4" />
          <line x1="45" y1="45" x2="65" y2="65" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
