import React, { useEffect, useRef } from "react";

const VideoPlayer = (props: { isMobile: boolean; isRevealed?: boolean }) => {
  const { isMobile, isRevealed } = props;
  const VideoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    isRevealed ? VideoRef.current?.play() : VideoRef.current?.pause();
  }, [isRevealed]);
  return (
    <video
      ref={VideoRef}
      className={`absolute w-full h-screen ${
        isMobile ? "scale-y-200 scale-x-150 absolute w-full h-full" : ""
      }`}
      src={isMobile ? "mobile.mp4" : "desktop.mp4"}
      muted
      loop
    />
  );
};

export default VideoPlayer;
