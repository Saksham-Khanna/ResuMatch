import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * ProgressButton - A premium action button with a revolving progress border.
 * 
 * @param {string} children - Button text
 * @param {boolean} isLoading - Loading state toggle
 * @param {number} progress - 0 to 100
 * @param {function} onClick - Click handler
 * @param {string} className - Additional Tailwind classes
 * @param {boolean} disabled - Disabled state
 * @param {React.ReactNode} icon - Optional icon to show before text
 */
export default function ProgressButton({ 
  children, 
  isLoading, 
  progress = 0, 
  onClick, 
  className = '', 
  disabled = false,
  icon: Icon = null
}) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden group px-8 py-4 rounded-xl font-display font-bold text-white
        bg-gradient-to-r from-[#F97316] to-[#EA580C] 
        hover:from-[#FB923C] hover:to-[#F97316]
        disabled:opacity-70 disabled:cursor-not-allowed
        shadow-[0_4px_20px_rgba(249,115,22,0.25)]
        hover:shadow-[0_8px_30px_rgba(249,115,22,0.4)]
        transition-all duration-300 transform active:scale-[0.98]
        flex items-center justify-center gap-3
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3"
          >
            {/* Revolving Circle */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Track */}
                <circle
                  cx="20"
                  cy="20"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="3"
                />
                {/* Progress Fill */}
                <motion.circle
                  cx="20"
                  cy="20"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </svg>
              {/* Percentage Text */}
              <span className="absolute text-[10px] font-mono font-bold">
                {Math.round(progress)}%
              </span>
            </div>
            <span className="tracking-wide">Processing...</span>
          </motion.div>
        ) : progress === 100 ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <Check size={20} className="text-white" />
            <span>Completed</span>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            {Icon}
            <span>{children}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform pointer-events-none" />
    </button>
  );
}
