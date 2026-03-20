"use client";

import { connection } from "@/util";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

const FloatItem = ({
  connection,
  border,
}: {
  connection: connection;
  border: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // smooth spring
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // control how strong the pull is
    const strength = 0.3;

    x.set(deltaX * strength);
    y.set(deltaY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="size-24 flex items-center justify-center"
    >
      <motion.div style={{ x: springX, y: springY }}>
        <Link
          href={connection.href}
          target="_blank"
          className={`size-16 rounded-full ${border ? "border-2" : ""} border-neutral-300 hover:border-white p-4 flex items-center justify-center text-neutral-300 hover:text-white transition-colors`}
        >
          <connection.icon className="w-full h-full object-cover" />
        </Link>
      </motion.div>
    </div>
  );
};

export default FloatItem;
