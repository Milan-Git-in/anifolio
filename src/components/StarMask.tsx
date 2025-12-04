import React, { useEffect, useRef } from "react";

// Define the type for an individual star object
interface Star {
  x: number;
  y: number;
  opacity: number;
  targetOpacity: number;
  isTwinkling: boolean;
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

      // 3. Update and Draw Stars
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
