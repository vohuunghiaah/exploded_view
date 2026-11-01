// src/components/ui/CinematicIntroOverlay.tsx
// Cinematic Opening Sequence Overlay (ANIM-01)

import React from 'react';
import { Film, FastForward } from 'lucide-react';

interface CinematicIntroOverlayProps {
  active: boolean;
  onSkip: () => void;
}

export const CinematicIntroOverlay: React.FC<CinematicIntroOverlayProps> = ({
  active,
  onSkip,
}) => {
  if (!active) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between p-8 pointer-events-none select-none">
      {/* Top Tag */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/50 backdrop-blur-md text-cyan-400 text-xs font-semibold tracking-wider uppercase animate-pulse">
          <Film className="w-3.5 h-3.5" />
          <span>Cinematic Showcase</span>
        </div>

        <button
          onClick={onSkip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md text-xs font-medium transition-all shadow-lg pointer-events-auto"
        >
          <span>Bỏ qua giới thiệu</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center / Lower Hero Titles */}
      <div className="max-w-xl mx-auto text-center space-y-2 mb-12">
        <div className="inline-block px-3 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-cyan-400 text-[11px] font-mono tracking-widest uppercase">
          Lenovo Engineering 2024
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
          LENOVO LOQ 15IAX9
        </h1>
        <p className="text-sm md:text-base text-slate-300 font-medium drop-shadow-md">
          Khám phá không gian 3D tương tác cấu trúc phần cứng & hệ thống tản nhiệt Hyperchamber
        </p>
      </div>
    </div>
  );
};

