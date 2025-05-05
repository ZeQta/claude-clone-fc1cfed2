
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import StyleSelector from './StyleSelector';
import ModelSelector from './ModelSelector';
import { ModelType, StyleType } from '@/pages/Index';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  selectedStyle: StyleType;
  onStyleChange: (style: StyleType) => void;
  isMobile: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  selectedModel, 
  onModelChange,
  selectedStyle,
  onStyleChange,
  isMobile
}) => {
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
          rows={isMobile ? 2 : 3}
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          <StyleSelector 
            selectedStyle={selectedStyle} 
            onStyleChange={onStyleChange} 
          />
          <Button 
            type="submit"
            size="icon"
            className="h-10 w-10 rounded-lg bg-claude-coral hover:bg-opacity-90 text-white"
            disabled={!message.trim()}
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-claude-text-secondary">Free plan</span>
        </div>
        <ModelSelector 
          selectedModel={selectedModel} 
          onModelChange={onModelChange} 
        />
      </div>
    </form>
  );
};

export default ChatInput;
