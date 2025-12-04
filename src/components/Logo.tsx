import React from "react";

/**
 * Renders the Shadow Logo component.
 * It uses an embedded SVG with a subtle drop shadow filter.
 * * @param className Optional Tailwind classes for sizing and positioning.
 */
const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="Svgs/Shadow.svg"
        className="
        invert
        transition
        duration-600
        hover:drop-shadow-[0_0_4px_white]"
      />
    </div>
  );
};

export default Logo;
