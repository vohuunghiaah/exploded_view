// src/components/ui/RightSidebar.tsx
// Component Inspector Panel: Detailed hardware specs, verification status, and technical references

import React from 'react';
import {
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  RotateCcw,
  BookOpen,
  Cpu,
  Info,
} from 'lucide-react';
import { COMPONENTS_DATA } from '../../data/components';

interface RightSidebarProps {
  selectedComponentId: string | null;
  onClose: () => void;
  isIsolated: boolean;
  onToggleIsolate: () => void;
  onResetView: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  selectedComponentId,
  onClose,
  isIsolated,
  onToggleIsolate,
  onResetView,
}) => {
  if (!selectedComponentId || !COMPONENTS_DATA[selectedComponentId]) {
    return (
      <div className="absolute top-16 right-4 z-10 w-72 p-4 bg-[#0b0f17]/80 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl text-slate-400 select-none hidden md:block">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Soi Chi Tiết Linh Kiện</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Nhấp chuột trực tiếp vào bất kỳ linh kiện nào trên mô hình 3D để kích hoạt camera zoom, xem thông số kỹ thuật đã xác minh và cô lập bộ phận.
        </p>
      </div>
    );
  }

  const comp = COMPONENTS_DATA[selectedComponentId];

  return (
    <div className="absolute top-16 right-4 bottom-16 z-10 w-84 flex flex-col bg-[#0b0f17]/95 backdrop-blur-md border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden select-none animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Panel Header */}
      <div className="flex items-start justify-between p-4 border-b border-slate-800 bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                comp.status === 'verified'
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60'
                  : 'bg-amber-950/80 text-amber-400 border border-amber-700/60'
              }`}
            >
              {comp.status === 'verified' ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  ĐÃ XÁC MINH CHÍNH HÃNG
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  TÁI DỰNG THAM CHIẾU
                </>
              )}
            </span>
          </div>
          <h2 className="text-sm font-bold text-white tracking-tight leading-snug">
            {comp.nameVi}
          </h2>
          <p className="text-[11px] text-slate-400 font-mono">{comp.nameEn}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Đóng bảng thông tin"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Quick Bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800/60 bg-slate-900/30">
        <button
          onClick={onToggleIsolate}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
            isIsolated
              ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          {isIsolated ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{isIsolated ? 'Bỏ Cô Lập' : 'Cô Lập Linh Kiện'}</span>
        </button>

        <button
          onClick={onResetView}
          className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          title="Đặt lại camera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Góc Nhìn</span>
        </button>
      </div>

      {/* Scrollable Information Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Function Description */}
        <div className="space-y-1">
          <h3 className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Chức Năng & Vị Trí Kỹ Thuật
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
            {comp.functionVi}
          </p>
        </div>

        {/* Detailed Description */}
        <div className="space-y-1">
          <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Mô Tả Cấu Tạo
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {comp.descriptionVi}
          </p>
        </div>

        {/* Technical Specifications Table */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" />
            Thông Số Kỹ Thuật Chi Tiết
          </h3>
          <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80 bg-slate-900/40 text-xs">
            {Object.entries(comp.specsVi).map(([key, val]) => (
              <div key={key} className="flex justify-between p-2">
                <span className="text-slate-400 font-medium text-[11px]">{key}</span>
                <span className="text-slate-200 font-medium text-[11px] text-right max-w-[55%]">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Reference Source */}
        <div className="space-y-1 pt-1">
          <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            Nguồn Tham Khảo Kỹ Thuật
          </h3>
          <div className="p-2 rounded-lg bg-blue-950/20 border border-blue-900/40 text-[10px] text-blue-300/90 font-mono break-words">
            {comp.technicalReference}
          </div>
        </div>
      </div>
    </div>
  );
};

