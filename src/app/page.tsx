"use client";
import About from "@/components/About";
import HeroSection from "@/components/sections/HeroSection";
import { useState } from "react";

export default function Page() {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <>
      <HeroSection confirmed={confirmed} setConfirmed={setConfirmed} />
      <div className={`${confirmed ? "block" : "hidden"}`}>
        <div className="w-full h-screen">
          <About />
        </div>
      </div>
    </>
  );
}
