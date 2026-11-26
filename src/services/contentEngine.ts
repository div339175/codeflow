import { ContentItem, ContentSourceType, ProblemContentItem, ProjectContentItem, TutorialContentItem } from '../types/content';

import leetcodeJson from '../data/leetcode.json';
import gfgJson from '../data/gfg.json';
import codeforcesJson from '../data/codeforces.json';
import githubJson from '../data/github_projects.json';
import tutorialsJson from '../data/tutorials.json';

export interface RenderItem {
  instanceId: string;
  item: ContentItem;
  sourceIndex: number;
  batchSequenceIndex: number;
}

export class ContentEngine {
  private sources: Map<ContentSourceType, ContentItem[]> = new Map();
  private sourceIndices: Map<ContentSourceType, number> = new Map();
  private sourceOrder: ContentSourceType[] = [];
  private currentSourceIndex = 0;
  private currentBatchCount = 0;
  private batchSizePerSource = 3; // Number of sequential items to show per source sequence before switching
  private instanceCounter = 0;
  private lastYieldedId: string | null = null;

  constructor(batchSize = 3) {
    this.batchSizePerSource = batchSize;
    this.initData();
  }

  private initData(): void {
    this.sources.set('LeetCode', leetcodeJson as ProblemContentItem[]);
    this.sources.set('GeeksforGeeks', gfgJson as ProblemContentItem[]);
    this.sources.set('Codeforces', codeforcesJson as ProblemContentItem[]);
    this.sources.set('GitHub', githubJson as ProjectContentItem[]);
    this.sources.set('Tutorial', tutorialsJson as TutorialContentItem[]);

    // Initialize pointer for each source at 0
    this.sourceIndices.set('LeetCode', 0);
    this.sourceIndices.set('GeeksforGeeks', 0);
    this.sourceIndices.set('Codeforces', 0);
    this.sourceIndices.set('GitHub', 0);
    this.sourceIndices.set('Tutorial', 0);

    // Shuffle the source order initially (e.g. LeetCode -> GitHub -> GFG -> Tutorial -> Codeforces)
    this.randomizeSourceOrder();
  }

  /**
   * Randomizes the sequence of source groups, but preserves sequential items within each source!
   */
  public randomizeSourceOrder(): void {
    const allSources: ContentSourceType[] = [
      'LeetCode',
      'GeeksforGeeks',
      'Codeforces',
      'GitHub',
      'Tutorial',
    ];

    // Fisher-Yates shuffle on sources
    for (let i = allSources.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allSources[i], allSources[j]] = [allSources[j], allSources[i]];
    }

    this.sourceOrder = allSources;
    this.currentSourceIndex = 0;
    this.currentBatchCount = 0;
  }

  /**
   * Switches to the next source group sequentially from sourceOrder
   */
  private advanceToNextSource(): void {
    this.currentSourceIndex = (this.currentSourceIndex + 1) % this.sourceOrder.length;
    this.currentBatchCount = 0;

    // When we finish a complete round of all sources, re-shuffle the order for freshness
    if (this.currentSourceIndex === 0) {
      this.randomizeSourceOrder();
    }
  }

  /**
   * Retrieves the next item in the infinite stream:
   * 1. Preserves sequential order within the current source (Problem 1 -> 2 -> 3...)
   * 2. After batch size is reached or source finishes, switches to next source
   * 3. Loops around source items when exhausted
   * 4. Ensures no immediate duplicate item is shown
   */
  public getNextItem(): RenderItem {
    let attempts = 0;
    while (attempts < 20) {
      const currentSourceType = this.sourceOrder[this.currentSourceIndex];
      const items = this.sources.get(currentSourceType) || [];
      const itemPointer = this.sourceIndices.get(currentSourceType) || 0;

      if (items.length === 0) {
        this.advanceToNextSource();
        attempts++;
        continue;
      }

      // Check if current batch is complete: switch source if reached limit
      if (this.currentBatchCount >= this.batchSizePerSource) {
        this.advanceToNextSource();
        continue;
      }

      const item = items[itemPointer];

      // Update pointer for this source (sequential progression)
      const nextPointer = (itemPointer + 1) % items.length;
      this.sourceIndices.set(currentSourceType, nextPointer);

      // Increment batch counter for this source
      this.currentBatchCount++;

      // Prevent immediate duplicate if somehow single item
      if (item.id === this.lastYieldedId && items.length > 1) {
        attempts++;
        continue;
      }

      this.lastYieldedId = item.id;
      this.instanceCounter++;

      return {
        instanceId: `inst-${this.instanceCounter}-${item.id}`,
        item,
        sourceIndex: itemPointer,
        batchSequenceIndex: this.currentBatchCount,
      };
    }

    // Fallback if loop exceeded
    const fallbackItem = (leetcodeJson as ProblemContentItem[])[0];
    this.instanceCounter++;
    return {
      instanceId: `fallback-${this.instanceCounter}`,
      item: fallbackItem,
      sourceIndex: 0,
      batchSequenceIndex: 1,
    };
  }

  /**
   * Preloads a batch of upcoming items so the view is never empty
   */
  public getInitialBatch(count = 6): RenderItem[] {
    const batch: RenderItem[] = [];
    for (let i = 0; i < count; i++) {
      batch.push(this.getNextItem());
    }
    return batch;
  }

  /**
   * Returns metadata statistics about all loaded content
   */
  public getContentStats(): {
    totalItems: number;
    sources: { source: ContentSourceType; count: number }[];
  } {
    const sourcesStats = Array.from(this.sources.entries()).map(([source, items]) => ({
      source,
      count: items.length,
    }));
    const totalItems = sourcesStats.reduce((acc, curr) => acc + curr.count, 0);

    return {
      totalItems,
      sources: sourcesStats,
    };
  }
}
