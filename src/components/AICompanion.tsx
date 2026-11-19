'use client';

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useVelocity,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { usePortfolioStore } from '@/lib/store';
import { portfolioData } from '@/lib/data';

/* ═════════════════════════════════════════════════
   Rule-Based Messages (instant — no API call)
   ═════════════════════════════════════════════════ */

const EDUCATION_MESSAGES = [
  "Highest Distinction? Someone forgot what sleep was. 🎓",
  "GPA this high should come with a warning label. 📚",
  "Strong academic roots — the rest is curiosity and caffeine.",
];

const EXPERIENCE_MESSAGES = [
  "ROBU — where robots are born and engineers are forged. 🤖",
  "Leading a design team is harder than debugging spaghetti code. 🚀",
];

const SKILL_MESSAGES = [
  "Ah, the tech stack. The duct tape of the modern web. 🛠️",
  "Every skill here was earned the hard way — Stack Overflow and tears. ⚡",
  "The right tool for the right problem — that's engineering. 🎯",
];

const FUN_MESSAGES = [
  "Boxing gloves and acrylic brushes. Renaissance vibes. 🥊🎨",
  "Between deadlifts and pencil strokes — balance unlocked. ✨",
];

const PAGE_GREETINGS: Record<string, string> = {
  home:       "Hey! I'm the AI companion. Click around — I react to everything. 👋",
  me:         "Getting to know the human behind the neural networks. 👤",
  projects:   "Seven builds. Each one is a rabbit hole. Dive in! 🗂️",
  skills:     "A deep toolkit, carefully assembled. Tap one. 🛠️",
  education:  "Strong foundations. The grades speak for themselves. 🎓",
  experience: "Real-world impact — not just side projects. 💼",
  fun:        "Even engineers need hobbies. These ones hit different. 🎨",
  contact:    "Impressed? You should probably say hi. 📬",
};

function getRandomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ═════════════════════════════════════════════════
   Static Satellite Coordinates (Hydration-Safe)
   ═════════════════════════════════════════════════ */

const LAYER2_NODES = [
  { left: '86.77%', top: '80.85%' },
  { left: '4.89%',  top: '66.42%' },
  { left: '54.18%', top: '2.18%' },
];

const RING1_BEADS = [
  { left: '87%', top: '50%' },
  { left: '13%', top: '50%' },
];

const RING2_BEADS = [
  { left: '69.25%', top: '83.34%' },
  { left: '30.75%', top: '16.66%' },
];

const RING3_BEADS = [
  { left: '30%',    top: '84.64%' },
  { left: '70%',    top: '15.36%' },
];

const RING4_BEADS = [
  { left: '50%', top: '91.5%' },
  { left: '50%', top: '8.5%' },
];

/* ═════════════════════════════════════════════════
   Thinking Dots Animation
   ═════════════════════════════════════════════════ */

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* Module-level deduplication to prevent double-firing in multi-render modes */
let lastReactionProjectId = '';
let lastReactionTimestamp = 0;

/* ═════════════════════════════════════════════════
   Main AICompanion Component
   ═════════════════════════════════════════════════ */

interface AICompanionProps {
  variant?: 'floating' | 'docked';
  className?: string;
}

