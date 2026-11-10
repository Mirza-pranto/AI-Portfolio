'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { portfolioData } from '@/lib/data';
import { usePortfolioStore } from '@/lib/store';

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const activePage = usePortfolioStore((s) => s.activePage);
  const setActivePage = usePortfolioStore((s) => s.setActivePage);
  const setIsRenderingUi = usePortfolioStore((s) => s.setIsRenderingUi);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = portfolioData.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const handleHomeClick = () => {
    if (activePage === 'home') return;
    setActivePage('home');
    setIsRenderingUi(true);
    setTimeout(() => {
      setIsRenderingUi(false);
    }, 1200);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3.5 backdrop-blur-sm"
    >
      {/* Left: Spacer to balance the top-right button group */}
      <div className="w-20" />

      {/* Center: Avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleHomeClick}
        title="Go to Home"
        className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-violet-500/20 cursor-pointer"
      >
        {initials}
      </motion.div>

      {/* Right: Actions (Home button & Theme Toggle) */}
      <div className="flex items-center gap-2 justify-end w-20">
        {/* Home Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleHomeClick}
          aria-label="Go to Home"
          title="Go to Home"
          className={`flex items-center justify-center w-9 h-9 rounded-full bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md border shadow-sm transition-all cursor-pointer ${
            activePage === 'home'
              ? 'text-black dark:text-white border-zinc-400 dark:border-zinc-500 bg-white dark:bg-zinc-800'
              : 'border-gray-200/80 dark:border-zinc-700/60 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-600'
          }`}
        >
          <Home className="w-4 h-4" />
        </motion.button>

        {/* Theme Toggle Button */}
        {mounted ? (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md border border-gray-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 shadow-sm hover:border-gray-300 dark:hover:border-zinc-600 transition-colors cursor-pointer"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-200 -rotate-12 hover:rotate-0" />
            )}
          </motion.button>
        ) : (
          <div className="w-9 h-9 rounded-full bg-transparent" />
        )}
      </div>
    </motion.header>
  );
}
