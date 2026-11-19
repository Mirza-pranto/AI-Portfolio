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

export default function NavigationPills() {
  const { activePage, setActivePage, showQuickQuestions, toggleQuickQuestions } =
    usePortfolioStore();
  const setIsRenderingUi = usePortfolioStore((s) => s.setIsRenderingUi);
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (glowTimerRef.current) {
        clearTimeout(glowTimerRef.current);
        glowTimerRef.current = null;
      }
    };
  }, []);

  const handleNavigate = (page: PageType) => {
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
