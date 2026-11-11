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
          className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400"
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
        rawJumpY.set(-36);
        setTimeout(() => {
          rawJumpY.set(0);
          setTimeout(() => {
            isJumpingRef.current = false;
          }, 320);
        }, 160);
      } else if (latestVelocity < -400 && !isJumpingRef.current) {
        // Subtle dip when scrolling up fast
        isJumpingRef.current = true;
        rawJumpY.set(16);
        setTimeout(() => {
          rawJumpY.set(0);
          setTimeout(() => {
            isJumpingRef.current = false;
          }, 260);
        }, 140);
      }
    });
    return unsubscribe;
  }, [scrollVelocity, rawJumpY]);

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

      {/* ══════════════ Speech Bubble (High-contrast glassmorphism) ══════════════ */}
      <AnimatePresence mode="wait">
        {showBubble && (
          <motion.div
            key={isThinking ? 'thinking' : companionMessage}
            initial={{ opacity: 0, y: 14, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            className="relative max-w-[260px] pointer-events-auto mr-3"
          >
            {/* Glassmorphic bubble body with crisp light mode border and contrast */}
            <div className="
              relative overflow-hidden
              backdrop-blur-xl
              bg-white/95 dark:bg-zinc-900/90
              border-2 border-slate-300/90 dark:border-cyan-500/30
              rounded-2xl rounded-br-sm
              shadow-2xl shadow-slate-900/20 dark:shadow-cyan-950/40
              px-4 py-3
            ">
              {/* Subtle inner ambient tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-blue-50/30 dark:from-cyan-950/30 dark:via-transparent dark:to-indigo-950/20 pointer-events-none" />

              <div className="relative z-10 text-[13px] leading-[1.65] font-semibold text-slate-800 dark:text-zinc-100">
                {isThinking ? <ThinkingDots /> : companionMessage}
              </div>
            </div>

            {/* Pointer tail with matching border */}
            <div className="
              absolute -bottom-[8px] right-6
              w-0 h-0
              border-l-[8px] border-l-transparent
              border-r-[8px] border-r-transparent
              border-t-[9px] border-t-white/95 dark:border-t-zinc-900/90
            " />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════ Scroll-Jump Wrapper ══════════════ */}
      <motion.div
        style={{ y: smoothJumpY }}
        className="pointer-events-auto select-none"
      >
        {/* ══════════════ Idle Float & Hover Scale Wrapper ══════════════ */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.12, y: -6 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            setSpinTrigger((s) => s + 1);
            const greeting = PAGE_GREETINGS[activePage];
            if (greeting) showMessage(greeting);
          }}
          className="cursor-pointer relative"
          title="Click to interact!"
        >
          {/* ══════════════ Futuristic 3D Circular Cyber-Sphere + Fluid Aura ══════════════ */}
          <motion.div
            className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center"
            animate={{ rotate: spinTrigger * 360 }}
            transition={{ type: 'spring', stiffness: 50, damping: 10, mass: 1.2 }}
          >

            {/* ── Layer 1: Ambient Luminous Aura (Soft circulating background fluid vortex) ── */}
            <motion.div
              className="absolute inset-[-16px] sm:inset-[-20px] rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(37,99,235,0.32) 0%, rgba(56,189,248,0.2) 42%, rgba(99,102,241,0.12) 65%, transparent 85%)',
                filter: 'blur(22px)',
              }}
              animate={{
                rotate: [0, 360],
                scale: isThinking ? [1, 1.25, 1] : [1, 1.1, 1],
                opacity: isThinking ? [0.85, 1, 0.85] : [0.65, 0.88, 0.65],
              }}
              transition={{
                rotate: { duration: isThinking ? 5 : 18, repeat: Infinity, ease: 'linear' },
                scale: { duration: isThinking ? 0.7 : 3.4, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: isThinking ? 0.7 : 3.4, repeat: Infinity, ease: 'easeInOut' },
              }}
            />

            {/* ── Layer 2: Secondary Counter-Flowing Fluid Ribbon (Background Depth Stream) ── */}
            <motion.div
              className="absolute inset-[-14px] sm:inset-[-18px] pointer-events-none z-0"
              animate={{
                rotate: isThinking ? [360, 0] : [360, 0],
              }}
              transition={{
                duration: isThinking ? 3.5 : 14,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <svg viewBox="0 0 180 180" className="w-full h-full" fill="none">
                <defs>
                  <linearGradient id="counterFluidLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.85" />
                    <stop offset="45%" stopColor="#4338ca" stopOpacity="0.8" />
                    <stop offset="80%" stopColor="#2563eb" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.1" />
                  </linearGradient>

                  <linearGradient id="counterFluidDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.75" />
                    <stop offset="85%" stopColor="#c084fc" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Sweeping Liquid Path 2 */}
                <path
                  d="M 134 90 C 134 122, 106 142, 60 140 C 20 138, 10 102, 22 66 C 34 30, 68 14, 108 22 C 132 30, 136 56, 124 76"
                  className="
                    stroke-[url(#counterFluidLight)] dark:stroke-[url(#counterFluidDark)]
                    stroke-[4]
                    drop-shadow-[0_0_10px_rgba(67,56,202,0.35)]
                    dark:drop-shadow-[0_0_14px_rgba(129,140,248,0.6)]
                  "
                  strokeLinecap="round"
                />
              </svg>

              {/* Smaller Orbiting Splash Droplets */}
              {[40, 160, 275].map((angle, i) => (
                <motion.div
                  key={i}
                  className="
                    absolute w-2.5 h-2.5 rounded-full
                    bg-indigo-600 dark:bg-indigo-300
                    shadow-[0_0_8px_2px_#4338ca]
                    dark:shadow-[0_0_10px_2px_#818cf8]
                  "
                  style={{
                    left: `calc(50% + ${48 * Math.cos((angle * Math.PI) / 180)}% - 5px)`,
                    top: `calc(50% + ${48 * Math.sin((angle * Math.PI) / 180)}% - 5px)`,
                  }}
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    scale: [0.85, 1.25, 0.85],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    delay: i * 0.45,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>

            {/* ── Layer 3: The 3D Glass Sphere (Circular, Tactile, High-End Luxury) ── */}
            <div className="
              relative z-10
              w-24 h-24 sm:w-28 sm:h-28
              rounded-full
              flex items-center justify-center
              overflow-hidden
              border-2 border-slate-900/85 dark:border-cyan-400/85
              bg-gradient-to-b from-slate-900/[0.12] via-blue-950/[0.22] to-slate-950/[0.42]
              dark:bg-gradient-to-b dark:from-slate-900/70 dark:via-blue-950/80 dark:to-cyan-950/90
              shadow-[0_16px_36px_rgba(15,23,42,0.38),inset_0_-10px_22px_rgba(15,23,42,0.45),inset_0_4px_14px_rgba(255,255,255,0.7)]
              dark:shadow-[0_0_32px_rgba(34,211,238,0.5),inset_0_-10px_24px_rgba(0,0,0,0.7),inset_0_4px_14px_rgba(34,211,238,0.6)]
              backdrop-blur-xl
            ">

              {/* ── Internal Plasma Nucleus (Energy Core) ── */}
              <motion.div
                className="
                  absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full
                  bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400
                  dark:from-cyan-400 dark:via-sky-400 dark:to-indigo-500
                  shadow-[0_0_24px_rgba(37,99,235,0.85)]
                  dark:shadow-[0_0_32px_rgba(34,211,238,0.9)]
                "
                animate={{
                  scale: isThinking ? [0.95, 1.28, 0.95] : [0.96, 1.08, 0.96],
                  opacity: isThinking ? [0.85, 1, 0.85] : [0.75, 0.92, 0.75],
                }}
                transition={{
                  duration: isThinking ? 0.5 : 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* ── Internal Circular Tech Aperture & Synaptic Filaments ── */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none">
                  {/* Concentric Cyber Reticle Rings */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    className="stroke-indigo-400/40 dark:stroke-cyan-400/40"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="28"
                    className="stroke-blue-500/50 dark:stroke-cyan-300/50"
                    strokeWidth="1.2"
                  />

                  {/* Neural Synaptic Connections */}
                  <path
                    d="M 32 44 Q 50 36 68 44"
                    className="stroke-blue-500 dark:stroke-cyan-300"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 32 58 Q 50 64 68 58"
                    className="stroke-indigo-500 dark:stroke-cyan-300"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 50 28 L 50 72"
                    className="stroke-cyan-500 dark:stroke-sky-200"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 36 36 L 64 64"
                    className="stroke-blue-400/70 dark:stroke-indigo-300/70"
                    strokeWidth="1"
                  />
                  <path
                    d="M 64 36 L 36 64"
                    className="stroke-indigo-400/70 dark:stroke-cyan-400/70"
                    strokeWidth="1"
                  />

                  {/* Synaptic Junction Nodes */}
                  <circle cx="50" cy="50" r="3.6" className="fill-blue-600 dark:fill-cyan-100 shadow-md" />
                  <circle cx="38" cy="40" r="2.4" className="fill-indigo-600 dark:fill-cyan-300" />
                  <circle cx="62" cy="40" r="2.4" className="fill-blue-600 dark:fill-cyan-300" />
                  <circle cx="38" cy="60" r="2.4" className="fill-indigo-700 dark:fill-cyan-300" />
                  <circle cx="62" cy="60" r="2.4" className="fill-blue-700 dark:fill-cyan-300" />
                  <circle cx="50" cy="32" r="2" className="fill-cyan-600 dark:fill-sky-200" />
                  <circle cx="50" cy="68" r="2" className="fill-cyan-600 dark:fill-sky-200" />
                </svg>
              </div>

              {/* ── 3D Spherical Specular Dome Glare (Apple Glass Volume) ── */}
              <div
                className="
                  absolute top-1 left-2 sm:top-2 sm:left-3
                  w-[62%] h-[40%]
                  rounded-full
                  bg-gradient-to-b from-white/80 via-white/20 to-transparent
                  blur-[0.5px]
                  pointer-events-none
                "
                style={{ transform: 'rotate(-28deg)' }}
              />

              {/* ── Subtle Bottom-Right Ambient Bounce Glow ── */}
              <div className="
                absolute bottom-1 right-2
                w-[50%] h-[26%]
                rounded-full
                bg-cyan-400/30 dark:bg-cyan-300/40
                blur-[5px]
                pointer-events-none
              " />
            </div>

            {/* ── Layer 4: Primary Liquid Ribbon Stream (Foreground Circulating Flow with Droplets) ── */}
            <motion.div
              className="absolute inset-[-18px] sm:inset-[-22px] pointer-events-none z-20"
              animate={{
                rotate: isThinking ? [0, 360] : [0, 360],
              }}
              transition={{
                duration: isThinking ? 2.4 : 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
                <defs>
                  {/* Fluid Stream Gradient Light Mode */}
                  <linearGradient id="fluidStreamLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0f172a" stopOpacity="0.9" />
                    <stop offset="35%" stopColor="#2563eb" stopOpacity="0.95" />
                    <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.8" />
                  </linearGradient>

                  {/* Fluid Stream Gradient Dark Mode */}
                  <linearGradient id="fluidStreamDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                    <stop offset="45%" stopColor="#22d3ee" stopOpacity="1" />
                    <stop offset="80%" stopColor="#818cf8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#c084fc" stopOpacity="0.85" />
                  </linearGradient>

                  {/* Liquid Glass Highlight Spine */}
                  <linearGradient id="fluidSpineGleam" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Sweeping Liquid Ribbon Path with Organic Wave Flow */}
                <path
                  d="M 32 100 C 32 50, 68 24, 120 28 C 170 32, 180 75, 166 120 C 150 165, 96 178, 56 158 C 34 144, 28 120, 38 100 Z"
                  className="
                    stroke-[url(#fluidStreamLight)] dark:stroke-[url(#fluidStreamDark)]
                    stroke-[5.5]
                    drop-shadow-[0_0_12px_rgba(37,99,235,0.45)]
                    dark:drop-shadow-[0_0_18px_rgba(34,211,238,0.75)]
                  "
                  strokeLinecap="round"
                />

                {/* Inner Specular Highlight Spine (Liquid Glass Glaze) */}
                <path
                  d="M 42 100 C 42 60, 74 38, 118 40 C 158 42, 168 80, 154 116 C 140 152, 95 162, 64 148"
                  stroke="url(#fluidSpineGleam)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              {/* Orbiting Liquid Droplet Beads */}
              {[0, 85, 180, 270].map((angle, i) => (
                <motion.div
                  key={i}
                  className="
                    absolute w-3.5 h-3.5 rounded-full
                    bg-gradient-to-tr from-blue-700 via-cyan-400 to-white
                    dark:from-cyan-300 dark:via-sky-200 dark:to-white
                    shadow-[0_0_12px_3px_#2563eb]
                    dark:shadow-[0_0_16px_4px_#22d3ee]
                  "
                  style={{
                    left: `calc(50% + ${48 * Math.cos((angle * Math.PI) / 180)}% - 7px)`,
                    top: `calc(50% + ${48 * Math.sin((angle * Math.PI) / 180)}% - 7px)`,
                  }}
                  animate={{
                    scale: isThinking ? [0.85, 1.45, 0.85] : [0.95, 1.25, 0.95],
                  }}
                  transition={{
                    duration: isThinking ? 0.6 : 1.8,
                    repeat: Infinity,
                    delay: i * 0.35,
                    ease: 'easeInOut',
                  }}
                >
                  {/* Droplet Highlight Glint */}
                  <div className="absolute top-[18%] left-[20%] w-[32%] h-[32%] rounded-full bg-white/90 blur-[0.3px]" />
                </motion.div>
              ))}
            </motion.div>

          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default memo(AICompanion);
