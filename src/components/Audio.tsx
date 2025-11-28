"use client";
import { useAudio } from "@/Hooks/useAudio";
import { RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Audio() {
  const { audio, isAudioPlaying, resetAudio, setIsAudioPlaying } = useAudio();

  // client-only marker
  const [mounted, setMounted] = useState(false);

  // refs
  const pathRef = useRef<SVGPathElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // physics state (keeps same as you had)
  const stateRef = useRef({
    amplitude: 0,
    targetAmplitude: 0,
    phase: 0,
    width: 0,
    height: 0,
    centerY: 0,
  });

  const DAMPING = 0.05;
  const SPEED = 0.02;
  const MAX_AMPLITUDE = 15;
  const SEGMENT_WIDTH = 4;

  // set mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // dimensions (runs only on client because inEffect)
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        stateRef.current.width = offsetWidth;
        stateRef.current.height = offsetHeight;
        stateRef.current.centerY = offsetHeight / 2;
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Update target amplitude whenever isAudioPlaying changes (safe SSR -> CSR)
  useEffect(() => {
    stateRef.current.targetAmplitude = isAudioPlaying ? MAX_AMPLITUDE : 0;
  }, [isAudioPlaying]);

  // control HTMLAudioElement playback programmatically after mounted
  useEffect(() => {
    if (!mounted || !audioRef.current) return;

    const el = audioRef.current;

    // if src changed, load it
    if (el.src !== audio) {
      // setting src directly; load to ensure it's ready
      el.src = audio ?? "";
      try {
        el.load();
      } catch (e) {
        console.error(e);
      }
    }

    if (isAudioPlaying) {
      // try to play, catch any promise rejection (autoplay rules)
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // autoplay blocked — keep isAudioPlaying state but audio won't auto play
          // you can notify user or toggle UI accordingly
        });
      }
    } else {
      el.pause();
      el.currentTime = 0; // optional: reset position when stopped
    }
  }, [mounted, isAudioPlaying, audio]);

  // animate SVG path
  const animate = useCallback(() => {
    const state = stateRef.current;

    state.amplitude += (state.targetAmplitude - state.amplitude) * DAMPING;
    state.phase += SPEED;

    if (state.width > 0 && pathRef.current) {
      const points: string[] = [`M 0 ${state.centerY}`];

      for (let x = 0; x <= state.width; x += SEGMENT_WIDTH) {
        const y1 = Math.sin(x * 0.01 + state.phase) * state.amplitude;
        const y2 =
          Math.sin(x * 0.02 + state.phase * 2) * (state.amplitude * 0.3);
        points.push(`L ${x} ${state.centerY + y1 + y2}`);
      }

      pathRef.current.setAttribute("d", points.join(" "));
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  // handlers
  const handleRefresh = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsAudioPlaying(false);
    resetAudio();
    setIsAudioPlaying(true); // you said you want it to play
  };

  const handleClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsAudioPlaying(!isAudioPlaying);
  };

  // For visuals, use mounted && isAudioPlaying so SSR renders the "not playing" variant
  const active = mounted && isAudioPlaying;

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="absolute z-20 bg-transparent right-10 w-60 h-30 flex gap-10 items-center justify-center cursor-pointer overflow-hidden"
      aria-hidden={false}
      role="button"
    >
      <svg
        className="w-full h-full block pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="neon-glow" x="4%" y="0%" width="100%" height="50%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          ref={pathRef}
          d=""
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          style={{
            stroke: active ? "#a259eb" : "#ffffff",
            filter: active ? "url(#neon-glow)" : "none",
            transition: "stroke 0.5s ease",
            opacity: 0.9,
          }}
        />
      </svg>

      <RefreshCcw
        size={55}
        className="active:animate-spin active:text-[#a259eb]"
        onClick={handleRefresh}
      />

      {/* Keep the audio element in the DOM always (no SSR/CSR mismatch from attributes).
          We control playback programmatically after mount via audioRef. */}
      <audio ref={audioRef} src={audio ?? ""} />
    </div>
  );
}
