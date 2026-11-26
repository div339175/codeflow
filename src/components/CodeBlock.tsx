import React, { useState, useMemo } from 'react';
import Prism from '../utils/prism';
import { Copy, Check, Code2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
}

// Map human labels to Prism grammar IDs
const languageMap: Record<string, string> = {
  'c++': 'cpp',
  'cpp': 'cpp',
  'python': 'python',
  'py': 'python',
  'java': 'java',
  'javascript': 'javascript',
  'js': 'javascript',
  'typescript': 'typescript',
  'ts': 'typescript',
  'go': 'go',
  'golang': 'go',
  'rust': 'rust',
  'rs': 'rust',
};

// Language badge colors
const languageBadges: Record<string, { bg: string; text: string; border: string }> = {
  'c++': { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-800/40' },
  'cpp': { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-800/40' },
  'python': { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800/40' },
  'java': { bg: 'bg-orange-950/40', text: 'text-orange-400', border: 'border-orange-800/40' },
  'typescript': { bg: 'bg-sky-950/40', text: 'text-sky-400', border: 'border-sky-800/40' },
  'javascript': { bg: 'bg-yellow-950/40', text: 'text-yellow-300', border: 'border-yellow-800/40' },
  'go': { bg: 'bg-cyan-950/40', text: 'text-cyan-400', border: 'border-cyan-800/40' },
  'rust': { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-800/40' },
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  title,
  showLineNumbers = true,
}) => {
  const [copied, setCopied] = useState(false);

  const cleanLang = (language || 'plaintext').toLowerCase();
  const prismLang = languageMap[cleanLang] || 'clike';

  const badgeStyle = languageBadges[cleanLang] || {
    bg: 'bg-slate-800/50',
    text: 'text-slate-300',
    border: 'border-slate-700/50',
  };

  // Perform Prism syntax highlighting
  const highlightedHtml = useMemo(() => {
    try {
      const grammar = Prism.languages[prismLang] || Prism.languages.clike || Prism.languages.plain;
      return Prism.highlight(code.trim(), grammar, prismLang);
    } catch {
      return code.trim();
    }
  }, [code, prismLang]);

  // Split lines for line numbers
  const lines = useMemo(() => {
    return highlightedHtml.split('\n');
  }, [highlightedHtml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-slate-800/80 bg-[#0d0f17] shadow-xl transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141724] border-b border-slate-800/80 select-none">
        <div className="flex items-center space-x-2.5">
          <div className="flex space-x-1.5 mr-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <Code2 className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono font-medium text-slate-300">
            {title || `${language.toUpperCase()} Solution`}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Language tag */}
          <span
            className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded-md border font-semibold tracking-wider ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
          >
            {language}
          </span>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 rounded text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code body with line numbers */}
      <div className="overflow-x-auto p-4 text-[14.5px] font-mono leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((lineHtml, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                {showLineNumbers && (
                  <td className="w-10 pr-4 text-right text-slate-600 select-none text-xs align-top pt-[2px]">
                    {idx + 1}
                  </td>
                )}
                <td className="text-slate-200 whitespace-pre">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: lineHtml || '&nbsp;',
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
