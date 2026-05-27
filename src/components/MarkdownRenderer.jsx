import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

/**
 * Beautiful styled GFM markdown parser in pure JS/JSX.
 */
export const MarkdownRenderer = ({ content, isStreaming }) => {
  return (
    <div 
      className={`prose prose-invert max-w-none text-zinc-300 leading-relaxed text-[14.5px] sm:text-[15px] space-y-3 sm:space-y-4 ${
        isStreaming ? 'streaming-cursor' : ''
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const isInline = !match;
            const codeString = String(children).replace(/\n$/, '');

            if (isInline) {
              return (
                <code 
                  className="bg-zinc-900 px-1.5 py-0.5 rounded text-brand-red font-mono text-[12px] sm:text-[13px] border border-zinc-800/80" 
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return <CodeBlock code={codeString} language={language} />;
          },
          
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 mt-6 sm:mt-8 mb-3 sm:mb-4 tracking-tight border-b border-zinc-800/60 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-semibold text-zinc-100 mt-5 sm:mt-6 mb-2 sm:mb-3 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-medium text-zinc-200 mt-4 sm:mt-5 mb-1.5 sm:mb-2 tracking-tight">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[14.5px] sm:text-[15px] text-zinc-300 leading-relaxed mb-3 sm:mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-1.5 text-[14.5px] sm:text-[15px] mb-3 sm:mb-4 text-zinc-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 sm:pl-5 space-y-1 sm:space-y-1.5 text-[14.5px] sm:text-[15px] mb-3 sm:mb-4 text-zinc-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-0.5 sm:pl-1 leading-relaxed">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-zinc-100">
              {children}
            </strong>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-brand-red hover:text-red-400 underline font-medium transition-colors"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-brand-red/50 pl-3 sm:pl-4 py-1 italic text-zinc-400 my-3 sm:my-4 bg-zinc-900/10 rounded-r-md">
              {children}
            </blockquote>
          ),
          
          table: ({ children }) => (
            <div className="overflow-x-auto w-full my-4 sm:my-6 border border-zinc-800/80 rounded-xl bg-zinc-950/20 glass-card">
              <table className="min-w-full divide-y divide-zinc-800/80 text-[13.5px] sm:text-[14px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-zinc-900/30 text-zinc-200">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-zinc-800/40">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-zinc-900/10 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 sm:px-4 py-2 sm:py-2.5 text-left font-semibold text-zinc-300 border-b border-zinc-800">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-zinc-400">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
export default MarkdownRenderer;
