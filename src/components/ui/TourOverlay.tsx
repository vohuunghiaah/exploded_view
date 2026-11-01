// src/components/ui/TourOverlay.tsx
// Guided Technical Tour Overlay (ANIM-10)

import React from 'react';
import {
  Compass,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
} from 'lucide-react';
import { TOUR_SCENES } from '../../data/tourScenes';

interface TourOverlayProps {
  active: boolean;
  currentSceneIndex: number;
  onNextScene: () => void;
  onPrevScene: () => void;
  onCloseTour: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  tourProgress: number; // 0 to 1 for scene progress bar
}

export const TourOverlay: React.FC<TourOverlayProps> = ({
  active,
  currentSceneIndex,
  onNextScene,
  onPrevScene,
  onCloseTour,
  isPlaying,
  onTogglePlay,
  tourProgress,
}) => {
  if (!active) return null;

  const scene = TOUR_SCENES[currentSceneIndex] || TOUR_SCENES[0];

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 pointer-events-none select-none">
      <div className="pointer-events-auto bg-[#0b0f17]/95 backdrop-blur-xl border border-purple-500/50 rounded-2xl shadow-2xl p-4 text-white animate-in fade-in slide-in-from-top-4 duration-300">
        {/* Header Tag & Close */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/60 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
              <Compass className="w-3 h-3 text-purple-400 animate-spin" />
              CHUYẾN THAM QUAN KỸ THUẬT
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {currentSceneIndex + 1} / {TOUR_SCENES.length}
            </span>
          </div>

          <button
            onClick={onCloseTour}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Dừng và thoát Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scene Title & Vietnamese Narrative */}
        <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
          {scene.titleVi}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-3 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80">
          {scene.descriptionVi}
        </p>

        {/* Scene Progress Bar */}
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-100"
            style={{ width: `${tourProgress * 100}%` }}
          />
        </div>

        {/* Tour Control Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevScene}
              disabled={currentSceneIndex === 0}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
              title="Cảnh trước"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onTogglePlay}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Tạm Dừng' : 'Tiếp Tục'}</span>
            </button>

            <button
              onClick={onNextScene}
              disabled={currentSceneIndex === TOUR_SCENES.length - 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
              title="Cảnh tiếp"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onCloseTour}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Bỏ qua Tour
          </button>
        </div>
      </div>
    </div>
  );
};
