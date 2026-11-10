'use client';

import { motion } from 'framer-motion';
import { portfolioData } from '@/lib/data';
import TypewriterText from '@/components/TypewriterText';
import ChatMessages from '@/components/ChatMessages';

export default function MePage() {
  const tags = ['AI', 'NLP', 'LLM', 'Developer'];
  const firstName = portfolioData.name.split(' ')[0] || 'Mirza';
  const location = portfolioData.contact.location || 'Dhaka, Bangladesh';
  const subInfo = `24 years old • ${location}`;
  const greeting = `Hey 👋 I'm ${firstName}, an AI & Full-Stack Engineer passionate about building end-to-end intelligent systems and turning ambitious ideas into working products.`;

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
        {/* Left Column: Large square image container with heavily rounded corners */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative w-60 h-60 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-zinc-800 bg-gradient-to-br from-emerald-100 via-teal-100 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 flex-shrink-0"
        >
          <img
            src={portfolioData.about.profileImage || '/profile.jpg'}
            alt={portfolioData.name}
            className="w-full h-full object-cover object-top"
          />
        </motion.div>

        {/* Right Column: Name, Sub-info, Short Greeting, Pill Tags */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex flex-col justify-center text-center md:text-left"
        >
          {/* Name */}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
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
                className="bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-200 px-3.5 py-1.5 rounded-full text-xs font-medium shadow-xs"
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
    </motion.div>
  );
}
