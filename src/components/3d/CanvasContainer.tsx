// src/components/3d/CanvasContainer.tsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { LaptopModel } from './LaptopModel';
import { CameraManager } from './CameraManager';
import { CoolingAnimation } from './CoolingAnimation';
import type { ViewMode, CameraPreset } from '../../types/hardware';

interface CanvasContainerProps {
  viewMode: ViewMode;
  explodeAmount: number;
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onHoverComponent: (id: string | null) => void;
  shellOpacity: number;
  isIsolated: boolean;
  cameraPreset: CameraPreset | null;
  onResetCameraPreset: () => void;
  assemblyProgress: number; // 0 to 1
  activeAssemblyStep: number;
  isCinematicIntro: boolean;
  onFinishCinematicIntro: () => void;
  tourCameraPos: [number, number, number] | null;
  tourCameraTarget: [number, number, number] | null;
  coolingSettings: {
    active: boolean;
    rpm: number;
    showAirflow: boolean;
    showHeatmap: boolean;
  };
  ramSsdAnimActive: boolean;
  lidAngle: number; // in degrees (0 = closed, 115 = normal, 180 = flat)
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  viewMode,
  explodeAmount,
  selectedComponentId,
  hoveredComponentId,
  onSelectComponent,
  onHoverComponent,
  shellOpacity,
  isIsolated,
  cameraPreset,
  onResetCameraPreset,
  assemblyProgress,
  activeAssemblyStep,
  isCinematicIntro,
  onFinishCinematicIntro,
  tourCameraPos,
  tourCameraTarget,
  coolingSettings,
  ramSsdAnimActive,
  lidAngle,
}) => {
  return (
    <div className="relative w-full h-full bg-[#07090d]">
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: 'high-performance',
        }}
        camera={{
          position: [0.32, 0.22, 0.35],
          fov: 42,
          near: 0.01,
          far: 20,
        }}
      >
        <color attach="background" args={['#07090d']} />

        {/* Ambient & Studio Lighting */}
        <ambientLight intensity={0.7} />
        
        {/* Key Light */}
        <directionalLight
          position={[1.5, 2.5, 1.8]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.1}
          shadow-camera-far={5}
          shadow-camera-left={-0.6}
          shadow-camera-right={0.6}
          shadow-camera-top={0.6}
          shadow-camera-bottom={-0.6}
          shadow-bias={-0.0001}
        />

        {/* Fill Light (Soft cool tone) */}
        <directionalLight
          position={[-1.8, 1.5, -1.2]}
          intensity={0.9}
          color="#94b8e6"
        />

        {/* Rim Light / Backlight (Tech accent cyan/blue) */}
        <directionalLight
          position={[0, -1.2, -2.0]}
          intensity={1.2}
          color="#38bdf8"
        />

        {/* Under-chassis soft bounce light */}
        <directionalLight
          position={[0, -1.5, 0.5]}
          intensity={0.4}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          {/* Main 3D Laptop Model */}
          <LaptopModel
            viewMode={viewMode}
            explodeAmount={explodeAmount}
            selectedComponentId={selectedComponentId}
            hoveredComponentId={hoveredComponentId}
            onSelectComponent={onSelectComponent}
            onHoverComponent={onHoverComponent}
            shellOpacity={shellOpacity}
            isIsolated={isIsolated}
            assemblyProgress={assemblyProgress}
            activeAssemblyStep={activeAssemblyStep}
            lidAngle={lidAngle}
            showHeatmap={coolingSettings.showHeatmap}
            ramSsdAnimActive={ramSsdAnimActive}
          />

          {/* Dynamic Cooling Fan Rotation & Airflow Particles */}
          <CoolingAnimation
            active={coolingSettings.active}
            rpm={coolingSettings.rpm}
            showAirflow={coolingSettings.showAirflow}
            explodeAmount={explodeAmount}
          />

          {/* Realistic Ground Contact Shadows */}
          <ContactShadows
            position={[0, -0.018, 0]}
            opacity={0.65}
            scale={0.8}
            blur={2.2}
            far={0.5}
            color="#020408"
          />

          {/* HDR Environment Reflections */}
          <Environment preset="city" environmentIntensity={0.4} />

          {/* Smooth Camera Director */}
          <CameraManager
            cameraPreset={cameraPreset}
            onResetPreset={onResetCameraPreset}
            selectedComponentId={selectedComponentId}
            viewMode={viewMode}
            isCinematicIntro={isCinematicIntro}
            onFinishCinematicIntro={onFinishCinematicIntro}
            tourCameraPos={tourCameraPos}
            tourCameraTarget={tourCameraTarget}
          />
        </Suspense>

        {/* User Orbit Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={0.12}
          maxDistance={1.6}
          maxPolarAngle={Math.PI / 2 + 0.25}
        />
      </Canvas>
    </div>
  );
};
