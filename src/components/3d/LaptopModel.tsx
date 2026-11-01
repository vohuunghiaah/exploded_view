// src/components/3d/LaptopModel.tsx
// Upgraded 3D Laptop Component Renderer:
// - Non-conflicting Hinge Angle Control (guaranteed lid angle persistence)
// - Real 3D Continuous Step-by-Step Assembly Kinematics
// - Real 3D RAM/SSD Installation Motion (30-degree tilt & latch displacement)
// - PBR Material Highlighting, X-Ray Transparency & Heatmap Gradients

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { COMPONENTS_DATA } from '../../data/components';
import { ASSEMBLY_STEPS } from '../../data/assemblySteps';
import type { ViewMode } from '../../types/hardware';

interface LaptopModelProps {
  viewMode: ViewMode;
  explodeAmount: number; // 0 to 1
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onHoverComponent: (id: string | null) => void;
  shellOpacity: number; // 0.05 to 1.0
  isIsolated: boolean;
  assemblyProgress: number; // 0 to 1 continuous
  activeAssemblyStep: number; // 1 to 10
  lidAngle: number; // 0 to 180 degrees
  showHeatmap: boolean;
  ramSsdAnimActive: boolean;
}

interface ComponentNodeRef {
  object: THREE.Object3D;
  initialPos: THREE.Vector3;
  initialRot: THREE.Euler;
  targetPos: THREE.Vector3;
  targetRot: THREE.Euler;
  materials: THREE.Material[];
  originalOpacities: number[];
  originalColors: THREE.Color[];
  originalEmissives: THREE.Color[];
}

