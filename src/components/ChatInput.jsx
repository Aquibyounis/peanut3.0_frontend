import { useRef, useEffect, useState } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Smart expanding chat query box.
 * Formats heights on long texts, binds submissions to Enter keys,
 * and styles inputs to 16px to bypass Safari auto-zooming.
 */
export const ChatInput = ({
  onSend,
  disabled,
  placeholder = "Ask anything about Aquib...",
  initialValue = "",
  onConnectClick
}) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Sync initial value if provided (e.g. from clicking suggested prompts)
  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
      textareaRef.current?.focus();
    }
  }, [initialValue]);

  // Handle auto-expanding height of textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isSubmitDisabled = !value.trim() || disabled;

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center"
    >
      <div 
        className={`w-full max-w-3xl rounded-2xl transition-all duration-300 relative overflow-hidden glass-input ${
          isFocused 
            ? 'border-brand-red/60 shadow-lg shadow-red-500/5 ring-1 ring-brand-red/20 bg-zinc-950/80' 
            : 'border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700/60'
        }`}
      >
        {/* Glow border light layer */}
        {isFocused && (
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-brand-red/85 to-transparent pointer-events-none" />
        )}

        {/* Text Input Row */}
        <div className="flex items-end gap-2 p-2.5 sm:p-3 pl-3.5 sm:pl-4">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            /* text-base (16px) on mobile prevents iOS Safari auto-zoom; sm:text-[15px] on desktop */
            className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-550 focus:outline-none text-base sm:text-[15px] resize-none max-h-[160px] sm:max-h-[200px] leading-relaxed py-1.5 align-middle select-text cursor-text"
            style={{ height: 'auto' }}
          />

          {/* Send Action Button */}
          <motion.button
            type="submit"
            disabled={isSubmitDisabled}
            whileHover={!isSubmitDisabled ? { scale: 1.05 } : {}}
            whileTap={!isSubmitDisabled ? { scale: 0.95 } : {}}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 cursor-pointer ${
              isSubmitDisabled
                ? 'bg-zinc-900 text-zinc-650 border border-zinc-800/60 cursor-not-allowed'
                : 'bg-white text-zinc-950 shadow-md hover:bg-zinc-100'
            }`}
            aria-label="Send query"
          >
            {disabled ? (
              <span className="w-4 h-4 rounded-full border border-zinc-500 border-t-transparent animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            )}
          </motion.button>
        </div>

        {/* Input Accessory Info */}
        <div className="flex items-center justify-between px-3 sm:px-4 pb-2 text-[9px] sm:text-[10px] text-zinc-500 font-medium font-sans border-t border-zinc-900/40 pt-1.5 select-none">
          <div className="flex items-center gap-3">
            {onConnectClick && (
              <button
                type="button"
                onClick={onConnectClick}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-red/20 bg-brand-red/5 text-brand-red hover:bg-brand-red/10 hover:border-brand-red/45 transition-all duration-200 cursor-pointer font-bold text-[9.5px] sm:text-[10.5px] tracking-wide shadow-[0_0_10px_rgba(255,42,95,0.03)]"
              >
                <Sparkles className="w-3 h-3 text-brand-red" />
                Connect with Aquib
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline pointer-events-none">Shift+Enter for newline</span>
            <span className="sm:hidden pointer-events-none">Press send to submit</span>
          </div>
        </div>
      </div>
      
      {/* Footnote */}
      <span className="text-[9px] sm:text-[10px] text-zinc-600 mt-2 tracking-wide text-center max-w-xs sm:max-w-md select-none font-sans leading-relaxed px-2 pointer-events-none">
        Peanut may provide detailed developer profiles. Verify LinkedIn, GitHub, or Resume for hiring decisions.
      </span>
    </form>
  );
};
export default ChatInput;
