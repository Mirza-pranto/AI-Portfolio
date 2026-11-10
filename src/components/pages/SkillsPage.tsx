'use client';

import { motion } from 'framer-motion';
import { portfolioData } from '@/lib/data';
import { usePortfolioStore } from '@/lib/store';
import ExpandedDetailView from '@/components/ExpandedDetailView';
import ChatMessages from '@/components/ChatMessages';

export default function SkillsPage() {
  const setExpandedItem = usePortfolioStore((s) => s.setExpandedItem);
  const skillCategories = Object.entries(portfolioData.skills);

  const handleSkillClick = (skill: string) => {
    setExpandedItem('skill', skill);
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
          Skills & Expertise
        </motion.h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Click any skill badge to view the relevant projects built with that technology.
        </p>
      </div>

      <div className="space-y-8">
        {skillCategories.map(([category, skills], catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
          >
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, skillIndex) => (
                <motion.button
                  key={skill}
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: catIndex * 0.1 + skillIndex * 0.03,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSkillClick(skill)}
                  className="bg-zinc-900 text-white rounded-xl px-4 py-2 text-sm font-medium dark:bg-zinc-800 dark:text-gray-200 cursor-pointer hover:shadow-md transition-all active:scale-95 text-left group"
                >
                  <span className="group-hover:text-indigo-400 transition-colors">
                    {skill}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mini Page (Expanded Detail View) */}
      <ExpandedDetailView />

      <ChatMessages />
    </motion.div>
  );
}
