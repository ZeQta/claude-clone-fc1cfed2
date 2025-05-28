
import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateAIResponse } from '@/utils/ai';
import { Message } from '@/components/ChatMessage';

export type ModelType = "Claude 3.7 Sonnet" | "Claude 3.5 Sonnet";
export type StyleType = "Normal" | "Concise" | "Explanatory" | "Formal";

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chatHistories: ChatHistory[];
  setChatHistories: React.Dispatch<React.SetStateAction<ChatHistory[]>>;
  currentChatId: string | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedModel: ModelType;
  setSelectedModel: React.Dispatch<React.SetStateAction<ModelType>>;
  selectedStyle: StyleType;
  setSelectedStyle: React.Dispatch<React.SetStateAction<StyleType>>;
  isGeneratingResponse: boolean;
  setIsGeneratingResponse: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  isFirstVisit: boolean;
  setIsFirstVisit: React.Dispatch<React.SetStateAction<boolean>>;
  handleSendMessage: (content: string) => Promise<void>;
  handleNewChat: () => void;
  handleSelectChat: (chatId: string) => void;
  handleDeleteChat: (chatId: string) => void;
  handleEditChatTitle: (chatId: string, newTitle: string) => void;
  handleModelChange: (model: ModelType) => void;
  handleStyleChange: (style: StyleType) => void;
  handleNameSubmission: (name: string) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userName, setUserName] = useState('');
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>("Claude 3.7 Sonnet");
  const [selectedStyle, setSelectedStyle] = useState<StyleType>("Normal");
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
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
        "Claude 3.5 Sonnet": "claude-3-5-sonnet",
        "Claude Sonnet 4": "claude-sonnet-4"
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
        updatedMessages, // Pass the full chat history including the latest user message
        modelMap[selectedModel] as 'claude-3-7-sonnet' | 'claude-3-5-sonnet' | 'claude-sonnet-4',
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
    // clearConversationContext(); // No longer needed, context is passed per call
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const selectedChat = chatHistories.find(chat => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      // Reset conversation context to match the selected chat
      // clearConversationContext(); // No longer needed
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

  const value = {
    messages,
    setMessages,
    chatHistories,
    setChatHistories,
    currentChatId,
    setCurrentChatId,
    selectedModel,
    setSelectedModel,
    selectedStyle,
    setSelectedStyle,
    isGeneratingResponse,
    setIsGeneratingResponse,
    userName,
    setUserName,
    isFirstVisit,
    setIsFirstVisit,
    handleSendMessage,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    handleEditChatTitle,
    handleModelChange,
    handleStyleChange,
    handleNameSubmission
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook to use the chat context
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
