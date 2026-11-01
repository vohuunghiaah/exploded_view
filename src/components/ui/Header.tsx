// src/components/ui/Header.tsx
import React from 'react';
import {
  Layers,
  Search,
  Maximize2,
  RotateCcw,
  Film,
  Compass,
  Cpu,
  Eye,
  Box,
  Wrench,
  Wind,
} from 'lucide-react';
import type { ViewMode } from '../../types/hardware';

interface HeaderProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onReplayCinematic: () => void;
  onToggleTour: () => void;
  tourActive: boolean;
  onResetView: () => void;
  onToggleFullscreen: () => void;
  coolingActive: boolean;
  onToggleCooling: () => void;
  onToggleRamSsdDemo: () => void;
  ramSsdDemoActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onChangeViewMode,
  onReplayCinematic,
  onToggleTour,
  tourActive,
  onResetView,
  onToggleFullscreen,
  coolingActive,
  onToggleCooling,
  onToggleRamSsdDemo,
  ramSsdDemoActive,
}) => {
  const modes: { id: ViewMode; labelVi: string; icon: React.ReactNode }[] = [
    { id: 'assembled', labelVi: 'Lắp Ráp', icon: <Box className="w-4 h-4" /> },
    { id: 'exploded', labelVi: 'Phân Rã 3D', icon: <Layers className="w-4 h-4" /> },
    { id: 'inspector', labelVi: 'Soi Linh Kiện', icon: <Search className="w-4 h-4" /> },
    { id: 'assembly', labelVi: 'Tháo Lắp HMM', icon: <Wrench className="w-4 h-4" /> },
    { id: 'xray', labelVi: 'Tia X (X-Ray)', icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-3 bg-[#0b0f17]/85 backdrop-blur-md border-b border-slate-800/80 select-none text-white">
      {/* Brand & Device Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 font-black text-sm tracking-wider">
          LOQ
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              LENOVO LOQ 15IAX9
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-700/50">
                Type 83GS (2024)
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400">
            Interactive 3D Exploded View & Hardware Maintenance Explorer
          </p>
        </div>
      </div>

      {/* Main View Mode Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner">
        {modes.map((m) => {
          const isActive = viewMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChangeViewMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {m.icon}
              <span>{m.labelVi}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Action Tools */}
      <div className="flex items-center gap-2">
        {/* Cooling Simulation Toggle */}
        <button
          onClick={onToggleCooling}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            coolingActive
              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/30'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Bật/Tắt mô phỏng luồng khí tản nhiệt Hyperchamber"
        >
          <Wind className={`w-3.5 h-3.5 ${coolingActive ? 'animate-spin' : ''}`} />
          <span>Tản Nhiệt</span>
        </button>

        {/* RAM/SSD Demo Toggle */}
        <button
          onClick={onToggleRamSsdDemo}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            ramSsdDemoActive
              ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/30'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Minh họa thao tác nâng cấp RAM & SSD góc 30°"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Nâng Cấp RAM/SSD</span>
        </button>

        {/* Guided Tour Toggle */}
        <button
          onClick={onToggleTour}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            tourActive
              ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-sm shadow-purple-500/30'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Chuyến tham quan kỹ thuật có thuyết minh 10 bước"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Tour Kỹ Thuật</span>
        </button>

        {/* Cinematic Replay */}
        <button
          onClick={onReplayCinematic}
          className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          title="Phát lại đoạn giới thiệu điện ảnh (Cinematic Intro)"
        >
          <Film className="w-4 h-4" />
        </button>

        {/* Reset Camera */}
        <button
          onClick={onResetView}
          className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          title="Đặt lại góc nhìn camera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          title="Toàn màn hình"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
