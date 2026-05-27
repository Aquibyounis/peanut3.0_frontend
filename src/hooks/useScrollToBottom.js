import { useRef, useEffect } from 'react';

/**
 * Custom hook to handle smart auto-scrolling of chat list container.
 * Auto-scrolls if user is already at the bottom of the viewport, 
 * but preserves user position if they scroll up manually to review history.
 */
export const useScrollToBottom = (dependency, isStreaming) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Calculate distance from bottom
    const threshold = 150; // pixels
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    
    const isUserNearBottom = distanceFromBottom <= threshold;

    // If near the bottom, scroll to the absolute bottom.
    // If not streaming (i.e. user just posted a message), force smooth scroll to bottom.
    if (isUserNearBottom) {
      container.scrollTop = container.scrollHeight;
    } else if (!isStreaming && dependency && dependency.length > 0) {
      // Force scroll on new user message
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [dependency, isStreaming]);

  return containerRef;
};
export default useScrollToBottom;
