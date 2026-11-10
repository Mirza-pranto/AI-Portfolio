'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/lib/store';

export default function NeuralGlow() {
  const isLoading = usePortfolioStore((s) => s.isLoading);
  const isRenderingUi = usePortfolioStore((s) => s.isRenderingUi);

  const active = isLoading || isRenderingUi;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-multiply dark:mix-blend-screen"
        >
          {/* Left edge glow */}
          <motion.div
            animate={{
              opacity: [0.45, 0.9, 0.55, 0.95, 0.45],
              scaleX: [1, 1.15, 0.95, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-0 top-0 bottom-0 w-36 md:w-52 origin-left blur-3xl mix-blend-multiply dark:mix-blend-screen bg-gradient-to-r from-indigo-500/35 via-blue-500/25 to-transparent dark:from-emerald-500/40 dark:via-indigo-500/30 dark:to-transparent"
          />

          {/* Right edge glow */}
          <motion.div
            animate={{
              opacity: [0.45, 0.95, 0.5, 0.9, 0.45],
              scaleX: [1, 1.1, 1.15, 0.95, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
            className="absolute right-0 top-0 bottom-0 w-36 md:w-52 origin-right blur-3xl mix-blend-multiply dark:mix-blend-screen bg-gradient-to-l from-blue-500/35 via-indigo-500/25 to-transparent dark:from-purple-500/40 dark:via-blue-500/30 dark:to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
