
import React, { useState, useEffect } from 'react';
import { Message } from '@/components/ChatMessage';
import Sidebar, { ChatHistoryItem } from '@/components/Sidebar';
import ChatContainer from '@/components/ChatContainer';
import StatusBar from '@/components/StatusBar';
import { v4 as uuidv4 } from 'uuid';
import { useIsMobile } from '@/hooks/use-mobile';
import { generateAIResponse, clearConversationContext } from '@/utils/ai';

export type ModelType = "Claude 3.7 Sonnet" | "Claude 3.5 Sonnet";
export type StyleType = "Normal" | "Concise" | "Explanatory" | "Formal";

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

const Index: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [userName, setUserName] = useState('');
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>("Claude 3.7 Sonnet");
  const [selectedStyle, setSelectedStyle] = useState<StyleType>("Normal");
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
  const isMobile = useIsMobile();
  
  // Initialize or load user name and chat history from localStorage
  useEffect(() => {
    const savedUserName = localStorage.getItem('userName');
    
    if (savedUserName) {
      setUserName(savedUserName);
      setIsFirstVisit(false);
    } else {
      setIsFirstVisit(true);
    }
    
    const savedHistories = localStorage.getItem('chatHistories');
    if (savedHistories) {
      try {
        const parsed = JSON.parse(savedHistories);
        // Convert string dates back to Date objects
        const histories = parsed.map((history: any) => ({
          ...history,
          timestamp: new Date(history.timestamp),
          messages: history.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatHistories(histories);
        
        // Load the most recent chat if available
        if (histories.length > 0) {
          const mostRecent = histories[0];
          setCurrentChatId(mostRecent.id);
          setMessages(mostRecent.messages);
        }
      } catch (error) {
        console.error("Error parsing chat histories:", error);
      }
    }
  }, []);

  // If it's the user's first visit, ask for their name
  useEffect(() => {
    if (isFirstVisit && !userName) {
      const askForNameMessage: Message = {
        id: uuidv4(),
        content: "Hello! I'm Claude, an AI assistant created by Anthropic. What's your name?",
        sender: 'claude',
        timestamp: new Date()
      };
      
      setMessages([askForNameMessage]);
    }
  }, [isFirstVisit, userName]);

  // Save chat histories to localStorage whenever they change
  useEffect(() => {
    if (chatHistories.length > 0) {
      localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
    }
  }, [chatHistories]);

  // Update the current messages whenever the currentChatId changes
  useEffect(() => {
    if (currentChatId) {
      const currentChat = chatHistories.find(chat => chat.id === currentChatId);
      if (currentChat) {
        setMessages(currentChat.messages);
      }
    } else if (!isFirstVisit) {
      setMessages([]);
    }
  }, [currentChatId, chatHistories, isFirstVisit]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleNameSubmission = (name: string) => {
    const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    const displayName = cleanName || 'User';
    
    setUserName(displayName);
    localStorage.setItem('userName', displayName);
    setIsFirstVisit(false);
    
    // Welcome the user
    const welcomeMessage: Message = {
      id: uuidv4(),
      content: `Nice to meet you, ${displayName}! How can I help you today?`,
      sender: 'claude',
      timestamp: new Date()
    };
    
    setMessages([
      {
        id: uuidv4(),
        content: name,
        sender: 'user',
        timestamp: new Date()
      },
      welcomeMessage
    ]);
  };

  const handleSendMessage = async (content: string) => {
    // If it's the first message and we don't have a username yet, treat it as name submission
    if (isFirstVisit && !userName) {
      handleNameSubmission(content);
      return;
    }
    
    const newMessageId = uuidv4();
    const newMessage: Message = {
      id: newMessageId,
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Update messages state
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // Create a new chat if there isn't one already
    let chatId = currentChatId;
    if (!chatId) {
      chatId = uuidv4();
      setCurrentChatId(chatId);
      
      // Create a new chat history
      const newChatHistory: ChatHistory = {
        id: chatId,
        title: content.substring(0, 30) + (content.length > 30 ? "..." : ""),
        lastMessage: content,
        timestamp: new Date(),
        messages: [newMessage]
      };
      
      setChatHistories(prev => [newChatHistory, ...prev]);
    } else {
      // Update existing chat history
      setChatHistories(prev => 
        prev.map(chat => 
          chat.id === chatId 
            ? {
                ...chat,
                lastMessage: content,
                timestamp: new Date(),
                messages: [...chat.messages, newMessage]
              }
            : chat
        ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()) // Sort by most recent
      );
    }
    
    // Generate AI response
    setIsGeneratingResponse(true);
    
    try {
      const modelMap: Record<ModelType, string> = {
        "Claude 3.7 Sonnet": "claude-3-7-sonnet",
        "Claude 3.5 Sonnet": "claude-3-5-sonnet"
      };
      
      // Create a placeholder response
      const responseId = uuidv4();
      const placeholderResponse: Message = {
        id: responseId,
        content: "",
        sender: 'claude',
        timestamp: new Date()
      };
      
      setMessages([...updatedMessages, placeholderResponse]);
      
      // Generate response with the appropriate style prefix
      let stylePrefix = "";
      switch (selectedStyle) {
        case "Concise":
          stylePrefix = "Respond concisely: ";
          break;
        case "Explanatory":
          stylePrefix = "Explain in detail: ";
          break;
        case "Formal":
          stylePrefix = "Respond formally: ";
          break;
      }
      
      const fullResponse = await generateAIResponse(
        stylePrefix + content,
        modelMap[selectedModel] as 'claude-3-7-sonnet' | 'claude-3-5-sonnet',
        (partial) => {
          setMessages(current => {
            const updatedMessages = [...current];
            const responseIndex = updatedMessages.findIndex(m => m.id === responseId);
            if (responseIndex !== -1) {
              updatedMessages[responseIndex] = {
                ...updatedMessages[responseIndex],
                content: updatedMessages[responseIndex].content + partial
              };
            }
            return updatedMessages;
          });
        }
      );
      
      const claudeResponse: Message = {
        id: responseId,
        content: fullResponse,
        sender: 'claude',
        timestamp: new Date()
      };
      
      // Update messages and chat history with Claude's final response
      setChatHistories(prev => 
        prev.map(chat => 
          chat.id === chatId 
            ? {
                ...chat,
                messages: [...chat.messages, claudeResponse]
              }
            : chat
        )
      );
      
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Add error message
      const errorResponse: Message = {
        id: uuidv4(),
        content: "I'm sorry, I encountered an error while generating a response. Please try again.",
        sender: 'claude',
        timestamp: new Date()
      };
      
      setMessages([...updatedMessages, errorResponse]);
      
      // Update chat history with error message
      setChatHistories(prev => 
        prev.map(chat => 
          chat.id === chatId 
            ? {
                ...chat,
                messages: [...chat.messages, errorResponse]
              }
            : chat
        )
      );
      
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    clearConversationContext(); // Clear conversation context for a fresh start
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const selectedChat = chatHistories.find(chat => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      // Reset conversation context to match the selected chat
      clearConversationContext();
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChatHistories(prev => prev.filter(chat => chat.id !== chatId));
    
    if (currentChatId === chatId) {
      if (chatHistories.length > 1) {
        // Find the next chat to select
        const nextChat = chatHistories.find(chat => chat.id !== chatId);
        if (nextChat) {
          setCurrentChatId(nextChat.id);
          setMessages(nextChat.messages);
        } else {
          handleNewChat();
        }
      } else {
        handleNewChat();
      }
    }
  };

  const handleEditChatTitle = (chatId: string, newTitle: string) => {
    setChatHistories(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? {
              ...chat,
              title: newTitle
            }
          : chat
      )
    );
  };

  const handleModelChange = (model: ModelType) => {
    setSelectedModel(model);
  };

  const handleStyleChange = (style: StyleType) => {
    setSelectedStyle(style);
  };

  // Auto-hide sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [isMobile]);

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

export default Index;
