// src/components/ui/RAMSSDModal.tsx
// Interactive RAM & SSD Upgrade and Insertion Guide (ANIM-07)

import React, { useState } from 'react';
import {
  X,
  Cpu,
  HardDrive,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface RAMSSDModalProps {
  active: boolean;
  onClose: () => void;
  onSelectComponent: (id: string | null) => void;
}

export const RAMSSDModal: React.FC<RAMSSDModalProps> = ({
  active,
  onClose,
  onSelectComponent,
}) => {
  const [activeTab, setActiveTab] = useState<'ram' | 'ssd'>('ram');
  const [currentStep, setCurrentStep] = useState(1);

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-[#0b0f17] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-600 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Quy Trình Nâng Cấp RAM & SSD (Lenovo HMM Standard)
              </h2>
              <p className="text-xs text-slate-400">
                Thao tác kỹ thuật tháo lắp chuẩn góc nghiêng 30° và cơ cấu lẫy khóa đàn hồi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/30 p-2 gap-2">
          <button
            onClick={() => {
              setActiveTab('ram');
              setCurrentStep(1);
              onSelectComponent('ram_slot_1');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ram'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Nâng Cấp RAM DDR5 SO-DIMM</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ssd');
              setCurrentStep(1);
              onSelectComponent('ssd_primary');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ssd'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Nâng Cấp M.2 PCIe 4.0 SSD</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'ram' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-950/40 border border-cyan-900/60 text-xs text-cyan-300">
                <Shield className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>
                  <strong>Cấu trúc:</strong> Lenovo LOQ 15IAX9 sở hữu 2 khe cắm DDR5 SO-DIMM được bao bọc bởi nắp hộp kim loại chống nhiễu điện từ (EMI Can).
                </span>
              </div>

              {/* Step Progression for RAM */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                {[
                  {
                    step: 1,
                    title: 'Tháo Nắp Shield Kim Loại',
                    desc: 'Dùng móng tay hoặc que nạy nhựa gỡ đều các ngàm bấm xung quanh viền hộp kim loại.',
                  },
                  {
                    step: 2,
                    title: 'Bật Lẫy Khóa Góc 30°',
                    desc: 'Gạt đồng thời hai lẫy kim loại hai bên ra ngoài; thanh RAM sẽ tự động bật chéo lên góc 30°.',
                  },
                  {
                    step: 3,
                    title: 'Cắm & Khóa Thanh Mới',
                    desc: 'Căn đúng rãnh chân cắm vào khe ở góc 30°, ấn nhẹ cạnh sau xuống phẳng đến khi nghe tiếng "tách" khóa.',
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    onClick={() => setCurrentStep(s.step)}
                    className={`cursor-pointer p-3.5 rounded-2xl border transition-all ${
                      currentStep === s.step
                        ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg shadow-cyan-950'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-cyan-400 font-mono">BƯỚC {s.step}</span>
                      {currentStep === s.step && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className="font-semibold text-slate-200 mb-1">{s.title}</div>
                    <p className="text-[11px] leading-relaxed text-slate-400">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-950/40 border border-amber-900/60 text-xs text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  <strong>Cấu trúc:</strong> Hỗ trợ 2 khe M.2 NVMe PCIe 4.0 (Khe 1 hỗ trợ 2242/2280, Khe 2 hỗ trợ 2280) đi kèm tấm đệm tản nhiệt kim loại.
                </span>
              </div>

              {/* Step Progression for SSD */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                {[
                  {
                    step: 1,
                    title: 'Tháo Ốc Neo M2',
                    desc: 'Dùng tuốc nơ vít PH0 tháo ốc siết cố định ở đuôi ổ SSD và gỡ miếng nhôm tản nhiệt.',
                  },
                  {
                    step: 2,
                    title: 'Rút Ổ Cũ Góc 30°',
                    desc: 'Cầm hai bên mép ổ SSD, nhẹ nhàng rút thẳng ra khỏi socket M.2 Key-M theo phương chéo 30°.',
                  },
                  {
                    step: 3,
                    title: 'Lắp Ổ Mới & Siết Ốc',
                    desc: 'Đẩy ổ SSD mới vào khe ở góc 30°, ấn nhẹ đuôi ổ xuống tiếp xúc trụ đỡ và siết lại ốc M2.',
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    onClick={() => setCurrentStep(s.step)}
                    className={`cursor-pointer p-3.5 rounded-2xl border transition-all ${
                      currentStep === s.step
                        ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg shadow-amber-950'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-amber-400 font-mono">BƯỚC {s.step}</span>
                      {currentStep === s.step && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="font-semibold text-slate-200 mb-1">{s.title}</div>
                    <p className="text-[11px] leading-relaxed text-slate-400">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Golden Rules Box */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Lưu Ý Kỹ Thuật Lenovo Chính Hãng:
            </h4>
            <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px] pl-1">
              <li>Luôn rút giắc cắm cáp pin trước khi thao tác bất kỳ linh kiện nào để triệt tiêu nguồn nuôi.</li>
              <li>Sử dụng vòng đeo tay chống tĩnh điện (ESD) khi chạm vào bo mạch chủ.</li>
              <li>Tuyệt đối không bẻ thẳng đứng thanh RAM hoặc SSD để tránh gãy chân socket trên bo mạch.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-between items-center">
          <button
            onClick={() => {
              if (activeTab === 'ram') onSelectComponent('ram_slot_1');
              else onSelectComponent('ssd_primary');
              onClose();
            }}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
          >
            <span>Soi linh kiện trên mô hình 3D</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
          >
            Đóng Hướng Dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
