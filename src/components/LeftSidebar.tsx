'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  User,
  GraduationCap,
  Briefcase,
  Star,
  Layers,
  PartyPopper,
  Mail,
  Download,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePortfolioStore, PageType } from '@/lib/store';
import { portfolioData } from '@/lib/data';

const navItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
  { id: 'home',       label: 'Home',       icon: <Home       className="w-4 h-4 shrink-0" /> },
  { id: 'me',         label: 'Me',         icon: <User       className="w-4 h-4 shrink-0" /> },
  { id: 'education',  label: 'Education',  icon: <GraduationCap className="w-4 h-4 shrink-0" /> },
  { id: 'experience', label: 'Experience', icon: <Star       className="w-4 h-4 shrink-0" /> },
  { id: 'projects',   label: 'Projects',   icon: <Briefcase  className="w-4 h-4 shrink-0" /> },
  { id: 'skills',     label: 'Skills',     icon: <Layers     className="w-4 h-4 shrink-0" /> },
  { id: 'fun',        label: 'Fun',        icon: <PartyPopper className="w-4 h-4 shrink-0" /> },
  { id: 'contact',    label: 'Contact',    icon: <Mail       className="w-4 h-4 shrink-0" /> },
];

interface LeftSidebarProps {
  onToggle?: (expanded: boolean) => void;
}

export default function LeftSidebar({ onToggle }: LeftSidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const activePage      = usePortfolioStore((s) => s.activePage);
  const setActivePage   = usePortfolioStore((s) => s.setActivePage);
  const setIsRenderingUi = usePortfolioStore((s) => s.setIsRenderingUi);

  useEffect(() => { setMounted(true); }, []);

  const handleNavigate = (page: PageType) => {
    if (page === activePage) return;
    setActivePage(page);
    setIsRenderingUi(true);
    setTimeout(() => setIsRenderingUi(false), 1200);
  };

  const toggleTheme = () =>
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  /* ── Collapse Toggle Button ── */
  const handleToggle = () => {
    const next = !expanded;
    setExpanded(next);
    onToggle?.(next);
  };

  return (
    <motion.aside
      animate={{ width: expanded ? 224 : 64 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className={`
        fixed top-0 left-0 h-screen z-40 flex flex-col
        bg-white/95 dark:bg-[#0d0d12]/95 backdrop-blur-xl
        border-r border-slate-200 dark:border-zinc-800
        shadow-[2px_0_24px_rgba(79,70,229,0.07)] dark:shadow-[2px_0_24px_rgba(0,0,0,0.5)]
        transition-colors duration-300
        overflow-visible
      `}
    >
      {/* ── Brand / Logo Row ── */}
      <div className="flex items-center gap-2.5 px-3 pt-5 pb-4 min-h-[72px] shrink-0">
        {/* Purple orb icon */}
        <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="text-sm font-bold tracking-wide text-slate-900 dark:text-zinc-100 whitespace-nowrap overflow-hidden"
            >
              {portfolioData.name}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Divider ── */}
      <div className="mx-3 h-px bg-slate-200 dark:bg-zinc-800 shrink-0" />

      {/* ── Navigation Items ── */}
      <nav className="flex flex-col gap-1 px-2 pt-3 flex-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNavigate(item.id)}
              title={item.label}
              className={`
                relative flex items-center gap-3 w-full rounded-xl px-3 py-2.5
                text-sm font-medium transition-all duration-200 cursor-pointer text-left
                ${isActive
                  ? 'bg-gradient-to-r from-indigo-600/15 to-violet-600/10 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-indigo-600 dark:hover:text-indigo-400'
                }
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon */}
              <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}>
                {item.icon}
              </span>

              {/* Label */}
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.16 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* ── Bottom Utilities ── */}
      <div className="flex flex-col gap-1 px-2 pb-4 pt-2 shrink-0 border-t border-slate-200 dark:border-zinc-800 mt-2">

        {/* Download CV */}
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          href="/Mirza_Julkawsar_Resume.pdf"
          download="Mirza_Julkawsar_Resume.pdf"
          aria-label="Download CV"
          title="Download CV"
          className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <Download className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.16 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Download CV
              </motion.span>
            )}
          </AnimatePresence>
        </motion.a>

        {/* Theme Toggle */}
        {mounted ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-amber-600 dark:hover:text-amber-400"
          >
            {resolvedTheme === 'dark'
              ? <Sun  className="w-4 h-4 shrink-0 text-amber-400" />
              : <Moon className="w-4 h-4 shrink-0 text-indigo-600" />
            }
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.16 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ) : (
          <div className="h-10 w-full rounded-xl" />
        )}
      </div>

      {/* ── Collapse Toggle Button ── */}
      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleToggle()}
        aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        className="
          absolute -right-4 top-20
          w-8 h-8 rounded-full
          bg-gradient-to-br from-indigo-600 to-violet-600
          shadow-[0_0_12px_rgba(99,102,241,0.6)]
          border-2 border-white dark:border-zinc-950
          flex items-center justify-center
          text-white
          hover:from-indigo-500 hover:to-violet-500
          hover:shadow-[0_0_18px_rgba(99,102,241,0.75)]
          transition-all duration-200 cursor-pointer z-50
        "
      >
        {expanded
          ? <ChevronLeft  className="w-4 h-4" />
          : <ChevronRight className="w-4 h-4" />
        }
      </motion.button>
    </motion.aside>
  );
}
