// src/components/ui/BottomBar.tsx
// Assembly Step-by-Step Controller & Camera Presets Quick-Bar

import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Camera,
} from 'lucide-react';
import type { ViewMode, CameraPreset } from '../../types/hardware';
import { ASSEMBLY_STEPS } from '../../data/assemblySteps';

interface BottomBarProps {
  viewMode: ViewMode;
  activeAssemblyStep: number; // 1 to 10
  onChangeAssemblyStep: (step: number) => void;
  isPlayingAssembly: boolean;
  onTogglePlayAssembly: () => void;
  assemblySpeed: number;
  onChangeAssemblySpeed: (speed: number) => void;
  cameraPreset: CameraPreset | null;
  onSelectCameraPreset: (preset: CameraPreset) => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  viewMode,
  activeAssemblyStep,
  onChangeAssemblyStep,
  isPlayingAssembly,
  onTogglePlayAssembly,
  assemblySpeed,
  onChangeAssemblySpeed,
  cameraPreset,
  onSelectCameraPreset,
}) => {
  const currentStepData = ASSEMBLY_STEPS[activeAssemblyStep - 1] || ASSEMBLY_STEPS[0];

  const presets: { id: CameraPreset; label: string }[] = [
    { id: 'isometric', label: '3/4 Chuẩn' },
    { id: 'front', label: 'Mặt Trước' },
    { id: 'rear', label: 'Mặt Sau' },
    { id: 'top', label: 'Nhìn Trên' },
    { id: 'bottom', label: 'Mặt Đáy' },
    { id: 'left', label: 'Cạnh Trái' },
    { id: 'right', label: 'Cạnh Phải' },
    { id: 'motherboard', label: 'Mainboard' },
    { id: 'cooling', label: 'Tản Nhiệt' },
  ];

  return (
    <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-col items-center gap-2 select-none pointer-events-none">
      {/* 1. ASSEMBLY STEP-BY-STEP CONTROLLER (Active in Assembly Mode) */}
      {viewMode === 'assembly' && (
        <div className="pointer-events-auto w-full max-w-3xl flex flex-col gap-2 p-3 bg-[#0b0f17]/95 backdrop-blur-md border border-slate-800/90 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
          {/* Step Narrative Line */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-cyan-900/60 text-cyan-400 font-bold border border-cyan-700/60 text-[11px]">
                {activeAssemblyStep}
              </span>
              <div>
                <span className="font-bold text-slate-200 mr-2">
                  {currentStepData.titleVi}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    currentStepData.cruFruType === 'CRU'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                      : 'bg-indigo-950/80 text-indigo-400 border-indigo-800'
                  }`}
                >
                  {currentStepData.cruFruType}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Bước {activeAssemblyStep} / {ASSEMBLY_STEPS.length}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug line-clamp-1 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/50">
            {currentStepData.actionVi}
          </p>

          {/* Stepper Buttons & Controls */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
            {/* Step Progress Pills */}
            <div className="flex items-center gap-1">
              {ASSEMBLY_STEPS.map((s) => (
                <button
                  key={s.stepNumber}
                  data-step={s.stepNumber}
                  onClick={() => onChangeAssemblyStep(s.stepNumber)}
                  className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${
                    s.stepNumber === activeAssemblyStep
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                      : s.stepNumber < activeAssemblyStep
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-900/40'
                      : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s.stepNumber}
                </button>
              ))}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onChangeAssemblyStep(Math.max(1, activeAssemblyStep - 1))}
                disabled={activeAssemblyStep <= 1}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300"
                title="Bước trước"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onTogglePlayAssembly}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-xs shadow-md shadow-cyan-600/30 hover:brightness-110"
              >
                {isPlayingAssembly ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Tạm Dừng</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Tự Động Chạy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onChangeAssemblyStep(Math.min(ASSEMBLY_STEPS.length, activeAssemblyStep + 1))}
                disabled={activeAssemblyStep >= ASSEMBLY_STEPS.length}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300"
                title="Bước tiếp theo"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onChangeAssemblyStep(1)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                title="Khởi động lại từ Bước 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-slate-400">Tốc độ:</span>
              {[0.5, 1.0, 1.5, 2.0].map((spd) => (
                <button
                  key={spd}
                  onClick={() => onChangeAssemblySpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    assemblySpeed === spd
                      ? 'bg-cyan-900 text-cyan-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. CAMERA SHOWCASE PRESETS BAR (ANIM-08) */}
      <div className="pointer-events-auto flex items-center gap-1 p-1.5 bg-[#0b0f17]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl">
        <div className="flex items-center gap-1 px-2 text-[11px] text-slate-400 font-medium border-r border-slate-800 mr-1">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Góc Quay</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {presets.map((p) => {
            const isCurrent = cameraPreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectCameraPreset(p.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
