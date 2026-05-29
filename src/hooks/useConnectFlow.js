import { useState, useCallback } from 'react';
import { useChatStore } from '../store/useChatStore';

export const CONNECT_STEPS = {
  IDLE: 'IDLE',
  ASK_NAME: 'ASK_NAME',
  ASK_EMAIL: 'ASK_EMAIL',
  ASK_COMPANY: 'ASK_COMPANY',
  ASK_MESSAGE: 'ASK_MESSAGE',
};

const CONNECT_API_URL = import.meta.env.VITE_CONNECT_API_URL || 'https://peanut3-backend.onrender.com/connect';

export const useConnectFlow = () => {
  const [step, setStep] = useState(CONNECT_STEPS.IDLE);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const { appendMessage, setStreaming } = useChatStore();

  const pushAssistantMessage = (content) => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'msg-' + Math.random().toString(36).substring(2, 9);
    appendMessage({
      id,
      role: 'assistant',
      content,
      timestamp: Date.now(),
      isStreaming: false
    });
  };

  const pushUserMessage = (content) => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'msg-' + Math.random().toString(36).substring(2, 9);
    appendMessage({
      id,
      role: 'user',
      content,
      timestamp: Date.now()
    });
  };

  const startConnectFlow = useCallback(() => {
    setStep(CONNECT_STEPS.ASK_NAME);
    setFormData({ name: '', email: '', company: '', message: '' });
    pushAssistantMessage("That's great! I'd love to connect. What is your name?");
  }, []);

  const handleConnectInput = useCallback((input) => {
    if (!input.trim()) return;

    pushUserMessage(input);

    if (step === CONNECT_STEPS.ASK_NAME) {
      setFormData(prev => ({ ...prev, name: input }));
      setStep(CONNECT_STEPS.ASK_EMAIL);
      setTimeout(() => pushAssistantMessage(`Nice to meet you, ${input}! What is your email address?`), 300);
    } else if (step === CONNECT_STEPS.ASK_EMAIL) {
      setFormData(prev => ({ ...prev, email: input }));
      setStep(CONNECT_STEPS.ASK_COMPANY);
      setTimeout(() => pushAssistantMessage("Which company do you work at?"), 300);
    } else if (step === CONNECT_STEPS.ASK_COMPANY) {
      setFormData(prev => ({ ...prev, company: input }));
      setStep(CONNECT_STEPS.ASK_MESSAGE);
      setTimeout(() => pushAssistantMessage("What would you like to discuss with Aquib?"), 300);
    } else if (step === CONNECT_STEPS.ASK_MESSAGE) {
      const finalMessage = input;
      setStep(CONNECT_STEPS.IDLE);
      
      setStreaming(true);
      
      (async () => {
        try {
          const response = await fetch(CONNECT_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name, 
              email: formData.email, 
              designation: "Not provided", 
              company: formData.company, 
              message: finalMessage
            }),
          });
          
          setStreaming(false);
          
          if (response.ok) {
            pushAssistantMessage("✅ Success! Your message has been sent to Aquib.");
            setFormData({ name: '', email: '', company: '', message: '' });
          } else {
            pushAssistantMessage("❌ Error: Failed to send your message. Please try again later.");
          }
        } catch (error) {
          setStreaming(false);
          pushAssistantMessage("❌ Error: Network error occurred while sending your message.");
          console.error("Connect fetch error:", error);
        }
      })();
    }
  }, [step, formData]);

  return {
    isActive: step !== CONNECT_STEPS.IDLE,
    startConnectFlow,
    handleConnectInput
  };
};
