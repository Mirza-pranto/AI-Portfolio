'use client';

import { motion } from 'framer-motion';
import { portfolioData } from '@/lib/data';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Greeting & Name */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3"
      >
        Hey, I&apos;m {portfolioData.name}
      </motion.p>

      {/* Role / Title */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="text-xl sm:text-2xl md:text-3xl font-medium tracking-normal mb-8 text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed"
      >
        {portfolioData.title}
      </motion.h1>

      {/* Avatar with profile image & aurora glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative mb-8"
      >
        {/* Aurora glow behind avatar */}
        <div className="absolute inset-0 -m-8 rounded-full aurora-bg opacity-35 dark:opacity-40 blur-3xl" />
        <motion.div
          animate={{
            boxShadow: [
              '0 0 30px rgba(16,185,129,0.3)',
              '0 0 60px rgba(139,92,246,0.4)',
              '0 0 30px rgba(59,130,246,0.3)',
              '0 0 60px rgba(16,185,129,0.3)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-36 h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-emerald-400 via-violet-500 to-blue-500 p-1 flex items-center justify-center overflow-hidden shadow-xl"
        >
          {portfolioData.avatar ? (
            <img
              src={portfolioData.avatar}
              alt={portfolioData.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-5xl md:text-6xl font-bold text-white">
              {portfolioData.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-slate-600 dark:text-zinc-400 text-lg max-w-md font-normal leading-relaxed"
      >
        {portfolioData.tagline}
      </motion.p>
    </div>
  );
}
