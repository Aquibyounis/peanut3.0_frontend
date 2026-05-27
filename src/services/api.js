/**
 * Streams chat responses from the FastAPI backend token-by-token.
 * Uses a single TextDecoder instance and passes { stream: true } to properly
 * assemble multi-byte character chunks (like emojis) split across buffers.
 */
export const streamChatMessage = async (
  apiUrl,
  sessionId,
  message,
  callbacks
) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
      }),
    });

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch {
        errorText = response.statusText;
      }
      throw new Error(errorText || `HTTP error ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null, cannot stream data.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let isStreamActive = true;

    try {
      while (isStreamActive) {
        const { value, done } = await reader.read();
        if (done) {
          isStreamActive = false;
          break;
        }
        if (value) {
          // Decode buffer chunk while keeping UTF-8 split boundary bytes cached in memory
          const token = decoder.decode(value, { stream: true });
          if (token) {
            try {
              callbacks.onToken(token);
            } catch (cbErr) {
              console.error('Exception in onToken callback:', cbErr);
            }
          }
        }
      }

      // Final flush to catch any remaining UTF-8 trailing byte fragments
      const finalToken = decoder.decode();
      if (finalToken) {
        try {
          callbacks.onToken(finalToken);
        } catch (cbErr) {
          console.error('Exception in final onToken callback:', cbErr);
        }
      }

      callbacks.onDone();
    } catch (readErr) {
      reader.releaseLock();
      throw readErr;
    }
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  }
};
