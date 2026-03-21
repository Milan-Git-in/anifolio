"use client";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Project from "@/components/Project";
import HeroSection from "@/components/sections/HeroSection";
import StarMask from "@/components/StarMask";
import { useState } from "react";

export default function Page() {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <>
      <HeroSection confirmed={confirmed} setConfirmed={setConfirmed} />
      <div className={`${confirmed ? "block" : "hidden"}`}>
        <div className="w-full h-screen">
          <About />
          <Experience />
          <Project />
        </div>
      </div>
    </>
  );
}
