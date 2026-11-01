// src/components/3d/CoolingAnimation.tsx
// Interactive Cooling Simulation: Rotating fan impellers & aerodynamic airflow particles

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CoolingAnimationProps {
  active: boolean;
  rpm: number; // 0 to 4500 RPM
  showAirflow: boolean;
  explodeAmount: number;
}

interface Particle {
  pos: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  type: 'intake' | 'exhaust';
  fanSide: 'left' | 'right';
}

export const CoolingAnimation: React.FC<CoolingAnimationProps> = ({
  active,
  rpm,
  showAirflow,
  explodeAmount,
}) => {
  const { scene } = useThree();
  const leftFanRef = useRef<THREE.Object3D | null>(null);
  const rightFanRef = useRef<THREE.Object3D | null>(null);
  const particlesMeshRef = useRef<THREE.InstancedMesh>(null);

  // Find the impeller nodes once
  React.useEffect(() => {
    scene.traverse((obj) => {
      if (obj.name === 'fan_cpu_impeller') leftFanRef.current = obj;
      if (obj.name === 'fan_gpu_impeller') rightFanRef.current = obj;
    });
  }, [scene]);

  // Particle simulation parameters
  const PARTICLE_COUNT = 140;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize particle states
  const particles = useMemo<Particle[]>(() => {
    const list: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isExhaust = i % 2 === 0;
      const isLeft = i % 4 < 2;
      const centerX = isLeft ? -0.118 : 0.118;

      list.push({
        pos: new THREE.Vector3(
          centerX + (Math.random() - 0.5) * 0.04,
          isExhaust ? 0.004 : -0.025 + Math.random() * 0.015,
          isExhaust ? -0.105 - Math.random() * 0.04 : -0.082 + (Math.random() - 0.5) * 0.03
        ),
        velocity: new THREE.Vector3(),
        life: Math.random(),
        maxLife: 1.0,
        type: isExhaust ? 'exhaust' : 'intake',
        fanSide: isLeft ? 'left' : 'right',
      });
    }
    return list;
  }, []);

  // Frame update: rotate fan blades and step particle physics
  useFrame((_, delta) => {
    // Effective fan speed: rotations per second = rpm / 60
    const rotSpeed = active ? (rpm / 60) * Math.PI * 2 * delta : 0;

    // CPU fan spins clockwise, GPU fan spins counter-clockwise (Lenovo outward exhaust design)
    if (leftFanRef.current) {
      leftFanRef.current.rotation.y += rotSpeed;
    }
    if (rightFanRef.current) {
      rightFanRef.current.rotation.y -= rotSpeed;
    }

    // Step airflow particles if active and visible
    if (particlesMeshRef.current && showAirflow && active) {
      const mesh = particlesMeshRef.current;
      const speedScale = (rpm / 2500) * 0.08;

      particles.forEach((p, idx) => {
        p.life += delta * (0.8 + speedScale * 4);

        const centerX = p.fanSide === 'left' ? -0.118 : 0.118;

        // Reset particle when life ends
        if (p.life >= p.maxLife) {
          p.life = 0;
          if (p.type === 'intake') {
            // Intake starts under the bottom cover
            p.pos.set(
              centerX + (Math.random() - 0.5) * 0.045,
              -0.028,
              -0.082 + (Math.random() - 0.5) * 0.035
            );
          } else {
            // Exhaust starts inside the rear fin stacks
            p.pos.set(
              centerX + (Math.random() - 0.5) * 0.035,
              0.004,
              -0.105
            );
          }
        }

        // Advance positions
        if (p.type === 'intake') {
          // Intake flows upwards and slightly inward towards the fan hub
          p.pos.y += delta * 0.035 * (rpm / 2000);
          p.pos.x = THREE.MathUtils.lerp(p.pos.x, centerX, 0.04);
        } else {
          // Exhaust shoots rearward (-Z) and spreads slightly
          p.pos.z -= delta * 0.075 * (rpm / 2000);
          p.pos.y += (Math.random() - 0.5) * delta * 0.005;
        }

        // Apply explode offset so particles track the thermal module when exploded
        const currentY = p.pos.y + (explodeAmount * 0.08);

        dummy.position.set(p.pos.x, currentY, p.pos.z);

        // Particle scale fades in and out with life
        const scale = Math.sin(p.life * Math.PI) * 0.0035;
        dummy.scale.set(scale, scale, scale * (p.type === 'exhaust' ? 2.5 : 1.0));
        dummy.rotation.x = p.type === 'exhaust' ? Math.PI / 2 : 0;
        dummy.updateMatrix();

        mesh.setMatrixAt(idx, dummy.matrix);

        // Color coding: Blue/Cyan for cold intake, Orange/Red for hot exhaust
        const color = p.type === 'intake'
          ? new THREE.Color(0x38bdf8) // Cool cyan air
          : new THREE.Color(0xff4500); // Hot red-orange exhaust
        mesh.setColorAt(idx, color);
      });

      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group name="cooling_simulation">
      {showAirflow && active && (
        <instancedMesh
          ref={particlesMeshRef}
          args={[undefined, undefined, PARTICLE_COUNT]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial transparent opacity={0.75} depthWrite={false} />
        </instancedMesh>
      )}
    </group>
  );
};

