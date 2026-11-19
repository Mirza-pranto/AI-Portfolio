'use client';

import { motion } from 'framer-motion';
import NavigationPills from './NavigationPills';
import ChatInput from './ChatInput';
import AICompanion from './AICompanion';

interface BottomInterfaceProps {
  sidebarWidth?: number;
}

export default function BottomInterface({ sidebarWidth = 224 }: BottomInterfaceProps) {
  return (
    <>
      {/* Desktop: offset left by sidebar */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="hidden md:block fixed bottom-4 z-30 px-4"
        style={{ left: sidebarWidth, right: 0 }}
      >
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex flex-col gap-3 rounded-3xl p-3.5 bg-white dark:bg-zinc-900 border-2 border-slate-300 dark:border-zinc-700/80 shadow-[0_12px_45px_rgba(15,23,42,0.18)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.7)] ring-1 ring-slate-900/5 dark:ring-white/5 transition-all duration-300">
            <NavigationPills />
            <ChatInput />
          </div>
        </div>
      </motion.div>

      {/* Mobile: full width, no sidebar offset */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="md:hidden fixed bottom-2 left-2 right-2 z-30"
      >
        <div className="flex flex-col gap-2 rounded-2xl p-2.5 bg-white dark:bg-zinc-900 border-2 border-slate-300 dark:border-zinc-700/80 shadow-[0_8px_32px_rgba(15,23,42,0.18)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.7)] ring-1 ring-slate-900/5 dark:ring-white/5 transition-all duration-300">
          {/* Mobile Top Row: 2/3 Quick Question Slider + 1/3 Fixed AI Companion */}
          <div className="flex items-center gap-1.5 w-full min-h-[50px]">
            {/* Left 2/3: Quick Question Slider */}
            <div className="w-[67%] min-w-0 relative">
              <NavigationPills variant="slider" />
              {/* Fade gradient mask on right edge to hint scrollability */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-white dark:from-zinc-900 to-transparent" />
            </div>

            {/* Right 1/3: AI Companion (Fixed in place) */}
            <div className="w-[33%] shrink-0 h-13 flex items-center justify-center relative border-l border-slate-200/90 dark:border-zinc-800/90 pl-1">
              <AICompanion variant="docked" />
            </div>
          </div>

          <ChatInput />
        </div>
      </motion.div>
    </>
  );
}
