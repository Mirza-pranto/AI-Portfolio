'use client';

import { motion } from 'framer-motion';
import { portfolioData } from '@/lib/data';
import ChatMessages from '@/components/ChatMessages';

export default function HomePage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center">
        {/* Greeting & Name */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 mb-3"
        >
          Hey, I&apos;m{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-500 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
            {portfolioData.name}
          </span>
        </motion.p>

        {/* Role / Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-xl sm:text-2xl md:text-3xl font-medium tracking-normal mb-8 text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed"
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
          <div className="absolute inset-0 -m-8 rounded-full aurora-bg opacity-30 dark:opacity-35 blur-3xl" />
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(79,70,229,0.35)',
                '0 0 60px rgba(124,58,237,0.45)',
                '0 0 40px rgba(217,119,6,0.3)',
                '0 0 60px rgba(79,70,229,0.35)',
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-36 h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-amber-400 p-1 flex items-center justify-center overflow-hidden shadow-xl"
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
          className="text-slate-500 dark:text-zinc-400 text-lg max-w-md font-normal leading-relaxed"
        >
          {portfolioData.tagline}
        </motion.p>
      </div>

      {/* Dynamic AI Chat History on Home Page */}
      <ChatMessages />
    </div>
  );
}
