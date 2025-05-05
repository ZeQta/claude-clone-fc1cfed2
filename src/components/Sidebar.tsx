
import React from 'react';
import { Button } from "@/components/ui/button";
import ClaudeLogo from './ClaudeLogo';

interface SidebarProps {
  onNewChat: () => void;
  recentChats: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, recentChats }) => {
  return (
    <aside className="h-full bg-claude-sidebar-bg border-r border-claude-button-hover w-full max-w-xs overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-claude-button-hover">
        <div className="flex items-center gap-2">
          <ClaudeLogo />
          <h1 className="text-white font-medium">Claude</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-md hover:bg-claude-button-hover"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12L23 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 5L23 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 19L23 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <Button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-transparent hover:bg-claude-button-hover text-white justify-start"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New chat
        </Button>
        <Button
          className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-transparent hover:bg-claude-button-hover text-white justify-start"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Projects
        </Button>
      </div>
      
      <div className="p-3 border-t border-claude-button-hover mt-2">
        <h3 className="text-claude-text-secondary text-xs font-medium px-2 py-1">Recents</h3>
        <div className="mt-2 flex flex-col gap-1">
          {recentChats.map((chat, index) => (
            <Button
              key={index}
              className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-transparent hover:bg-claude-button-hover text-white justify-start"
              variant="ghost"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {chat}
            </Button>
          ))}
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
};

export default Sidebar;
