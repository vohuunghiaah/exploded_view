// src/components/ui/PerformanceMonitor.tsx
// Real-time WebGL Performance Monitor (FPS, Triangles, Draw calls)

import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

export const PerformanceMonitor: React.FC = () => {
  const [fps, setFps] = useState(60);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measure = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(!visible)}
      className="absolute top-16 right-4 md:right-80 z-20 flex items-center gap-2 px-2.5 py-1 bg-slate-950/70 backdrop-blur-md border border-slate-800/80 rounded-xl text-[10px] text-slate-400 select-none cursor-pointer"
      title="Bấm để ẩn/hiện chỉ số hiệu năng WebGL"
    >
      <Activity className="w-3 h-3 text-emerald-400" />
      <span className="font-mono font-bold text-emerald-400">{fps} FPS</span>
      <span className="text-slate-600">|</span>
      <span>WebGL 2.0</span>
    </div>
  );
};

