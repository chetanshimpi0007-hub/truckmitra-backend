import React from 'react';
import GlassCard from './GlassCard';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

interface StatWidgetProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  trend?: number;
  trendText?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'accent' | 'secondary';
  delay?: number;
}

const colorMap = {
  primary: 'text-brand bg-brand/10 dark:bg-brand/20',
  success: 'text-success bg-success/10 dark:bg-success/20',
  warning: 'text-warning bg-warning/10 dark:bg-warning/20',
  danger: 'text-danger bg-danger/10 dark:bg-danger/20',
  accent: 'text-accent bg-accent/10 dark:bg-accent/20',
  secondary: 'text-secondary bg-secondary/10 dark:bg-secondary/20',
};

const StatWidget: React.FC<StatWidgetProps> = ({
  title,
  value,
  prefix = '',
  suffix = '',
  icon,
  trend,
  trendText,
  color = 'primary',
  delay = 0,
}) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <GlassCard 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col relative group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            <CountUp end={value} prefix={prefix} suffix={suffix} duration={2.5} separator="," />
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      
      {(trend !== undefined || trendText) && (
        <div className="flex items-center text-sm mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
          {trend !== undefined && (
            <span className={`flex items-center font-bold mr-2 ${isPositive ? 'text-success' : isNegative ? 'text-danger' : 'text-slate-500'}`}>
              {isPositive ? '↑' : isNegative ? '↓' : '-'} {Math.abs(trend)}%
            </span>
          )}
          {trendText && (
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {trendText}
            </span>
          )}
        </div>
      )}
    </GlassCard>
  );
};

export default StatWidget;
