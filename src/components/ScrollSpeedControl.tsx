import React, { useState } from 'react';
import { Sliders, EyeOff, Eye, Minus, Plus, ArrowDown } from 'lucide-react';

interface ScrollSpeedControlProps {
  speed: number;
  setSpeed: (speed: number) => void;
  onDownPressStart: () => void;
  onDownPressEnd: () => void;
  triggerDownStep: () => void;
}

const PRESETS = [
  { label: 'Extremely Slow', value: 0.01 },
  { label: 'Very Slow', value: 0.05 },
  { label: 'Slow', value: 0.10 },
  { label: 'Normal', value: 0.50 },
  { label: 'Fast', value: 1.00 },
];

export const ScrollSpeedControl: React.FC<ScrollSpeedControlProps> = ({
  speed,
  setSpeed,
  onDownPressStart,
  onDownPressEnd,
  triggerDownStep,
}) => {
  const [isHidden, setIsHidden] = useState(false);

  const handleClickDown = () => {
    triggerDownStep();
  };

  /**
   * Non-linear mapping:
   * Slider range 0 to 100
   * 0 - 50  => 0.01 to 0.20 (super fine control for recording!)
   * 50 - 100 => 0.20 to 5.00
   */
  const speedToSlider = (s: number): number => {
    if (s <= 0.20) {
      return ((s - 0.01) / (0.20 - 0.01)) * 50;
    } else {
      return 50 + ((s - 0.20) / (5.00 - 0.20)) * 50;
    }
  };

  const sliderToSpeed = (val: number): number => {
    if (val <= 50) {
      const res = 0.01 + (val / 50) * (0.20 - 0.01);
      return Number(res.toFixed(2));
    } else {
      const res = 0.20 + ((val - 50) / 50) * (5.00 - 0.20);
      return Number(res.toFixed(2));
    }
  };

  const sliderPos = speedToSlider(Math.min(5.0, Math.max(0.01, speed)));

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSpeed(sliderToSpeed(val));
  };

  const adjustSpeed = (delta: number) => {
    const next = Math.max(0.01, Math.min(5.0, Number((speed + delta).toFixed(2))));
    setSpeed(next);
  };

  // If collapsed/hidden, show minimal pill with a quick Down button
  if (isHidden) {
    return (
      <div className="fixed bottom-5 right-5 z-40 flex items-center space-x-1.5 bg-[#12141e]/95 backdrop-blur-md px-2 py-1.5 rounded-full border border-slate-800 shadow-2xl text-xs font-mono select-none">
        <button
          onClick={handleClickDown}
          onMouseDown={onDownPressStart}
          onMouseUp={onDownPressEnd}
          onMouseLeave={onDownPressEnd}
          onTouchStart={onDownPressStart}
          onTouchEnd={onDownPressEnd}
          className="flex items-center space-x-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 active:scale-95 transition-all"
          title="Click to step down, hold to scroll"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span className="font-semibold">Scroll</span>
        </button>

        <button
          onClick={() => setIsHidden(false)}
          className="flex items-center space-x-1 text-slate-400 hover:text-slate-100 px-2 py-1 rounded-full hover:bg-slate-800 transition-colors"
          title="Show Scroll Speed Controls"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span>{speed.toFixed(2)}</span>
          <Eye className="w-3.5 h-3.5 ml-0.5 text-slate-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 w-72 sm:w-80 bg-[#11131c]/95 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 shadow-2xl shadow-black/80 select-none text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/70">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-mono font-semibold tracking-wide text-slate-300">
            Scroll Speed:{' '}
            <span className="text-blue-400 font-bold ml-1 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
              {speed.toFixed(2)}
            </span>
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => adjustSpeed(-0.01)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Decrease (-0.01)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => adjustSpeed(0.01)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Increase (+0.01)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsHidden(true)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-1"
            title="Hide controls (keyboard ↓ still works)"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="py-1">
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1 select-none">
          <span className="text-emerald-400 font-medium">VERY SLOW (0.01)</span>
          <span className="text-slate-400">NORMAL (0.50)</span>
          <span className="text-rose-400 font-medium">FAST (5.0)</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={sliderPos}
          onChange={handleSliderChange}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 focus:outline-none transition-all"
        />
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-800/60">
        {PRESETS.map((p) => {
          const isActive = Math.abs(speed - p.value) < 0.005;
          return (
            <button
              key={p.label}
              onClick={() => setSpeed(p.value)}
              className={`px-2 py-0.5 rounded text-[10.5px] font-mono transition-colors border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-500 font-semibold shadow-sm'
                  : 'bg-slate-800/50 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Scroll Down Button: Click to step down, or Hold to scroll continuously */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/60">
        <button
          onClick={handleClickDown}
          onMouseDown={onDownPressStart}
          onMouseUp={onDownPressEnd}
          onMouseLeave={onDownPressEnd}
          onTouchStart={onDownPressStart}
          onTouchEnd={onDownPressEnd}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 active:bg-blue-600/40 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-mono font-bold transition-all shadow-md active:scale-[0.98]"
          title="Click to scroll step, hold to scroll continuously"
        >
          <ArrowDown className="w-4 h-4 text-blue-400" />
          <span>↓ Scroll Down (Click or Hold)</span>
        </button>
        <p className="text-[10px] font-mono text-slate-500 text-center mt-1.5">
          Or press/hold <kbd className="px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">Space</kbd> or <kbd className="px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">↓</kbd> or <kbd className="px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">PageDown</kbd>. Stops instantly on release.
        </p>
      </div>
    </div>
  );
};
