'use client';

import { motion, type Variants } from 'framer-motion';
import { Briefcase, MapPin, Calendar, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import { portfolioData } from '@/lib/data';
import { usePortfolioStore } from '@/lib/store';
import TypewriterText from '@/components/TypewriterText';
import ExpandedDetailView from '@/components/ExpandedDetailView';
import ChatMessages from '@/components/ChatMessages';

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

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

export default function ExperiencePage() {
  const setExpandedItem = usePortfolioStore((s) => s.setExpandedItem);

  const handleExperienceClick = (id: string) => {
    setExpandedItem('experience', id);
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
          Experience
        </motion.h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Leadership, professional roles, and engineering contributions. Click any card to expand details.
        </p>
      </div>

      {/* Staggered Alternating Experience List - Seamless without background card wrapper */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {portfolioData.experience.map((exp, index) => {
          const isReversed = index % 2 === 1;

          return (
            <motion.div
              key={exp.id}
              variants={childVariants}
              whileHover={{ y: -4 }}
              onClick={() => handleExperienceClick(exp.id)}
              className={`flex flex-col ${
                isReversed ? 'md:flex-row-reverse' : 'md:flex-row'
              } gap-6 md:gap-8 items-center md:items-start cursor-pointer group`}
            >
              {/* Image / Placeholder Column */}
              <div className="w-full md:w-52 h-48 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-indigo-500/10 dark:from-zinc-800 dark:to-zinc-800/60 border border-emerald-100/60 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 relative shadow-sm group-hover:shadow-md group-hover:border-emerald-300 dark:group-hover:border-zinc-600 transition-all">
                {exp.image ? (
                  <img
                    src={exp.image}
                    alt={exp.company}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-700 flex items-center justify-center shadow-xs text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                      <Briefcase className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 line-clamp-2">
                      {exp.company}
                    </span>
                  </div>
                )}
              </div>

              {/* Details Column - directly on page background */}
              <div className="flex-1 flex flex-col justify-center w-full">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2.5">
                    {exp.logo && (
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-0.5 flex items-center justify-center flex-shrink-0 shadow-2xs">
                        <img
                          src={exp.logo}
                          alt={`${exp.company} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {exp.role}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/60">
                    Click to view details →
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {exp.company}
                </h4>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    {exp.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    {exp.location}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pt-1 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                  <TypewriterText
                    text={exp.details}
                    speed={4}
                    className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base"
                  />
                </div>

                {/* Visible Links / Badges for Website, Facebook & Instagram */}
                {(exp as any).links && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-wrap items-center gap-2.5 pt-1"
                  >
                    {(exp as any).links.website && (
                      <a
                        href={(exp as any).links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all shadow-2xs"
                      >
                        <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Official Website
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )}
                    {(exp as any).links.facebook && (
                      <a
                        href={(exp as any).links.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all shadow-2xs"
                      >
                        <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2]" />
                        Facebook Page
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )}
                    {(exp as any).links.instagram && (
                      <a
                        href={(exp as any).links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-200/80 dark:border-pink-800/80 hover:bg-pink-100 dark:hover:bg-pink-900/60 transition-all shadow-2xs"
                      >
                        <InstagramIcon className="w-3.5 h-3.5 text-[#E4405F]" />
                        Instagram
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )}
                  </div>
                )}
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
