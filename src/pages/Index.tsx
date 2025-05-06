
import React from 'react';
import Sidebar from '@/components/Sidebar';
import ChatContainer from '@/components/ChatContainer';
import StatusBar from '@/components/StatusBar';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResponsiveSidebar } from '@/hooks/use-responsive-sidebar';

// Wrapper component that uses the ChatContext
const ChatApp: React.FC = () => {
  const { 
    messages, 
    userName, 
    selectedModel,
    selectedStyle,
    isGeneratingResponse,
    chatHistories,
    currentChatId,
    handleSendMessage,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    handleEditChatTitle,
    handleModelChange,
    handleStyleChange
  } = useChatContext();
  
  const isMobile = useIsMobile();
  const { showSidebar, toggleSidebar, setShowSidebar } = useResponsiveSidebar();

  return (
    <div className="min-h-screen flex flex-col bg-claude-dark-bg text-white">
      <StatusBar 
        toggleSidebar={toggleSidebar} 
        userName={userName || 'User'} 
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isMobile={isMobile}
          showSidebar={showSidebar}
          onNewChat={handleNewChat}
          chatHistories={chatHistories}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onEditChatTitle={handleEditChatTitle}
          currentChatId={currentChatId}
          closeSidebar={() => setShowSidebar(false)}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatContainer 
            messages={messages}
            userName={userName || 'User'}
            onSendMessage={handleSendMessage}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
            selectedStyle={selectedStyle}
            onStyleChange={handleStyleChange}
            isMobile={isMobile}
            isGeneratingResponse={isGeneratingResponse}
          />
        </main>
      </div>
    </div>
  );
};

// Main Index component that provides the ChatContext
const Index: React.FC = () => {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
};

export default Index;
