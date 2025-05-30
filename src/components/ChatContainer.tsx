
import React, { useEffect, useRef } from 'react';
import { Message } from './ChatMessage';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ClaudeHeader from './ClaudeHeader';
import { ModelType, StyleType } from '@/types/chat';

interface ChatContainerProps {
  messages: Message[];
  userName: string;
  onSendMessage: (message: string) => void;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  selectedStyle: StyleType;
  onStyleChange: (style: StyleType) => void;
  isMobile: boolean;
  isGeneratingResponse: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  userName,
  onSendMessage,
  selectedModel,
  onModelChange,
  selectedStyle,
  onStyleChange,
  isMobile,
  isGeneratingResponse
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto flex flex-col">
        {messages.length === 0 ? (
          <ClaudeHeader userName={userName} />
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                userName={userName}
                isThinking={isGeneratingResponse && message.sender === 'claude' && message === messages[messages.length - 1]} 
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <ChatInput 
        onSendMessage={onSendMessage} 
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        selectedStyle={selectedStyle}
        onStyleChange={onStyleChange}
        isMobile={isMobile}
      />
    </div>
  );
};

export default ChatContainer;
