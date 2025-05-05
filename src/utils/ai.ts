
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

export const generateAIResponse = async (
  prompt: string,
  model: 'claude-3-7-sonnet' | 'claude-3-5-sonnet',
  onPartialResponse?: (text: string) => void
): Promise<string> => {
  try {
    await loadPuterScript();
    
    let fullResponse = '';
    const response = await window.puter.ai.chat(prompt, { 
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
