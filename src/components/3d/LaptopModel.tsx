// src/components/3d/LaptopModel.tsx
import React, { useRef, useMemo, useEffect } from 'react';
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
  assemblyProgress: number; // 0 to 1
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
  assemblyProgress: _assemblyProgress,
  activeAssemblyStep,
  lidAngle,
  showHeatmap,
  ramSsdAnimActive: _ramSsdAnimActive,
}) => {
  const { scene } = useGLTF('/models/lenovo_loq_15iax9.glb');
  const modelRef = useRef<THREE.Group>(null);

  // Map of component IDs to their cached node references & transform baselines
  const componentNodes = useMemo(() => {
    const map = new Map<string, ComponentNodeRef>();

    scene.traverse((obj) => {
      if (COMPONENTS_DATA[obj.name] || obj.name === 'display_assembly') {
        const materials: THREE.Material[] = [];
        const originalOpacities: number[] = [];
        const originalColors: THREE.Color[] = [];
        const originalEmissives: THREE.Color[] = [];

        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Clone material so each mesh can have independent highlight / opacity
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

  // Handle Hinge angle rotation for display_assembly
  useEffect(() => {
    const displayAssembly = componentNodes.get('display_assembly');
    if (displayAssembly) {
      displayAssembly.object.rotation.x = THREE.MathUtils.degToRad(-lidAngle);
    }
  }, [lidAngle, componentNodes]);

  // Frame update: compute exact target positions and lerp for ultra-smooth 60fps animations
  useFrame((_, delta) => {
    // Determine interpolation speed based on mode
    const lerpFactor = Math.min(1.0, delta * 9.0);

    // Track disassembled components in step-by-step assembly mode
    const disassembledSet = new Set<string>();
    if (viewMode === 'assembly') {
      for (let s = 0; s < activeAssemblyStep; s++) {
        const step = ASSEMBLY_STEPS[s];
        if (step) {
          step.affectedComponents.forEach((id) => disassembledSet.add(id));
        }
      }
    }

    componentNodes.forEach((nodeRef, compId) => {
      const compData = COMPONENTS_DATA[compId];
      const isSelected = selectedComponentId === compId;
      const isHovered = hoveredComponentId === compId;
      const isShell = compId === 'upper_case' || compId === 'bottom_cover' || compId === 'display_lid';

      // 1. Calculate Target Position & Rotation
      if (viewMode === 'assembly') {
        const isDisassembled = disassembledSet.has(compId);
        if (isDisassembled && compData) {
          const [ox, oy, oz] = compData.explodedOffset;
          nodeRef.targetPos.set(
            nodeRef.initialPos.x + ox * 1.2,
            nodeRef.initialPos.y + oy * 1.2,
            nodeRef.initialPos.z + oz * 1.2
          );
        } else {
          nodeRef.targetPos.copy(nodeRef.initialPos);
        }
      } else if (compData) {
        // Mode A, B, C, E: Exploded interpolation
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

      // Smoothly slerp/lerp position and rotation
      nodeRef.object.position.lerp(nodeRef.targetPos, lerpFactor);
      nodeRef.object.rotation.x = THREE.MathUtils.lerp(nodeRef.object.rotation.x, nodeRef.targetRot.x, lerpFactor);
      nodeRef.object.rotation.y = THREE.MathUtils.lerp(nodeRef.object.rotation.y, nodeRef.targetRot.y, lerpFactor);
      nodeRef.object.rotation.z = THREE.MathUtils.lerp(nodeRef.object.rotation.z, nodeRef.targetRot.z, lerpFactor);

      // 2. Manage Visibility for Isolation Mode
      if (isIsolated && selectedComponentId) {
        nodeRef.object.visible = isSelected || compId === 'display_assembly';
      } else {
        nodeRef.object.visible = true;
      }

      // 3. Materials, Highlighting, X-Ray & Opacity
      nodeRef.materials.forEach((mat, idx) => {
        const stdMat = mat as THREE.MeshStandardMaterial;
        const origOpacity = nodeRef.originalOpacities[idx] ?? 1.0;
        const origColor = nodeRef.originalColors[idx];
        const origEmissive = nodeRef.originalEmissives[idx];

        // Mode E: X-Ray View
        if (viewMode === 'xray') {
          if (isShell) {
            stdMat.transparent = true;
            stdMat.opacity = THREE.MathUtils.lerp(stdMat.opacity, 0.16, lerpFactor);
            stdMat.depthWrite = false;
            stdMat.roughness = 0.1;
            stdMat.metalness = 0.1;
          } else {
            // Internals stand out crisply
            stdMat.transparent = false;
            stdMat.opacity = 1.0;
            stdMat.depthWrite = true;
          }
        } else {
          // Normal mode: apply shell opacity slider if it's a shell part
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
          // Vibrant cyan highlight glow
          stdMat.emissive.setHex(0x00d2ff);
          stdMat.emissiveIntensity = 0.65;
        } else if (isHovered) {
          // Subtle hover glow
          stdMat.emissive.setHex(0x38bdf8);
          stdMat.emissiveIntensity = 0.35;
        } else if (viewMode === 'inspector' && selectedComponentId) {
          // Dim other components in Inspector mode
          stdMat.emissive.copy(origEmissive);
          stdMat.emissiveIntensity = 0.0;
          if (stdMat.color && origColor) {
            stdMat.color.lerp(new THREE.Color(0x333b47), lerpFactor);
          }
        } else if (showHeatmap) {
          // Heatmap gradient representation
          if (compId === 'cpu_module' || compId === 'gpu_module') {
            stdMat.emissive.setHex(0xff2200); // Glowing hot red
            stdMat.emissiveIntensity = 0.8;
          } else if (compId === 'thermal_module') {
            stdMat.emissive.setHex(0xff7700); // Warm heat pipe orange
            stdMat.emissiveIntensity = 0.5;
          } else if (compId === 'heatsink_fins') {
            stdMat.emissive.setHex(0xdd4400);
            stdMat.emissiveIntensity = 0.4;
          } else if (compId === 'fan_cpu' || compId === 'fan_gpu') {
            stdMat.emissive.setHex(0x0066cc); // Cool intake blue
            stdMat.emissiveIntensity = 0.3;
          } else {
            stdMat.emissive.copy(origEmissive);
            stdMat.emissiveIntensity = 0.0;
          }
        } else {
          // Restore default material colors & emissives
          stdMat.emissive.copy(origEmissive);
          stdMat.emissiveIntensity = 0.0;
          if (stdMat.color && origColor) {
            stdMat.color.lerp(origColor, lerpFactor);
          }
        }
      });
    });
  });

  // Pointer event handlers for selecting & hovering components
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
    // If clicked empty space
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
