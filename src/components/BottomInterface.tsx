'use client';

import { motion } from 'framer-motion';
import NavigationPills from './NavigationPills';
import ChatInput from './ChatInput';

export default function BottomInterface() {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-4xl z-30 px-4"
    >
      <div className="flex flex-col gap-3 rounded-3xl p-3 bg-gray-50/90 backdrop-blur-lg border border-gray-200 shadow-2xl shadow-gray-200/50 dark:bg-zinc-900/80 dark:border-zinc-800 dark:shadow-none transition-all duration-300">
        <NavigationPills />
        <ChatInput />
      </div>
    </motion.div>
  );
}
