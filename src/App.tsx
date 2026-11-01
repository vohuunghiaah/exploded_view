// src/App.tsx
// Main Orchestrator for Lenovo LOQ 15IAX9 Interactive 3D Exploded View

import { useState, useEffect, useRef, useCallback } from 'react';
import { CanvasContainer } from './components/3d/CanvasContainer';
import { Header } from './components/ui/Header';
import { LeftSidebar } from './components/ui/LeftSidebar';
import { RightSidebar } from './components/ui/RightSidebar';
import { BottomBar } from './components/ui/BottomBar';
import { TourOverlay } from './components/ui/TourOverlay';
import { CinematicIntroOverlay } from './components/ui/CinematicIntroOverlay';
import { RAMSSDModal } from './components/ui/RAMSSDModal';
import { PerformanceMonitor } from './components/ui/PerformanceMonitor';
import type { ViewMode, CameraPreset } from './types/hardware';
import { TOUR_SCENES } from './data/tourScenes';
import { ASSEMBLY_STEPS } from './data/assemblySteps';
import gsap from 'gsap';

export function App() {
  // Core view mode & explosion state
  const [viewMode, setViewMode] = useState<ViewMode>('assembled');
  const [explodeAmount, setExplodeAmount] = useState<number>(0);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [shellOpacity, setShellOpacity] = useState<number>(1.0);
  const [isIsolated, setIsIsolated] = useState<boolean>(false);
  const [lidAngle, setLidAngle] = useState<number>(115);

  // Camera preset
  const [cameraPreset, setCameraPreset] = useState<CameraPreset | null>('isometric');

  // Cinematic Intro state (ANIM-01)
  const [isCinematicIntro, setIsCinematicIntro] = useState<boolean>(true);

  // Guided Tour state (ANIM-10)
  const [tourActive, setTourActive] = useState<boolean>(false);
  const [tourSceneIndex, setTourSceneIndex] = useState<number>(0);
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(true);
  const [tourProgress, setTourProgress] = useState<number>(0);

  // Assembly Step-by-Step state (Mode D)
  const [activeAssemblyStep, setActiveAssemblyStep] = useState<number>(1);
  const [isPlayingAssembly, setIsPlayingAssembly] = useState<boolean>(false);
  const [assemblySpeed, setAssemblySpeed] = useState<number>(1.0);
  const assemblyProgress = (activeAssemblyStep - 1) / (ASSEMBLY_STEPS.length - 1);

  // Cooling simulation settings (ANIM-05)
  const [coolingSettings, setCoolingSettings] = useState({
    active: true,
    rpm: 2800,
    showAirflow: true,
    showHeatmap: false,
  });

  // RAM/SSD installation guide modal (ANIM-07)
  const [ramSsdDemoActive, setRamSsdDemoActive] = useState<boolean>(false);

  // Smooth explode tween ref
  const explodeTweenRef = useRef<gsap.core.Tween | null>(null);

  const animateExplodeTo = useCallback((targetVal: number, duration = 1.0) => {
    if (explodeTweenRef.current) explodeTweenRef.current.kill();
    const current = { val: explodeAmount };
    explodeTweenRef.current = gsap.to(current, {
      val: targetVal,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => setExplodeAmount(current.val),
    });
  }, [explodeAmount]);

  // Mode change handler with smart transition
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setIsIsolated(false);

    if (mode === 'assembled') {
      animateExplodeTo(0, 0.8);
      setSelectedComponentId(null);
      setCameraPreset('isometric');
    } else if (mode === 'exploded') {
      animateExplodeTo(1.0, 1.2);
    } else if (mode === 'xray') {
      animateExplodeTo(0.15, 0.8);
      setCameraPreset('isometric');
    } else if (mode === 'assembly') {
      setActiveAssemblyStep(1);
      setIsPlayingAssembly(false);
    } else if (mode === 'inspector') {
      if (!selectedComponentId) {
        setSelectedComponentId('motherboard');
      }
    }
  };

  // Component selection handler
  const handleSelectComponent = (id: string | null) => {
    setSelectedComponentId(id);
    if (id && viewMode !== 'inspector') {
      setViewMode('inspector');
    }
  };

  // Step-by-Step Assembly Autoplay Timer
  useEffect(() => {
    if (viewMode !== 'assembly' || !isPlayingAssembly) return;

    const currentStep = ASSEMBLY_STEPS[activeAssemblyStep - 1];
    const duration = (currentStep ? currentStep.duration : 3.0) / assemblySpeed;

    const interval = setTimeout(() => {
      if (activeAssemblyStep < ASSEMBLY_STEPS.length) {
        setActiveAssemblyStep((prev) => prev + 1);
      } else {
        setIsPlayingAssembly(false);
      }
    }, duration * 1000);

    return () => clearTimeout(interval);
  }, [viewMode, isPlayingAssembly, activeAssemblyStep, assemblySpeed]);

  // Guided Technical Tour Timer
  useEffect(() => {
    if (!tourActive || !isPlayingTour) return;

    const currentScene = TOUR_SCENES[tourSceneIndex];
    if (!currentScene) return;

    // Apply scene presets
    animateExplodeTo(currentScene.explodeAmount, 1.2);
    if (currentScene.targetComponentId) {
      setSelectedComponentId(currentScene.targetComponentId);
    }
    setCoolingSettings((prev) => ({
      ...prev,
      active: currentScene.coolingActive,
    }));

    const sceneDuration = currentScene.duration * 1000;
    const startTime = Date.now();

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1.0, elapsed / sceneDuration);
      setTourProgress(progress);

      if (elapsed >= sceneDuration) {
        clearInterval(progressTimer);
        if (tourSceneIndex < TOUR_SCENES.length - 1) {
          setTourSceneIndex((prev) => prev + 1);
          setTourProgress(0);
        } else {
          // Finish tour
          setTourActive(false);
          setTourProgress(0);
        }
      }
    }, 50);

    return () => clearInterval(progressTimer);
  }, [tourActive, isPlayingTour, tourSceneIndex, animateExplodeTo]);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const currentTourScene = tourActive ? TOUR_SCENES[tourSceneIndex] : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07090d] font-sans">
      {/* 1. Header Navigation Bar */}
      <Header
        viewMode={viewMode}
        onChangeViewMode={handleViewModeChange}
        onReplayCinematic={() => setIsCinematicIntro(true)}
        onToggleTour={() => {
          setTourActive(!tourActive);
          setTourSceneIndex(0);
          setIsPlayingTour(true);
        }}
        tourActive={tourActive}
        onResetView={() => setCameraPreset('isometric')}
        onToggleFullscreen={handleToggleFullscreen}
        coolingActive={coolingSettings.active}
        onToggleCooling={() =>
          setCoolingSettings((prev) => ({ ...prev, active: !prev.active }))
        }
        onToggleRamSsdDemo={() => setRamSsdDemoActive(!ramSsdDemoActive)}
        ramSsdDemoActive={ramSsdDemoActive}
      />

      {/* 2. Left Control Panel (Sliders, Tree, Cooling) */}
      <LeftSidebar
        viewMode={viewMode}
        explodeAmount={explodeAmount}
        onChangeExplodeAmount={(amt) => {
          setExplodeAmount(amt);
          if (viewMode !== 'exploded' && amt > 0.05) setViewMode('exploded');
        }}
        lidAngle={lidAngle}
        onChangeLidAngle={setLidAngle}
        shellOpacity={shellOpacity}
        onChangeShellOpacity={setShellOpacity}
        selectedComponentId={selectedComponentId}
        onSelectComponent={handleSelectComponent}
        coolingSettings={coolingSettings}
        onChangeCoolingSettings={setCoolingSettings}
      />

      {/* 3. Main 3D Canvas Scene */}
      <CanvasContainer
        viewMode={viewMode}
        explodeAmount={explodeAmount}
        selectedComponentId={selectedComponentId}
        hoveredComponentId={hoveredComponentId}
        onSelectComponent={handleSelectComponent}
        onHoverComponent={setHoveredComponentId}
        shellOpacity={shellOpacity}
        isIsolated={isIsolated}
        cameraPreset={cameraPreset}
        onResetCameraPreset={() => setCameraPreset(null)}
        assemblyProgress={assemblyProgress}
        activeAssemblyStep={activeAssemblyStep}
        isCinematicIntro={isCinematicIntro}
        onFinishCinematicIntro={() => setIsCinematicIntro(false)}
        tourCameraPos={currentTourScene ? currentTourScene.camera.position : null}
        tourCameraTarget={currentTourScene ? currentTourScene.camera.target : null}
        coolingSettings={coolingSettings}
        ramSsdAnimActive={ramSsdDemoActive}
        lidAngle={lidAngle}
      />

      {/* 4. Right Component Inspector Panel */}
      <RightSidebar
        selectedComponentId={selectedComponentId}
        onClose={() => {
          setSelectedComponentId(null);
          setIsIsolated(false);
        }}
        isIsolated={isIsolated}
        onToggleIsolate={() => setIsIsolated(!isIsolated)}
        onResetView={() => setCameraPreset('isometric')}
      />

      {/* 5. Bottom Assembly Timeline & Camera Presets */}
      <BottomBar
        viewMode={viewMode}
        activeAssemblyStep={activeAssemblyStep}
        onChangeAssemblyStep={setActiveAssemblyStep}
        isPlayingAssembly={isPlayingAssembly}
        onTogglePlayAssembly={() => setIsPlayingAssembly(!isPlayingAssembly)}
        assemblySpeed={assemblySpeed}
        onChangeAssemblySpeed={setAssemblySpeed}
        cameraPreset={cameraPreset}
        onSelectCameraPreset={setCameraPreset}
      />

      {/* 6. Overlays */}
      <CinematicIntroOverlay
        active={isCinematicIntro}
        onSkip={() => setIsCinematicIntro(false)}
      />

      <TourOverlay
        active={tourActive}
        currentSceneIndex={tourSceneIndex}
        onNextScene={() =>
          setTourSceneIndex((prev) => Math.min(TOUR_SCENES.length - 1, prev + 1))
        }
        onPrevScene={() => setTourSceneIndex((prev) => Math.max(0, prev - 1))}
        onCloseTour={() => setTourActive(false)}
        isPlaying={isPlayingTour}
        onTogglePlay={() => setIsPlayingTour(!isPlayingTour)}
        tourProgress={tourProgress}
      />

      <RAMSSDModal
        active={ramSsdDemoActive}
        onClose={() => setRamSsdDemoActive(false)}
        onSelectComponent={handleSelectComponent}
      />

      <PerformanceMonitor />
    </div>
  );
}
export default App;
