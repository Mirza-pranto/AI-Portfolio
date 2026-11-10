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
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          {showQuickQuestions ? 'Hide quick questions' : 'Show quick questions'}
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
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                activePage === item.id
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'bg-white border border-gray-100 shadow-sm text-zinc-600 hover:text-zinc-900 dark:bg-zinc-800 dark:border-none dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-700'
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
