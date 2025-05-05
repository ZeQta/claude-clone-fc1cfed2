
import React from 'react';
import ClaudeLogo from './ClaudeLogo';

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
    <div className="flex flex-col items-center justify-center py-8 space-y-6">
      <ClaudeLogo />
      <h1 className="text-4xl font-serif text-white">
        <span className="claude-sunburst mr-2">★</span>
        {getGreeting()}, {userName}
      </h1>
    </div>
  );
};

export default ClaudeHeader;
