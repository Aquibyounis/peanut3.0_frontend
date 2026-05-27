import { motion } from 'framer-motion';

/**
 * Three jumping glass-tinted loading spheres in pure JS/JSX.
 */
export const TypingIndicator = () => {
  const dotVariants = {
    start: {
      y: '0%',
    },
    end: {
      y: '-80%',
    },
  };

  const dotTransition = (delay) => ({
    duration: 0.4,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
    delay: delay,
  });

  return (
    <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-zinc-900/40 border border-zinc-800/40 w-fit glass-card select-none">
      <div className="flex gap-1 h-3 items-center">
        <motion.span
          variants={dotVariants}
          initial="start"
          animate="end"
          transition={dotTransition(0)}
          className="w-1.5 h-1.5 bg-brand-red rounded-full shadow-[0_0_4px_var(--color-brand-red)]"
        />
        <motion.span
          variants={dotVariants}
          initial="start"
          animate="end"
          transition={dotTransition(0.12)}
          className="w-1.5 h-1.5 bg-brand-red/80 rounded-full"
        />
        <motion.span
          variants={dotVariants}
          initial="start"
          animate="end"
          transition={dotTransition(0.24)}
          className="w-1.5 h-1.5 bg-brand-red/60 rounded-full"
        />
      </div>
      <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium font-sans pl-1 tracking-wide animate-pulse">
        Peanut is thinking
      </span>
    </div>
  );
};
export default TypingIndicator;
