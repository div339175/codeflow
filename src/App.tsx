import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ContentEngine, RenderItem } from './services/contentEngine';
import { ContentCard } from './components/ContentCard';
import { ScrollSpeedControl } from './components/ScrollSpeedControl';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { useKeyboardSmoothScroll } from './hooks/useKeyboardSmoothScroll';
import { Code2, Layers, HelpCircle } from 'lucide-react';

export function App() {
  // Initialize Content Engine (batch size 3 sequential items per source sequence)
  const contentEngine = useMemo(() => new ContentEngine(3), []);
  const [items, setItems] = useState<RenderItem[]>(() => contentEngine.getInitialBatch(6));

  // Custom keyboard and button smooth scroll controller
  const {
    speed,
    setSpeed,
    onDownPressStart,
    onDownPressEnd,
    triggerDownStep,
  } = useKeyboardSmoothScroll({ initialSpeed: 0.10 });

  // Shortcuts modal
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Sentinel ref for infinite preloading
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Load next items into stream buffer
  const loadMoreContent = useCallback(() => {
    setItems((prev) => {
      const next1 = contentEngine.getNextItem();
      const next2 = contentEngine.getNextItem();
      return [...prev, next1, next2];
    });
  }, [contentEngine]);

  // Infinite preloading observer: triggers before reaching the bottom
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadMoreContent();
        }
      },
      {
        root: null,
        rootMargin: '1600px', // Buffer ahead so content is never empty
        threshold: 0.01,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMoreContent]);

  const contentStats = useMemo(() => contentEngine.getContentStats(), [contentEngine]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col items-center selection:bg-blue-600/30">
      {/* Clean, standard developer website header */}
      <header className="w-full border-b border-slate-800/80 bg-[#0d0f17]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold tracking-tight text-white font-mono">
                  CodeFlow
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                  STREAM
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Infinite Programming Feed
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="hidden sm:flex items-center space-x-2 text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>{contentStats.totalItems}+ Verified Items</span>
            </div>

            <button
              onClick={() => setIsShortcutsModalOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Centered Reading Column */}
      <main className="w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        {/* Stream Items List */}
        <div className="w-full space-y-2">
          {items.map((renderItem, index) => (
            <ContentCard
              key={renderItem.instanceId}
              renderItem={renderItem}
              index={index}
            />
          ))}
        </div>

        {/* Sentinel element to trigger infinite buffer expansion */}
        <div
          ref={sentinelRef}
          className="w-full py-12 flex flex-col items-center justify-center text-slate-500 text-xs font-mono space-y-2"
        >
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span>Loading next sequential programming content...</span>
        </div>
      </main>

      {/* Small Clean Floating Scroll Speed Controller with On-Screen Down Button */}
      <ScrollSpeedControl
        speed={speed}
        setSpeed={setSpeed}
        onDownPressStart={onDownPressStart}
        onDownPressEnd={onDownPressEnd}
        triggerDownStep={triggerDownStep}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
}

export default App;
