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
   Thinking Dots Animation
   ═════════════════════════════════════════════════ */

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════════
   Main AICompanion Component
   ═════════════════════════════════════════════════ */

function AICompanion() {
  const {
    expandedItemType,
    expandedItemId,
    activePage,
    companionMessage,
    setCompanionMessage,
  } = usePortfolioStore();

  const [isThinking, setIsThinking] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const prevExpandedRef = useRef<string | null>(null);

  /* ── Auto-dismiss helper ── */
  const showMessage = useCallback(
    (msg: string, duration = 8000) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setCompanionMessage(msg);
      timerRef.current = setTimeout(() => setCompanionMessage(null), duration);
    },
    [setCompanionMessage]
  );

  /* ── Fetch AI-generated project reaction ── */
  const fetchProjectReaction = useCallback(
    async (projectId: string) => {
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
    } else if (expandedItemType === 'education') {
      showMessage(getRandomFrom(EDUCATION_MESSAGES));
    } else if (expandedItemType === 'experience') {
      showMessage(getRandomFrom(EXPERIENCE_MESSAGES));
    } else if (expandedItemType === 'skill') {
      showMessage(getRandomFrom(SKILL_MESSAGES));
    } else if (expandedItemType === 'fun') {
      showMessage(getRandomFrom(FUN_MESSAGES));
    } else if (expandedItemType === null) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
      setIsThinking(false);
      setCompanionMessage(null);
    }
  }, [expandedItemType, expandedItemId, fetchProjectReaction, showMessage, setCompanionMessage]);

  /* ── React to page navigation ── */
  useEffect(() => {
    const greeting = PAGE_GREETINGS[activePage];
    if (greeting) showMessage(greeting);
  }, [activePage, showMessage]);

  /* ── Scroll velocity → jump animation ── */
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const rawJump = useMotionValue(0);
  const smoothJump = useSpring(rawJump, { stiffness: 400, damping: 20 });
  const jumpDebounce = useRef(false);

  useEffect(() => {
    const unsubscribe = scrollVelocity.on('change', (v) => {
      if (Math.abs(v) > 1500 && !jumpDebounce.current) {
        jumpDebounce.current = true;
        rawJump.set(v > 0 ? -30 : 30);
        setTimeout(() => {
          rawJump.set(0);
          setTimeout(() => {
            jumpDebounce.current = false;
          }, 400);
        }, 150);
      }
    });
    return unsubscribe;
  }, [scrollVelocity, rawJump]);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const showBubble = companionMessage !== null || isThinking;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">

      {/* ══════════════ Speech Bubble ══════════════ */}
      <AnimatePresence mode="wait">
        {showBubble && (
          <motion.div
            key={isThinking ? 'thinking' : companionMessage}
            initial={{ opacity: 0, y: 14, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative max-w-[250px] pointer-events-auto mr-2"
          >
            {/* Glassmorphic bubble */}
            <div className="
              relative overflow-hidden
              backdrop-blur-lg
              bg-white/60 dark:bg-zinc-900/60
              border border-white/50 dark:border-zinc-600/40
              rounded-2xl rounded-br-md
              shadow-2xl shadow-cyan-300/10 dark:shadow-cyan-800/20
              px-4 py-3
            ">
              {/* Inner shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 via-transparent to-blue-50/20 dark:from-cyan-950/15 dark:via-transparent dark:to-blue-950/15 pointer-events-none" />

              <div className="relative z-10 text-[13px] leading-[1.65] text-zinc-700 dark:text-zinc-200 font-medium">
                {isThinking ? <ThinkingDots /> : companionMessage}
              </div>
            </div>

            {/* Tail */}
            <div className="
              absolute -bottom-[7px] right-5
              w-0 h-0
              border-l-[7px] border-l-transparent
              border-r-[7px] border-r-transparent
              border-t-[8px] border-t-white/60 dark:border-t-zinc-900/60
            " />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════ Cute Glass Orb Avatar ══════════════ */}
      <motion.div
        className="pointer-events-auto cursor-pointer select-none"
        style={{ y: smoothJump }}
        animate={{ y: [0, -12, 0] }}
        transition={{
          y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          setSpinTrigger((s) => s + 1);
          const greeting = PAGE_GREETINGS[activePage];
          if (greeting) showMessage(greeting);
        }}
        title="Click me!"
      >
        {/* Outer container — holds everything & does the select-spin */}
        <motion.div
          className="relative w-28 h-28 sm:w-32 sm:h-32"
          animate={{ rotate: spinTrigger * 360 }}
          transition={{ type: 'spring', stiffness: 50, damping: 10, mass: 1.2 }}
        >

          {/* ── Ambient Glow (behind everything) ── */}
          <div className="absolute inset-[-16px] rounded-full pointer-events-none">
            <motion.div
              className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)',
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* ── Layer 1: Glass Body (the sphere) ── */}
          <div className="
            absolute inset-0 rounded-full
            bg-white/25 dark:bg-white/[0.06]
            backdrop-blur-xl
            border-2 border-white/50 dark:border-white/[0.12]
            shadow-[0_0_50px_rgba(34,211,238,0.08),inset_0_-8px_20px_rgba(0,0,0,0.04)]
            dark:shadow-[0_0_50px_rgba(34,211,238,0.12),inset_0_-8px_20px_rgba(0,0,0,0.15)]
            overflow-hidden
          ">
            {/* Glass highlight — the specular reflection across the top */}
            <div
              className="absolute top-0 left-[10%] right-[10%] h-[45%] rounded-b-full pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)',
              }}
            />

            {/* Inner body gradient — gives depth */}
            <div className="
              absolute inset-[6px] rounded-full
              bg-gradient-to-b from-cyan-100/30 via-blue-50/15 to-indigo-100/20
              dark:from-cyan-900/20 dark:via-blue-950/15 dark:to-indigo-950/25
            " />
          </div>

          {/* ── Layer 2: The "Eye" / Core ── */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Outer eye glow */}
            <motion.div
              className="absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(34,211,238,0.5) 0%, rgba(59,130,246,0.25) 50%, transparent 80%)',
                filter: 'blur(8px)',
              }}
              animate={{
                scale: isThinking ? [1, 1.6, 1] : [1, 1.3, 1],
                opacity: isThinking ? [0.5, 1, 0.5] : [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: isThinking ? 0.8 : 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Core iris */}
            <motion.div
              className="
                relative w-8 h-8 sm:w-10 sm:h-10 rounded-full
                bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500
                dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-500
                shadow-[0_0_20px_rgba(34,211,238,0.5)]
                dark:shadow-[0_0_25px_rgba(34,211,238,0.6)]
              "
              animate={{
                scale: isThinking ? [1, 0.85, 1] : [1, 1.08, 1],
              }}
              transition={{
                duration: isThinking ? 0.6 : 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Inner pupil highlight */}
              <div className="absolute top-[20%] left-[22%] w-[28%] h-[28%] rounded-full bg-white/70 blur-[1px]" />

              {/* Bottom light catch */}
              <div className="absolute bottom-[15%] right-[18%] w-[18%] h-[18%] rounded-full bg-white/30 blur-[1px]" />
            </motion.div>
          </div>

          {/* ── Layer 3: Orbital Halo Ring ── */}
          <motion.div
            className="absolute inset-[-10px] sm:inset-[-12px] pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{
              rotateX: 68,
              rotateZ: isThinking ? [0, 360] : 25,
              rotate: isThinking ? [0, 360] : 0,
            }}
            transition={
              isThinking
                ? { rotate: { duration: 1.8, repeat: Infinity, ease: 'linear' }, rotateZ: { duration: 1.8, repeat: Infinity, ease: 'linear' } }
                : { rotate: { type: 'spring', stiffness: 40, damping: 15 }, rotateZ: { duration: 0 } }
            }
          >
            {/* Main ring */}
            <div className="
              absolute inset-0 rounded-full
              border-[2.5px] border-cyan-400/25 dark:border-cyan-400/20
              shadow-[0_0_12px_rgba(34,211,238,0.15)]
            " />

            {/* Orbiting data nodes */}
            {[0, 90, 200, 310].map((angle, i) => (
              <motion.div
                key={i}
                className="
                  absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full
                  bg-cyan-400 dark:bg-cyan-300
                  shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]
                "
                style={{
                  left: `calc(50% + ${48 * Math.cos((angle * Math.PI) / 180)}% - 5px)`,
                  top: `calc(50% + ${48 * Math.sin((angle * Math.PI) / 180)}% - 5px)`,
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.8, 1.3, 0.8],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>

          {/* ── Second Halo (counter-orbit) ── */}
          <motion.div
            className="absolute inset-[-6px] sm:inset-[-8px] pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{
              rotateX: -55,
              rotateZ: isThinking ? [360, 0] : -20,
              rotate: isThinking ? [360, 0] : 0,
            }}
            transition={
              isThinking
                ? { rotate: { duration: 2.4, repeat: Infinity, ease: 'linear' }, rotateZ: { duration: 2.4, repeat: Infinity, ease: 'linear' } }
                : { rotate: { type: 'spring', stiffness: 40, damping: 15 }, rotateZ: { duration: 0 } }
            }
          >
            <div className="
              absolute inset-0 rounded-full
              border-[1.5px] border-indigo-400/15 dark:border-indigo-400/12
              shadow-[0_0_8px_rgba(99,102,241,0.1)]
            " />

            {/* Smaller accent nodes */}
            {[45, 180, 270].map((angle, i) => (
              <motion.div
                key={i}
                className="
                  absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full
                  bg-indigo-400 dark:bg-indigo-300
                  shadow-[0_0_6px_1px_rgba(99,102,241,0.4)]
                "
                style={{
                  left: `calc(50% + ${46 * Math.cos((angle * Math.PI) / 180)}% - 4px)`,
                  top: `calc(50% + ${46 * Math.sin((angle * Math.PI) / 180)}% - 4px)`,
                }}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>

        </motion.div>
      </motion.div>
    </div>
  );
}

export default memo(AICompanion);
