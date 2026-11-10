'use client';

import { useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, Dumbbell, Palette } from 'lucide-react';
import { portfolioData } from '@/lib/data';
import TypewriterText from '@/components/TypewriterText';
import ChatMessages from '@/components/ChatMessages';

const sectionIcons: Record<string, React.ReactNode> = {
  'fun-1': <Dumbbell className="w-5 h-5" />,
  'fun-2': <Palette className="w-5 h-5" />,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
    },
  },
};

function PaintingGallery({ images, title }: { images: string[]; title: string }) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToImage = (index: number) => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    gallery.scrollTo({
      left: index * gallery.clientWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  return (
    <>
      <div
        ref={galleryRef}
        role="region"
        aria-label={`${title} photos`}
        onScroll={(event) => {
          const gallery = event.currentTarget;
          setActiveIndex(Math.round(gallery.scrollLeft / gallery.clientWidth));
        }}
        className="absolute inset-0 flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {images.map((image, imageIndex) => (
          <img
            key={image}
            src={image}
            alt={`${title} ${imageIndex + 1}`}
            className="h-full w-full shrink-0 snap-center object-contain"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => scrollToImage(Math.max(0, activeIndex - 1))}
        disabled={activeIndex === 0}
        aria-label="Show previous painting"
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-md transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollToImage(Math.min(images.length - 1, activeIndex + 1))}
        disabled={activeIndex === images.length - 1}
        aria-label="Show next painting"
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-md transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <span className="absolute right-4 top-4 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
        {activeIndex + 1} / {images.length}
      </span>
    </>
  );
}

export default function FunPage() {
  const sections = (portfolioData.fun as any).sections || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4"
    >
      {/* Page Header */}
      <div className="mb-12">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold text-zinc-900 dark:text-white"
        >
          Beyond the Terminal
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-xl italic"
        >
          Where discipline meets creativity — the passions that shape me outside of code.
        </motion.p>
      </div>

      {/* Two Cinematic Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-20"
      >
        {sections.map((section: any, index: number) => {
          const isReversed = index % 2 === 1;
          const isGymSection = section.id === 'fun-1';
          const isPaintingSection = section.id === 'fun-2';

          return (
            <motion.section
              key={section.id}
              variants={sectionVariants}
              className="group"
            >
              {/* Two-Column Layout: Image + Text, alternating */}
              <div
                className={`flex flex-col ${
                  isReversed ? 'md:flex-row-reverse' : 'md:flex-row'
                } gap-8 md:gap-12 items-center`}
              >
                {/* Visual Column — Cinematic Image or Gradient Placeholder */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="w-full md:w-[45%] flex-shrink-0"
                >
                  <div
                    className={`relative w-full ${
                      isGymSection
                        ? 'aspect-[4/5]'
                        : isPaintingSection
                          ? 'aspect-[3/4]'
                          : 'aspect-[4/3]'
                    } rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-500 ${
                      section.image
                        ? 'bg-zinc-900'
                        : `bg-gradient-to-br ${section.gradient}`
                    }`}
                  >
                    {isPaintingSection ? (
                      <PaintingGallery images={section.gallery} title={section.title} />
                    ) : section.image ? (
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-full object-cover filter group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="relative z-10 flex flex-col items-center gap-3">
                          <span className="text-6xl drop-shadow-lg">
                            {section.emoji}
                          </span>
                          <span className="text-sm font-semibold text-white/90 tracking-wide uppercase">
                            {section.subtitle}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Floating badge overlaying the bottom of the image */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <div className="flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-xl px-3 py-1.5 shadow-md border border-zinc-200/60 dark:border-zinc-800/80">
                        <span className="text-indigo-600 dark:text-indigo-400">
                          {sectionIcons[section.id] || (
                            <span className="text-lg">{section.emoji}</span>
                          )}
                        </span>
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 tracking-wide uppercase">
                          {section.subtitle}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Text Column — Poetic Description */}
                <div className="flex-1 flex flex-col justify-center w-full">
                  {/* Section Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
                      {sectionIcons[section.id] || (
                        <span className="text-lg">{section.emoji}</span>
                      )}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                      {section.title}
                    </h3>
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-5 uppercase tracking-wider">
                    {section.subtitle}
                  </p>

                  {/* Poetic Description with Typewriter */}
                  <div className="mb-6">
                    <TypewriterText
                      text={section.description}
                      speed={3}
                      className="text-zinc-600 dark:text-zinc-300 leading-[1.85] text-base sm:text-[17px] font-light italic"
                    />
                  </div>

                  {/* Tags */}
                  {section.tags && section.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {section.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Elegant Divider Between Sections */}
              {index < sections.length - 1 && (
                <div className="flex items-center justify-center mt-16">
                  <div className="h-px w-16 bg-zinc-300/60 dark:bg-zinc-700/60" />
                  <span className="mx-4 text-zinc-400 dark:text-zinc-600 text-xs tracking-widest uppercase font-medium">
                    ✦
                  </span>
                  <div className="h-px w-16 bg-zinc-300/60 dark:bg-zinc-700/60" />
                </div>
              )}
            </motion.section>
          );
        })}
      </motion.div>

      {/* Closing Statement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 mb-4 max-w-2xl mx-auto text-center"
      >
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base italic leading-relaxed">
          {portfolioData.fun.description}
        </p>
      </motion.div>

      {/* AI Chat History - Always at the bottom */}
      <ChatMessages />
    </motion.div>
  );
}
