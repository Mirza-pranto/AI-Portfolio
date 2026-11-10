'use client';

import { motion, type Variants } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react';
import { portfolioData } from '@/lib/data';
import { usePortfolioStore } from '@/lib/store';
import TypewriterText from '@/components/TypewriterText';
import ExpandedDetailView from '@/components/ExpandedDetailView';
import ChatMessages from '@/components/ChatMessages';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export default function EducationPage() {
  const setExpandedItem = usePortfolioStore((s) => s.setExpandedItem);

  const handleEducationClick = (id: string) => {
    setExpandedItem('education', id);
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
      <div className="mb-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold text-zinc-900 dark:text-white"
        >
          Education
        </motion.h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Academic foundation, honors, and degrees. Click any card to expand details.
        </p>
      </div>

      {/* Staggered Alternating (Zigzag) Education List - Seamless without background card wrapper */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {portfolioData.education.map((edu, index) => {
          const isReversed = index % 2 === 1;

          return (
            <motion.div
              key={edu.id}
              variants={childVariants}
              whileHover={{ y: -4 }}
              onClick={() => handleEducationClick(edu.id)}
              className={`flex flex-col ${
                isReversed ? 'md:flex-row-reverse' : 'md:flex-row'
              } gap-6 md:gap-8 items-center md:items-start cursor-pointer group`}
            >
              {/* Image / Placeholder Column */}
              <div className="w-full md:w-52 h-48 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 relative shadow-xs group-hover:shadow-md group-hover:border-indigo-300 dark:group-hover:border-zinc-600 transition-all p-4">
                {edu.image ? (
                  <img
                    src={edu.image}
                    alt={edu.institution}
                    className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shadow-xs text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 line-clamp-2">
                      {edu.institution}
                    </span>
                  </div>
                )}
              </div>

              {/* Details Column - directly on page background */}
              <div className="flex-1 flex flex-col justify-center w-full">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2.5">
                    {edu.logo && (
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-0.5 flex items-center justify-center flex-shrink-0 shadow-xs">
                        <img
                          src={edu.logo}
                          alt={edu.institution}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {edu.institution}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/60">
                    Click to view details →
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  {edu.degree}
                </h4>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    {edu.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    {edu.location}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pt-1">
                  <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-1" />
                  <TypewriterText
                    text={edu.details}
                    speed={4}
                    className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mini Page (Expanded Detail View) */}
      <ExpandedDetailView />

      {/* AI Chat History - Always at the bottom */}
      <ChatMessages />
    </motion.div>
  );
}
