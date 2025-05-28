
// AI Integration using puter.js
import { Message } from '@/components/ChatMessage';

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

const MAX_HISTORY_MESSAGES_FOR_CONTEXT = 10;

export const generateAIResponse = async (
  currentPrompt: string,
  historyMessages: Message[],
  model: 'claude-3-7-sonnet' | 'claude-3-5-sonnet' | 'claude-sonnet-4',
  onPartialResponse?: (text: string) => void
): Promise<string> => {
  try {
    await loadPuterScript();
    
    // Build context from historyMessages
    // Take the last MAX_HISTORY_MESSAGES_FOR_CONTEXT messages
    const recentHistorySlice = historyMessages.slice(-MAX_HISTORY_MESSAGES_FOR_CONTEXT);

    const promptLines: string[] = [];

    for (let i = 0; i < recentHistorySlice.length; i++) {
      const message = recentHistorySlice[i];
      const isLastMessageInSlice = i === recentHistorySlice.length - 1;

      if (message.sender === 'user') {
        // If it's the last message, use currentPrompt (which includes style prefix)
        promptLines.push(`Human: ${isLastMessageInSlice ? currentPrompt : message.content}`);
      } else if (message.sender === 'claude') {
        promptLines.push(`Assistant: ${message.content}`);
      }
    }
    
    const contextualPrompt = promptLines.join('\n\n') + '\n\nAssistant:';
    
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
    
    return fullResponse;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I apologize, but I'm having trouble connecting to my AI services right now. Please try again later.";
  }
};
