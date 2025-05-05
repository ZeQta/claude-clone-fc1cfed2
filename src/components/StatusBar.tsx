
import React from 'react';

interface StatusBarProps {
  isPro?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ isPro = false }) => {
  return (
    <div className="bg-black bg-opacity-50 backdrop-blur-md py-2 px-4 flex items-center justify-between">
      <button className="h-6 w-6 flex items-center justify-center rounded">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 12L23 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 5L23 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 19L23 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <span className="text-white text-sm">
          {isPro ? "Pro plan" : "Free plan"}
        </span>
        <span className="text-sm">•</span>
        <span className="text-blue-400 text-sm">Upgrade</span>
      </div>
    </div>
  );
};

export default StatusBar;
