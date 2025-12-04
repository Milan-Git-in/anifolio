import { useEffect, useState } from "react";

export default function useIsMobile(): boolean {
  const breakpoint = 1024; // cover tablets too

  const getState = () =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false;

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // run once on mount (correct initial value)
    setIsMobile(getState());

    const handleResize = () => {
      setIsMobile(getState());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
