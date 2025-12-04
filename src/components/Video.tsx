import React, { useEffect, useRef } from "react";

const VideoPlayer = (props: { isMobile: boolean; isRevealed?: boolean }) => {
  const { isMobile, isRevealed } = props;
  const VideoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    isRevealed ? VideoRef.current?.play() : VideoRef.current?.pause();
  }, [isRevealed, isMobile]);
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background video */}
      <video
        ref={VideoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={isMobile ? "mobile.mp4" : "desktop.mp4"}
        muted
        loop
      />
    </div>
  );
};

export default VideoPlayer;
