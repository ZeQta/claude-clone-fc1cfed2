
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from 'lucide-react';

interface ModelOption {
  name: string;
  description: string;
  isPro?: boolean;
}

const models: ModelOption[] = [
  { name: "Claude 3.7 Sonnet", description: "Our most intelligent model yet", isPro: true },
  { name: "Claude 3.5 Haiku", description: "Fastest model for daily tasks" },
  { name: "Claude 3.5 Sonnet (Oct 2024)", description: "" },
  { name: "Claude 3 Opus", description: "" },
];

const ModelSelector: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelOption>(models[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center justify-between gap-2 py-2 px-3 bg-transparent hover:bg-transparent text-white font-normal"
        >
          <span className="text-base">{selectedModel.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-claude-input-bg border border-claude-button-hover">
        <div className="py-2">
          {models.map((model) => (
            <button
              key={model.name}
              className={`w-full flex items-start justify-between px-4 py-3 hover:bg-claude-button-hover text-left ${
                model === selectedModel ? "bg-claude-button-hover" : ""
              }`}
              onClick={() => {
                setSelectedModel(model);
                setIsOpen(false);
              }}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-white">{model.name}</span>
                  {model.isPro && (
                    <span className="px-1.5 py-0.5 text-xs bg-claude-pro-badge rounded text-white">
                      PRO
                    </span>
                  )}
                </div>
                {model.description && (
                  <span className="text-claude-text-secondary text-sm">
                    {model.description}
                  </span>
                )}
              </div>
              {model === selectedModel && (
                <Check className="h-5 w-5 text-claude-coral" />
              )}
            </button>
          ))}
          <div className="border-t border-claude-button-hover mt-2 pt-2 px-4">
            <button className="text-claude-text-secondary py-2 text-sm hover:text-white">
              More models
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ModelSelector;
