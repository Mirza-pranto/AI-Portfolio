'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { portfolioData } from '@/lib/data';
import TypewriterText from '@/components/TypewriterText';
import ChatMessages from '@/components/ChatMessages';

export default function MePage() {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const tags = ['AI', 'NLP', 'LLM', 'Developer'];
  const firstName = portfolioData.name.split(' ')[0] || 'Mirza';
  const location = portfolioData.contact.location || 'Dhaka, Bangladesh';
  const subInfo = `24 years old • ${location}`;
  const greeting = `Hey 👋 I'm ${firstName}, an AI & Full-Stack Engineer passionate about building end-to-end intelligent systems and turning ambitious ideas into working products.`;

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageExpanded(false);
      }
    };
    if (isImageExpanded) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageExpanded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6"
    >
      {/* Top Profile Grid (2 Columns) */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
        {/* Left Column: Profile Picture with Click-to-Expand Show Mode */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsImageExpanded(true)}
          className="relative w-60 h-60 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-lg border-2 border-slate-300 dark:border-zinc-800 bg-gradient-to-br from-indigo-50 via-violet-50 to-amber-50 dark:from-zinc-900 dark:to-zinc-800 flex-shrink-0 cursor-pointer group"
          title="Click to view full size"
        >
          <img
            src={portfolioData.about.profileImage || '/profile.jpg'}
            alt={portfolioData.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover Overlay with Expand Hint */}
          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5 backdrop-blur-[2px]">
            <div className="p-2.5 rounded-full bg-white/20 text-white backdrop-blur-md shadow-md">
              <Maximize2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white tracking-wide drop-shadow-sm">
              Click to view full size
            </span>
          </div>
        </motion.div>

        {/* Right Column: Name, Sub-info, Short Greeting, Pill Tags */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex flex-col justify-center text-center md:text-left"
        >
          {/* Name */}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 mb-2">
            {portfolioData.name}
          </h1>

          {/* Sub-info: Age and Location */}
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm sm:text-base mb-4">
            {subInfo}
          </p>

          {/* Short Greeting */}
          <p className="text-zinc-700 dark:text-zinc-300 text-base sm:text-lg leading-relaxed mb-6 max-w-xl">
            {greeting}
          </p>

          {/* Pill Tags */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-indigo-600 text-white dark:bg-indigo-700 dark:text-indigo-100 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Bio Paragraph */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 md:mt-14 max-w-3xl"
      >
        <TypewriterText
          text={portfolioData.about.summary}
          speed={3}
          className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-base md:text-lg whitespace-pre-line"
        />
      </motion.div>

      {/* Dynamic AI Chat History */}
      <ChatMessages />

      {/* ── Fullscreen Image Modal (Show Mode) ── */}
      <AnimatePresence>
        {isImageExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsImageExpanded(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-zinc-950 flex flex-col items-center cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsImageExpanded(false)}
                aria-label="Close image view"
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-110 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Large Image */}
              <div className="w-full max-h-[75vh] flex items-center justify-center overflow-hidden">
                <img
                  src={portfolioData.about.profileImage || '/profile.jpg'}
                  alt={portfolioData.name}
                  className="w-full h-full object-contain max-h-[75vh]"
                />
              </div>

              {/* Caption Footer */}
              <div className="w-full px-6 py-4 bg-zinc-900/90 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-white text-base font-bold">
                    {portfolioData.name}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {portfolioData.title}
                  </p>
                </div>
                <span className="text-xs text-zinc-400 bg-white/10 px-3 py-1 rounded-full">
                  Press ESC or click outside to close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
