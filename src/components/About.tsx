"use client";

import dynamic from "next/dynamic";
import StarMask from "./StarMask";
import Connection from "./Connections";

// almost everything you see here in aboutsection related to the Image and water distortion effect. it is NOT my work. it is copied and pasted from Github repo https://github.com/cortiz2894/mouse-effects

// thank you.

// Dynamically import the canvas component to avoid SSR issues with Three.js
const WaterDistortionCanvas = dynamic(
  () =>
    import("@/components/water-distortion-canvas").then(
      (mod) => mod.WaterDistortionCanvas,
    ),
  { ssr: false },
);

const images = [
  "https://github.com/Milan-Git-in/anifolio/blob/master/public/images/Image.webp?raw=true",
];

export default function About() {
  // Static settings used instead of Leva controls so the UI doesn't render
  const settings = {
    intensity: 0.24,
    scale: 0.03,
    viscosity: 0.89,
    decay: 0.98,
    distortionStrength: 0.04,
    aberration: 0.003,
    lightIntensity: 0.09,
    specularPower: 8.1,
  };

  return (
    <main className="relative w-full py-12 px-6">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <StarMask />
      </div>
      <div className="flex flex-col md:flex-row  items-center justify-center gap-12 md:gap-24">
        {/* Image: mobile-first order=first, desktop order=last */}
        <div className="order-1 md:order-2 shrink-0 w-[60vw] self-center  md:w-[40vw]">
          <div className="relative overflow-hidden rounded-xl w-full h-[50vh] md:h-[90vh]">
            <WaterDistortionCanvas images={images} settings={settings} />
          </div>
        </div>

        {/* Text: mobile-first below image, desktop-left */}
        <div className="order-2 md:order-1 md:flex-1  md:px-7 ">
          <h2 className="text-6xl font-semibold text-neutral-100 mb-10 drop-shadow-[0px_-8px_8px_white]">
            About Me
          </h2>
          <p
            className="text-2xl text-neutral-300 pl-6
  tracking-[2px] leading-8 md:leading-10"
          >
            Hey, I’m Milan Prajapati. A full-stack developer working with modern
            JavaScript. I’ve been building for about a year now, and have also
            worked as a full-stack developer intern, shipping real projects and
            gaining hands-on experience across the stack. I like creating things
            that are clean, useful, and actually work the way they should.
            Always learning, improving, and building better stuff along the way
            if you’re up for it, let’s build something cool together
          </p>
          <div className="justify-self-center md:justify-self-end scale-70">
            <Connection borders={false} />
          </div>
        </div>
      </div>
    </main>
  );
}
