'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Home, Sun, Moon } from 'lucide-react';
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
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3 bg-[#eceff3]/90 dark:bg-[#09090d]/90 backdrop-blur-md border-b-2 border-slate-300/80 dark:border-zinc-800 shadow-xs"
    >
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleHomeClick}
        aria-label={`${portfolioData.name} — Go to Home`}
        title="Go to Home"
        className="whitespace-nowrap text-left text-sm font-bold tracking-wide text-slate-900 dark:text-zinc-100 sm:text-base cursor-pointer"
      >
        {portfolioData.name}
      </motion.button>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 justify-end">
        {/* Home Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleHomeClick}
          aria-label="Go to Home"
          title="Go to Home"
          className={`flex items-center justify-center w-9 h-9 rounded-full border-2 shadow-xs transition-all cursor-pointer ${
            activePage === 'home'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/30'
              : 'bg-white dark:bg-zinc-850 border-slate-300 dark:border-zinc-700 text-slate-700 hover:text-indigo-600 hover:border-indigo-400 dark:text-zinc-300 dark:hover:text-indigo-400 dark:hover:border-zinc-600'
          }`}
        >
          <Home className="w-4 h-4" />
        </motion.button>

        <motion.a
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          href="/Mirza_Julkawsar_Resume.pdf"
          download="Mirza_Julkawsar_Resume.pdf"
          aria-label="Download CV"
          title="Download CV"
          className="flex h-9 items-center justify-center gap-1.5 rounded-full border-2 border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-850 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:text-indigo-400 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>CV</span>
        </motion.a>

        {/* Theme Toggle Button */}
        {mounted ? (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-zinc-850 border-2 border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 shadow-xs hover:border-amber-400 dark:hover:border-amber-500/60 transition-colors cursor-pointer"
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
