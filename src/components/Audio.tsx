"use client";
import { useAudio } from "@/Hooks/useAudio";
import useIsMobile from "@/Hooks/useIsMobile";
import { RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Audio() {
  const { audio, isAudioPlaying, resetAudio, setIsAudioPlaying } = useAudio();

  const [mounted, setMounted] = useState(false);

  const pathRef = useRef<SVGPathElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => setMounted(true), []);

  // PLAY / PAUSE audio tag
  useEffect(() => {
    if (!mounted || !audioRef.current) return;
    const el = audioRef.current;

    if (el.src !== audio) {
      el.src = audio ?? "";
      el.load();
    }

    if (isAudioPlaying) {
      el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [mounted, isAudioPlaying, audio]);

  // ⭐ CLEAN SLOW WAVE — tuned for h-6 (24px tall)
  // ⭐ CLEAN SLOW WAVE — tuned for h-6 (24px tall)
  const animate = useCallback(() => {
    const svgBox = containerRef.current;
    const path = pathRef.current;
    if (!svgBox || !path) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const width = svgBox.offsetWidth;
    const height = svgBox.offsetHeight;
    const mid = height / 2; // 1. DECREASE AMPLITUDE (Shorter wave): Changed from 0.7 back to a small value like 0.2

    const amplitude = isAudioPlaying ? height * 0.2 : 0;

    let phase = 0;

    const render = () => {
      let d = `M 0 ${mid}`;
      phase += 0.03; // Speed remains same

      for (let x = 0; x <= width; x += 6) {
        // 2. INCREASE FREQUENCY (Tighter/Curvier wave): Changed from 0.015 to 0.04
        const y = Math.sin(x * 2 + phase) * amplitude;
        d += ` L ${x} ${mid + y}`;
      }

      path.setAttribute("d", d);
      animationRef.current = requestAnimationFrame(render);
    };

    render();
  }, [isAudioPlaying]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const handleRefresh = (e: any) => {
    e.stopPropagation();
    setIsAudioPlaying(false);
    resetAudio();
    setIsAudioPlaying(true);
  };

  const handleClick = () => setIsAudioPlaying(!isAudioPlaying);

  const isMobile = useIsMobile();

  return (
    !isMobile && (
      <div
        ref={containerRef}
        onClick={handleClick}
        className="absolute right-10  h-6 z-20 top-5 bg-transparent  cursor-pointer overflow-hidden flex items-center gap-5"
      >
        {/* SVG WAVE */}
        <svg
          className="w-[100px] h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            stroke={mounted && isAudioPlaying ? "#a259eb" : "#ffffff"}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            style={{
              transition: "stroke 0.5s ease",
            }}
          />
        </svg>

        {/* YOUR REFRESH BUTTON */}
        <div
          className={`transition-all duration-300 ${
            isAudioPlaying
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-3 pointer-events-none"
          }`}
        >
          <RefreshCcw
            size={28}
            className="hover:rotate-180 transition-all duration-300 active:text-[#a259eb]"
            onClick={handleRefresh}
          />
        </div>

        {/* Audio tag */}
        <audio ref={audioRef} src={audio ?? ""} />
      </div>
    )
  );
}
