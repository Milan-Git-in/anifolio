"use client";
import { useAudio } from "@/Hooks/useAudio";
import { motion } from "motion/react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const Gate = (props: {
  setConfirmed: Dispatch<SetStateAction<boolean>>;
  ready: boolean;
  isMobile: boolean;
}) => {
  const { setConfirmed, ready, isMobile } = props;
  const [progress, setProgress] = useState(0);
  const vidRef = useRef<HTMLVideoElement>(null);
  const { setIsAudioPlaying } = useAudio();
  useEffect(() => {
    if (ready && progress >= 100 && vidRef.current) {
      vidRef.current.currentTime = 0;
      vidRef.current.playbackRate = 0.7;
      vidRef.current.play();
    }
  }, [ready, progress]);
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const tick = () => {
      setProgress((p) => {
        // if already completed
        if (p >= 100) return 100;

        // if ready AND almost done → finish
        if (ready && p >= 99) {
          clearInterval(interval);
          return 100;
        }

        // otherwise slowly move toward 99
        if (p < 99) {
          const step = Math.random() * 6 + 0.5; // smoother crawl (0.5–2.5)
          return Math.min(p + step, 99);
        }

        return p;
      });
    };

    interval = setInterval(tick, 100);

    return () => clearInterval(interval);
  }, [ready]);

  return (
    <div className="bg-black dotted-mask  ">
      <div className=" w-full h-dvh flex flex-col items-center justify-center">
        <video ref={vidRef} src="/webm/eyes.webm" muted playsInline />
        <div className="flex flex-col items-center text-xl gap-3 z-10">
          <div className="flex gap-5 items-center">
            <img src="/Svgs/Shadow.svg" className="w-32 invert " />
            <p>
              Patience, Cool Stuff <br /> Takes Time...
            </p>
            <p>{Math.floor(progress)} %</p>
          </div>
          {ready && (
            <div className="flex flex-col gap-1 px-10">
              {!isMobile ? (
                <>
                  <p>THIS SITE USES MUSIC FOR A BETTER EXPERIENCE.</p>
                  <p>
                    YOU CAN DISABLE IT AT ANY TIME USING THE BUTTON IN THE TOP
                    CORNER.
                  </p>
                </>
              ) : (
                <p>MAKE SURE TO VISIT ON DESKTOP FOR BETTER EXPERIENCE</p>
              )}
            </div>
          )}
          {ready && progress === 100 && (
            <button
              className="group relative p-3 rounded-full border-white text-white border flex flex-col overflow-hidden"
              onClick={() => {
                !isMobile && setIsAudioPlaying(true);
                setConfirmed(true);
              }}
            >
              <p className="relative z-20 group-hover:text-black transition-colors duration-400">
                OK, I UNDERSTAND
              </p>

              <span className="absolute bottom-0 left-0 w-[190px] h-[55px] bg-white rounded-full translate-y-16 group-hover:translate-y-0 transition-all duration-400 z-0"></span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gate;
