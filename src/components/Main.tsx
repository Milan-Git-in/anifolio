"use client";
import { useEffect } from "react";
import SmokeRevealOverlay from "./SmokeRevealOverlay";
import VideoPlayer from "./Video";

export default function Main(props: {
  onReady: () => void;
  isMobile: boolean;
}) {
  const { onReady, isMobile } = props;
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onReady();
      });
    });
  }, []);

  return (
    <SmokeRevealOverlay>
      <VideoPlayer isMobile={isMobile} />
    </SmokeRevealOverlay>
  );
}
