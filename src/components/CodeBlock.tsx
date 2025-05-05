
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHtmlPreviewable = language === 'html' || language === 'markup';

  return (
    <div className="relative my-4 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-claude-button-hover px-4 py-2">
        <div className="text-sm text-claude-text-secondary">
          {language}
        </div>
        <div className="flex gap-2">
          {isHtmlPreviewable && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-claude-input-bg"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <X size={16} /> : <Play size={16} />}
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-claude-input-bg"
            onClick={copyToClipboard}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
      </div>
      
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          padding: '1rem',
          backgroundColor: '#121212',
        }}
      >
        {value}
      </SyntaxHighlighter>

      {showPreview && isHtmlPreviewable && (
        <div className="border-t border-claude-button-hover bg-claude-input-bg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-white">Preview</h3>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-white hover:bg-claude-button-hover"
              onClick={() => setShowPreview(false)}
            >
              <X size={14} />
            </Button>
          </div>
          <div className="bg-white rounded p-4 text-black">
            <iframe
              srcDoc={value}
              title="HTML Preview"
              className="w-full min-h-[200px] border-0"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