export const LaptopModel: React.FC<LaptopModelProps> = ({
  viewMode,
  explodeAmount,
  selectedComponentId,
  hoveredComponentId,
  onSelectComponent,
  onHoverComponent,
  shellOpacity,
  isIsolated,
  assemblyProgress,
  activeAssemblyStep,
  lidAngle,
  showHeatmap,
  ramSsdAnimActive,
}) => {
  const { scene } = useGLTF('/models/lenovo_loq_15iax9.glb');
  const modelRef = useRef<THREE.Group>(null);
  const displayAssemblyRef = useRef<THREE.Object3D | null>(null);

  // Map of component IDs to their cached node references & transform baselines
  const componentNodes = useMemo(() => {
    const map = new Map<string, ComponentNodeRef>();

    scene.traverse((obj) => {
      if (obj.name === 'display_assembly') {
        displayAssemblyRef.current = obj;
      }

      if (COMPONENTS_DATA[obj.name]) {
        const materials: THREE.Material[] = [];
        const originalOpacities: number[] = [];
        const originalColors: THREE.Color[] = [];
        const originalEmissives: THREE.Color[] = [];

        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
              const clonedMat = mat.clone();
              mesh.material = clonedMat;
              materials.push(clonedMat);
              originalOpacities.push(clonedMat.opacity ?? 1);
              originalColors.push(clonedMat.color ? clonedMat.color.clone() : new THREE.Color(0xffffff));
              originalEmissives.push(clonedMat.emissive ? clonedMat.emissive.clone() : new THREE.Color(0x000000));
            }
          }
        });

        map.set(obj.name, {
          object: obj,
          initialPos: obj.position.clone(),
          initialRot: obj.rotation.clone(),
          targetPos: obj.position.clone(),
          targetRot: obj.rotation.clone(),
          materials,
          originalOpacities,
          originalColors,
          originalEmissives,
        });
      }
    });

    return map;
  }, [scene]);

  // Frame update: Compute exact target positions & lerp smoothly
  useFrame((_, delta) => {
    const lerpFactor = Math.min(1.0, delta * 8.5);

    // 1. DEDICATED SCREEN HINGE CONTROL (Guaranteed no override)
    if (displayAssemblyRef.current) {
      const targetLidRad = THREE.MathUtils.degToRad(-lidAngle);
      displayAssemblyRef.current.rotation.x = THREE.MathUtils.lerp(
        displayAssemblyRef.current.rotation.x,
        targetLidRad,
        lerpFactor
      );
    }

    // 2. DISASSEMBLY / ASSEMBLY STEP PROGRESS MAPPING
    const disassembledSet = new Set<string>();
    const activelyDisassemblingSet = new Set<string>();
    if (viewMode === 'assembly') {
      for (let s = 0; s < activeAssemblyStep - 1; s++) {
        const step = ASSEMBLY_STEPS[s];
        if (step) {
          step.affectedComponents.forEach((id) => disassembledSet.add(id));
        }
      }
      // Current active step components interpolate continuously
      const currentStep = ASSEMBLY_STEPS[activeAssemblyStep - 1];
      if (currentStep) {
        currentStep.affectedComponents.forEach((id) => activelyDisassemblingSet.add(id));
      }
    }

    // 3. TRANSFORM COMPUTATION FOR EACH COMPONENT
    componentNodes.forEach((nodeRef, compId) => {
      const compData = COMPONENTS_DATA[compId];
      const isSelected = selectedComponentId === compId;
      const isHovered = hoveredComponentId === compId;
      const isShell = compId === 'upper_case' || compId === 'bottom_cover' || compId === 'display_lid';

      if (viewMode === 'assembly') {
        const [ox, oy, oz] = compData.explodedOffset;
        if (disassembledSet.has(compId)) {
          // Fully disassembled position
          nodeRef.targetPos.set(
            nodeRef.initialPos.x + ox * 1.25,
            nodeRef.initialPos.y + oy * 1.25,
            nodeRef.initialPos.z + oz * 1.25
          );
        } else if (activelyDisassemblingSet.has(compId)) {
          // Actively disassembling with continuous progress
          const progressFactor = Math.sin(assemblyProgress * Math.PI * 0.5);
          nodeRef.targetPos.set(
            nodeRef.initialPos.x + ox * 1.25 * (0.8 + progressFactor * 0.2),
            nodeRef.initialPos.y + oy * 1.25 * (0.8 + progressFactor * 0.2),
            nodeRef.initialPos.z + oz * 1.25 * (0.8 + progressFactor * 0.2)
          );
        } else {
          // Still assembled
          nodeRef.targetPos.copy(nodeRef.initialPos);
        }
      } else if (ramSsdAnimActive && (compId.includes('ram') || compId.includes('ssd'))) {
        // REAL 3D RAM & SSD INSTALLATION KINEMATICS (30-degree mechanical tilt)
        if (compId === 'ram_slot_1' || compId === 'ram_slot_2') {
          // RAM pops up at 30 degrees (0.52 rad) from slot and elevates
          nodeRef.targetPos.set(
            nodeRef.initialPos.x,
            nodeRef.initialPos.y + 0.035,
            nodeRef.initialPos.z + 0.012
          );
          nodeRef.targetRot.set(-0.52, 0, 0); // 30-degree extraction angle
        } else if (compId === 'ram_shield') {
          nodeRef.targetPos.set(
            nodeRef.initialPos.x,
            nodeRef.initialPos.y + 0.055,
            nodeRef.initialPos.z + 0.015
          );
        } else if (compId === 'ssd_primary') {
          // SSD angles up by 30 degrees and slides forward
          nodeRef.targetPos.set(
            nodeRef.initialPos.x - 0.025,
            nodeRef.initialPos.y + 0.032,
            nodeRef.initialPos.z + 0.018
          );
          nodeRef.targetRot.set(0, 0, 0.52);
        } else if (compId === 'ssd_secondary') {
          nodeRef.targetPos.set(
            nodeRef.initialPos.x + 0.025,
            nodeRef.initialPos.y + 0.032,
            nodeRef.initialPos.z + 0.018
          );
          nodeRef.targetRot.set(0, 0, -0.52);
        }
      } else if (compData) {
        // Standard Exploded View with zero mathematical drift
        const effectiveExplode = (viewMode === 'exploded' || explodeAmount > 0) ? explodeAmount : 0;
        const [ox, oy, oz] = compData.explodedOffset;
        nodeRef.targetPos.set(
          nodeRef.initialPos.x + ox * effectiveExplode,
          nodeRef.initialPos.y + oy * effectiveExplode,
          nodeRef.initialPos.z + oz * effectiveExplode
        );

        if (compData.explodedRot) {
          const [rx, ry, rz] = compData.explodedRot;
          nodeRef.targetRot.set(
            nodeRef.initialRot.x + rx * effectiveExplode,
            nodeRef.initialRot.y + ry * effectiveExplode,
            nodeRef.initialRot.z + rz * effectiveExplode
          );
        } else {
          nodeRef.targetRot.copy(nodeRef.initialRot);
        }
      }

      // Smooth interpolation of position and orientation
      nodeRef.object.position.lerp(nodeRef.targetPos, lerpFactor);
      nodeRef.object.rotation.x = THREE.MathUtils.lerp(nodeRef.object.rotation.x, nodeRef.targetRot.x, lerpFactor);
      nodeRef.object.rotation.y = THREE.MathUtils.lerp(nodeRef.object.rotation.y, nodeRef.targetRot.y, lerpFactor);
      nodeRef.object.rotation.z = THREE.MathUtils.lerp(nodeRef.object.rotation.z, nodeRef.targetRot.z, lerpFactor);

      // 4. ISOLATION MODE VISIBILITY
      if (isIsolated && selectedComponentId) {
        nodeRef.object.visible = isSelected;
      } else {
        nodeRef.object.visible = true;
      }

      // 5. PBR MATERIALS, X-RAY TRANSPARENCY & HIGHLIGHTS
      nodeRef.materials.forEach((mat, idx) => {
        const stdMat = mat as THREE.MeshStandardMaterial;
        const origOpacity = nodeRef.originalOpacities[idx] ?? 1.0;
        const origColor = nodeRef.originalColors[idx];
        const origEmissive = nodeRef.originalEmissives[idx];

        // Mode E: X-Ray View
        if (viewMode === 'xray') {
          if (isShell) {
            stdMat.transparent = true;
            stdMat.opacity = THREE.MathUtils.lerp(stdMat.opacity, 0.15, lerpFactor);
            stdMat.depthWrite = false;
            stdMat.roughness = 0.08;
            stdMat.metalness = 0.12;
          } else {
            stdMat.transparent = false;
            stdMat.opacity = 1.0;
            stdMat.depthWrite = true;
          }
        } else {
          if (isShell) {
            if (shellOpacity < 0.99) {
              stdMat.transparent = true;
              stdMat.opacity = THREE.MathUtils.lerp(stdMat.opacity, shellOpacity, lerpFactor);
              stdMat.depthWrite = shellOpacity > 0.5;
            } else {
              stdMat.transparent = origOpacity < 0.99;
              stdMat.opacity = origOpacity;
              stdMat.depthWrite = true;
            }
          } else {
            stdMat.transparent = origOpacity < 0.99;
            stdMat.opacity = origOpacity;
            stdMat.depthWrite = true;
          }
        }

        // Selection & Hover Highlighting
        if (isSelected) {
          stdMat.emissive.setHex(0x00d2ff);
          stdMat.emissiveIntensity = 0.75;
        } else if (isHovered) {
          stdMat.emissive.setHex(0x38bdf8);
          stdMat.emissiveIntensity = 0.40;
        } else if (viewMode === 'inspector' && selectedComponentId) {
          stdMat.emissive.copy(origEmissive);
          stdMat.emissiveIntensity = 0.0;
          if (stdMat.color && origColor) {
            stdMat.color.lerp(new THREE.Color(0x28303d), lerpFactor);
          }
        } else if (showHeatmap) {
          if (compId === 'cpu_module' || compId === 'gpu_module') {
            stdMat.emissive.setHex(0xff1e00);
            stdMat.emissiveIntensity = 0.85;
          } else if (compId === 'thermal_module') {
            stdMat.emissive.setHex(0xff7700);
            stdMat.emissiveIntensity = 0.55;
          } else if (compId === 'heatsink_fins') {
            stdMat.emissive.setHex(0xee3300);
            stdMat.emissiveIntensity = 0.45;
          } else if (compId === 'fan_cpu' || compId === 'fan_gpu') {
            stdMat.emissive.setHex(0x0077dd);
            stdMat.emissiveIntensity = 0.35;
          } else {
            stdMat.emissive.copy(origEmissive);
            stdMat.emissiveIntensity = 0.0;
          }
        } else {
          stdMat.emissive.copy(origEmissive);
          stdMat.emissiveIntensity = 0.0;
          if (stdMat.color && origColor) {
            stdMat.color.lerp(origColor, lerpFactor);
          }
        }
      });
    });
  });

  // Pointer event handlers
  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    let curr = e.object;
    while (curr && curr !== scene) {
      if (COMPONENTS_DATA[curr.name]) {
        onHoverComponent(curr.name);
        document.body.style.cursor = 'pointer';
        return;
      }
      curr = curr.parent;
    }
  };

  const handlePointerOut = () => {
    onHoverComponent(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    let curr = e.object;
    while (curr && curr !== scene) {
      if (COMPONENTS_DATA[curr.name]) {
        onSelectComponent(curr.name);
        return;
      }
      curr = curr.parent;
    }
    onSelectComponent(null);
  };

  return (
    <primitive
      ref={modelRef}
      object={scene}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
};
