"use client";
import React, { useEffect, useRef } from "react";
import Text from "./Text";

import Connection from "./Connections";

const Hero = ({ isMobile }: { isMobile: boolean }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.getAttribute("src") === "/web/center.webm") {
      video.playbackRate = 0;
    }
  }, []);
  return (
    <>
      <div className="flex  justify-center items-center flex-col pointer-events-auto max-w-svw gap-[20vh]">
        <div className="flex items-baseline flex-wrap justify-center">
          <h1
            className="text-6xl  font-semibold  text-zinc-900 md:text-7xl"
            style={{
              letterSpacing: "10px",
              textShadow:
                " -1px -1px 0 #888, 1px -1px 0 #888, -1px  1px 0 #888, 1px  1px 0 #888",
            }}
          >
            TAKE
          </h1>
          <Text text="CREATIVITY" />
        </div>

        <video
          key={isMobile ? "eyes" : "center"}
          ref={videoRef}
          src={isMobile ? "/webm/eyes.webm" : "/webm/center.webm"}
          muted
          playsInline
          autoPlay
          className="lg:rounded-full absolute md:h-150 h-40  w-screen object-cover md:object-contain "
          onPlay={(e) => {
            const v = e.currentTarget;

            if (v.playbackRate !== 5) {
              v.playbackRate = 5;
              console.log("set on play");
            }
          }}
        />
        <div className="flex items-baseline flex-wrap justify-center">
          <h1
            className="text-6xl  font-semibold  text-zinc-900 md:text-7xl"
            style={{
              letterSpacing: "10px",
              textShadow:
                " -1px -1px 0 #888, 1px -1px 0 #888, -1px  1px 0 #888, 1px  1px 0 #888",
            }}
          >
            TO
          </h1>
          <Text text="NEXT" />
          <h1
            className="text-6xl sm:text-7xl  font-semibold  text-zinc-900"
            style={{
              letterSpacing: "10px",
              textShadow:
                " -1px -1px 14px #9662fc, 1px -1px 0 #9662fc, -1px  1px 0 #9662fc, 1px  1px 0 #9662fc",
            }}
          >
            LEVEL
          </h1>
        </div>
      </div>
      <div className="absolute bottom-0 md:left-30">
        <Connection />
      </div>
    </>
  );
};

export default Hero;
