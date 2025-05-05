
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <CodeBlock
              language={match[1]}
              value={String(children).replace(/\n$/, '')}
            />
          ) : (
            <code className="bg-claude-button-hover px-1 py-0.5 rounded text-claude-coral" {...props}>
              {children}
            </code>
          );
        },
        h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold mt-5 mb-2">{children}</h3>,
        h4: ({ children }) => <h4 className="text-base font-bold mt-4 mb-2">{children}</h4>,
        p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        a: ({ href, children }) => (
          <a href={href} className="text-claude-coral hover:underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-claude-button-hover pl-4 my-4 italic">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border-collapse border border-claude-button-hover">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-claude-button-hover">{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => <tr className="border-b border-claude-button-hover">{children}</tr>,
        th: ({ children }) => <th className="py-2 px-4 text-left">{children}</th>,
        td: ({ children }) => <td className="py-2 px-4">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
