'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Smile, Briefcase, Layers, GraduationCap, Star, PartyPopper, User } from 'lucide-react';
import { usePortfolioStore, PageType } from '@/lib/store';

const navItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
  { id: 'me', label: 'Me', icon: <Smile className="w-4 h-4" /> },
  { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'experience', label: 'Experience', icon: <Star className="w-4 h-4" /> },
  { id: 'projects', label: 'Projects', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'skills', label: 'Skills', icon: <Layers className="w-4 h-4" /> },
  { id: 'fun', label: 'Fun', icon: <PartyPopper className="w-4 h-4" /> },
  { id: 'contact', label: 'Contact', icon: <User className="w-4 h-4" /> },
];

interface NavigationPillsProps {
  variant?: 'wrap' | 'slider';
}

export default function NavigationPills({ variant = 'wrap' }: NavigationPillsProps) {
  const { activePage, setActivePage, showQuickQuestions, toggleQuickQuestions } =
    usePortfolioStore();
  const setIsRenderingUi = usePortfolioStore((s) => s.setIsRenderingUi);
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (glowTimerRef.current) {
        clearTimeout(glowTimerRef.current);
        glowTimerRef.current = null;
      }
    };
  }, []);

  // Auto-peek / auto-rotate effect at the very beginning to demonstrate it is a slider
  useEffect(() => {
    if (variant !== 'slider') return;

    // Small delay after mount so initial entrance settles
    const timer1 = setTimeout(() => {
      if (userInteractedRef.current || !sliderRef.current) return;
      const el = sliderRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 10) {
        const peekDistance = Math.min(115, maxScroll);
        el.scrollTo({ left: peekDistance, behavior: 'smooth' });
      }
    }, 1100);

    // Pause so user sees the hidden pills, then smoothly return
    const timer2 = setTimeout(() => {
      if (userInteractedRef.current || !sliderRef.current) return;
      sliderRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [variant]);

  const handleNavigate = (page: PageType) => {
    userInteractedRef.current = true;
    if (page === activePage) return;

    if (glowTimerRef.current) {
      clearTimeout(glowTimerRef.current);
      glowTimerRef.current = null;
    }

    setActivePage(page);
    setIsRenderingUi(true);

    if (page !== 'me') {
      glowTimerRef.current = setTimeout(() => {
        setIsRenderingUi(false);
        glowTimerRef.current = null;
      }, 1500);
    }
  };

  if (variant === 'slider') {
    return (
      <div className="relative w-full overflow-hidden">
        <div
          ref={sliderRef}
          onTouchStart={() => { userInteractedRef.current = true; }}
          onPointerDown={() => { userInteractedRef.current = true; }}
          onWheel={() => { userInteractedRef.current = true; }}
          className="flex items-center gap-1.5 overflow-x-auto scroll-smooth py-1 px-1 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleNavigate(item.id)}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer border select-none ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-100/90 hover:bg-indigo-50 border-slate-200/90 text-slate-700 hover:text-indigo-700 dark:bg-zinc-800/90 dark:border-zinc-700/80 dark:text-zinc-300 dark:hover:text-white'
                }`}
              >
                {item.icon}
                <span className="whitespace-nowrap">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Toggle */}
      <div className="flex justify-center mb-2">
        <button
          onClick={toggleQuickQuestions}
          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors cursor-pointer tracking-wide"
        >
          {showQuickQuestions ? '↑ Hide quick questions' : '↓ Show quick questions'}
        </button>
      </div>

      {/* Pills */}
      {showQuickQuestions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex items-center justify-center gap-2 flex-wrap"
        >
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigate(item.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                activePage === item.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 hover:bg-indigo-50 border-slate-300 text-slate-700 hover:text-indigo-700 hover:border-indigo-300 shadow-xs dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-700 dark:hover:border-zinc-600'
              }`}
            >
              {item.icon}
              {item.label}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
