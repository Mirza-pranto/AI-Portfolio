'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/lib/store';

export default function HomeGuideOrb() {
  const activePage = usePortfolioStore((s) => s.activePage);
  const [showFlight, setShowFlight] = useState(false);
  const [showArrivalPulse, setShowArrivalPulse] = useState(false);

  useEffect(() => {
    // Only trigger on the home page
    if (activePage === 'home') {
      // Small delay after home page mounts
      const flightTimer = setTimeout(() => {
        setShowFlight(true);
      }, 1000);

      // Arrival at the bottom interface after flight completes
      const arrivalTimer = setTimeout(() => {
        setShowFlight(false);
        setShowArrivalPulse(true);
      }, 2600);

      // Dissolve the arrival guide pulse after teaching the user
      const cleanupTimer = setTimeout(() => {
        setShowArrivalPulse(false);
      }, 6200);

      return () => {
        clearTimeout(flightTimer);
        clearTimeout(arrivalTimer);
        clearTimeout(cleanupTimer);
      };
    } else {
      setShowFlight(false);
      setShowArrivalPulse(false);
    }
  }, [activePage]);

  if (activePage !== 'home') return null;

  return (
    <>
      {/* ── 1. The Flying Aura Orb traveling from Companion (bottom-right) to Bottom Interface ── */}
      <AnimatePresence>
        {showFlight && (
          <motion.div
            key="flying-orb"
            className="fixed z-40 pointer-events-none"
            initial={{
              left: 'calc(100% - 28px)',
              bottom: '28px',
              scale: 0.2,
              opacity: 0,
            }}
            animate={{
              left: ['calc(100% - 28px)', 'calc(100% - 80px)', '75vw', '50vw'],
              bottom: ['28px', '160px', '220px', '95px'],
              scale: [0.2, 1.3, 1.1, 0.5],
              opacity: [0, 1, 1, 0.8],
            }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{
              duration: 1.6,
              ease: [0.25, 0.1, 0.25, 1],
              times: [0, 0.35, 0.7, 1],
            }}
            style={{ transform: 'translateX(-50%)' }}
          >
            {/* Luminous Outer Flare */}
            <div className="relative flex items-center justify-center">
              <motion.div
                className="w-16 h-16 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(56,189,248,0.95) 0%, rgba(37,99,235,0.7) 45%, rgba(99,102,241,0.2) 75%, transparent 100%)',
                  filter: 'blur(10px)',
                }}
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />

              {/* Glowing Core Spark */}
              <div className="absolute w-6 h-6 rounded-full bg-gradient-to-tr from-white via-cyan-200 to-blue-400 shadow-[0_0_16px_4px_#38bdf8]" />

              {/* Trailing Comet Tail */}
              <motion.div
                className="absolute w-20 h-3 -rotate-45 rounded-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-[2px]"
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. Arrival Halo & Guide Tooltip over the Bottom Quick Questions / Chat ── */}
      <AnimatePresence>
        {showArrivalPulse && (
          <motion.div
            key="arrival-pulse"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed bottom-[135px] left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center"
          >
            {/* Pulsing Target Ring pointing down to quick questions */}
            <div className="relative flex flex-col items-center">
              {/* Tooltip Bubble */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="
                  flex items-center gap-2
                  px-4 py-2 rounded-full
                  bg-slate-900/90 dark:bg-white/95
                  text-white dark:text-slate-950
                  shadow-xl shadow-cyan-500/20 dark:shadow-cyan-400/30
                  border border-cyan-400/50 dark:border-cyan-500/60
                  backdrop-blur-md
                  text-xs font-semibold
                "
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 dark:bg-blue-600 animate-ping" />
                <span>Explore with Quick Questions or ask anything below! ✨</span>
              </motion.div>

              {/* Downward Pointer Triangle */}
              <div
                className="
                  w-0 h-0
                  border-l-[6px] border-l-transparent
                  border-r-[6px] border-r-transparent
                  border-t-[8px] border-t-slate-900/90 dark:border-t-white/95
                "
              />

              {/* Glowing Aura Ripple expanding into the navigation pills */}
              <motion.div
                className="
                  w-48 h-8 rounded-full mt-1
                  bg-gradient-to-r from-cyan-400/30 via-blue-500/40 to-indigo-500/30
                  blur-[12px]
                "
                animate={{
                  scale: [0.9, 1.3, 0.9],
                  opacity: [0.5, 0.9, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
