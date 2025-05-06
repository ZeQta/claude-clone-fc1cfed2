
import React from 'react';
import { cn } from "@/lib/utils";
import ClaudeLogo from './ClaudeLogo';
import MarkdownRenderer from './MarkdownRenderer';
import UserAvatar from './UserAvatar';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'claude';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  isThinking?: boolean;
  userName: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isThinking = false, userName }) => {
  return (
    <div 
      className={cn(
        "flex py-6 px-4 md:px-8",
        message.sender === 'user' ? "bg-claude-dark-bg" : "bg-[#1A1A1A]"
      )}
    >
      <div className="flex items-start gap-4 w-full max-w-3xl mx-auto">
        {message.sender === 'claude' ? (
          <div className="mt-1 flex-shrink-0">
            <ClaudeLogo isThinking={isThinking} />
          </div>
        ) : (
          <div className="mt-1 flex-shrink-0">
            <UserAvatar userName={userName} />
          </div>
        )}
        <div className="flex-1">
          {message.sender === 'user' ? (
            <p className="text-white text-base leading-relaxed">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
