
import React from 'react';
import { Message } from './ChatMessage';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ClaudeHeader from './ClaudeHeader';
import { ModelType, StyleType } from '@/pages/Index';

interface ChatContainerProps {
  messages: Message[];
  userName: string;
  onSendMessage: (message: string) => void;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  selectedStyle: StyleType;
  onStyleChange: (style: StyleType) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  userName,
  onSendMessage,
  selectedModel,
  onModelChange,
  selectedStyle,
  onStyleChange
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto flex flex-col">
        {messages.length === 0 ? (
          <ClaudeHeader userName={userName} />
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>
      <ChatInput 
        onSendMessage={onSendMessage} 
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        selectedStyle={selectedStyle}
        onStyleChange={onStyleChange}
      />
    </div>
  );
};

export default ChatContainer;
