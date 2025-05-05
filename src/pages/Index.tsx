
import React, { useState } from 'react';
import { Message } from '@/components/ChatMessage';
import Sidebar from '@/components/Sidebar';
import ChatContainer from '@/components/ChatContainer';
import StatusBar from '@/components/StatusBar';
import { v4 as uuidv4 } from 'uuid';

const Index: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [userName, setUserName] = useState('User');
  
  const recentChats = [
    "Explaining Einstein's Theory of Relativity",
    "Effective Muscle-Building Exercises",
    "Using the Claude API",
    "Analyzing Website Information",
    "Maximizing Artifact Potential"
  ];

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    
    // Simulate Claude's response after a delay
    setTimeout(() => {
      const claudeResponse: Message = {
        id: uuidv4(),
        content: `I'll help you with "${content}". What specific information are you looking for?`,
        sender: 'claude',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, claudeResponse]);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-claude-dark-bg text-white">
      <StatusBar />
      <div className="flex-1 flex overflow-hidden">
        {showSidebar && (
          <Sidebar 
            onNewChat={handleNewChat}
            recentChats={recentChats}
          />
        )}
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatContainer 
            messages={messages}
            userName={userName}
            onSendMessage={handleSendMessage}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
