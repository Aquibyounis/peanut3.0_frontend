import { motion } from 'framer-motion';
import { MarkdownRenderer } from './MarkdownRenderer';
import { TypingIndicator } from './TypingIndicator';

/**
 * Message element splits right user bubbles from left assistant streaming outputs.
 */
export const ChatMessage = ({ message, onFollowUpClick }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, type: 'spring', stiffness: 100, damping: 16 }}
      className={`flex w-full my-3 sm:my-5 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`flex gap-2.5 sm:gap-4 max-w-3xl w-full ${
          isUser ? 'justify-end' : 'justify-start items-start'
        }`}
      >
        {/* Assistant Brand Avatar */}
        {!isUser && (
          <div 
            className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-brand-red to-red-700 flex items-center justify-center text-white text-[10px] sm:text-[11px] font-mono font-bold shadow-md shadow-red-500/5 select-none mt-1 border border-brand-red/20"
            title="Peanut 3.0"
          >
            P
          </div>
        )}

        {/* Message Content Bubble */}
        <div className={`flex flex-col ${isUser ? 'max-w-[85%] items-end' : 'flex-1 min-w-0'}`}>
          {isUser ? (
            /* User Message Bubble */
            <div className="bg-zinc-900/60 border border-zinc-800/80 py-2 px-3.5 sm:py-2.5 sm:px-4 rounded-2xl text-zinc-100 text-[13.5px] sm:text-[14.5px] leading-relaxed shadow-sm font-sans select-text whitespace-pre-wrap">
              {message.content}
            </div>
          ) : (
            /* Assistant Response Block */
            <div className="pl-0.5 sm:pl-1 pt-1 sm:pt-1.5 flex-1 min-w-0">
              {message.content === '' && message.isStreaming ? (
                <TypingIndicator />
              ) : (
                <>
                  <MarkdownRenderer 
                    content={message.content} 
                    isStreaming={message.isStreaming} 
                  />
                  {message.followUps && message.followUps.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.followUps.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => onFollowUpClick && onFollowUpClick(q)}
                          className="text-xs px-3 py-1.5 rounded-full border border-brand-red/30 bg-brand-red/10 text-brand-red hover:bg-brand-red/20 hover:border-brand-red/50 transition-colors cursor-pointer text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default ChatMessage;
