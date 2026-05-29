import { useRef, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { streamChatMessage } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'https://peanut3-backend.onrender.com/chat';

/**
 * Custom React hook that implements a throttled token buffering queue in pure JS.
 * Decouples incoming socket streams (Ollama/FastAPI chunks) from React's re-rendering loop,
 * eliminating browser UI freezes and stream cuts in long, rapid responses.
 */
export const useChatStream = () => {
  const { 
    sessionId, 
    appendMessage, 
    appendTokenToMessage, 
    finalizeMessage, 
    setStreaming, 
    setError, 
    isStreaming 
  } = useChatStore();

  const tokenBufferRef = useRef('');
  const activeAssistantIdRef = useRef('');
  const flushIntervalRef = useRef(null);

  // Clean up timers on hook destruction
  useEffect(() => {
    return () => {
      if (flushIntervalRef.current) {
        clearInterval(flushIntervalRef.current);
      }
    };
  }, []);

  const sendQuery = async (queryText) => {
    if (isStreaming || !queryText.trim()) return;

    // Reset buffer and scheduler timers
    tokenBufferRef.current = '';
    if (flushIntervalRef.current) {
      clearInterval(flushIntervalRef.current);
      flushIntervalRef.current = null;
    }

    // 1. Create and append User message capsule
    const userMessageId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'msg-' + Math.random().toString(36).substring(2, 9);
    const userMessage = {
      id: userMessageId,
      role: 'user',
      content: queryText.trim(),
      timestamp: Date.now()
    };
    appendMessage(userMessage);

    // 2. Create and append Assistant placeholder message
    const assistantMessageId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'msg-' + Math.random().toString(36).substring(2, 9);
    activeAssistantIdRef.current = assistantMessageId;
    
    const assistantPlaceholder = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1,
      isStreaming: true
    };
    appendMessage(assistantPlaceholder);

    // Toggle loading indicators
    setStreaming(true);
    setError(null);

    // 3. Launch 55ms throttled flush scheduler (maps to ~18 frame paints per second).
    // Decouples layout reflow rendering from incoming socket packet rate.
    flushIntervalRef.current = setInterval(() => {
      if (tokenBufferRef.current) {
        const chunkToFlush = tokenBufferRef.current;
        tokenBufferRef.current = ''; // drain buffer
        appendTokenToMessage(activeAssistantIdRef.current, chunkToFlush);
      }
    }, 55);

    // 4. Fire network reader loop
    await streamChatMessage(
      API_URL,
      sessionId,
      queryText.trim(),
      {
        onToken: (token) => {
          // Immediately append chunk into memory buffer ref without triggering re-renders
          tokenBufferRef.current += token;
        },
        onDone: () => {
          // Halt throttled scheduler
          if (flushIntervalRef.current) {
            clearInterval(flushIntervalRef.current);
            flushIntervalRef.current = null;
          }

          // Flush any trailing elements inside the buffer
          if (tokenBufferRef.current) {
            appendTokenToMessage(activeAssistantIdRef.current, tokenBufferRef.current);
            tokenBufferRef.current = '';
          }

          // Parse for follow-up questions in the final message content
          const messages = useChatStore.getState().messages;
          const currentMessage = messages.find(m => m.id === activeAssistantIdRef.current);
          if (currentMessage && currentMessage.content) {
            const content = currentMessage.content;
            const followUpMatch = content.match(/<follow_ups>([\s\S]*?)<\/follow_ups>/);
            if (followUpMatch) {
              try {
                const followUps = JSON.parse(followUpMatch[1]);
                if (Array.isArray(followUps)) {
                  const cleanContent = content.replace(followUpMatch[0], '').trim();
                  useChatStore.getState().setFollowUpsAndContent(activeAssistantIdRef.current, followUps, cleanContent);
                }
              } catch (e) {
                console.error("Failed to parse follow up questions", e);
              }
            }
          }

          // Complete streaming active flags
          finalizeMessage(activeAssistantIdRef.current);
          setStreaming(false);
        },
        onError: (err) => {
          // Halt timer
          if (flushIntervalRef.current) {
            clearInterval(flushIntervalRef.current);
            flushIntervalRef.current = null;
          }

          console.error('useChatStream caught error:', err);
          setError(err.message || 'Stream connection to assistant backend failed.');

          // Flush what was successfully fetched before error
          if (tokenBufferRef.current) {
            appendTokenToMessage(activeAssistantIdRef.current, tokenBufferRef.current);
            tokenBufferRef.current = '';
          }

          // Complete message streaming state
          finalizeMessage(activeAssistantIdRef.current);
          setStreaming(false);

          // If the AI message is empty, append a helpful diagnostic placeholder
          const messages = useChatStore.getState().messages;
          const currentAssistantMessage = messages.find(m => m.id === activeAssistantIdRef.current);
          if (currentAssistantMessage && !currentAssistantMessage.content) {
            appendTokenToMessage(
              activeAssistantIdRef.current,
              '⚠️ *An error occurred while connecting to the assistant backend. Please ensure the server is active at `https://peanut3-backend.onrender.com/chat`.*'
            );
          }
        }
      }
    );
  };

  return {
    sendQuery,
    isStreaming
  };
};
export default useChatStream;
