'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { portfolioData } from '@/lib/data';
import { usePortfolioStore } from '@/lib/store';
import ExpandedDetailView from '@/components/ExpandedDetailView';
import ChatMessages from '@/components/ChatMessages';

export default function ProjectsPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const setExpandedItem = usePortfolioStore((s) => s.setExpandedItem);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleProjectClick = (projectId: number | string) => {
    setExpandedItem('project', projectId);
    // Smooth scroll down to reveal the expanded detail view
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-bold text-zinc-900 dark:text-white"
          >
            Projects
          </motion.h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Click any project card to view architecture, metrics, and source links.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Previous project"
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-gray-300 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Next project"
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-gray-300 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
      >
        {portfolioData.projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleProjectClick(project.id)}
            className={`flex-shrink-0 w-72 md:w-80 rounded-2xl bg-gradient-to-br ${project.gradient} p-6 snap-center shadow-md cursor-pointer transition-all hover:shadow-xl`}
          >
            {/* Device mockup placeholder */}
            <div className="w-full h-32 rounded-xl bg-black/20 mb-4 flex items-center justify-center">
              <div className="w-16 h-16 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
            </div>

            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
              {project.subtitle}
            </p>
            <h3 className="text-white text-lg font-bold mb-2">
              {project.title}
            </h3>
            <p className="text-white/90 text-sm leading-relaxed mb-3 line-clamp-3">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center text-xs font-semibold text-white/90 pt-2 border-t border-white/15">
              <span>Click for details & links →</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-3xl"
      >
        <p>
          These are just a few highlights from my portfolio. I&apos;ve worked on
          everything from production ML systems to hackathon prototypes, always
          focused on building things that solve real problems. Ask me about any
          project for more details!
        </p>
      </motion.div>

      {/* Mini Page (Expanded Detail View) */}
      <ExpandedDetailView />

      {/* AI Chat History - Always at the bottom */}
      <ChatMessages />
    </motion.div>
  );
}
