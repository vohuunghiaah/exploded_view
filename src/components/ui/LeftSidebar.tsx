// src/components/ui/LeftSidebar.tsx
import React, { useState } from 'react';
import {
  Sliders,
  ChevronLeft,
  ChevronRight,
  Search,
  Monitor,
  Box,
  Cpu,
  Flame,
  HardDrive,
  BatteryCharging,
  Volume2,
  CheckCircle,
  AlertCircle,
  Wind,
} from 'lucide-react';
import type { ViewMode, ComponentGroup } from '../../types/hardware';
import { COMPONENTS_DATA } from '../../data/components';

interface LeftSidebarProps {
  viewMode: ViewMode;
  explodeAmount: number;
  onChangeExplodeAmount: (amount: number) => void;
  lidAngle: number;
  onChangeLidAngle: (angle: number) => void;
  shellOpacity: number;
  onChangeShellOpacity: (opacity: number) => void;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  coolingSettings: {
    active: boolean;
    rpm: number;
    showAirflow: boolean;
    showHeatmap: boolean;
  };
  onChangeCoolingSettings: (settings: any) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  viewMode: _viewMode,
  explodeAmount,
  onChangeExplodeAmount,
  lidAngle,
  onChangeLidAngle,
  shellOpacity,
  onChangeShellOpacity,
  selectedComponentId,
  onSelectComponent,
  coolingSettings,
  onChangeCoolingSettings,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<ComponentGroup | 'all'>('all');

  const groups: { id: ComponentGroup | 'all'; labelVi: string; icon: React.ReactNode }[] = [
    { id: 'all', labelVi: 'Tất cả', icon: <Box className="w-3.5 h-3.5" /> },
    { id: 'display', labelVi: 'Màn hình', icon: <Monitor className="w-3.5 h-3.5" /> },
    { id: 'chassis', labelVi: 'Khung vỏ', icon: <Box className="w-3.5 h-3.5" /> },
    { id: 'motherboard', labelVi: 'Bo mạch', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'thermal', labelVi: 'Tản nhiệt', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'components', labelVi: 'RAM & SSD', icon: <HardDrive className="w-3.5 h-3.5" /> },
    { id: 'battery', labelVi: 'Nguồn & Pin', icon: <BatteryCharging className="w-3.5 h-3.5" /> },
    { id: 'audio', labelVi: 'Âm thanh', icon: <Volume2 className="w-3.5 h-3.5" /> },
  ];

  const filteredComponents = Object.values(COMPONENTS_DATA).filter((comp) => {
    const matchesGroup = selectedGroup === 'all' || comp.group === selectedGroup;
    const matchesSearch =
      comp.nameVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div
      className={`absolute top-16 left-4 bottom-16 z-10 flex transition-all duration-300 ${
        collapsed ? 'w-10' : 'w-80'
      }`}
    >
      {/* Sidebar Main Card */}
      <div
        className={`flex flex-col w-full h-full bg-[#0b0f17]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden ${
          collapsed ? 'hidden' : 'flex'
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Bảng Điều Khiển Mô Hình
            </span>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            title="Thu nhỏ thanh điều khiển"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-slate-800/60">
          {/* SECTION 1: Exploded View Slider (0% - 100%) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-cyan-400" />
                Mức độ phân rã 3D (Explode)
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono text-[11px]">
                {Math.round(explodeAmount * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explodeAmount}
              onChange={(e) => onChangeExplodeAmount(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <button
                onClick={() => onChangeExplodeAmount(0)}
                className="hover:text-cyan-400 font-medium transition-colors"
              >
                0% Lắp Ráp
              </button>
              <button
                onClick={() => onChangeExplodeAmount(0.5)}
                className="hover:text-cyan-400 font-medium transition-colors"
              >
                50% Trung Gian
              </button>
              <button
                onClick={() => onChangeExplodeAmount(1)}
                className="hover:text-cyan-400 font-medium transition-colors"
              >
                100% Phân Rã
              </button>
            </div>
          </div>

          {/* SECTION 2: Screen Hinge Angle */}
          <div className="space-y-2 pt-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                Góc mở bản lề màn hình
              </span>
              <span className="font-mono text-blue-400 text-[11px]">{Math.round(lidAngle)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="1"
              value={lidAngle}
              onChange={(e) => onChangeLidAngle(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <button onClick={() => onChangeLidAngle(0)} className="hover:text-blue-400">
                0° Đóng
              </button>
              <button onClick={() => onChangeLidAngle(115)} className="hover:text-blue-400 text-blue-300 font-semibold">
                115° Chuẩn
              </button>
              <button onClick={() => onChangeLidAngle(180)} className="hover:text-blue-400">
                180° Mở phẳng
              </button>
            </div>
          </div>

          {/* SECTION 3: Shell Opacity Control */}
          <div className="space-y-2 pt-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <span>Độ trong suốt vỏ máy</span>
              <span className="font-mono text-slate-400 text-[11px]">{Math.round(shellOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={shellOpacity}
              onChange={(e) => onChangeShellOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
            />
          </div>

          {/* SECTION 4: Cooling System Controls */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                Tản Nhiệt Hyperchamber
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono">
                {coolingSettings.active ? `${coolingSettings.rpm} RPM` : 'TẮT'}
              </span>
            </div>

            {/* Fan Presets */}
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: 'Yên Tĩnh', rpm: 1800 },
                { label: 'Cân Bằng', rpm: 2800 },
                { label: 'Cực Đại', rpm: 4200 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() =>
                    onChangeCoolingSettings({
                      ...coolingSettings,
                      active: true,
                      rpm: p.rpm,
                    })
                  }
                  className={`py-1 text-[10px] font-medium rounded border transition-all ${
                    coolingSettings.active && coolingSettings.rpm === p.rpm
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Cooling Feature Toggles */}
            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer text-[11px]">
                <input
                  type="checkbox"
                  checked={coolingSettings.showAirflow}
                  onChange={(e) =>
                    onChangeCoolingSettings({
                      ...coolingSettings,
                      showAirflow: e.target.checked,
                    })
                  }
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                />
                Hạt luồng khí
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer text-[11px]">
                <input
                  type="checkbox"
                  checked={coolingSettings.showHeatmap}
                  onChange={(e) =>
                    onChangeCoolingSettings({
                      ...coolingSettings,
                      showHeatmap: e.target.checked,
                    })
                  }
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                />
                Gradient nhiệt
              </label>
            </div>
          </div>

          {/* SECTION 5: Component Tree Browser */}
          <div className="space-y-3 pt-3">
            <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Danh Sách Linh Kiện ({filteredComponents.length})</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Tìm linh kiện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroup(g.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all ${
                    selectedGroup === g.id
                      ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-700'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80'
                  }`}
                >
                  {g.icon}
                  <span>{g.labelVi}</span>
                </button>
              ))}
            </div>

            {/* Component Items List */}
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {filteredComponents.map((comp) => {
                const isSelected = selectedComponentId === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => onSelectComponent(isSelected ? null : comp.id)}
                    className={`flex items-center justify-between w-full p-2 rounded-lg text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-500/80 text-white shadow-sm'
                        : 'bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="font-medium truncate text-[11px]">{comp.nameVi}</div>
                      <div className="text-[9px] text-slate-500 truncate">{comp.nameEn}</div>
                    </div>
                    {comp.status === 'verified' ? (
                      <span title="Đã xác minh"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /></span>
                    ) : (
                      <span title="Tái dựng tham chiếu"><AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" /></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toggle Button when Collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white shadow-xl backdrop-blur-md"
          title="Mở bảng điều khiển"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
