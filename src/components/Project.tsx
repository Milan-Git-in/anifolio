import React from "react";
import TiltedCard from "./TiltedCard";

const Project = () => {
  return (
    <div className="p-10">
      <h1 className="text-5xl md:px-2 mb-10 text-shadow-lg text-shadow-white">
        Projects
      </h1>
      <div className="flex flex-col md:flex-row md:gap-10  ">
        <div className="flex flex-col ">
          <TiltedCard
            imageSrc="https://media.licdn.com/dms/image/v2/D4D22AQGHQpmXfpCzVw/feedshare-shrink_2048_1536/B4DZz7qZRlH4Ag-/0/1773748721123?e=1775692800&v=beta&t=EoaU0YmX0ZqWMKS6DbNDVTsBNJkuqPU4FtQX4N9CboE"
            altText="Aniverse (SaaS prototype)"
            captionText="Kendrick Lamar - GNX"
            containerHeight="300px"
            containerWidth="400px"
            imageHeight="300px"
            imageWidth="400px"
            rotateAmplitude={17}
            scaleOnHover={1}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent
            overlayContent={
              <p className="bg-transparent backdrop-blur-xl p-4 ">
                Aniverse (SaaS prototype)
              </p>
            }
          />
        </div>
        <div className="flex flex-col md:-mt-10">
          <h1 className="text-5xl px-2 mb-6 text-shadow-lg text-shadow-white">
            Aniverse
          </h1>
          <p
            className="text-sm text-neutral-300 pl-6
  tracking-[2px] leading-8"
          >
            Aniverse is a cross-platform content aggregation platform built with
            a strong focus on backend architecture and system design, using
            NestJS, Supabase, and Redis to deliver structured, scalable APIs
            with real-time capabilities and an efficient caching layer, while
            the frontend leverages Next.js (App Router) for SSR, optimized data
            fetching, and predictable data flow; the system is designed to
            handle consistent state across clients through clean API contracts,
            caching strategies, and modular service architecture, with an
            emphasis on performance, maintainability, and extensibility,
            reflecting a modern approach to building scalable, system-driven
            applications rather than isolated features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Project;
