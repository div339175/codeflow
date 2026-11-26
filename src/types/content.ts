export type ContentSourceType = 'LeetCode' | 'GeeksforGeeks' | 'Codeforces' | 'GitHub' | 'Tutorial';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface ComplexityInfo {
  time: string;
  space: string;
}

export interface ProblemContentItem {
  id: string;
  source: 'LeetCode' | 'GeeksforGeeks' | 'Codeforces';
  title: string;
  problemNumber?: number | string;
  difficulty: DifficultyLevel;
  topic: string;
  tags?: string[];
  problem: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints?: string[];
  approach: string;
  solution: string;
  language: 'C++' | 'Python' | 'Java' | 'JavaScript' | 'TypeScript' | 'Go' | 'Rust';
  complexity: ComplexityInfo;
  sourceUrl: string;
}

export interface ProjectContentItem {
  id: string;
  source: 'GitHub';
  title: string;
  tagline: string;
  stars?: string;
  license: string;
  topic: string;
  tags: string[];
  description: string;
  architecture: string;
  features: string[];
  codeSnippet: string;
  codeSnippetTitle: string;
  language: 'TypeScript' | 'JavaScript' | 'Rust' | 'Go' | 'C++' | 'Python';
  sourceUrl: string;
}

export interface TutorialContentItem {
  id: string;
  source: 'Tutorial';
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  readTime: string;
  overview: string;
  keyConcepts: string[];
  detailedExplanation: string;
  codeSnippet: string;
  codeSnippetTitle: string;
  language: 'TypeScript' | 'JavaScript' | 'Python' | 'Go' | 'Rust' | 'C++' | 'Java';
  complexity?: ComplexityInfo;
  keyTakeaways: string[];
  sourceUrl: string;
}

export type ContentItem = ProblemContentItem | ProjectContentItem | TutorialContentItem;

export interface SourceGroup {
  sourceType: ContentSourceType;
  items: ContentItem[];
}

export interface ScrollSpeedState {
  speed: number; // in pixels per frame
  isAutoScrolling: boolean;
  isPaused: boolean;
  isRecordingMode: boolean;
  areControlsHidden: boolean;
  isFullscreen: boolean;
}
