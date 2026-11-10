'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/lib/store';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export default function TypewriterText({
  text,
  speed = 8,
  className = '',
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const setIsRenderingUi = usePortfolioStore((s) => s.setIsRenderingUi);

  // When mounted or typing, ensure the neural glow is active
  useEffect(() => {
    if (currentIndex < text.length) {
      setIsRenderingUi(true);
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      // Completed typing!
      setIsRenderingUi(false);
    }
  }, [currentIndex, text, speed, setIsRenderingUi]);

  // Cleanup when unmounting
  useEffect(() => {
    return () => {
      // Only clear glow if we are still on the 'me' page
      // (prevents turning off glow if another page navigation just started)
      const currentActivePage = usePortfolioStore.getState().activePage;
      if (['me', 'education', 'experience', 'fun', 'contact'].includes(currentActivePage)) {
        setIsRenderingUi(false);
      }
    };
  }, [setIsRenderingUi]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-5 bg-zinc-400 ml-0.5 align-middle"
        />
      )}
    </motion.p>
  );
}
