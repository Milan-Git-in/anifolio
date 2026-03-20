import React from "react";

const Marqueez = () => {
  return (
    <div
      className={`absolute top-0 left-0 w-full md:h-20 h-10 md:bg-neutral-500 bg-neutral-200 z-20 overflow-hidden `}
    >
      <div className="marquee whitespace-nowrap md:text-7xl text-3xl font-bold text-black animate-marquee">
        <span className="mx-8">FULL STACK DEVELOPER</span>
        <span className="mx-8">FULL STACK DEVELOPER</span>
        <span className="mx-8">FULL STACK DEVELOPER</span>
      </div>
    </div>
  );
};

export default Marqueez;
