// src/components/3d/CameraManager.tsx
// Cinematic Camera Controller: Presets, Component Framing, Tour tracking & Opening Sequence

import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import type { CameraPreset, ViewMode } from '../../types/hardware';
import { COMPONENTS_DATA } from '../../data/components';

interface CameraManagerProps {
  cameraPreset: CameraPreset | null;
  onResetPreset: () => void;
  selectedComponentId: string | null;
  viewMode: ViewMode;
  isCinematicIntro: boolean;
  onFinishCinematicIntro: () => void;
  tourCameraPos: [number, number, number] | null;
  tourCameraTarget: [number, number, number] | null;
}

const PRESET_CONFIGS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  front: { pos: [0, 0.08, 0.42], target: [0, 0.04, 0] },
  rear: { pos: [0, 0.12, -0.42], target: [0, 0.02, 0] },
  top: { pos: [0, 0.48, 0.01], target: [0, 0.02, 0] },
  bottom: { pos: [0, -0.48, 0.01], target: [0, -0.01, 0] },
  left: { pos: [-0.45, 0.08, 0], target: [0, 0.04, 0] },
  right: { pos: [0.45, 0.08, 0], target: [0, 0.04, 0] },
  isometric: { pos: [0.34, 0.24, 0.34], target: [0, 0.03, 0] },
  motherboard: { pos: [0, 0.22, 0.10], target: [0, 0.01, -0.02] },
  cooling: { pos: [0, 0.18, -0.18], target: [0, 0.01, -0.06] },
};

export const CameraManager: React.FC<CameraManagerProps> = ({
  cameraPreset,
  onResetPreset,
  selectedComponentId,
  viewMode,
  isCinematicIntro,
  onFinishCinematicIntro,
  tourCameraPos,
  tourCameraTarget,
}) => {
  const { camera, controls, scene } = useThree();
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Helper to smoothly animate camera position and target
  const animateCameraTo = (
    targetPos: [number, number, number],
    lookTarget: [number, number, number],
    duration = 1.2,
    ease = 'power2.inOut',
    onComplete?: () => void
  ) => {
    if (!controls) return;
    const orbitControls = controls as any;

    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    const state = {
      cx: camera.position.x,
      cy: camera.position.y,
      cz: camera.position.z,
      tx: orbitControls.target.x,
      ty: orbitControls.target.y,
      tz: orbitControls.target.z,
    };

    tweenRef.current = gsap.to(state, {
      cx: targetPos[0],
      cy: targetPos[1],
      cz: targetPos[2],
      tx: lookTarget[0],
      ty: lookTarget[1],
      tz: lookTarget[2],
      duration,
      ease,
      onUpdate: () => {
        camera.position.set(state.cx, state.cy, state.cz);
        orbitControls.target.set(state.tx, state.ty, state.tz);
        orbitControls.update();
      },
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });
  };

  // 1. Handle Cinematic Intro Sequence (ANIM-01)
  useEffect(() => {
    if (!isCinematicIntro || !controls) return;
    const orbitControls = controls as any;

    // Start wide panoramic overview
    camera.position.set(0.65, 0.40, 0.55);
    orbitControls.target.set(0, 0.05, 0);
    orbitControls.update();

    // GSAP Timeline for opening showcase
    const tl = gsap.timeline({
      onComplete: () => {
        onFinishCinematicIntro();
      },
    });

    // Stage 1: Sweep around to the side
    tl.to(camera.position, {
      x: -0.45,
      y: 0.25,
      z: 0.40,
      duration: 3.2,
      ease: 'power1.inOut',
      onUpdate: () => orbitControls.update(),
    })
    // Stage 2: Move into classic 3/4 isometric beauty hero shot
    .to(camera.position, {
      x: 0.32,
      y: 0.20,
      z: 0.34,
      duration: 3.5,
      ease: 'power2.out',
      onUpdate: () => orbitControls.update(),
    });

    return () => {
      tl.kill();
    };
  }, [isCinematicIntro, controls, onFinishCinematicIntro]);

  // 2. Handle Camera Presets (ANIM-08)
  useEffect(() => {
    if (cameraPreset && PRESET_CONFIGS[cameraPreset]) {
      const config = PRESET_CONFIGS[cameraPreset];
      animateCameraTo(config.pos, config.target, 1.1, 'power2.inOut', () => {
        onResetPreset();
      });
    }
  }, [cameraPreset]);

  // 3. Handle Dynamic Component Focus in Inspector Mode (ANIM-04)
  // Computes actual current world position so camera frames the part wherever it is (0% or 100% exploded)
  useEffect(() => {
    if (viewMode === 'inspector' && selectedComponentId) {
      const targetObj = scene.getObjectByName(selectedComponentId);
      if (targetObj) {
        const worldPos = new THREE.Vector3();
        targetObj.getWorldPosition(worldPos);

        // Frame camera with an optimal offset relative to live component world position
        const targetCamPos: [number, number, number] = [
          worldPos.x + 0.06,
          worldPos.y + 0.12,
          worldPos.z + 0.16,
        ];
        const lookTarget: [number, number, number] = [worldPos.x, worldPos.y, worldPos.z];

        animateCameraTo(targetCamPos, lookTarget, 1.2, 'power2.out');
      } else if (COMPONENTS_DATA[selectedComponentId]) {
        const comp = COMPONENTS_DATA[selectedComponentId];
        animateCameraTo(comp.focusCamera.position, comp.focusCamera.target, 1.2, 'power2.out');
      }
    }
  }, [viewMode, selectedComponentId, scene]);

  // 4. Handle Guided Tour Tracking (ANIM-10)
  useEffect(() => {
    if (tourCameraPos && tourCameraTarget) {
      animateCameraTo(tourCameraPos, tourCameraTarget, 1.8, 'power2.inOut');
    }
  }, [tourCameraPos, tourCameraTarget]);

  return null;
};
