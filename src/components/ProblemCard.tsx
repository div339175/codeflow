import React from 'react';
import { ProblemContentItem } from '../types/content';
import { CodeBlock } from './CodeBlock';
import {
  ExternalLink,
  Clock,
  Database,
  Tag,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Cpu,
} from 'lucide-react';

interface ProblemCardProps {
  item: ProblemContentItem;
  sequenceNumber: number;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  item,
  sequenceNumber,
}) => {
  // Difficulty styling
  const difficultyStyles: Record<string, { bg: string; text: string; border: string }> = {
    Easy: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-700/50' },
    Medium: { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-700/50' },
    Hard: { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-700/50' },
  };

  const diffStyle = difficultyStyles[item.difficulty] || difficultyStyles['Medium'];

  // Source branding styles
  const sourceBranding: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    LeetCode: {
      label: 'LEETCODE',
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      text: 'text-amber-400',
      dot: 'bg-amber-500',
    },
    GeeksforGeeks: {
      label: 'GEEKSFORGEEKS',
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      text: 'text-emerald-400',
      dot: 'bg-emerald-500',
    },
    Codeforces: {
      label: 'CODEFORCES',
      bg: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
      text: 'text-sky-400',
      dot: 'bg-sky-500',
    },
  };

  const branding = sourceBranding[item.source] || sourceBranding['LeetCode'];

  return (
    <article className="w-full bg-[#10121b] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm transition-all hover:border-slate-700/80">
      {/* Top Source and Sequence Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border ${branding.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${branding.dot} animate-pulse`} />
            <span>{branding.label}</span>
          </span>

          {item.problemNumber && (
            <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
              #{item.problemNumber}
            </span>
          )}

          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}
          >
            {item.difficulty}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
          <span className="text-slate-400">Stream item #{sequenceNumber}</span>
        </div>
      </div>

      {/* Title & Topic Section */}
      <div className="mt-5">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          {item.title}
        </h2>

        <div className="flex flex-wrap items-center gap-2 mt-2.5">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-mono text-slate-300 bg-slate-800/40 px-2 py-0.5 rounded border border-slate-700/40">
            {item.topic}
          </span>
          {item.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono text-slate-400 bg-slate-800/30 px-2 py-0.5 rounded border border-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Problem Statement */}
      <section className="mt-6">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <span>Problem Statement</span>
        </div>
        <div className="bg-[#141724]/90 rounded-xl p-4 sm:p-5 border border-slate-800/80 text-slate-200 leading-relaxed text-[15px] whitespace-pre-line">
          {item.problem}
        </div>
      </section>

      {/* Examples if present */}
      {item.examples && item.examples.length > 0 && (
        <section className="mt-6">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            Examples
          </div>
          <div className="space-y-3">
            {item.examples.map((ex, idx) => (
              <div
                key={idx}
                className="bg-[#0d0f17] rounded-xl p-4 border border-slate-800 text-sm font-mono space-y-1.5"
              >
                <div className="text-slate-400">
                  <span className="text-slate-300 font-semibold">Example {idx + 1}:</span>
                </div>
                <div className="text-slate-200">
                  <span className="text-slate-400">Input: </span>
                  <span className="text-sky-300">{ex.input}</span>
                </div>
                <div className="text-slate-200">
                  <span className="text-slate-400">Output: </span>
                  <span className="text-emerald-300">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div className="text-slate-400 pt-1 text-xs font-sans italic border-t border-slate-800/60 mt-1">
                    Explanation: {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Constraints if present */}
      {item.constraints && item.constraints.length > 0 && (
        <section className="mt-5">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Constraints
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-400 bg-[#0d0f17]/60 p-3.5 rounded-xl border border-slate-800/60">
            {item.constraints.map((c, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/80" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Approach / Logic */}
      <section className="mt-6">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Approach & Intuition</span>
        </div>
        <div className="bg-[#141724]/90 rounded-xl p-4 sm:p-5 border border-slate-800/80 text-slate-300 leading-relaxed text-[15px]">
          {item.approach}
        </div>
      </section>

      {/* Solution Code Block */}
      <section className="mt-6">
        <div className="flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>{item.language} Solution</span>
          </div>
        </div>

        <CodeBlock
          code={item.solution}
          language={item.language}
          title={`${item.title} — ${item.language}`}
          showLineNumbers={true}
        />
      </section>

      {/* Complexity Analysis */}
      <section className="mt-6 pt-5 border-t border-slate-800/80">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Complexity Analysis
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start space-x-3 bg-[#0d0f17] p-3.5 rounded-xl border border-slate-800">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 font-semibold uppercase">
                Time Complexity
              </div>
              <div className="text-sm font-mono font-medium text-slate-200 mt-0.5">
                {item.complexity.time}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-[#0d0f17] p-3.5 rounded-xl border border-slate-800">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 font-semibold uppercase">
                Space Complexity
              </div>
              <div className="text-sm font-mono font-medium text-slate-200 mt-0.5">
                {item.complexity.space}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Source Attribution Footer */}
      <footer className="mt-6 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500 border-t border-slate-800/50">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verified Solution & Analysis</span>
        </div>

        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 hover:underline transition-colors"
        >
          <span>View on {item.source}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </footer>
    </article>
  );
};
