import React from 'react';

export const LogisticsSide: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg className={className} viewBox="0 0 600 800" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeOpacity="0.05" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="600" height="800" fill="url(#bg)" />
      <rect width="600" height="800" fill="url(#grid)" />
      
      {/* Route Line */}
      <path d="M 100 100 Q 300 400 500 700" stroke="#3b82f6" strokeWidth="6" strokeDasharray="15 15" fill="none" />
      
      {/* Warehouse / Fulfillment Center */}
      <g transform="translate(150, 150)">
        <rect x="0" y="0" width="100" height="80" rx="8" fill="#334155" stroke="#3b82f6" strokeWidth="2" />
        <rect x="20" y="20" width="20" height="20" fill="#64748b" />
        <rect x="60" y="20" width="20" height="20" fill="#64748b" />
        <rect x="20" y="50" width="60" height="30" fill="#1e293b" />
      </g>
      
      {/* Truck Profile */}
      <g transform="translate(300, 350)">
        <rect x="0" y="10" width="80" height="50" rx="6" fill="#10b981" />
        <rect x="85" y="25" width="30" height="35" rx="4" fill="#3b82f6" />
        <circle cx="20" cy="65" r="10" fill="#94a3b8" />
        <circle cx="60" cy="65" r="10" fill="#94a3b8" />
        <circle cx="100" cy="65" r="10" fill="#94a3b8" />
      </g>
      
      {/* Destination */}
      <g transform="translate(420, 600)">
        <circle cx="40" cy="40" r="40" fill="#3b82f6" opacity="0.2" />
        <path d="M40 10 C25 10 15 25 15 40 C15 60 40 80 40 80 C40 80 65 60 65 40 C65 25 55 10 40 10 Z" fill="#ef4444" />
        <circle cx="40" cy="35" r="10" fill="white" />
      </g>
    </svg>
  );
};
