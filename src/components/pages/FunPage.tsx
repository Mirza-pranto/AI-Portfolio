'use client';

import { motion } from 'framer-motion';
import { portfolioData } from '@/lib/data';
import { usePortfolioStore } from '@/lib/store';
import TypewriterText from '@/components/TypewriterText';
import ExpandedDetailView from '@/components/ExpandedDetailView';
import ChatMessages from '@/components/ChatMessages';

export default function FunPage() {
  const setExpandedItem = usePortfolioStore((s) => s.setExpandedItem);

  const funColors = [
    'from-emerald-100 to-teal-200 border-emerald-200 dark:from-emerald-950/60 dark:to-teal-900/60 dark:border-zinc-800',
    'from-violet-100 to-purple-200 border-violet-200 dark:from-violet-950/60 dark:to-purple-900/60 dark:border-zinc-800',
    'from-amber-100 to-orange-200 border-amber-200 dark:from-amber-950/60 dark:to-orange-900/60 dark:border-zinc-800',
  ];

  const handleFunCardClick = (id: string) => {
    setExpandedItem('fun', id);
    setTimeout(() => {
      const detailElement = document.getElementById('expanded-detail-view');
      if (detailElement) {
        detailElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4"
    >
      <div className="mb-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold text-zinc-900 dark:text-white"
        >
          When I&apos;m Not Coding 🎉
        </motion.h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Click any card to read about my leadership, community initiatives, and creative craft.
        </p>
      </div>

      {/* Image / Activity grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {portfolioData.fun.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleFunCardClick(item.id)}
            className={`h-56 rounded-2xl bg-gradient-to-br ${funColors[index]} flex flex-col items-center justify-center border shadow-xs cursor-pointer transition-all hover:shadow-lg p-5 text-center`}
          >
            <span className="text-5xl drop-shadow-sm mb-3">{item.emoji}</span>
            <span className="text-base font-bold text-zinc-900 dark:text-white line-clamp-1">
              {item.title}
            </span>
            <span className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 line-clamp-1">
              {item.subtitle}
            </span>
            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 mt-3">
              Click to view story →
            </span>
          </motion.div>
        ))}
      </div>

      {/* Description */}
      <div className="max-w-3xl">
        <TypewriterText
          text={portfolioData.fun.description}
          speed={4}
          className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-base md:text-lg whitespace-pre-line"
        />
      </div>

      {/* Mini Page (Expanded Detail View) */}
      <ExpandedDetailView />

      {/* AI Chat History - Always at the bottom */}
      <ChatMessages />
    </motion.div>
  );
}
