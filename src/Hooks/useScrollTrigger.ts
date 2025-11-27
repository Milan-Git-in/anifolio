// hooks/useScrollTrigger.ts
import { useEffect, useState, useCallback } from "react";

export const useScrollTrigger = (
  totalSteps: number,
  isLocked: boolean,
  onTrigger: (direction: "next" | "prev") => void
) => {
  const [touchStart, setTouchStart] = useState(0);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (isLocked) return;
      // Threshold ensures we don't trigger on tiny accidental trackpad jitters
      if (Math.abs(e.deltaY) > 15) {
        if (e.deltaY > 0) onTrigger("next");
        if (e.deltaY < 0) onTrigger("prev");
      }
    },
    [isLocked, onTrigger]
  );

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (isLocked) return;
      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStart - touchEnd;

      if (Math.abs(diff) > 50) {
        // Swipe threshold
        if (diff > 0) onTrigger("next");
        else onTrigger("prev");
      }
    },
    [isLocked, onTrigger, touchStart]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleWheel, handleTouchEnd]);
};
