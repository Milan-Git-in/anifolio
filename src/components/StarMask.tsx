"use client";
import React, { useEffect, useRef } from "react";

// Define the type for an individual star object
interface Star {
  x: number;
  y: number;
  opacity: number;
  targetOpacity: number;
  isTwinkling: boolean;
}

// Define the type for smoke particles
interface Smoke {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  targetOpacity: number;
  duration: number;
  elapsed: number;
  isActive: boolean;
}

// Define the configuration types
interface StarConfig {
  gridSpacing: number;
  starSize: number;
  maskColor: string;
  baseStarOpacity: number;
  peakStarOpacity: number;
  twinkleSpeed: number;
  twinkleChance: number;
}

// Define the component's props (allowing configuration override)
interface StarMaskProps {
  config?: Partial<StarConfig>;
}

const defaultStarConfig: StarConfig = {
  gridSpacing: 50,
  starSize: 2,
  maskColor: "rgba(0, 0, 0, 0.6)", // Slightly darker tint for better contrast
  baseStarOpacity: 0.1, // Very faint when idle
  peakStarOpacity: 0.6, // Subtle shine, not fully white
  twinkleSpeed: 0.005, // Very slow, breathing fade
  twinkleChance: 0.00005, // Extremely low chance to ensure only ~5 stars shine at once
};

const StarMask: React.FC<StarMaskProps> = ({ config: propConfig }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Merge user-provided config with defaults
  const config = { ...defaultStarConfig, ...propConfig };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Type guard for context

    let animationFrameId: number;
    let width: number = 0;
    let height: number = 0;
    let stars: Star[] = [];
    let smokes: Smoke[] = [];
    let smokeSpawnCounter: number = 0;

    const initStars = (): void => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars = [];

      // Create a strict grid pattern
      for (let x = 0; x < width; x += config.gridSpacing) {
        for (let y = 0; y < height; y += config.gridSpacing) {
          // Offset slightly to center grid
          const finalX = x + config.gridSpacing / 2;
          const finalY = y + config.gridSpacing / 2;

          stars.push({
            x: finalX,
            y: finalY,
            opacity: config.baseStarOpacity,
            targetOpacity: config.baseStarOpacity,
            isTwinkling: false,
          });
        }
      }
    };

    const draw = (): void => {
      // 1. Clear the canvas purely
      ctx.clearRect(0, 0, width, height);

      // 2. Draw the "Black Glasses" Mask
      ctx.fillStyle = config.maskColor;
      ctx.fillRect(0, 0, width, height);

      // 3. Spawn new smoke randomly
      smokeSpawnCounter++;
      if (smokeSpawnCounter > 15 && Math.random() < 0.3) {
        // Spawn new smoke at random location
        const smokeX = Math.random() * width;
        const smokeY = Math.random() * height;
        const smokeRadius = 60 + Math.random() * 10; // 40-50px spread

        smokes.push({
          x: smokeX,
          y: smokeY,
          radius: smokeRadius,
          opacity: 0.15,
          targetOpacity: 0.15,
          duration: 2000 + Math.random() * 1000,
          elapsed: 0,
          isActive: true,
        });
        smokeSpawnCounter = 0;
      }

      // 4. Update and Draw Smoke
      smokes = smokes.filter((smoke) => smoke.isActive);
      smokes.forEach((smoke) => {
        smoke.elapsed += 16; // Approximate frame time

        // Fade out over duration
        const progress = smoke.elapsed / smoke.duration;
        smoke.opacity = 0.15 * (1 - progress);

        // Mark as inactive when done
        if (progress >= 1) {
          smoke.isActive = false;
        }

        // Draw smoke with blur effect (drop shadow style)
        ctx.fillStyle = `rgba(255, 255, 255, ${smoke.opacity})`;
        ctx.filter = `blur(${smoke.radius * 0.8}px)`;
        ctx.beginPath();
        ctx.arc(smoke.x, smoke.y, smoke.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = "none";
      });

      // 5. Update and Draw Stars
      stars.forEach((star) => {
        // Randomly trigger a twinkle if not already twinkling
        if (!star.isTwinkling && Math.random() < config.twinkleChance) {
          star.isTwinkling = true;
          star.targetOpacity = config.peakStarOpacity;
        }

        // Logic for fading in/out
        if (star.isTwinkling) {
          if (star.opacity < star.targetOpacity) {
            star.opacity += config.twinkleSpeed;
            if (star.opacity >= star.targetOpacity) {
              // Reached peak, now target base opacity again
              star.targetOpacity = config.baseStarOpacity;
            }
          } else if (star.opacity > star.targetOpacity) {
            star.opacity -= config.twinkleSpeed;
            if (star.opacity <= config.baseStarOpacity) {
              // Returned to normal, stop twinkling
              star.opacity = config.baseStarOpacity;
              star.isTwinkling = false;
            }
          }
        }

        // Draw the individual star
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fillRect(star.x, star.y, config.starSize, config.starSize);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    // Setup
    initStars();
    draw();

    // Resize Handler
    const handleResize = (): void => {
      initStars();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config]); // Re-run effect if config changes

  return (
    <canvas
      ref={canvasRef}
      // Uses the mandatory classes: pointer-events-none absolute inset-0 z-10
      className="pointer-events-none absolute inset-0 z-10"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default StarMask;
