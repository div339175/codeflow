import React from 'react';
import { TutorialContentItem } from '../types/content';
import { CodeBlock } from './CodeBlock';
import {
  ExternalLink,
  BookOpen,
  Clock,
  Lightbulb,
  CheckCircle2,
  FileCode2,
  Compass,
} from 'lucide-react';

interface TutorialCardProps {
  item: TutorialContentItem;
  sequenceNumber: number;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({
  item,
  sequenceNumber,
}) => {
  return (
    <article className="w-full bg-[#10121b] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm transition-all hover:border-slate-700/80">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border bg-cyan-500/10 border-cyan-500/20 text-cyan-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>TUTORIAL & DEEP DIVE</span>
          </span>

          <span className="text-xs font-mono font-semibold text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
            {item.category}
          </span>

          <span className="inline-flex items-center space-x-1 text-xs font-mono text-slate-400 bg-slate-800/40 px-2.5 py-1 rounded-full border border-slate-800">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{item.readTime}</span>
          </span>
        </div>

        <div className="text-xs font-mono text-slate-500">
          <span>Stream item #{sequenceNumber}</span>
        </div>
      </div>

      {/* Title */}
      <div className="mt-5">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          {item.title}
        </h2>
        <p className="text-slate-300 text-base mt-2 leading-relaxed">
          {item.overview}
        </p>
      </div>

      {/* Key Concepts Grid */}
      <section className="mt-6">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Core Concepts</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {item.keyConcepts.map((concept, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-2.5 bg-[#0d0f17] p-3 rounded-xl border border-slate-800 text-xs font-sans text-slate-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <span>{concept}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Walkthrough */}
      <section className="mt-6">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>In-Depth Technical Breakdown</span>
        </div>
        <div className="bg-[#141724]/90 rounded-xl p-5 border border-slate-800/80 text-slate-200 leading-relaxed text-[15px] whitespace-pre-line font-sans">
          {item.detailedExplanation}
        </div>
      </section>

      {/* Code Demo */}
      <section className="mt-6">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1">
          <FileCode2 className="w-4 h-4 text-cyan-400" />
          <span>{item.codeSnippetTitle}</span>
        </div>

        <CodeBlock
          code={item.codeSnippet}
          language={item.language}
          title={item.codeSnippetTitle}
          showLineNumbers={true}
        />
      </section>

      {/* Key Takeaways */}
      {item.keyTakeaways && item.keyTakeaways.length > 0 && (
        <section className="mt-6">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            Key Engineering Takeaways
          </div>
          <div className="space-y-2">
            {item.keyTakeaways.map((takeaway, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 bg-[#0d0f17]/80 p-3 rounded-xl border border-slate-800 text-xs font-sans text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-6 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500 border-t border-slate-800/50">
        <div className="flex items-center space-x-2">
          <span>Production Architecture Guide</span>
        </div>

        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
        >
          <span>Official Documentation</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </footer>
    </article>
  );
};
