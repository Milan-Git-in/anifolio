import { useEffect, useState } from "react";

export default function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Only run on client
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

    const detectedMobile =
      /android/i.test(ua) ||
      /iPhone|iPad|iPod/i.test(ua) ||
      /Windows Phone/i.test(ua) ||
      /mobile/i.test(ua);

    setIsMobile(detectedMobile);
  }, []);

  return isMobile;
}
