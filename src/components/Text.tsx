import { motion } from "motion/react";

const Text = ({ text }: { text: string }) => {
  // 1. Parent controls the staggering logic
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 2, // Time between each letter starting
      },
    },
  };

  // 2. Child defines the shadow "pulse"
  const letterVariants = {
    initial: { textShadow: "0px 0px 0px rgba(0,0,0,0)" },
    animate: {
      textShadow: "0px 0px 14px rgba(255,255,255,1)",
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const, // This handles the "appearing and then disappearing"
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      style={{ display: "flex", gap: "2px" }}
      className="text-7xl sm:text-8xl"
    >
      {text.split("").map((letter, i) => (
        <motion.span
          key={i}
          variants={letterVariants}
          className="text-shadow-white"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default Text;
