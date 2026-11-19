'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/lib/store';
import LeftSidebar from '@/components/LeftSidebar';
import NeuralGlow from '@/components/NeuralGlow';
import BottomInterface from '@/components/BottomInterface';
import HomePage from '@/components/pages/HomePage';
import MePage from '@/components/pages/MePage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import SkillsPage from '@/components/pages/SkillsPage';
import EducationPage from '@/components/pages/EducationPage';
import ExperiencePage from '@/components/pages/ExperiencePage';
import FunPage from '@/components/pages/FunPage';
import ContactPage from '@/components/pages/ContactPage';

const pageComponents = {
  home: HomePage,
  me: MePage,
  projects: ProjectsPage,
  skills: SkillsPage,
  education: EducationPage,
  experience: ExperiencePage,
  fun: FunPage,
  contact: ContactPage,
};

export default function Page() {
  const activePage = usePortfolioStore((s) => s.activePage);
  const ActiveComponent = pageComponents[activePage];

  // Desktop sidebar expanded state: 224 expanded, 64 collapsed
  const [desktopSidebarWidth, setDesktopSidebarWidth] = useState(224);
  // Track if we're on mobile (< 768px)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const sidebarOffset = isMobile ? 0 : desktopSidebarWidth;

  return (
    <div className="min-h-screen bg-transparent text-zinc-900 dark:text-gray-100 transition-colors duration-300">
      {/* Neural Glow Effect */}
      <NeuralGlow />

      {/* Left Sidebar / Mobile top-bar + drawer */}
      <LeftSidebar onToggle={(expanded) => setDesktopSidebarWidth(expanded ? 224 : 64)} />

      {/* Main area */}
      <motion.div
        className="flex flex-col min-h-screen"
        animate={{ marginLeft: sidebarOffset }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      >
        {/* Main scrollable content — pt-14 on mobile for the fixed top bar */}
        <main className="overflow-y-auto pb-44 flex-1 pt-14 md:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="py-8"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Interface (Navigation Pills + Chat) */}
        <BottomInterface sidebarWidth={sidebarOffset} />
      </motion.div>
    </div>
  );
}
