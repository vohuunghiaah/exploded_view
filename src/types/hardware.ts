// src/types/hardware.ts
// Comprehensive TypeScript Definitions for Lenovo LOQ 15IAX9 Interactive 3D Explorer

export type ComponentGroup =
  | 'chassis'       // Khung và vỏ máy
  | 'display'       // Hệ thống hiển thị
  | 'motherboard'   // Bo mạch chủ & vi xử lý
  | 'thermal'       // Hệ thống tản nhiệt
  | 'components'    // RAM & SSD
  | 'battery'       // Nguồn & Pin
  | 'audio'         // Âm thanh
  | 'io';           // Cổng kết nối

export type VerificationStatus = 'verified' | 'reconstructed' | 'unverified';

export interface ComponentData {
  id: string;
  nameVi: string;
  nameEn: string;
  group: ComponentGroup;
  status: VerificationStatus;
  descriptionVi: string;
  functionVi: string;
  specsVi: Record<string, string>;
  technicalReference: string;
  // Exploded View kinematics
  explodedOffset: [number, number, number]; // [x, y, z] displacement at 100% explode
  explodedRot?: [number, number, number];    // optional rotation offset in radians
  // Camera focus presets for Inspector mode
  focusCamera: {
    position: [number, number, number];
    target: [number, number, number];
  };
}

export type ViewMode =
  | 'assembled'   // Chế độ A: Assembled View
  | 'exploded'    // Chế độ B: Exploded View
  | 'inspector'   // Chế độ C: Component Inspector
  | 'assembly'    // Chế độ D: Assembly / Disassembly Step-by-Step
  | 'xray';       // Chế độ E: X-Ray View

export type CameraPreset =
  | 'front'
  | 'rear'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'isometric'
  | 'motherboard'
  | 'cooling';

export interface AssemblyStep {
  stepNumber: number;
  id: string;
  titleVi: string;
  titleEn: string;
  actionVi: string;
  actionEn: string;
  affectedComponents: string[];
  cameraFocus: {
    position: [number, number, number];
    target: [number, number, number];
  };
  duration: number; // in seconds
  cruFruType: 'CRU' | 'FRU';
  torqueOrTool?: string;
  notesVi: string;
}

export interface TourScene {
  id: number;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  targetComponentId?: string;
  camera: {
    position: [number, number, number];
    target: [number, number, number];
  };
  duration: number; // in seconds
  explodeAmount: number; // 0 to 1
  xrayMode: boolean;
  coolingActive: boolean;
}

export interface PerformanceStats {
  fps: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
}

