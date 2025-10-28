import { motion } from "framer-motion";

function LoadingDots() {
  const dotVariants = {
    start: { y: 0 },
    end: { y: -4 },
  };

  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          variants={dotVariants}
          initial="start"
          animate="end"
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.2,
          }}
          className="text-lg text-gray-600"
        >
          •
        </motion.span>
      ))}
    </div>
  );
}

export default LoadingDots;