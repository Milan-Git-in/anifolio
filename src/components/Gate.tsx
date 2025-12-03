"use client";
import { useAudio } from "@/Hooks/useAudio";
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
    if (ready && vidRef.current) {
      vidRef.current.currentTime = 0; // start from beginning
      vidRef.current.play(); // play once
    }

    let interval: NodeJS.Timeout;

    const tick = () => {
      // if ready -> insta-finish
      if (ready) {
        setProgress(100);
        clearInterval(interval);
        return;
      }

      // lil fake loading crawl
      setProgress((p) => {
        if (p >= 99) return 99;
        const step = Math.random() * 3; // 0–3%
        return Math.min(p + step, 99);
      });
    };

    interval = setInterval(tick, 100);

    return () => clearInterval(interval);
  }, [ready]);

  return (
    <div className="bg-black dotted-mask ">
      <div className=" w-full h-dvh flex flex-col items-center justify-center">
        <video ref={vidRef} src="/webm/eyes.webm" muted playsInline />
        <div className="flex flex-col items-center text-xl gap-3 z-10">
          <div className="flex gap-5 items-center">
            <img src="/Svgs/Shadow.svg" className="w-32 invert " />
            <p>
              Patience, Cool Stuff <br /> Takes Time...
            </p>
            <p>{progress} %</p>
          </div>
          {ready && (
            <div className="flex flex-col gap-1">
              <p>THIS SITE USES MUSIC FOR A BETTER EXPERIENCE.</p>
              <p>
                YOU CAN DISABLE IT AT ANY TIME USING THE BUTTON IN THE TOP
                CORNER.
              </p>
              {isMobile && (
                <p>MAKE SURE TO VISIT ON DESKTOP FOR BETTER EXPERIENCE</p>
              )}
            </div>
          )}
          {ready && (
            <button
              className="p-3 rounded-full border-white  text-white border"
              onClick={() => {
                setIsAudioPlaying(true);
                setConfirmed(true);
              }}
            >
              OK, I UNDERSTAND
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gate;
