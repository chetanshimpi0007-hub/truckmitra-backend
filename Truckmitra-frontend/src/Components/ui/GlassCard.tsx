import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  noPadding = false,
  ...props 
}) => {
  return (
    <motion.div
      className={`bg-white dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-lg dark:shadow-2xl rounded-2xl overflow-hidden transition-colors ${noPadding ? '' : 'p-6'} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
