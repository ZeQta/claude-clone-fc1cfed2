
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import StyleSelector from './StyleSelector';
import ModelSelector from './ModelSelector';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-auto p-4 flex flex-col gap-4">
      <div className="relative">
        <textarea
          className="claude-input min-h-[100px] resize-none pr-16"
          placeholder="How can I help you today?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          <StyleSelector />
          <Button 
            type="submit"
            size="icon"
            className="h-10 w-10 rounded-lg bg-claude-coral hover:bg-opacity-90 text-white"
            disabled={!message.trim()}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 19V5M12 5L6 11M12 5L18 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            type="button"
            size="icon"
            variant="ghost" 
            className="h-10 w-10 rounded-lg bg-claude-input-bg hover:bg-claude-button-hover"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Button>
        </div>
        <ModelSelector />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
        <Button type="button" className="claude-button" variant="ghost">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 3.5H7L2 9.5L12 20.5L22 9.5L17 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M12 20.5V9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 9.5H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 3.5L7 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 3.5L17 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Write</span>
        </Button>
        <Button type="button" className="claude-button" variant="ghost">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Learn</span>
        </Button>
        <Button type="button" className="claude-button" variant="ghost">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 2L14 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Code</span>
        </Button>
        <Button type="button" className="claude-button" variant="ghost">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L10 7C10 7.55228 9.55228 8 9 8L4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 21.4939C18.1631 21.4997 17.8241 21.4538 17.5 21.3593C16.6675 21.1131 16 20.5931 16 19.9939C16 19.3947 16.6675 18.8748 17.5 18.6285C17.8241 18.534 18.1631 18.4882 18.5 18.4939C18.8369 18.4997 19.1759 18.534 19.5 18.6285C20.3325 18.8748 21 19.3947 21 19.9939C21 20.5931 20.3325 21.1131 19.5 21.3593C19.1759 21.4538 18.8369 21.4997 18.5 21.4939Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 18.5V13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 15C16 15.5917 16.6675 16.1117 17.5 16.3579C17.8241 16.4524 18.1631 16.4983 18.5 16.4925C18.8369 16.4867 19.1759 16.4524 19.5 16.3579C20.3325 16.1117 21 15.5917 21 15C21 14.4083 20.3325 13.8883 19.5 13.6421C19.1759 13.5476 18.8369 13.5017 18.5 13.5075C18.1631 13.5133 17.8241 13.5476 17.5 13.6421C16.6675 13.8883 16 14.4083 16 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 4H11.5C12.6046 4 13.5 4.89543 13.5 6V19C13.5 20.1046 12.6046 21 11.5 21H4C2.89543 21 2 20.1046 2 19V6C2 4.89543 2.89543 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.75 16.5C8.16421 16.5 8.5 16.1642 8.5 15.75C8.5 15.3358 8.16421 15 7.75 15C7.33579 15 7 15.3358 7 15.75C7 16.1642 7.33579 16.5 7.75 16.5Z" fill="currentColor"/>
          </svg>
          <span>Life stuff</span>
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
