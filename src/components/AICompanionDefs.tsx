'use client';

export default function AICompanionDefs() {
  return (
    <svg
      className="absolute w-0 h-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0 }}
    >
      <defs>
        {/* ── Layer 2 Counter-Flowing Depth Gradients ── */}
        <linearGradient id="counterFluidLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#6366f1" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient id="counterFluidDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#6366f1" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#9333ea" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.25" />
        </linearGradient>

        {/* ── Layer 4 Ring 1: Equatorial Front-Tilt Gradients ── */}
        <linearGradient id="ringEquatorGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#2563eb" stopOpacity="0.95" />
          <stop offset="65%" stopColor="#06b6d4" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id="ringEquatorGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#8b5cf6" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#a855f7" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.75" />
        </linearGradient>

        {/* ── Layer 4 Ring 2: Primary Ascending Diagonal Gradients ── */}
        <linearGradient id="ringDiag1GradLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#6366f1" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
        </linearGradient>

        <linearGradient id="ringDiag1GradDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#6366f1" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#9333ea" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.3" />
        </linearGradient>

        {/* ── Layer 4 Ring 3: Opposing Descending Diagonal Gradients ── */}
        <linearGradient id="ringDiag2GradLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#6366f1" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
        </linearGradient>

        <linearGradient id="ringDiag2GradDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#6366f1" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#a855f7" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#4338ca" stopOpacity="0.35" />
        </linearGradient>

        {/* ── Layer 4 Ring 4: Polar Meridian Gradients ── */}
        <linearGradient id="ringPolarGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#0ea5e9" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#818cf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.4" />
        </linearGradient>

        <linearGradient id="ringPolarGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#818cf8" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#6366f1" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#9333ea" stopOpacity="0.35" />
        </linearGradient>

        {/* ── Layer 4 Ring 5: Oblique Nutation Gradients ── */}
        <linearGradient id="ringObliqueGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#a855f7" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient id="ringObliqueGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#c084fc" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#7c3aed" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3" />
        </linearGradient>

        {/* ── Specular Spine Highlight ── */}
        <linearGradient id="ringSpineGleam" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  );
}
