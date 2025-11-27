"use client";
import { useEffect } from "react";

export default function Main({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    // Wait for full paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onReady();
      });
    });
  }, []);

  return (
    <div>
      {/* your heavy UI here */}
      <h1>Heavy Page Rendered</h1>
    </div>
  );
}
