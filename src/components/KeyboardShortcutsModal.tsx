import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Space  or  ↓  or  PageDown', desc: 'Smooth Scroll Down (Tap to step, hold to scroll continuously)' },
  { key: '↑ (Up Arrow)  or  PageUp', desc: 'Smooth Scroll Up' },
  { key: 'Hold Space / ↓', desc: 'Continuous Smooth Gliding at Slider Speed' },
  { key: 'Release key', desc: 'Stops Immediately with Zero Drift' },
  { key: '?', desc: 'Toggle this Shortcuts Guide' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-[#11131c] border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <Keyboard className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white font-sans">
              Keyboard Navigation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="mt-4 space-y-2.5">
          {SHORTCUTS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0d0f17] border border-slate-800/60 text-xs font-mono"
            >
              <span className="text-slate-300 font-sans">{item.desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-blue-300 font-bold shadow-sm whitespace-nowrap ml-2">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-800/60 text-center text-[11px] font-mono text-slate-500">
          Tip: Use the floating speed slider to adjust scroll speed from extremely slow (0.01) to fast (5.00).
        </div>
      </div>
    </div>
  );
};
