
import React from 'react';
import { Button } from "@/components/ui/button";

interface StatusBarProps {
  toggleSidebar: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-claude-dark-bg h-10 border-b border-claude-button-hover flex items-center px-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 rounded-md hover:bg-claude-button-hover"
        onClick={toggleSidebar}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 12L23 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 5L23 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 19L23 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
    </header>
  );
};

export default StatusBar;
