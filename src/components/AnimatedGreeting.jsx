import { motion, AnimatePresence } from 'framer-motion';

/**
 * Centered greeting stagger animation that shrinks and slides up to resolve
 * into a slim top header on active messaging states in pure JS/JSX.
 */
export const AnimatedGreeting = ({ 
  isChatActive,
  onResetSession 
}) => {
  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 90, damping: 18 }}
      className={`w-full ${
        isChatActive 
          ? 'py-3 border-b border-zinc-900/60 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-20 transition-colors select-none' 
          : 'flex flex-col items-center justify-center py-8 sm:py-12 px-4'
      }`}
    >
      <motion.div 
        layout="position"
        className="w-full max-w-3xl mx-auto flex flex-col items-center"
      >
        <AnimatePresence mode="wait">
          {!isChatActive ? (
            // Landing State Greeting
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center"
            >
              {/* Title Header with Responsive Scaling */}
              <motion.h1
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white mb-2 sm:mb-3 select-none leading-normal"
              >
                Hey <span className='bg-gradient-to-br from-red-400 via-rose-400 to-brand-red bg-clip-text text-transparent'>Ask</span> anything about{' '}
                <span className="bg-gradient-to-r from-red-400 via-rose-400 to-brand-red bg-clip-text text-transparent">
                  Aquib
                </span>
                .
              </motion.h1>

              {/* Subheader */}
              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-zinc-400 text-xs sm:text-sm max-w-sm sm:max-w-md font-medium tracking-wide"
              >
                AI-powered portfolio and engineering assistant
              </motion.p>
            </motion.div>
          ) : (
            // Shrunken Header State
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between w-full px-4 sm:px-6"
            >
              {/* Left Brand Badge */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-brand-red to-red-700 shadow-md">
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-white select-none">P</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 border border-zinc-950" />
                </div>
                <div className="text-left">
                  <h2 className="text-xs sm:text-sm font-semibold text-zinc-100 tracking-tight leading-none">
                    Peanut 3.0
                  </h2>
                  <span className="text-[9px] sm:text-[10px] text-zinc-400 font-medium tracking-wide">
                    Aquib's AI Assistant
                  </span>
                </div>
              </div>
              
              {/* Right Connection Status */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onResetSession}
                  className="text-[10px] sm:text-[11px] font-medium bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-850 px-2 sm:px-2.5 py-1 rounded-md text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  title="Start a completely fresh session"
                >
                  Reset Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
export default AnimatedGreeting;
