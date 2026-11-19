'use client';

import { motion } from 'framer-motion';
import NavigationPills from './NavigationPills';
import ChatInput from './ChatInput';

interface BottomInterfaceProps {
  sidebarWidth?: number;
}

export default function BottomInterface({ sidebarWidth = 224 }: BottomInterfaceProps) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed bottom-4 z-30 px-4"
      style={{
        left: sidebarWidth,
        right: 0,
      }}
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex flex-col gap-3 rounded-3xl p-3.5 bg-white dark:bg-zinc-900 border-2 border-slate-300 dark:border-zinc-700/80 shadow-[0_12px_45px_rgba(15,23,42,0.18)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.7)] ring-1 ring-slate-900/5 dark:ring-white/5 transition-all duration-300">
          <NavigationPills />
          <ChatInput />
        </div>
      </div>
    </motion.div>
  );
}
