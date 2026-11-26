import React from 'react';
import { ProjectContentItem } from '../types/content';
import { CodeBlock } from './CodeBlock';
import {
  ExternalLink,
  Star,
  GitBranch,
  ShieldCheck,
  Layers,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

interface ProjectCardProps {
  item: ProjectContentItem;
  sequenceNumber: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  item,
  sequenceNumber,
}) => {
  return (
    <article className="w-full bg-[#10121b] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm transition-all hover:border-slate-700/80">
      {/* Top Bar with GitHub Brand and Stars */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border bg-purple-500/10 border-purple-500/20 text-purple-400">
            <GitBranch className="w-3.5 h-3.5" />
            <span>GITHUB OPEN SOURCE</span>
          </span>

          {item.stars && (
            <span className="inline-flex items-center space-x-1.5 text-xs font-mono font-semibold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{item.stars}</span>
            </span>
          )}

          <span className="text-xs font-mono font-medium text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
            {item.license}
          </span>
        </div>

        <div className="text-xs font-mono text-slate-500">
          <span>Stream item #{sequenceNumber}</span>
        </div>
      </div>

      {/* Project Header */}
      <div className="mt-5">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          {item.title}
        </h2>
        <p className="text-slate-400 text-base mt-1.5 leading-relaxed font-sans">
          {item.tagline}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs font-mono text-purple-300 bg-purple-950/40 px-2.5 py-0.5 rounded border border-purple-800/50">
            {item.topic}
          </span>
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono text-slate-400 bg-slate-800/30 px-2 py-0.5 rounded border border-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <section className="mt-6 bg-[#141724]/90 rounded-xl p-5 border border-slate-800/80 text-slate-200 leading-relaxed text-[15px]">
        {item.description}
      </section>

      {/* Architecture & Design */}
      <section className="mt-6">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Architecture & Core Mechanics</span>
        </div>
        <div className="bg-[#0d0f17] rounded-xl p-4 sm:p-5 border border-slate-800 text-slate-300 leading-relaxed text-[14.5px]">
          {item.architecture}
        </div>
      </section>

      {/* Key Highlights / Features */}
      <section className="mt-6">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Key Features & Capabilities
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {item.features.map((feat, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-2.5 bg-[#0d0f17]/70 p-3 rounded-xl border border-slate-800/70 text-xs font-sans text-slate-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Core Code Snippet */}
      <section className="mt-6">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span>{item.codeSnippetTitle}</span>
        </div>

        <CodeBlock
          code={item.codeSnippet}
          language={item.language}
          title={`${item.title} — ${item.codeSnippetTitle}`}
          showLineNumbers={true}
        />
      </section>

      {/* Footer Attribution */}
      <footer className="mt-6 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500 border-t border-slate-800/50">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Open Source Project Spotlight</span>
        </div>

        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 text-purple-400 hover:text-purple-300 hover:underline transition-colors"
        >
          <span>Explore Repository</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </footer>
    </article>
  );
};
