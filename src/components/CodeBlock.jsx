import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

/**
 * Windowed, copyable terminal Chrome wrapper for code elements in pure JS/JSX.
 */
export const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const getHighlightedCode = () => {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language }).value;
      } catch (e) {
        console.warn('highlight.js error, falling back to auto-highlight:', e);
      }
    }
    
    try {
      return hljs.highlightAuto(code).value;
    } catch {
      return code;
    }
  };

  const highlightedHtml = getHighlightedCode();

  return (
    <div className="relative my-4 sm:my-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80 text-sm font-mono shadow-2xl glass-card">
      {/* Codeblock Window Header */}
      <div className="flex items-center justify-between bg-zinc-900/60 px-3 sm:px-4 py-2 text-xs text-zinc-400 border-b border-zinc-800/80 select-none">
        <div className="flex items-center gap-1.5">
          {/* Decorative terminal dots */}
          <div className="flex gap-1.5 mr-2">
            <span className="w-2 h-2 rounded-full bg-red-500/60" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <span className="w-2 h-2 rounded-full bg-green-500/60" />
          </div>
          <span className="font-sans uppercase tracking-wider font-semibold text-[9px] sm:text-[10px] text-zinc-500">
            {language || 'code'}
          </span>
        </div>
        
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-zinc-200 transition-all py-1 px-2 rounded-md hover:bg-zinc-800 active:scale-95 text-zinc-400 font-sans cursor-pointer"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium text-[10px] sm:text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="text-[10px] sm:text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Codeblock Body */}
      <div className="p-3 sm:p-4 overflow-x-auto font-mono text-[12.5px] sm:text-[13.5px] leading-relaxed text-zinc-100 max-h-[450px] sm:max-h-[500px]">
        <pre className="m-0">
          <code 
            className="hljs" 
            dangerouslySetInnerHTML={{ __html: highlightedHtml }} 
          />
        </pre>
      </div>
    </div>
  );
};
export default CodeBlock;
