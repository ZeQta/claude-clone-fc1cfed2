
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from 'lucide-react';
import { ModelType } from '@/pages/Index';

interface ModelOption {
  name: ModelType;
  description: string;
  apiName: string;
}

const models: ModelOption[] = [
  { 
    name: "Claude 3.7 Sonnet", 
    description: "Our most intelligent model yet", 
    apiName: "claude-3-7-sonnet" 
  },
  { 
    name: "Claude 3.5 Sonnet", 
    description: "Balanced speed and capabilities", 
    apiName: "claude-3-5-sonnet" 
  },
];

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find the currently selected model object
  const currentModelObject = models.find(model => model.name === selectedModel) || models[0];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center justify-between gap-2 py-2 px-3 bg-transparent hover:bg-transparent text-white font-normal"
        >
          <span className="text-base">{currentModelObject.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-claude-input-bg border border-claude-button-hover">
        <div className="py-2">
          {models.map((model) => (
            <button
              key={model.name}
              className={`w-full flex items-start justify-between px-4 py-3 hover:bg-claude-button-hover text-left ${
                model.name === selectedModel ? "bg-claude-button-hover" : ""
              }`}
              onClick={() => {
                onModelChange(model.name);
                setIsOpen(false);
              }}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-white">{model.name}</span>
                </div>
                {model.description && (
                  <span className="text-claude-text-secondary text-sm">
                    {model.description}
                  </span>
                )}
              </div>
              {model.name === selectedModel && (
                <Check className="h-5 w-5 text-claude-coral" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ModelSelector;
