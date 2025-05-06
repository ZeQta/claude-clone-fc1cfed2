
import React from 'react';
import ClaudeLogo from './ClaudeLogo';
import { Sparkles } from 'lucide-react';

interface ClaudeHeaderProps {
  userName: string;
}

const ClaudeHeader: React.FC<ClaudeHeaderProps> = ({ userName }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <div className="flex items-center justify-center">
        <ClaudeLogo />
      </div>
      <h1 className="text-4xl md:text-5xl font-serif text-white text-center">
        <Sparkles className="claude-sunburst mr-2 text-lg inline-block" size={24} />
        {getGreeting()}, {userName}
      </h1>
    </div>
  );
};

export default ClaudeHeader;
