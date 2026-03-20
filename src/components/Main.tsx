"use client";
import { useEffect } from "react";
import SmokeRevealOverlay from "./SmokeRevealOverlay";
import VideoPlayer from "./Video";

export default function Background(props: {
  onReady: () => void;
  isMobile: boolean;
  mousePosition: { x: number; y: number };
}) {
  const { onReady, isMobile, mousePosition } = props;
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onReady();
      });
    });
  }, []);

  return (
    <SmokeRevealOverlay isMobile={isMobile} mousePosition={mousePosition}>
      <VideoPlayer isMobile={isMobile} />
    </SmokeRevealOverlay>
  );
}
