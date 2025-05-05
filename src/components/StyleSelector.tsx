
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from 'lucide-react';
import { StyleType } from '@/pages/Index';

interface StyleOption {
  name: StyleType;
  icon?: React.ReactNode;
}

const styles: StyleOption[] = [
  { name: "Normal" },
  { name: "Concise" },
  { name: "Explanatory" },
  { name: "Formal" },
];

interface StyleSelectorProps {
  selectedStyle: StyleType;
  onStyleChange: (style: StyleType) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-10 w-10 rounded-lg bg-transparent hover:bg-claude-button-hover"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 7.8c0 3.1-2 6.2-5.1 6.2-3.1 0-5.2-3-5.2-6.1 0-3.1 1.8-5.9 4.9-5.9 3.1 0 5.4 2.7 5.4 5.8zm-5.1 8.2c3.4 0 10.1 1.7 10.1 5v3H2v-3c0-3.3 6.6-5 9.9-5zM3.7 17c1.7 1 6.5 1.9 6.5 1.9s4.9-.9 6.6-1.9H3.7z" fill="currentColor"/>
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 bg-claude-input-bg border border-claude-button-hover">
        <div className="py-2">
          {styles.map((style) => (
            <button
              key={style.name}
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-claude-button-hover text-left ${
                style.name === selectedStyle ? "bg-claude-button-hover" : ""
              }`}
              onClick={() => {
                onStyleChange(style.name);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 7.8c0 3.1-2 6.2-5.1 6.2-3.1 0-5.2-3-5.2-6.1 0-3.1 1.8-5.9 4.9-5.9 3.1 0 5.4 2.7 5.4 5.8zm-5.1 8.2c3.4 0 10.1 1.7 10.1 5v3H2v-3c0-3.3 6.6-5 9.9-5zM3.7 17c1.7 1 6.5 1.9 6.5 1.9s4.9-.9 6.6-1.9H3.7z" fill="currentColor"/>
                </svg>
                <span className="text-white">{style.name}</span>
              </div>
              {style.name === selectedStyle && (
                <Check className="h-5 w-5 text-claude-coral" />
              )}
            </button>
          ))}
          <div className="border-t border-claude-button-hover mt-2 pt-2 px-4">
            <button className="flex items-center gap-2 py-2 text-claude-text-secondary hover:text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Create & edit styles
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default StyleSelector;
