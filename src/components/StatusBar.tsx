
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';

interface StatusBarProps {
  toggleSidebar: () => void;
  userName: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ toggleSidebar, userName }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  return (
    <header className="bg-claude-dark-bg h-10 border-b border-claude-button-hover flex items-center justify-between px-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 rounded-md hover:bg-claude-button-hover"
        onClick={toggleSidebar}
      >
        <Menu size={18} />
      </Button>
      
      <div className="text-sm text-claude-text-secondary hidden sm:block">
        Good {getGreeting()}, {userName}
      </div>
      
      <div className="h-7 w-7" /> {/* Empty div for flex spacing */}
    </header>
  );
};

export default StatusBar;
