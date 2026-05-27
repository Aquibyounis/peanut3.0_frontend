import { create } from 'zustand';

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'peanut-session-' + Math.random().toString(36).substring(2, 15) + '-' + Math.random().toString(36).substring(2, 15);
};

const getOrInitializeSessionId = () => {
  let sessionId = localStorage.getItem('peanut_session_id');
  if (!sessionId) {
    sessionId = generateUUID();
    localStorage.setItem('peanut_session_id', sessionId);
  }
  return sessionId;
};

export const useChatStore = create((set) => ({
  messages: [],
  isStreaming: false,
  error: null,
  sessionId: getOrInitializeSessionId(),

  appendMessage: (msg) => {
    set((state) => ({ messages: [...state.messages, msg] }));
  },

  appendTokenToMessage: (id, token) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content: msg.content + token } : msg
      ),
    }));
  },

  finalizeMessage: (id) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, isStreaming: false } : msg
      ),
    }));
  },

  setFollowUps: (id, followUps) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, followUps } : msg
      ),
    }));
  },

  setFollowUpsAndContent: (id, followUps, content) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, followUps, content } : msg
      ),
    }));
  },

  updateMessageContent: (id, content) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content } : msg
      ),
    }));
  },

  setStreaming: (isStreaming) => {
    set({ isStreaming });
  },

  setError: (error) => {
    set({ error });
  },

  clearChat: () => {
    set({
      messages: [],
      error: null,
      isStreaming: false,
    });
  },

  resetSession: () => {
    const newSessionId = generateUUID();
    localStorage.setItem('peanut_session_id', newSessionId);
    set({
      sessionId: newSessionId,
      messages: [],
      error: null,
      isStreaming: false,
    });
  },
}));
export default useChatStore;
