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
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePortfolioStore, PageType } from '@/lib/store';
import { portfolioData } from '@/lib/data';

const navItems: { id: PageType; label: string; icon: React.ReactNode; mobileIcon: React.ReactNode }[] = [
  { id: 'home',       label: 'Home',       icon: <Home        className="w-4 h-4 shrink-0" />, mobileIcon: <Home        className="w-5 h-5" /> },
  { id: 'me',         label: 'Me',         icon: <User        className="w-4 h-4 shrink-0" />, mobileIcon: <User        className="w-5 h-5" /> },
  { id: 'education',  label: 'Education',  icon: <GraduationCap className="w-4 h-4 shrink-0" />, mobileIcon: <GraduationCap className="w-5 h-5" /> },
  { id: 'experience', label: 'Experience', icon: <Star        className="w-4 h-4 shrink-0" />, mobileIcon: <Star        className="w-5 h-5" /> },
  { id: 'projects',   label: 'Projects',   icon: <Briefcase   className="w-4 h-4 shrink-0" />, mobileIcon: <Briefcase   className="w-5 h-5" /> },
  { id: 'skills',     label: 'Skills',     icon: <Layers      className="w-4 h-4 shrink-0" />, mobileIcon: <Layers      className="w-5 h-5" /> },
  { id: 'fun',        label: 'Fun',        icon: <PartyPopper className="w-4 h-4 shrink-0" />, mobileIcon: <PartyPopper className="w-5 h-5" /> },
  { id: 'contact',    label: 'Contact',    icon: <Mail        className="w-4 h-4 shrink-0" />, mobileIcon: <Mail        className="w-5 h-5" /> },
];

interface LeftSidebarProps {
  onToggle?: (expanded: boolean) => void;
}

