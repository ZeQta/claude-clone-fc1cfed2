
// AI Integration using puter.js
declare global {
  interface Window {
    puter: any;
  }
}

export const loadPuterScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.puter) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load puter.js'));
    document.body.appendChild(script);
  });
};

// This is our conversation context to maintain continuity
let conversationContext: string[] = [];
const MAX_CONTEXT_MESSAGES = 10;

export const generateAIResponse = async (
  prompt: string,
  model: 'claude-3-7-sonnet' | 'claude-3-5-sonnet',
  onPartialResponse?: (text: string) => void
): Promise<string> => {
  try {
    await loadPuterScript();
    
    // Add the current prompt to our conversation context
    conversationContext.push(`Human: ${prompt}`);
    
    // Create a prompt with context from previous messages for continuity
    const contextualPrompt = conversationContext.slice(-MAX_CONTEXT_MESSAGES).join('\n\n') + '\n\nAssistant:';
    
    let fullResponse = '';
    const response = await window.puter.ai.chat(contextualPrompt, { 
      model: model, 
      stream: true 
    });
    
    for await (const part of response) {
      if (part?.text) {
        fullResponse += part.text;
        if (onPartialResponse) {
          onPartialResponse(part.text);
        }
      }
    }
    
    // Add the AI's response to our conversation context
    conversationContext.push(`Assistant: ${fullResponse}`);
    
    // Trim conversation context if it gets too long
    if (conversationContext.length > MAX_CONTEXT_MESSAGES * 2) {
      conversationContext = conversationContext.slice(-MAX_CONTEXT_MESSAGES * 2);
    }
    
    return fullResponse;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I apologize, but I'm having trouble connecting to my AI services right now. Please try again later.";
  }
};

export const clearConversationContext = () => {
  conversationContext = [];
};
