import { useState } from 'react';
import { useChatStore } from './store/useChatStore';
import { useChatStream } from './hooks/useChatStream';
import { AnimatedGreeting } from './components/AnimatedGreeting';
import { SuggestedPrompts } from './components/SuggestedPrompts';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { Sidebar } from './components/Sidebar';
import { useScrollToBottom } from './hooks/useScrollToBottom';
import { useConnectFlow } from './hooks/useConnectFlow';
import { FuturisticBackground } from './components/FuturisticBackground';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { 
    messages, 
    isStreaming, 
    error, 
    resetSession 
  } = useChatStore();
  
  const { sendQuery } = useChatStream();
  const { isActive: isConnectActive, startConnectFlow, handleConnectInput } = useConnectFlow();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');

  const isChatActive = messages.length > 0;
  // Dynamic scrolling reference attached to scroll container
  const scrollContainerRef = useScrollToBottom(messages, isStreaming);

  const handleSend = (text) => {
    if (isConnectActive) {
      handleConnectInput(text);
    } else {
      sendQuery(text);
    }
    setSelectedPrompt(''); // clear temporary prompt cache
  };

  const handlePromptSelect = (promptText) => {
    handleSend(promptText);
  };

  return (
    <div className="relative min-h-screen text-zinc-100 flex overflow-hidden selection:bg-red-500/20 selection:text-zinc-100">
      
      {/* 1. Futuristic Cybernetic Background */}
      <FuturisticBackground isChatActive={isChatActive} />

      {/* 2. Collapsible Glassmorphic Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        onConnectClick={() => {
          setIsSidebarOpen(false);
          startConnectFlow();
        }}
      />

      {/* 3. Main Action Panel */}
      <div 
        className={`relative z-10 flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-0'
        }`}
      >
        {!isChatActive ? (
          /* Landing State - Everything beautifully centered in the middle of the screen */
          <div className="w-full max-w-3xl px-4 flex flex-col items-center justify-center gap-6 sm:gap-8 flex-1 mx-auto min-h-0 overflow-y-auto animate-in fade-in duration-500">
            {/* Centered Large Greeting */}
            <AnimatedGreeting 
              isChatActive={false} 
              onResetSession={resetSession} 
            />
            
            {/* Input Box in the middle of the viewport */}
            <motion.div
              layoutId="shared-chat-input"
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="w-full z-10"
            >
              <ChatInput 
                onSend={handleSend} 
                disabled={isStreaming} 
                initialValue={selectedPrompt}
                onConnectClick={startConnectFlow}
              />
            </motion.div>

            {/* Suggested Prompts below the input box */}
            <SuggestedPrompts 
              onSelectPrompt={handlePromptSelect} 
              onConnectClick={startConnectFlow}
            />
          </div>
        ) : (
          /* Active Chat State - Message list fills center, input at sticky bottom */
          <div className="flex-1 flex flex-col min-h-0 w-full relative">
            {/* Sticky Slim Header */}
            <AnimatedGreeting 
              isChatActive={true} 
              onResetSession={resetSession} 
            />

            {/* Scrollable message container */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 w-full flex flex-col items-center select-text min-h-0"
            >
              <div className="w-full max-w-3xl">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} onFollowUpClick={handleSend} />
                ))}
                
                {/* Connection Error Banner */}
                {error && (
                  <div className="w-full max-w-3xl my-4 sm:my-6 p-4 rounded-xl border border-rose-500/20 bg-rose-950/20 text-rose-300 text-sm flex flex-col gap-1.5 glass-panel animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <span className="font-semibold text-rose-200">⚠️ Backend Connection Refused</span>
                    <p className="text-rose-300/80 leading-relaxed font-sans">
                      {error}. Please ensure the FastAPI backend is running at{' '}
                      <code className="bg-rose-950 px-1.5 py-0.5 rounded font-mono text-xs select-all text-white border border-rose-900/60">
                        https://peanut3-backend.onrender.com/chat
                      </code>.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Bottom Chat Input Row with Layout ID Transition */}
            <motion.div
              layoutId="shared-chat-input"
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="w-full max-w-3xl mx-auto px-3 sm:px-4 pb-4 sm:pb-6 pt-2 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent flex flex-col items-center flex-shrink-0 z-10"
            >
              <ChatInput 
                onSend={handleSend} 
                disabled={isStreaming} 
                initialValue={selectedPrompt}
                onConnectClick={startConnectFlow}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
