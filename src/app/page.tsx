'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
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
  const [sidebarWidth, setSidebarWidth] = useState(224);

  return (
    <div className="min-h-screen bg-transparent text-zinc-900 dark:text-gray-100 transition-colors duration-300 flex">
      {/* Neural Glow Effect */}
      <NeuralGlow />

      {/* Left Sidebar Navigation */}
      <LeftSidebar onToggle={(expanded) => setSidebarWidth(expanded ? 224 : 64)} />

      {/* Main area – offset by sidebar width */}
      <motion.div
        className="flex-1 flex flex-col min-h-screen"
        animate={{ marginLeft: sidebarWidth }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      >
        {/* Main scrollable content area */}
        <main className="overflow-y-auto pb-44 flex-1">
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
        <BottomInterface sidebarWidth={sidebarWidth} />
      </motion.div>
    </div>
  );
}