function AICompanion({ variant = 'floating', className = '' }: AICompanionProps) {
  const isDocked = variant === 'docked';
  const {
    expandedItemType,
    expandedItemId,
    activePage,
    companionMessage,
    setCompanionMessage,
  } = usePortfolioStore();

  const isRenderingUi = usePortfolioStore((s) => s.isRenderingUi);
  const [isThinking, setIsThinking] = useState(false);
  const isGenerating = isThinking || isRenderingUi;
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const clickCountRef = useRef(0);
  const clickResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const prevExpandedRef = useRef<string | null>(null);
  const prevPageRef = useRef<string>(activePage);

  /* ── Auto-dismiss helper ── */
  const showMessage = useCallback(
    (msg: string, duration = 8000) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setCompanionMessage(msg);
      timerRef.current = setTimeout(() => setCompanionMessage(null), duration);
    },
    [setCompanionMessage]
  );

  /* ── Click reaction handler with escalating dizzy dialogue ── */
  const handleAvatarClick = useCallback(() => {
    setSpinTrigger((s) => s + 1);
    clickCountRef.current += 1;

    // Reset rapid-click counter after 6 seconds of calm
    if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);
    clickResetTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 6000);

    const count = clickCountRef.current;
    if (count === 1) {
      showMessage("Oh, hoo.... ho... that was a smooth spin! 🌀✨", 4000);
    } else if (count === 2) {
      showMessage("Whoa, again?! You really like that 360 spin, don't you? 💫", 4500);
    } else if (count === 3) {
      showMessage("Hold on... my gyro sensors are getting a little dizzy! 😵‍💫", 5000);
    } else if (count === 4) {
      showMessage("Hey! Stop spinning me! My neural weights might get tangled! 🧠⚡", 5500);
    } else if (count === 5) {
      showMessage("Warning: Centrifugal overflow! My code is literally gonna mix up! 📜💥", 6000);
    } else {
      const dizzyQuips = [
        "100101... wait, did a semicolon just fly out of my stack?! 🌀😵",
        "Error 418: Companion is currently dizzy. Please let me catch my balance! 💫",
        "If my RAG pipeline starts hallucinating cat pictures, it's totally your fault! 🐱⚠️",
        "Look at me goooooo! But seriously, I'm feeling nauseous in binary! 0_0",
      ];
      showMessage(dizzyQuips[(count - 6) % dizzyQuips.length], 6000);
    }
  }, [showMessage]);

  /* ── Fetch AI-generated project reaction ── */
  const fetchProjectReaction = useCallback(
    async (projectId: string) => {
      const now = Date.now();
      if (lastReactionProjectId === projectId && now - lastReactionTimestamp < 3500) {
        return;
      }
      lastReactionProjectId = projectId;
      lastReactionTimestamp = now;

      const proj = portfolioData.projects.find(
        (p) => String(p.id) === projectId
      );
      if (!proj) {
        showMessage("Hmm, interesting project. Let me look closer… 🔍");
        return;
      }

      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setIsThinking(true);
      setCompanionMessage(null);

      try {
        const res = await fetch('/api/companion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectName: proj.title,
            subtitle: proj.subtitle,
            tags: proj.tags,
          }),
          signal: abortRef.current.signal,
        });

        const data = await res.json();
        setIsThinking(false);
        showMessage(data.message || "This one's interesting. 🧠", 8000);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setIsThinking(false);
        showMessage("My circuits buzzed — but this project's solid. ⚡", 6000);
      }
    },
    [showMessage, setCompanionMessage]
  );

  /* ── React to expanded item changes ── */
  useEffect(() => {
    const currentKey = `${expandedItemType}-${expandedItemId}`;
    if (currentKey === prevExpandedRef.current) return;
    prevExpandedRef.current = currentKey;

    if (expandedItemType === 'project' && expandedItemId) {
      setSpinTrigger((s) => s + 1);
      fetchProjectReaction(expandedItemId);
    } else if (expandedItemType === 'skill') {
      setSpinTrigger((s) => s + 1);
      const skillName = expandedItemId;
      showMessage(skillName ? `Checking out projects powered by ${skillName}? Let's see the stack! ⚡` : getRandomFrom(SKILL_MESSAGES));
    } else if (expandedItemType === 'education') {
      setSpinTrigger((s) => s + 1);
      showMessage(getRandomFrom(EDUCATION_MESSAGES));
    } else if (expandedItemType === 'experience') {
      setSpinTrigger((s) => s + 1);
      showMessage(getRandomFrom(EXPERIENCE_MESSAGES));
    } else if (expandedItemType === 'fun') {
      setSpinTrigger((s) => s + 1);
      showMessage(getRandomFrom(FUN_MESSAGES));
    } else if (expandedItemType === null) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
      setIsThinking(false);
      setCompanionMessage(null);
    }
  }, [expandedItemType, expandedItemId, fetchProjectReaction, showMessage, setCompanionMessage]);

  /* ── React to page navigation (Quick Questions / Tab Switching) ── */
  useEffect(() => {
    if (prevPageRef.current !== activePage) {
      prevPageRef.current = activePage;
      setIsPageTransitioning(true);

      // Effort to load transition: shrink, vigorously shake/strain, then pop back up
      const timer = setTimeout(() => {
        setIsPageTransitioning(false);
        const greeting = PAGE_GREETINGS[activePage];
        if (greeting) showMessage(greeting);
      }, 1400);

      return () => clearTimeout(timer);
    } else {
      const greeting = PAGE_GREETINGS[activePage];
      if (greeting) showMessage(greeting);
    }
  }, [activePage, showMessage]);

  /* ── Scroll velocity → lively jump animation when scrolling down ── */
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const rawJumpY = useMotionValue(0);
  const smoothJumpY = useSpring(rawJumpY, { stiffness: 320, damping: 16, mass: 0.8 });
  const isJumpingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = scrollVelocity.on('change', (latestVelocity) => {
      // Trigger upward jump when scrolling down with moderate speed
      if (latestVelocity > 250 && !isJumpingRef.current) {
        isJumpingRef.current = true;
        rawJumpY.set(-26);
        setTimeout(() => {
          rawJumpY.set(0);
          setTimeout(() => {
            isJumpingRef.current = false;
          }, 300);
        }, 150);
      } else if (latestVelocity < -400 && !isJumpingRef.current) {
        // Subtle dip when scrolling up fast
        isJumpingRef.current = true;
        rawJumpY.set(12);
        setTimeout(() => {
          rawJumpY.set(0);
          setTimeout(() => {
            isJumpingRef.current = false;
          }, 240);
        }, 130);
      }
    });
    return unsubscribe;
  }, [scrollVelocity, rawJumpY]);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const showBubble = companionMessage !== null || isGenerating;

  return (
    <div
      className={
        isDocked
          ? `relative w-full h-full flex items-center justify-center pointer-events-auto select-none ${className}`
          : `hidden md:flex fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex-col items-end gap-2.5 pointer-events-none ${className}`
      }
    >
      {/* ══════════════ Speech Bubble (Compact, high-contrast glassmorphism) ══════════════ */}
      <AnimatePresence mode="wait">
        {showBubble && (
          <motion.div
            key={isGenerating ? (isRenderingUi ? 'generating' : 'thinking') : companionMessage}
            initial={{ opacity: 0, y: isDocked ? 6 : 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            className={
              isDocked
                ? "absolute bottom-[calc(100%+10px)] right-0 w-[230px] max-w-[calc(100vw-36px)] pointer-events-auto z-50 mr-1"
                : "relative max-w-[210px] sm:max-w-[230px] pointer-events-auto mr-2"
            }
          >
            {/* Glassmorphic bubble body with crisp light mode border and contrast */}
            <div className="
              relative overflow-hidden
              backdrop-blur-xl
              bg-white/95 dark:bg-zinc-900/90
              border-2 border-slate-300/90 dark:border-indigo-500/30
              rounded-2xl rounded-br-sm
              shadow-xl shadow-slate-900/15 dark:shadow-indigo-950/30
              px-3.5 py-2.5
            ">
              {/* Subtle inner ambient tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-blue-50/30 dark:from-indigo-950/30 dark:via-transparent dark:to-violet-950/20 pointer-events-none" />

              <div className="relative z-10 text-xs sm:text-[13px] leading-[1.6] font-semibold text-slate-800 dark:text-zinc-100">
                {isGenerating && !companionMessage ? (
                  <div className="flex items-center gap-1.5 py-0.5">
                    <ThinkingDots />
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {isRenderingUi ? 'Synthesizing...' : 'Thinking...'}
                    </span>
                  </div>
                ) : (
                  companionMessage
                )}
              </div>
            </div>

            {/* Pointer tail with matching border */}
            <div className={`
              absolute -bottom-[7px] ${isDocked ? 'right-7' : 'right-5'}
              w-0 h-0
              border-l-[7px] border-l-transparent
              border-r-[7px] border-r-transparent
              border-t-[8px] border-t-white/95 dark:border-t-zinc-900/90
            `} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════ Scroll-Jump Wrapper ══════════════ */}
      <motion.div
        style={isDocked ? undefined : { y: smoothJumpY }}
        className="pointer-events-auto select-none"
      >
        {/* ══════════════ Idle Float, Hover Scale, & Page Transition Effort Wrapper ══════════════ */}
        <motion.div
          animate={
            isPageTransitioning
              ? {
                  scale: [1, 0.68, 0.68, 0.68, 0.68, 0.68, 0.68, 0.68, 0.68, 1.2, 0.96, 1],
                  x: [0, 0, -4, 4, -6, 6, -5, 5, -4, 4, 0, 0],
                  rotate: [0, -3, 6, -7, 9, -9, 8, -7, 6, -4, 0, 0],
                  y: isDocked ? [0, 2, 3, 3, 3, 3, 3, 2, 2, -4, 1, 0] : [0, 6, 7, 8, 8, 8, 8, 7, 6, -14, 2, 0],
                }
              : isDocked
              ? {
                  y: [0, -2.5, 0],
                  scale: 1,
                  x: 0,
                  rotate: 0,
                }
              : {
                  y: [0, -8, 0],
                  scale: 1,
                  x: 0,
                  rotate: 0,
                }
          }
          transition={
            isPageTransitioning
              ? {
                  duration: 1.4,
                  times: [0, 0.12, 0.22, 0.35, 0.48, 0.6, 0.72, 0.82, 0.88, 0.94, 0.98, 1],
                  ease: 'easeInOut',
                }
              : {
                  y: { duration: isDocked ? 2.8 : 3.4, repeat: Infinity, ease: 'easeInOut' },
                }
          }
          whileHover={{ scale: isDocked ? 1.05 : 1.1, y: isDocked ? -2 : -4 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleAvatarClick}
          className="cursor-pointer relative flex items-center justify-center"
          title="Click to interact!"
        >
          {/* ══════════════ Compact 3D Circular Cyber-Sphere + Fluid Aura ══════════════ */}
          <motion.div
            className={`relative flex items-center justify-center ${
              isDocked
                ? 'w-16 h-14 scale-[0.58] origin-center'
                : 'w-24 h-24 sm:w-28 sm:h-28'
            }`}
            style={{ perspective: 850, transformStyle: 'preserve-3d' }}
            animate={{ rotate: spinTrigger * 360 }}
            transition={{ type: 'spring', stiffness: 50, damping: 10, mass: 1.2 }}
          >

            {/* ── Layer 1: Ambient Luminous Aura (Soft circulating background fluid vortex) ── */}
            <motion.div
              className="absolute inset-[-12px] sm:inset-[-15px] rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(56,189,248,0.18) 42%, rgba(168,85,247,0.12) 65%, transparent 85%)',
                filter: 'blur(18px)',
              }}
              animate={{
                rotate: [0, 360],
                scale: isPageTransitioning
                  ? [1, 1.4, 1.1, 1.45, 1.15, 1.5, 1]
                  : isGenerating
                  ? [1, 1.3, 1]
                  : [1, 1.18, 1],
                opacity: isPageTransitioning
                  ? [0.7, 1, 0.75, 1, 0.8, 1, 0.7]
                  : isGenerating
                  ? [0.65, 1, 0.65]
                  : [0.65, 0.92, 0.65],
              }}
              transition={{
                rotate: { duration: isGenerating ? 5 : 18, repeat: Infinity, ease: 'linear' },
                scale: { duration: isPageTransitioning ? 1.4 : isGenerating ? 0.5 : 2.4, repeat: isPageTransitioning ? 0 : Infinity, ease: 'easeInOut' },
                opacity: { duration: isPageTransitioning ? 1.4 : isGenerating ? 0.5 : 2.4, repeat: isPageTransitioning ? 0 : Infinity, ease: 'easeInOut' },
              }}
            />

            {/* ── Layer 2: Secondary Counter-Flowing Precision Gyroscope Lines (Background Depth System) ── */}
            <motion.div
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-14px)' }}
              className="absolute inset-[-10px] sm:inset-[-13px] pointer-events-none z-0"
              animate={{
                rotate: isGenerating ? [360, 0] : [360, 0],
              }}
              transition={{
                duration: isGenerating ? 3.5 : 14,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <svg viewBox="0 0 180 180" className="w-full h-full" fill="none">
                {/* Track 1: Outer Sweeping Counter-Ellipse */}
                <path
                  d="M 148 90 C 148 126, 118 152, 68 148 C 22 144, 10 106, 24 64 C 38 22, 74 6, 120 14 C 148 20, 154 52, 138 78"
                  className="
                    counter-fluid
                    drop-shadow-[0_0_6px_rgba(99,102,241,0.3)]
                    dark:drop-shadow-[0_0_8px_rgba(124,58,237,0.35)]
                  "
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />

                {/* Track 2: Concentric Inner Counter-Track */}
                <path
                  d="M 136 90 C 136 120, 110 140, 72 136 C 34 132, 22 100, 34 68 C 46 36, 76 22, 112 28 C 134 32, 140 56, 128 78"
                  className="
                    counter-fluid
                    opacity-75
                  "
                  strokeWidth="1.0"
                  strokeLinecap="round"
                />

                {/* Track 3: Dashed Astrolabe Harmonic Sub-Track */}
                <path
                  d="M 142 90 C 142 123, 114 146, 70 142 C 28 138, 16 103, 29 66 C 42 29, 75 14, 116 21 C 141 26, 147 54, 133 78"
                  className="
                    counter-fluid
                    opacity-50
                  "
                  strokeWidth="0.8"
                  strokeDasharray="2.5 4"
                  strokeLinecap="round"
                />
              </svg>

              {/* Smaller Orbiting Micro-Nodes */}
              {LAYER2_NODES.map((pos, i) => (
                <motion.div
                  key={i}
                  suppressHydrationWarning
                  className="
                    absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2
                    bg-gradient-to-tr from-indigo-500 to-cyan-400 dark:bg-indigo-300
                    shadow-[0_0_5px_1px_rgba(99,102,241,0.5)]
                    dark:shadow-[0_0_5px_1px_rgba(129,140,248,0.4)]
                  "
                  style={{
                    left: pos.left,
                    top: pos.top,
                  }}
                  animate={{
                    opacity: isPageTransitioning ? [0.6, 1, 0.6] : isGenerating ? [0.7, 1, 0.7] : [0.6, 0.92, 0.6],
                    scale: isPageTransitioning ? [0.85, 1.4, 0.85] : isGenerating ? [0.9, 1.4, 0.9] : [0.85, 1.25, 0.85],
                  }}
                  transition={{
                    duration: isPageTransitioning ? 1.4 : isGenerating ? 0.5 : 2.4,
                    repeat: isPageTransitioning ? 0 : Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>

            {/* ── Layer 3: The 3D Glass Sphere (Circular, Tactile, Scaled-Down) ── */}
            <div
              style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}
              className="
                relative z-10
                w-[70px] h-[70px] sm:w-[80px] sm:h-[80px]
                rounded-full
                flex items-center justify-center
                overflow-hidden
                border-2 border-indigo-400/90 dark:border-indigo-500/50
                bg-gradient-to-b from-white/95 via-sky-50/80 to-indigo-100/90
                dark:bg-gradient-to-b dark:from-zinc-900/90 dark:via-slate-950/95 dark:to-indigo-950/80
                shadow-[0_12px_28px_rgba(99,102,241,0.25),0_4px_12px_rgba(56,189,248,0.2),inset_0_-6px_16px_rgba(99,102,241,0.2),inset_0_3px_12px_rgba(255,255,255,0.95)]
                dark:shadow-[0_0_28px_rgba(99,102,241,0.25),0_0_12px_rgba(139,92,246,0.2),inset_0_-8px_18px_rgba(15,10,30,0.8),inset_0_2px_8px_rgba(165,180,252,0.35)]
                backdrop-blur-xl
              "
            >

              {/* ── Internal Plasma Nucleus (Energy Core) ── */}
              <motion.div
                className="
                  absolute w-9 h-9 sm:w-11 sm:h-11 rounded-full
                  bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-300
                  dark:from-indigo-600 dark:via-violet-600 dark:to-indigo-400
                  shadow-[0_0_22px_rgba(79,70,229,0.7),0_0_10px_rgba(56,189,248,0.8)]
                  dark:shadow-[0_0_22px_rgba(99,102,241,0.55),0_0_10px_rgba(168,85,247,0.4)]
                "
                animate={{
                  scale: isPageTransitioning
                    ? [1, 1.4, 0.88, 1.45, 0.9, 1.5, 0.92, 1.4, 1]
                    : isGenerating
                    ? [0.95, 1.25, 0.95]
                    : [0.96, 1.08, 0.96],
                  opacity: isPageTransitioning
                    ? [0.75, 1, 0.75, 1, 0.8, 1, 0.85, 1, 0.75]
                    : isGenerating
                    ? [0.85, 1, 0.85]
                    : [0.75, 0.92, 0.75],
                }}
                transition={{
                  duration: isPageTransitioning ? 1.4 : isGenerating ? 0.5 : 2.4,
                  repeat: isPageTransitioning ? 0 : Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* ── 3D Spherical Specular Dome Glare (Apple Glass Volume) ── */}
              <div
                className="
                  absolute top-1 left-1.5 sm:top-1.5 sm:left-2
                  w-[60%] h-[38%]
                  rounded-full
                  bg-gradient-to-b from-white/90 via-white/40 to-transparent
                  blur-[0.5px]
                  pointer-events-none
                "
                style={{ transform: 'rotate(-28deg)' }}
              />

              {/* ── Subtle Bottom-Right Ambient Bounce Glow ── */}
              <div className="
                absolute bottom-1 right-1.5
                w-[48%] h-[24%]
                rounded-full
                bg-cyan-400/40 dark:bg-indigo-400/25
                blur-[4px]
                pointer-events-none
              " />
            </div>

            {/* ── Layer 4: 3D Multi-Planar Gyroscopic Rings (Orbiting IN FRONT of the Sphere across 5 distinct 3D axes) ── */}
            <div
              className="absolute inset-[-20px] sm:inset-[-26px] pointer-events-none z-20 flex items-center justify-center"
              style={{
                perspective: 900,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* ── 3D Ring 1: Equatorial Front-Tilt Orbit (Horizontal Plane passing across front face) ── */}
              <motion.div
                className="absolute w-full h-full flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{
                  rotateX: [66, 60, 72, 66],
                  rotateY: [-12, -4, -18, -12],
                  z: 14,
                }}
                transition={{
                  duration: 8.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <motion.div
                  className="w-full h-full"
                  animate={{ rotateZ: [0, 360] }}
                  transition={{
                    duration: isGenerating ? 2.4 : 9.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
                    {/* Outer Equatorial Orbit Rail */}
                    <circle
                      cx="100" cy="100" r="74"
                      className="
                        ring-equator
                        drop-shadow-[0_0_8px_rgba(99,102,241,0.35)]
                        dark:drop-shadow-[0_0_9px_rgba(129,140,248,0.4)]
                      "
                      strokeWidth="1.3"
                    />

                    {/* Concentric Inner Rail */}
                    <circle
                      cx="100" cy="100" r="66"
                      className="ring-equator opacity-80"
                      strokeWidth="0.9"
                    />

                    {/* Micro Dashed Track */}
                    <circle
                      cx="100" cy="100" r="70"
                      className="ring-equator opacity-60"
                      strokeWidth="0.8"
                      strokeDasharray="3 5"
                    />

                    {/* Specular Front Curvature Highlight Spine */}
                    <path
                      d="M 38 126 C 65 158, 135 158, 162 126"
                      stroke="url(#ringSpineGleam)"
                      strokeWidth="1.0"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Satellite Beads Orbiting on Equatorial Plane */}
                  {RING1_BEADS.map((pos, i) => (
                    <motion.div
                      key={i}
                      suppressHydrationWarning
                      className="
                        absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2
                        bg-gradient-to-tr from-blue-600 via-indigo-500 to-white
                        dark:from-indigo-400 dark:via-violet-300 dark:to-white
                        shadow-[0_0_8px_1.5px_rgba(37,99,235,0.7)]
                        dark:shadow-[0_0_8px_1.5px_rgba(139,92,246,0.6)]
                      "
                      style={{
                        left: pos.left,
                        top: pos.top,
                      }}
                      animate={{
                        scale: isPageTransitioning ? [0.85, 1.4, 0.85] : isGenerating ? [0.85, 1.4, 0.85] : [0.85, 1.25, 0.85],
                        opacity: isPageTransitioning ? [0.65, 1, 0.65] : isGenerating ? [0.65, 1, 0.65] : [0.65, 0.95, 0.65],
                      }}
                      transition={{
                        duration: isPageTransitioning ? 1.4 : isGenerating ? 0.5 : 2.4,
                        repeat: isPageTransitioning ? 0 : Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <div className="absolute top-[18%] left-[20%] w-[32%] h-[32%] rounded-full bg-white/95 blur-[0.2px]" />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* ── 3D Ring 2: Ascending Diagonal Orbit (Bottom-Left to Top-Right Tilt) ── */}
              <motion.div
                className="absolute w-full h-full flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{
                  rotateX: [-54, -46, -60, -54],
                  rotateY: [42, 50, 34, 42],
                  z: 11,
                }}
                transition={{
                  duration: 10.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <motion.div
                  className="w-full h-full"
                  animate={{ rotateZ: [360, 0] }}
                  transition={{
                    duration: isGenerating ? 3.0 : 12.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
                    {/* Outer Ascending Diagonal Rail */}
                    <circle
                      cx="100" cy="100" r="77"
                      className="
                        ring-diag1
                        drop-shadow-[0_0_7px_rgba(56,189,248,0.35)]
                        dark:drop-shadow-[0_0_8px_rgba(124,58,237,0.35)]
                      "
                      strokeWidth="1.2"
                    />

                    {/* Concentric Inner Rail */}
                    <circle
                      cx="100" cy="100" r="63"
                      className="ring-diag1 opacity-75"
                      strokeWidth="0.8"
                    />

                    {/* Dashed Sub-Rail */}
                    <circle
                      cx="100" cy="100" r="70"
                      className="ring-diag1 opacity-55"
                      strokeWidth="0.75"
                      strokeDasharray="2.5 4"
                    />
                  </svg>

                  {/* Satellite Beads Orbiting on Ascending Plane */}
                  {RING2_BEADS.map((pos, i) => (
                    <motion.div
                      key={i}
                      suppressHydrationWarning
                      className="
                        absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2
                        bg-gradient-to-tr from-indigo-500 to-cyan-400 dark:bg-indigo-300
                        shadow-[0_0_6px_1px_rgba(99,102,241,0.5)]
                        dark:shadow-[0_0_6px_1px_rgba(129,140,248,0.4)]
                      "
                      style={{
                        left: pos.left,
                        top: pos.top,
                      }}
                      animate={{
                        scale: isPageTransitioning ? [0.85, 1.4, 0.85] : isGenerating ? [0.85, 1.4, 0.85] : [0.85, 1.25, 0.85],
                        opacity: isPageTransitioning ? [0.65, 1, 0.65] : isGenerating ? [0.65, 1, 0.65] : [0.65, 0.92, 0.65],
                      }}
                      transition={{
                        duration: isPageTransitioning ? 1.4 : isGenerating ? 0.5 : 2.4,
                        repeat: isPageTransitioning ? 0 : Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* ── 3D Ring 3: Opposing Descending Diagonal Orbit (Top-Left to Bottom-Right Cross-Plane) ── */}
              <motion.div
                className="absolute w-full h-full flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{
                  rotateX: [52, 60, 44, 52],
                  rotateY: [-46, -38, -54, -46],
                  z: 13,
                }}
                transition={{
                  duration: 11.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <motion.div
                  className="w-full h-full"
                  animate={{ rotateZ: [0, 360] }}
                  transition={{
                    duration: isGenerating ? 3.4 : 14,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
                    {/* Outer Descending Diagonal Rail */}
                    <circle
                      cx="100" cy="100" r="80"
                      className="
                        ring-diag2
                        drop-shadow-[0_0_7px_rgba(99,102,241,0.3)]
                        dark:drop-shadow-[0_0_8px_rgba(168,85,247,0.35)]
                      "
                      strokeWidth="1.2"
                    />

                    {/* Inner Fine Rail */}
                    <circle
                      cx="100" cy="100" r="65"
                      className="ring-diag2 opacity-70"
                      strokeWidth="0.8"
                    />

                    {/* Fine Cadence Dots */}
                    <circle
                      cx="100" cy="100" r="72"
                      className="ring-diag2 opacity-55"
                      strokeWidth="0.75"
                      strokeDasharray="1.5 3.5"
                    />
                  </svg>

                  {/* Satellite Beads Orbiting on Descending Plane */}
                  {RING3_BEADS.map((pos, i) => (
                    <motion.div
                      key={i}
                      suppressHydrationWarning
                      className="
                        absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2
                        bg-gradient-to-tr from-sky-400 to-indigo-600 dark:from-purple-300 dark:to-indigo-500
                        shadow-[0_0_6px_1px_rgba(56,189,248,0.5)]
                        dark:shadow-[0_0_6px_1px_rgba(168,85,247,0.5)]
                      "
                      style={{
                        left: pos.left,
                        top: pos.top,
                      }}
                      animate={{
                        scale: isPageTransitioning ? [0.85, 1.4, 0.85] : isGenerating ? [0.85, 1.4, 0.85] : [0.85, 1.25, 0.85],
                        opacity: isPageTransitioning ? [0.65, 1, 0.65] : isGenerating ? [0.65, 1, 0.65] : [0.65, 0.92, 0.65],
                      }}
                      transition={{
                        duration: isPageTransitioning ? 1.4 : isGenerating ? 0.5 : 2.4,
                        repeat: isPageTransitioning ? 0 : Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* ── 3D Ring 4: Polar Meridian Orbit (Vertical North-to-South Longitude Loop) ── */}
              <motion.div
                className="absolute w-full h-full flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{
                  rotateX: [16, 24, 8, 16],
                  rotateY: [82, 88, 76, 82],
                  z: 9,
                }}
                transition={{
                  duration: 12.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <motion.div
                  className="w-full h-full"
                  animate={{ rotateZ: [360, 0] }}
                  transition={{
                    duration: isGenerating ? 3.8 : 16,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
                    {/* Primary Polar Meridian Rail */}
                    <circle
                      cx="100" cy="100" r="83"
                      className="
                        ring-polar
                        opacity-85
                        drop-shadow-[0_0_7px_rgba(14,165,233,0.3)]
                        dark:drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]
                      "
                      strokeWidth="1.15"
                    />

                    {/* Concentric Polar Sub-Rail */}
                    <circle
                      cx="100" cy="100" r="75"
                      className="ring-polar opacity-65"
                      strokeWidth="0.8"
                    />

                    {/* Dashed Meridian Track */}
                    <circle
                      cx="100" cy="100" r="79"
                      className="ring-polar opacity-55"
                      strokeWidth="0.75"
                      strokeDasharray="3 5.5"
                    />
                  </svg>

                  {/* Satellite Beads Orbiting on Polar Longitude Plane */}
                  {RING4_BEADS.map((pos, i) => (
                    <div
                      key={i}
                      suppressHydrationWarning
                      className="
                        absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2
                        bg-white dark:bg-violet-200
                        shadow-[0_0_6px_1.5px_rgba(255,255,255,0.85)]
                        dark:shadow-[0_0_6px_1.5px_rgba(168,85,247,0.8)]
                      "
                      style={{
                        left: pos.left,
                        top: pos.top,
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* ── 3D Ring 5: High-Oblique Precessing Orbit (Active 3D Gyroscopic Nutation) ── */}
              <motion.div
                className="absolute w-full h-full flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{
                  rotateX: [-32, -18, -44, -32],
                  rotateY: [-58, -38, -72, -58],
                  z: 16,
                }}
                transition={{
                  duration: 8.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <motion.div
                  className="w-full h-full"
                  animate={{ rotateZ: [0, 360] }}
                  transition={{
                    duration: isGenerating ? 4.2 : 18,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
                    {/* Outer Oblique Nutation Rail */}
                    <circle
                      cx="100" cy="100" r="87"
                      className="
                        ring-oblique
                        opacity-80
                        drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]
                        dark:drop-shadow-[0_0_9px_rgba(192,132,252,0.35)]
                      "
                      strokeWidth="1.1"
                    />

                    {/* Fine Cadence Ring */}
                    <circle
                      cx="100" cy="100" r="82"
                      className="ring-oblique opacity-60"
                      strokeWidth="0.75"
                      strokeDasharray="2 4"
                    />
                  </svg>

                  {/* Luminous Specular Pearl Node on Precession Track */}
                  <div
                    suppressHydrationWarning
                    className="
                      absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2
                      bg-gradient-to-tr from-white via-indigo-200 to-indigo-600
                      dark:from-white dark:via-violet-200 dark:to-violet-600
                      shadow-[0_0_8px_2px_rgba(99,102,241,0.85)]
                      dark:shadow-[0_0_8px_2px_rgba(192,132,252,0.8)]
                    "
                    style={{
                      left: '80.76%',
                      top: '80.76%',
                    }}
                  >
                    <div className="absolute top-[20%] left-[20%] w-[35%] h-[35%] rounded-full bg-white blur-[0.2px]" />
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default memo(AICompanion);
