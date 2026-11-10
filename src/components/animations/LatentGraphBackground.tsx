'use client';

import React, { memo, useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  z: number; // 0.2 (deep / far) to 1.0 (foreground)
}

interface Pulse {
  fromNode: number;
  toNode: number;
  progress: number; // 0 to 1
  speed: number;
  controlX: number;
  controlY: number;
}

const LatentGraphBackground = memo(function LatentGraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates & interaction state
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 170,
      isHovered: false,
    };

    // Node count reduced in half (from 130 to 65) for a clean, balanced aesthetic
    const nodeCount = 65;
    const maxConnectionDistance = 160;
    const nodes: Node[] = [];

    // Initialize multi-layered nodes with 3D depth (z)
    for (let i = 0; i < nodeCount; i++) {
      const z = 0.3 + Math.random() * 0.7; // depth factor between 0.3 and 1.0
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5 * z,
        vy: (Math.random() - 0.5) * 0.5 * z,
        baseRadius: (1.8 + Math.random() * 2.2) * z,
        z,
      });
    }

    const pulses: Pulse[] = [];

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.isHovered = false;
    };

    // Spawns a pulse between two nodes
    const spawnPulseBetween = (fromIdx: number, toIdx: number, speedMultiplier = 1) => {
      const n1 = nodes[fromIdx];
      const n2 = nodes[toIdx];
      const mx = (n1.x + n2.x) / 2;
      const my = (n1.y + n2.y) / 2;
      const curvature = 16 * ((n1.z + n2.z) / 2);
      const perpX = -(n2.y - n1.y) * 0.08;
      const perpY = (n2.x - n1.x) * 0.08;

      pulses.push({
        fromNode: fromIdx,
        toNode: toIdx,
        progress: 0,
        speed: (0.008 + Math.random() * 0.008) * speedMultiplier,
        controlX: mx + perpX + (Math.sin(fromIdx) * curvature),
        controlY: my + perpY + (Math.cos(toIdx) * curvature),
      });
    };

    // Click handler: Query Burst of 3 to 6 pulses from nearest nodes
    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      // Find nodes close to click
      const candidates: { idx: number; dist: number }[] = [];
      nodes.forEach((node, idx) => {
        const dx = node.x - clickX;
        const dy = node.y - clickY;
        const dist = Math.hypot(dx, dy);
        if (dist < 260) {
          candidates.push({ idx, dist });
        }
      });

      candidates.sort((a, b) => a.dist - b.dist);

      let bursts = 0;
      for (let i = 0; i < candidates.length && bursts < 6; i++) {
        const fromIdx = candidates[i].idx;
        // Find a connected or nearby node
        for (let j = 0; j < nodes.length; j++) {
          if (fromIdx !== j) {
            const dist = Math.hypot(nodes[fromIdx].x - nodes[j].x, nodes[fromIdx].y - nodes[j].y);
            if (dist < maxConnectionDistance * 1.3) {
              spawnPulseBetween(fromIdx, j, 1.6);
              bursts++;
              if (bursts >= 5) break;
            }
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Quadratic bezier point evaluator
    const getQuadraticPoint = (
      p0: number,
      p1: number,
      p2: number,
      t: number
    ) => {
      const oneMinusT = 1 - t;
      return oneMinusT * oneMinusT * p0 + 2 * oneMinusT * t * p1 + t * t * p2;
    };

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Detect dark mode from documentElement class
      const isDarkMode = document.documentElement.classList.contains('dark');

      // Apple-like sophisticated minimal color palette with punchy visibility
      // Light mode: clean modern indigo/violet hues with crisp links
      // Dark mode: luminous electric cyan/indigo nodes with crisp connections
      const nodeFillBase = isDarkMode ? '147, 197, 253' : '79, 70, 229'; // punchy indigo/blue
      const linkBaseColor = isDarkMode ? '165, 180, 252' : '99, 102, 241'; // vibrant connection lines
      const pulseColor = isDarkMode ? '96, 165, 250' : '67, 56, 202'; // bright Graph-RAG signal pulses

      // 1. Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Gravitational pull towards mouse if within radius
        if (mouse.isHovered) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius && dist > 1) {
            const force = (1 - dist / mouse.radius) * 0.45 * node.z;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }
        }

        // Apply friction & update position
        node.vx *= 0.96;
        node.vy *= 0.96;
        node.x += node.vx;
        node.y += node.vy;

        // Bounce gently off canvas edges
        if (node.x < 0) {
          node.x = 0;
          node.vx *= -1;
        } else if (node.x > width) {
          node.x = width;
          node.vx *= -1;
        }
        if (node.y < 0) {
          node.y = 0;
          node.vy *= -1;
        } else if (node.y > height) {
          node.y = height;
          node.vy *= -1;
        }

        // Render node with 3D depth opacity & size (crisp and visible)
        const nodeAlpha = (0.45 + 0.5 * node.z) * (isDarkMode ? 0.95 : 0.85);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.baseRadius * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeFillBase}, ${nodeAlpha})`;
        ctx.fill();

        // Soft atmospheric halo around foreground nodes
        if (node.z > 0.55) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.baseRadius * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${nodeFillBase}, ${nodeAlpha * 0.28})`;
          ctx.fill();
        }
      }

      // 2. Draw curved connections between close nodes
      const connectedPairs: [number, number][] = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy);

          const dynamicThreshold = maxConnectionDistance * ((n1.z + n2.z) / 2);

          if (dist < dynamicThreshold) {
            connectedPairs.push([i, j]);

            // Subtle organic curve control point
            const mx = (n1.x + n2.x) / 2;
            const my = (n1.y + n2.y) / 2;
            const curvature = 10 * ((n1.z + n2.z) / 2);
            const perpX = -(dy / dist) * curvature;
            const perpY = (dx / dist) * curvature;
            const cx = mx + perpX;
            const cy = my + perpY;

            // Connection opacity scales with distance and 3D depth (clearly visible)
            const normalizedDist = 1 - dist / dynamicThreshold;
            const avgZ = (n1.z + n2.z) / 2;
            const strokeAlpha = normalizedDist * 0.28 * avgZ * (isDarkMode ? 1.3 : 1.05);

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.quadraticCurveTo(cx, cy, n2.x, n2.y);
            ctx.strokeStyle = `rgba(${linkBaseColor}, ${strokeAlpha})`;
            ctx.lineWidth = 1.2 * avgZ;
            ctx.stroke();
          }
        }
      }

      // 3. Spontaneously spawn background data retrieval pulses
      if (Math.random() < 0.05 && connectedPairs.length > 0 && pulses.length < 18) {
        const randomPair = connectedPairs[Math.floor(Math.random() * connectedPairs.length)];
        const fromIdx = Math.random() < 0.5 ? randomPair[0] : randomPair[1];
        const toIdx = fromIdx === randomPair[0] ? randomPair[1] : randomPair[0];
        spawnPulseBetween(fromIdx, toIdx);
      }

      // 4. Update and draw traveling data retrieval pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const n1 = nodes[pulse.fromNode];
        const n2 = nodes[pulse.toNode];

        // Current pulse position along quadratic curve
        const px = getQuadraticPoint(n1.x, pulse.controlX, n2.x, pulse.progress);
        const py = getQuadraticPoint(n1.y, pulse.controlY, n2.y, pulse.progress);

        // Previous point for soft trailing glow
        const prevT = Math.max(0, pulse.progress - 0.08);
        const prevX = getQuadraticPoint(n1.x, pulse.controlX, n2.x, prevT);
        const prevY = getQuadraticPoint(n1.y, pulse.controlY, n2.y, prevT);

        const avgZ = (n1.z + n2.z) / 2;
        const pulseAlpha = Math.sin(pulse.progress * Math.PI) * 0.7 * avgZ;

        // Draw glowing tail
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.strokeStyle = `rgba(${pulseColor}, ${pulseAlpha * 0.4})`;
        ctx.lineWidth = 1.8 * avgZ;
        ctx.stroke();

        // Draw pulse head
        ctx.beginPath();
        ctx.arc(px, py, 2.2 * avgZ, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pulseColor}, ${pulseAlpha})`;
        ctx.shadowColor = `rgba(${pulseColor}, ${pulseAlpha * 0.8})`;
        ctx.shadowBlur = 8 * avgZ;
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-700"
      aria-hidden="true"
    />
  );
});

export default LatentGraphBackground;
