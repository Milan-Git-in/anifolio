import React, { useEffect, useRef, useState, ReactNode } from "react";
import { MousePointer2, Move } from "lucide-react";
import { useRevealed } from "@/Hooks/useRevealed";
import useIsMobile from "@/Hooks/useIsMobile";

/**
 * Reusable component for the CS2 Smoke Reveal Effect.
 * It wraps any content (children) and uses an HTML5 Canvas and particle physics
 * to create a flowy, mouse-driven reveal mask.
 */

interface Particle {
  x: number;
  y: number;
  vx: number; // Velocity X
  vy: number; // Velocity Y
  size: number;
  maxSize: number;
  angle: number;
  spin: number;
  life: number;
  decay: number;
  growth: number;
}

interface SmokeRevealProps {
  children: ReactNode;
  overlayColor?: string; // Optional custom color for the darkness (e.g., '#111111')
  isMobile: boolean;
  mousePosition?: { x: number; y: number };
}

export default function SmokeRevealOverlay({
  children,
  overlayColor = "#1222222",
  isMobile,
  mousePosition,
}: SmokeRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const { isRevealed, setIsRevealed } = useRevealed();
  // const [isRevealed, setIsRevealed] = useState(false);
  const isRevealed = false;
  // Refs for animation state
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);
  const smokeBrush = useRef<HTMLCanvasElement | null>(null);
  /**
   * Generates a random "cloud puff" texture on an off-screen canvas.
   * This textured brush creates the irregular, flowy smoke shapes.
   */
  const createSmokeBrush = () => {
    const size = 250;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const centerX = size / 2;
    const centerY = size / 2;

    for (let i = 0; i < 30; i++) {
      const radius = 50 + Math.random() * 100;
      const x = centerX + (Math.random() - 0.5) * (size * 0.4);
      const y = centerY + (Math.random() - 0.5) * (size * 0.4);

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      // We use white/alpha since destination-out works based on alpha/color
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    return canvas;
  };

  /**
   * Creates and initializes a single smoke particle.
   */
  const spawnParticles = (
    x: number,
    y: number,
    count: number,
    isExplosion: boolean,
  ) => {
    for (let i = 0; i < count; i++) {
      let vx = 0;
      let vy = 0;

      if (isExplosion) {
        // Explosion logic: Shoot outwards in random directions (Shockwave effect)
        const angle = Math.random() * Math.PI * 2;
        const speed = 10 + Math.random() * 20;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      } else {
        // Normal drift for mouse-driven smoke
        vx = 0;
        vy = 0;
      }

      particles.current.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        size: isExplosion ? 80 + Math.random() * 50 : 30 + Math.random() * 60,
        maxSize: isExplosion ? window.innerWidth : window.innerWidth * 0.05,
        angle: Math.random() * Math.PI * 1,
        spin: (Math.random() - 0.5) * 0.4,
        life: 10,
        decay: isExplosion ? 0.005 : 0.5,
        growth: isExplosion ? 30 : 7,
      });
    }
  };

  /**
   * Spawn particles when mouse position changes (from prop drilling)
   * This effect detects changes in the passed mousePosition prop
   * and spawns particles at those coordinates in the overlay
   */
  useEffect(() => {
    if (!mousePosition || isRevealed) return;

    // Spawn particles at the received mouse position
    // We spawn fewer particles here (1) compared to direct canvas events
    // to avoid performance issues from rapid updates
    spawnParticles(mousePosition.x, mousePosition.y, 10, false);
  }, [mousePosition, isRevealed]);

  useEffect(() => {
    smokeBrush.current = createSmokeBrush();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Canvas resizing
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = overlayColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    // The main animation loop
    const render = () => {
      // 1. Healing Effect (Re-filling black)
      if (!isRevealed) {
        ctx.globalCompositeOperation = "source-over";
        // Use the base color but with transparency to create the slow re-darkening effect
        ctx.fillStyle = `${overlayColor}14`; // 14 is hex for 8% alpha
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Drawing Smoke (Erasing black)
      ctx.globalCompositeOperation = "destination-out";

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];

        // Update Physics
        p.x += p.vx;
        p.y += p.vy;
        p.size += p.growth;
        p.angle += p.spin;
        // Don't decay - keep smoke forever
        p.vx *= 0.95; // Friction
        p.vy *= 0.95; // Friction

        if (smokeBrush.current) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);

          // Apply horizontal distortion: wider horizontally (2x), narrower vertically (0.6x)
          ctx.scale(2, 0.6);
          ctx.globalAlpha = 1; // Keep fully opaque
          ctx.drawImage(
            smokeBrush.current,
            -p.size / 2,
            -p.size / 2,
            p.size,
            p.size,
          );

          ctx.restore();
        }

        // Only remove if size exceeds a very large threshold
        if (p.size >= p.maxSize * 2) {
          particles.current.splice(i, 1);
          i--;
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    // Initial fill
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [isRevealed, overlayColor]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isRevealed) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Spawn 6 particles per mouse move event for a dense trail
    spawnParticles(x, y, 100, false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden z-0">
      {/* LAYER 1: CHILDREN CONTENT (Z-INDEX 0) - VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {/*
          The children prop is a ReactNode. If it's a single element,
          we can clone it and inject a new prop: isRevealed.
        */}
        {React.isValidElement(children)
          ? React.cloneElement(children, { isRevealed: isRevealed } as any)
          : children}
      </div>

      {/* LAYER 2: SMOKE CANVAS OVERLAY (Z-INDEX 10) - ABOVE VIDEO, BELOW PAGE CONTENT */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-1000 pointer-events-auto ${
          isRevealed || isMobile
            ? "opacity-0 pointer-events-none"
            : "opacity-100 cursor-none"
        }`}
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          className="block touch-none w-full h-full"
        />

        {/* Visibility Hint */}
        {/* {!isRevealed && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-purple-500 text-sm font-mono tracking-[0.3em] uppercase pointer-events-none flex flex-col items-center gap-2 animate-pulse">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4" /> MOVE TO PEEK
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MousePointer2 className="w-3 h-3" /> CLICK TO BREACH
            </div>
          </div>
        )} */}
        {/* <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-purple-500 text-sm font-mono tracking-[0.3em] uppercase pointer-events-none flex flex-col items-center gap-2 animate-pulse"></div> */}
      </div>
    </div>
  );
}
