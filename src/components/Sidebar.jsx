import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  RefreshCw, 
  Globe, 
  Copy, 
  Check, 
  Mail, 
  ExternalLink,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

/**
 * Sliding, collapsable, blur connection sidebar menu.
 */
export const Sidebar = ({ isOpen, onToggle, onConnectClick }) => {
  const { sessionId, clearChat, resetSession, messages } = useChatStore();
  const [copiedId, setCopiedId] = useState(false);

  const handleCopySessionId = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (err) {
      console.error('Failed to copy session id: ', err);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      clearChat();
    }
  };

  const handleReset = () => {
    if (window.confirm('This will start a completely new session with the backend. Continue?')) {
      resetSession();
    }
  };

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
        />
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 active:scale-95 transition-all cursor-pointer glass-panel"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar Panel Container */}
      <motion.div
        initial={false}
        animate={{ 
          width: isOpen ? 280 : 0,
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : -280
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className={`fixed top-0 bottom-0 left-0 z-40 bg-zinc-950/90 border-r border-zinc-900/80 flex flex-col h-full overflow-hidden glass-panel ${
          isOpen ? 'w-[280px]' : 'w-0 border-r-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-900/80 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-brand-red to-red-700 flex items-center justify-center text-white text-[10px] font-mono font-bold">
              P
            </div>
            <span className="font-semibold text-sm tracking-tight text-white select-none">Peanut 3.0 Menu</span>
          </div>
          
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Section: Quick Actions */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 font-mono mb-3 select-none">
              Actions
            </h3>
            


            {/* Clear Conversation */}
            <button
              onClick={handleClear}
              disabled={messages.length === 0}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                messages.length === 0
                  ? 'border-zinc-900 text-zinc-650 cursor-not-allowed opacity-50'
                  : 'border-zinc-900 bg-zinc-900/30 hover:bg-zinc-900/85 hover:border-zinc-800 text-zinc-300 hover:text-zinc-100 active:scale-98'
              }`}
            >
              <Trash2 className="w-4 h-4 text-zinc-400" />
              <span>Clear History</span>
            </button>

            {/* Reset Session */}
            <button
              onClick={handleReset}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium border border-zinc-900 bg-zinc-900/30 hover:bg-zinc-900/85 hover:border-zinc-805 text-zinc-300 hover:text-zinc-100 active:scale-98 text-left transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-zinc-400" />
              <span>Reset Session</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-900/80 text-[10px] text-zinc-600 text-center select-none bg-zinc-950 flex-shrink-0 font-sans leading-relaxed">
          Peanut Front-End v3.0.0
          <br />
          Built with React & Vite
        </div>
      </motion.div>
    </>
  );
};
export default Sidebar;
