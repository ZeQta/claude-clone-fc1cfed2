
import React from 'react';
import { cn } from "@/lib/utils";
import ClaudeLogo from './ClaudeLogo';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'claude';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div 
      className={cn(
        "flex py-6 px-4 md:px-8",
        message.sender === 'user' ? "bg-claude-dark-bg" : "bg-[#1A1A1A]"
      )}
    >
      <div className="flex items-start gap-4 w-full max-w-3xl mx-auto">
        {message.sender === 'claude' && (
          <div className="mt-1">
            <ClaudeLogo />
          </div>
        )}
        <div className="flex-1">
          <p className="text-white text-base leading-relaxed">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
