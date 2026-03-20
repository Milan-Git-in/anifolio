"use client";
import Gate from "@/components/Gate";
import Hero from "@/components/Hero";
import Background from "@/components/Main";
import Marqueez from "@/components/Marqueez";
import Navbar from "@/components/Navbar";
import StarMask from "@/components/StarMask";
import useIsMobile from "@/Hooks/useIsMobile";
import { useState } from "react";
import React from "react";

const HeroSection = ({
  confirmed,
  setConfirmed,
}: {
  confirmed: boolean;
  setConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [heavyReady, setHeavyReady] = useState(false);
  const isMobile = useIsMobile();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };
  return (
    <>
      {!confirmed && (
        <Gate
          setConfirmed={setConfirmed}
          ready={heavyReady}
          isMobile={isMobile}
        />
      )}

      {/* Heavy page is loading even if Gate is showing */}
      <div
        style={{ display: confirmed ? "block" : "none" }}
        className=" w-screen h-screen overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <Background
          onReady={() => setHeavyReady(true)}
          isMobile={isMobile}
          mousePosition={mousePosition}
        />
        <div className="absolute inset-0 md:top-20 top-5 z-20 pointer-events-none">
          <Marqueez />
        </div>
        <div className="absolute inset-0 z-20 pointer-events-none">
          <StarMask />
        </div>
        <div className="absolute top-4 left-0 z-40 w-screen pointer-events-none ">
          <div className="pointer-events-auto">
            <Navbar isMobile={isMobile} />
          </div>
        </div>
        <div className="absolute inset-0 z-40  flex flex-col justify-center items-center pointer-events-none">
          <Hero isMobile={isMobile} />
        </div>

        <div className="absolute inset-0 md:top-10/12 top-8/9 z-10 pointer-events-none">
          <Marqueez />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
