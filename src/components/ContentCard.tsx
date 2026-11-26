import React from 'react';
import { RenderItem } from '../services/contentEngine';
import { ProblemCard } from './ProblemCard';
import { ProjectCard } from './ProjectCard';
import { TutorialCard } from './TutorialCard';
import { ProblemContentItem, ProjectContentItem, TutorialContentItem } from '../types/content';
import { ChevronDown } from 'lucide-react';

interface ContentCardProps {
  renderItem: RenderItem;
  index: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({ renderItem, index }) => {
  const { item } = renderItem;

  const renderContent = () => {
    switch (item.source) {
      case 'LeetCode':
      case 'GeeksforGeeks':
      case 'Codeforces':
        return (
          <ProblemCard
            item={item as ProblemContentItem}
            sequenceNumber={index + 1}
          />
        );

      case 'GitHub':
        return (
          <ProjectCard
            item={item as ProjectContentItem}
            sequenceNumber={index + 1}
          />
        );

      case 'Tutorial':
        return (
          <TutorialCard
            item={item as TutorialContentItem}
            sequenceNumber={index + 1}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {renderContent()}

      {/* Stream Flow Connector */}
      <div className="w-full flex flex-col items-center my-6 select-none opacity-40 hover:opacity-80 transition-opacity">
        <div className="w-px h-8 bg-gradient-to-b from-slate-700 to-blue-500/50" />
        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500 bg-[#0d0f17] px-3 py-1 rounded-full border border-slate-800">
          <ChevronDown className="w-3 h-3 text-blue-400 animate-bounce" />
          <span>Next in sequence</span>
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-blue-500/50 to-slate-700" />
      </div>
    </div>
  );
};
