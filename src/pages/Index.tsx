
import React, { useState, useEffect } from 'react';
import { Message } from '@/components/ChatMessage';
import Sidebar from '@/components/Sidebar';
import ChatContainer from '@/components/ChatContainer';
import StatusBar from '@/components/StatusBar';
import { v4 as uuidv4 } from 'uuid';

export type ModelType = "Claude 3.7 Sonnet" | "Claude 3.5 Haiku" | "Claude 3.5 Sonnet (Oct 2024)" | "Claude 3 Opus";
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
  const [userName, setUserName] = useState('User');
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>("Claude 3.7 Sonnet");
  const [selectedStyle, setSelectedStyle] = useState<StyleType>("Normal");
  
  // Initialize or load chat history from localStorage
  useEffect(() => {
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
    } else {
      setMessages([]);
    }
  }, [currentChatId, chatHistories]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const generateAIResponse = (userMessage: string): Promise<string> => {
    // Simulate AI response based on selected style and model
    return new Promise((resolve) => {
      setTimeout(() => {
        let responsePrefix = "";
        
        switch (selectedStyle) {
          case "Concise":
            responsePrefix = "Briefly: ";
            break;
          case "Explanatory":
            responsePrefix = "Let me explain: ";
            break;
          case "Formal":
            responsePrefix = "According to current information: ";
            break;
          default:
            responsePrefix = "";
        }
        
        const modelInfo = selectedModel.includes("3.7") ? 
          "Using advanced reasoning" : 
          selectedModel.includes("Opus") ? 
          "Providing comprehensive analysis" : 
          "With clear thinking";
        
        resolve(`${responsePrefix}${modelInfo}, I can help with "${userMessage}". What specific details would you like to know?`);
      }, 1000);
    });
  };

  const handleSendMessage = async (content: string) => {
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
    const aiResponse = await generateAIResponse(content);
    
    const claudeResponse: Message = {
      id: uuidv4(),
      content: aiResponse,
      sender: 'claude',
      timestamp: new Date()
    };
    
    // Update messages with Claude's response
    const finalMessages = [...updatedMessages, claudeResponse];
    setMessages(finalMessages);
    
    // Update chat history with Claude's response
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
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const selectedChat = chatHistories.find(chat => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  };

  const handleModelChange = (model: ModelType) => {
    setSelectedModel(model);
  };

  const handleStyleChange = (style: StyleType) => {
    setSelectedStyle(style);
  };

  return (
    <div className="min-h-screen flex flex-col bg-claude-dark-bg text-white">
      <StatusBar toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex overflow-hidden">
        {showSidebar && (
          <Sidebar 
            onNewChat={handleNewChat}
            chatHistories={chatHistories.map(chat => ({
              id: chat.id,
              title: chat.title
            }))}
            onSelectChat={handleSelectChat}
            currentChatId={currentChatId}
          />
        )}
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatContainer 
            messages={messages}
            userName={userName}
            onSendMessage={handleSendMessage}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
            selectedStyle={selectedStyle}
            onStyleChange={handleStyleChange}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
