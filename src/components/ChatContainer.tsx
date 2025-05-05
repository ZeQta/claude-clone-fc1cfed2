
import React, { useState } from 'react';
import { Message } from './ChatMessage';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ClaudeHeader from './ClaudeHeader';

interface ChatContainerProps {
  messages: Message[];
  userName: string;
  onSendMessage: (message: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, userName, onSendMessage }) => {
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
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatContainer;
