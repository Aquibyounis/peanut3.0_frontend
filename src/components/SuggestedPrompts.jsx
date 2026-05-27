import { motion } from 'framer-motion';
import { Code, Briefcase, Sparkles } from 'lucide-react';

/**
 * 3 responsive suggestion blocks. Fades and rises in using Framer Motion.
 */
export const SuggestedPrompts = ({ onSelectPrompt, onConnectClick }) => {
  const prompts = [
    {
      text: "What are some featured software projects Aquib has built recently? 🛠️",
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      category: "Projects"
    },
    {
      text: "Show me Aquib's core tech stack & engineering expertise 🚀",
      icon: <Code className="w-4 h-4 text-brand-red" />,
      category: "Skills"
    },
    {
      text: "Tell me about his professional software engineering background",
      icon: <Briefcase className="w-4 h-4 text-emerald-400" />,
      category: "Experience"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 15 
      } 
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-3xl px-4 mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
    >
      {prompts.map((prompt, idx) => (
        <motion.button
          key={idx}
          variants={itemVariants}
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelectPrompt(prompt.text)}
          className="flex items-center gap-3 p-2.5 sm:p-3 text-left rounded-xl glass-card hover:bg-zinc-900/40 hover:border-zinc-700/60 transition-all cursor-pointer group select-none relative overflow-hidden min-h-[58px] w-full"
        >
          {/* Subtle gradient flash on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-red/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          {/* Icon */}
          <span className="p-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 group-hover:border-zinc-700/80 transition-colors flex-shrink-0 flex items-center justify-center">
            {prompt.icon}
          </span>
          
          {/* Prompt Text */}
          <span className="text-zinc-300 text-[11.5px] sm:text-[12.5px] font-medium leading-snug group-hover:text-zinc-100 transition-colors select-none text-left flex-1">
            {prompt.text}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default SuggestedPrompts;
