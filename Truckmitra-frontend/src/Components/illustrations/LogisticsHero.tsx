import React from 'react';

export const LogisticsHero: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg className={className} viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Grid */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1"/>
        </pattern>
        <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#grid)" />
      
      {/* Abstract Logistics Nodes */}
      <circle cx="150" cy="450" r="100" fill="url(#glow)" />
      <circle cx="650" cy="150" r="150" fill="url(#glow)" />
      
      {/* Connecting Routes */}
      <path d="M 200 400 Q 400 200 600 250" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10 10" fill="none" />
      <path d="M 250 500 Q 500 500 550 350" stroke="#10b981" strokeWidth="4" strokeDasharray="10 10" fill="none" />
      
      {/* Truck Representation */}
      <g transform="translate(350, 280)">
        <rect x="0" y="20" width="120" height="60" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="3" />
        <rect x="125" y="40" width="40" height="40" rx="4" fill="#3b82f6" />
        <circle cx="30" cy="85" r="12" fill="#94a3b8" />
        <circle cx="90" cy="85" r="12" fill="#94a3b8" />
        <circle cx="145" cy="85" r="12" fill="#94a3b8" />
        <path d="M 145 45 L 160 60 L 160 80 L 125 80 L 125 45 Z" fill="#60a5fa" opacity="0.8" />
      </g>
      
      {/* Pins */}
      <g transform="translate(185, 365)">
        <path d="M15 0 C6.7 0 0 6.7 0 15 C0 26.2 15 45 15 45 C15 45 30 26.2 30 15 C30 6.7 23.3 0 15 0 Z" fill="#ef4444" />
        <circle cx="15" cy="15" r="5" fill="white" />
      </g>
      <g transform="translate(585, 215)">
        <path d="M15 0 C6.7 0 0 6.7 0 15 C0 26.2 15 45 15 45 C15 45 30 26.2 30 15 C30 6.7 23.3 0 15 0 Z" fill="#10b981" />
        <circle cx="15" cy="15" r="5" fill="white" />
      </g>
    </svg>
  );
};
