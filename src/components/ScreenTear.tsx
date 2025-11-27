"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";

// Removed 'cross' type as requested
type TearType = "vertical" | "diagonal" | "reverse-diagonal";

interface ScreenTearProps {
  isOpen: boolean;
  type?: TearType;
  children: React.ReactNode;
  audioSrc?: string;
  // Default color changed to off-white for a paper-edge look,
  // but you can still pass neon colors if you want.
  color?: string;
  duration?: number;
  onComplete?: () => void;
}

export const ScreenTear: React.FC<ScreenTearProps> = ({
  isOpen,
  type = "diagonal",
  children,
  audioSrc,
  color = "#f8fafc", // Default to a paper-white edge
  duration = 1.2, // Slightly faster for a punch effect
  onComplete,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    if (typeof window !== "undefined" && audioSrc) {
      audioRef.current = new Audio(audioSrc);
      // Optional: Lower volume slightly for sharp sounds
      audioRef.current.volume = 0.6;
    }
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [audioSrc]);

  useEffect(() => {
    if (isOpen && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log("Audio failed:", e));
    }
  }, [isOpen]);

  const getPaths = (t: TearType, w: number, h: number) => {
    switch (t) {
      case "vertical":
        // Slight offset so it's not perfectly centered, looks more natural
        return [`M ${w / 2 + w * 0.1} -100 L ${w / 2 - w * 0.1} ${h + 100}`];
      case "diagonal":
        return [`M -100 -100 L ${w + 100} ${h + 100}`];
      case "reverse-diagonal":
        return [`M ${w + 100} -100 L -100 ${h + 100}`];
      default:
        return [`M 0 0 L ${w} ${h}`];
    }
  };

  const paths = getPaths(type, dimensions.width, dimensions.height);
  // Max dimension needs to be huge to ensure the jagged edges clear the screen
  const maxDim = Math.max(dimensions.width, dimensions.height) * 4;

  // --- Animation Variants (Explosive Punch) ---
  const bezierEase = [0.7, 0, 0.3, 1]; // An explosive start, slower end

  const maskVariants: Variants = {
    closed: { strokeWidth: 0, opacity: 0 },
    open: {
      strokeWidth: maxDim,
      opacity: 1,
      // A "punch" is fast. We use a very aggressive ease curve.
      transition: { duration: duration, ease: bezierEase },
    },
  };

  const contentVariants: Variants = {
    closed: { scale: 0.92, opacity: 0 }, // Start slightly smaller for more impact
    open: {
      scale: 1,
      opacity: 1,
      transition: { duration: duration, ease: bezierEase },
    },
  };

  const edgeVariants: Variants = {
    closed: { strokeWidth: 0, opacity: 1 },
    open: {
      strokeWidth: maxDim * 1.05, // Slightly wider than mask so the edge is visible
      opacity: 0,
      transition: { duration: duration * 1.1, ease: "easeOut" },
    },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Content */}
      <motion.div
        className="absolute inset-0 z-10 origin-center"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={contentVariants}
        onAnimationComplete={() => onComplete && onComplete()}
        style={{ mask: `url(#mask-${type})`, WebkitMask: `url(#mask-${type})` }}
      >
        {children}
      </motion.div>

      {/* SVG Engine */}
      <svg
        className="absolute inset-0 pointer-events-none z-20 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* THE NEW "SHARP PAPER" FILTER 
              Key changes for sharpness:
              1. type="turbulence" (rougher than fractalNoise)
              2. High baseFrequency (0.08) = lots of small spikes
              3. High scale (200) = very deep spikes
          */}
          <filter
            id="sharp-paper-tear"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.08"
              numOctaves="5"
              result="noise"
              seed="2"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="200"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          <mask id={`mask-${type}`}>
            <rect x="-50%" y="-50%" width="200%" height="200%" fill="black" />
            {paths.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                stroke="white"
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={maskVariants}
                filter="url(#sharp-paper-tear)"
                strokeLinecap="butt" // 'butt' ends look sharper than 'round'
              />
            ))}
          </mask>
        </defs>

        {/* The Ripped Edge Visuals */}
        {isOpen &&
          paths.map((d, i) => (
            <motion.path
              key={`edge-${i}`}
              d={d}
              // Using the color as a solid fill instead of a glow
              stroke={color}
              fill="none"
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              variants={edgeVariants}
              filter="url(#sharp-paper-tear)"
              // Removed the soft blur drop-shadow for a crisper edge
              style={{ mixBlendMode: "lighten" }}
            />
          ))}
      </svg>
    </div>
  );
};

export default ScreenTear;