export default function LeftSidebar({ onToggle }: LeftSidebarProps) {
  const [expanded, setExpanded]       = useState(true);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [mounted, setMounted]         = useState(false);
  const { resolvedTheme, setTheme }   = useTheme();

  const activePage       = usePortfolioStore((s) => s.activePage);
  const setActivePage    = usePortfolioStore((s) => s.setActivePage);
  const setIsRenderingUi = usePortfolioStore((s) => s.setIsRenderingUi);

  useEffect(() => { setMounted(true); }, []);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [activePage]);

  const handleNavigate = (page: PageType) => {
    if (page === activePage) return;
    setActivePage(page);
    setIsRenderingUi(true);
    setTimeout(() => setIsRenderingUi(false), 1200);
    setDrawerOpen(false);
  };

  const toggleTheme = () =>
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  const handleToggle = () => {
    const next = !expanded;
    setExpanded(next);
    onToggle?.(next);
  };

  /* ───────────────────────────────────────
     SHARED: Nav + Utilities inner content
  ─────────────────────────────────────── */
  const SidebarContent = ({ showLabels }: { showLabels: boolean }) => (
    <>
      {/* Brand Row */}
      <div className="flex items-center gap-2.5 px-3 pt-5 pb-4 min-h-[72px] shrink-0">
        <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {showLabels && (
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

      {/* Divider */}
      <div className="mx-3 h-px bg-slate-200 dark:bg-zinc-800 shrink-0" />

      {/* Nav Items */}
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
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}>
                {item.icon}
              </span>
              <AnimatePresence>
                {showLabels && (
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

      {/* Bottom Utilities */}
      <div className="flex flex-col gap-1 px-2 pb-4 pt-2 shrink-0 border-t border-slate-200 dark:border-zinc-800 mt-2">
        <motion.a
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          href="/Mirza_Julkawsar_Resume.pdf"
          download="Mirza_Julkawsar_Resume.pdf"
          aria-label="Download CV" title="Download CV"
          className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <Download className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {showLabels && (
              <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.16 }} className="whitespace-nowrap overflow-hidden">
                Download CV
              </motion.span>
            )}
          </AnimatePresence>
        </motion.a>

        {mounted ? (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
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
              {showLabels && (
                <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.16 }} className="whitespace-nowrap overflow-hidden">
                  {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ) : (
          <div className="h-10 w-full rounded-xl" />
        )}
      </div>
    </>
  );

  return (
    <>
      {/* ══════════════════════════════════
          DESKTOP sidebar  (md and above)
      ══════════════════════════════════ */}
      <motion.aside
        animate={{ width: expanded ? 224 : 64 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="
          hidden md:flex flex-col
          fixed top-0 left-0 h-screen z-40
          bg-white/95 dark:bg-[#0d0d12]/95 backdrop-blur-xl
          border-r border-slate-200 dark:border-zinc-800
          shadow-[2px_0_24px_rgba(79,70,229,0.07)] dark:shadow-[2px_0_24px_rgba(0,0,0,0.5)]
          transition-colors duration-300
          overflow-visible
        "
      >
        {/* Inner clip so text doesn't spill when collapsed */}
        <div className="flex flex-col h-full overflow-hidden">
          <SidebarContent showLabels={expanded} />
        </div>

        {/* Collapse Toggle */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          className="
            absolute -right-4 top-20
            w-8 h-8 rounded-full
            bg-gradient-to-br from-indigo-600 to-violet-600
            shadow-[0_0_12px_rgba(99,102,241,0.6)]
            border-2 border-white dark:border-zinc-950
            flex items-center justify-center text-white
            hover:from-indigo-500 hover:to-violet-500
            hover:shadow-[0_0_18px_rgba(99,102,241,0.75)]
            transition-all duration-200 cursor-pointer z-50
          "
        >
          {expanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </motion.button>
      </motion.aside>

      {/* ══════════════════════════════════
          MOBILE: top bar + slide drawer
      ══════════════════════════════════ */}

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14
        bg-white/95 dark:bg-[#0d0d12]/95 backdrop-blur-xl
        border-b border-slate-200 dark:border-zinc-800
        shadow-sm
      ">
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand center */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center shadow shadow-indigo-500/30">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-wide">
            {portfolioData.name.split(' ')[0]}
          </span>
        </div>

        {/* Theme + CV (top-right on mobile) */}
        <div className="flex items-center gap-1.5">
          <a
            href="/Mirza_Julkawsar_Resume.pdf"
            download="Mirza_Julkawsar_Resume.pdf"
            aria-label="Download CV"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </a>
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {resolvedTheme === 'dark'
                ? <Sun  className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-indigo-600" />
              }
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setDrawerOpen(false)}
            className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="
              md:hidden fixed top-0 left-0 h-screen w-72 z-[60] flex flex-col
              bg-white dark:bg-[#0d0d12]
              border-r border-slate-200 dark:border-zinc-800
              shadow-2xl
            "
          >
            {/* Close button */}
            <div className="flex items-center justify-between px-4 pt-5 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center shadow shadow-indigo-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-wide">
                  {portfolioData.name}
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-4 h-px bg-slate-200 dark:bg-zinc-800" />

            {/* Nav */}
            <nav className="flex flex-col gap-1 px-3 pt-3 flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`
                      relative flex items-center gap-3 w-full rounded-xl px-3 py-3
                      text-sm font-medium transition-all duration-200 cursor-pointer text-left
                      ${isActive
                        ? 'bg-gradient-to-r from-indigo-600/15 to-violet-600/10 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80'
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600" />
                    )}
                    <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Drawer utilities */}
            <div className="flex flex-col gap-1 px-3 pb-6 pt-2 border-t border-slate-200 dark:border-zinc-800">
              <a
                href="/Mirza_Julkawsar_Resume.pdf"
                download="Mirza_Julkawsar_Resume.pdf"
                className="flex items-center gap-3 w-full rounded-xl px-3 py-3 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Download CV</span>
              </a>
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 w-full rounded-xl px-3 py-3 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  {resolvedTheme === 'dark'
                    ? <Sun  className="w-4 h-4 shrink-0 text-amber-400" />
                    : <Moon className="w-4 h-4 shrink-0 text-indigo-600" />
                  }
                  <span>{resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
