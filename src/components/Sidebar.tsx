
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import ClaudeLogo from './ClaudeLogo';
import { cn } from '@/lib/utils';
import { Check, Edit, Pencil, Plus, Trash2, X } from 'lucide-react';

export interface ChatHistoryItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface SidebarProps {
  isMobile: boolean;
  showSidebar: boolean;
  onNewChat: () => void;
  chatHistories: ChatHistoryItem[];
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onEditChatTitle: (chatId: string, newTitle: string) => void;
  currentChatId: string | null;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isMobile,
  showSidebar,
  onNewChat, 
  chatHistories, 
  onSelectChat, 
  onDeleteChat,
  onEditChatTitle,
  currentChatId,
  closeSidebar
}) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startEditing = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditTitle(currentTitle);
  };

  const saveEdit = (chatId: string) => {
    if (editTitle.trim()) {
      onEditChatTitle(chatId, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const cancelEdit = () => {
    setEditingChatId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit(chatId);
    }
    if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleChatSelect = (chatId: string) => {
    onSelectChat(chatId);
    if (isMobile) {
      closeSidebar();
    }
  };

  const SidebarContent = () => (
    <aside className="h-full bg-claude-sidebar-bg border-r border-claude-button-hover w-full max-w-xs overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-claude-button-hover">
        <div className="flex items-center gap-2">
          <ClaudeLogo />
          <h1 className="text-white font-medium">Claude</h1>
        </div>
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-md hover:bg-claude-button-hover"
            onClick={closeSidebar}
          >
            <X size={18} />
          </Button>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2">
        <Button
          onClick={() => {
            onNewChat();
            if (isMobile) {
              closeSidebar();
            }
          }}
          className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-transparent hover:bg-claude-button-hover text-white justify-start"
        >
          <Plus size={16} />
          New chat
        </Button>
      </div>
      
      <div className="p-3 border-t border-claude-button-hover mt-2 flex-1 overflow-y-auto">
        <h3 className="text-claude-text-secondary text-xs font-medium px-2 py-1">Recents</h3>
        <div className="mt-2 flex flex-col gap-1">
          {chatHistories.length === 0 ? (
            <p className="text-claude-text-secondary text-sm px-2 py-1">No recent chats</p>
          ) : (
            chatHistories.map((chat) => (
              <div key={chat.id} className="group relative">
                {editingChatId === chat.id ? (
                  <div className="flex items-center gap-2 py-2 px-3 rounded-md bg-claude-button-hover">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, chat.id)}
                      className="flex-1 bg-transparent text-white border-b border-claude-text-secondary focus:outline-none focus:border-claude-coral"
                      autoFocus
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => saveEdit(chat.id)}
                    >
                      <Check size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={cancelEdit}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ) : (
                  <Button
                    className={cn(
                      "w-full flex items-center gap-2 py-2 px-3 rounded-md bg-transparent hover:bg-claude-button-hover text-white justify-start",
                      currentChatId === chat.id && "bg-claude-button-hover"
                    )}
                    variant="ghost"
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="truncate">{chat.title}</span>
                  </Button>
                )}
                {!editingChatId && (
                  <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 bg-transparent hover:bg-claude-button-hover rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(chat.id, chat.title);
                      }}
                    >
                      <Pencil size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 bg-transparent hover:bg-claude-button-hover rounded-full text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-auto p-3 border-t border-claude-button-hover">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-claude-button-hover flex items-center justify-center text-white">
              <span>U</span>
            </div>
            <div className="text-white">User</div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-md hover:bg-claude-button-hover"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </div>
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <Drawer open={showSidebar} onOpenChange={closeSidebar}>
        <DrawerContent className="max-h-[95vh] p-0 bg-claude-sidebar-bg">
          <SidebarContent />
        </DrawerContent>
      </Drawer>
    );
  }

  return showSidebar ? <SidebarContent /> : null;
};

export default Sidebar;
