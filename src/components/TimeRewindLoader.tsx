import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// --- Configuration ---
const CITY_SIZE = 60;
const BUILDING_COUNT = 600; // Increased for density
const DURATION = 9;

const COLORS = {
    chaos: new THREE.Color('#ff0033'),
    stable: new THREE.Color('#001133'), // Deep Blue
    highlight: new THREE.Color('#00f0ff'), // Cyan
};

// --- Utils ---
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// --- Shaders ---
const BuildingMaterial = {
    vertexShader: `
    varying vec2 vUv;
    varying vec3 vPos;
    varying float vHeight;
    attribute vec3 instanceColor;
    attribute float instanceHeight;
    
    uniform float uTime;
    uniform float uDistortion; // 0 = none, 1 = max chaos
    uniform float uPulse; // 0 to 1 (expansion wave)
    
    void main() {
      vUv = uv;
      vHeight = instanceHeight;
      
      vec3 pos = position;
      vec4 modelPos = instanceMatrix * vec4(pos, 1.0);
      vPos = modelPos.xyz;
      
      // Glitch effect (Chaos Phase)
      if (uDistortion > 0.0) {
        float noise = sin(modelPos.y * 0.5 + uTime * 10.0) * cos(modelPos.x * 0.5 + uTime * 5.0);
        
        // Random vertex displacement
        if (noise > 0.9) {
           pos.x += noise * uDistortion * 2.0;
        }
      }

      // Pulse Stabilization Effect (Ascension Phase)
      // Expand vertical scale slightly as pulse passes?
      float dist = length(modelPos.xz);
      if (uPulse > 0.0) {
         float wave = smoothstep(uPulse * 50.0 - 10.0, uPulse * 50.0, dist);
         // No geometry change, just pass for color
      }
      
      gl_Position = projectionMatrix * viewMatrix * instanceMatrix * vec4(pos, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    varying vec3 vPos;
    varying float vHeight;
    
    uniform float uTime;
    uniform float uDistortion;
    uniform float uPulse; 
    uniform vec3 uColorChaos;
    uniform vec3 uColorStable;
    uniform vec3 uColorHighlight;
    
    void main() {
      // Base Color Logic
      vec3 color = uColorChaos;
      
      // Distance from center for pulse
      float dist = length(vPos.xz);
      float wave = step(dist, uPulse * 100.0); // 0 before wave, 1 after wave
      
      // Mix Chaos -> Stable based on Wave
      color = mix(uColorChaos, uColorStable, wave);
      
      // Edges / Grid (The "Blue Glass" look)
      float edge = step(0.95, fract(vUv.y * vHeight)) + step(0.95, fract(vUv.x));
      
      // Glitch overlapping pattern
      if (uDistortion > 0.0) {
          float glitch = sin(vPos.y * 20.0 + uTime * 20.0);
          if (glitch > 0.9) color += vec3(1.0, 0.0, 0.0);
      }
      
      // Stable Glow
      if (wave > 0.5) {
          // Vertical gradient
          color += uColorHighlight * 0.1 * (vPos.y / 20.0);
          
          // Edge glow
          if (edge > 0.5) {
             color = mix(color, uColorHighlight, 0.8);
          }
      } else {
          // Chaos Grid (Red)
          if (edge > 0.5) {
             color += vec3(1.0, 0.0, 0.0) * 0.5;
          }
      }
      
      // Transparency for glass feel (simple alpha)
      float alpha = 0.9;
      if (wave > 0.5 && edge < 0.5) alpha = 0.6; // Glass body
      
      gl_FragColor = vec4(color, alpha);
    }
  `
};

// --- Components ---

const DigitalCity = ({ timelineRef }: { timelineRef: React.MutableRefObject<any> }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // Generate City Layout
    const { positions, heights } = useMemo(() => {
        const pos = new Float32Array(BUILDING_COUNT * 3);
        const h = new Float32Array(BUILDING_COUNT);

        let idx = 0;
        // Create a "Canyon" layout (clear path in center for camera flight)
        for (let i = 0; i < BUILDING_COUNT; i++) {
            let x = randomRange(-CITY_SIZE, CITY_SIZE);
            let z = randomRange(-10, CITY_SIZE * 2); // Extend forward

            // Canyon Logic: If near center X, push out
            if (Math.abs(x) < 8) {
                x = (x > 0 ? 1 : -1) * (8 + Math.random() * 5);
            }

            pos[idx * 3] = x;
            pos[idx * 3 + 1] = 0;
            pos[idx * 3 + 2] = z;

            // Taller buildings near the "road"
            const proximity = Math.max(0, 1 - (Math.abs(x) / 30));
            h[idx] = randomRange(5, 10) + (proximity * 30); // Up to 40 units tall

            idx++;
        }
        return { positions: pos, heights: h };
    }, []);

    const tempObj = new THREE.Object3D();

    useFrame((state) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    });

    // Set initial positions
    useEffect(() => {
        if (!meshRef.current) return;
        for (let i = 0; i < BUILDING_COUNT; i++) {
            tempObj.position.set(positions[i * 3], heights[i] / 2, positions[i * 3 + 2]);
            tempObj.scale.set(2, heights[i], 2); // Thicker buildings
            tempObj.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObj.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;

        // Populate height attribute for shader
        meshRef.current.geometry.setAttribute(
            'instanceHeight',
            new THREE.InstancedBufferAttribute(heights, 1)
        );
    }, [positions, heights]);

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, BUILDING_COUNT]}>
            <boxGeometry args={[1, 1, 1]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={BuildingMaterial.vertexShader}
                fragmentShader={BuildingMaterial.fragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uDistortion: { value: 1.0 }, // Starts fully distorted
                    uPulse: { value: 0 },
                    uColorChaos: { value: COLORS.chaos },
                    uColorStable: { value: COLORS.stable },
                    uColorHighlight: { value: COLORS.highlight },
                }}
                transparent
                side={THREE.DoubleSide}
            />
        </instancedMesh>
    );
};

// --- Camera & Sequence Controller ---
const Director = ({ onComplete, sceneRef }: { onComplete: () => void, sceneRef: any }) => {
    const camRef = useRef<THREE.PerspectiveCamera>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!camRef.current) return;

        // Find the material in the scene to animate uniforms
        // A bit hacky, but robust enough for this component structure
        let mat: THREE.ShaderMaterial | null = null;

        // Wait for mount
        setTimeout(() => {
            // @ts-ignore
            const mesh = sceneRef.current?.children.find(c => c.isInstancedMesh);
            if (mesh) mat = mesh.material;

            if (!mat) return;

            // --- MASTER TIMELINE ---
            tl.current = gsap.timeline({
                onComplete: () => {
                    // End sequence
                }
            });

            // 1. CHAOS (0-2s)
            // Camera: Shaky, looking around
            camRef.current.position.set(0, 5, -10);
            tl.current.to(camRef.current.position, {
                x: 2, y: 6, z: -8, duration: 2, ease: "rough({ strength: 1, points: 20 })" // Shaky
            }, 0);

            // 2. FREEZE (2-3s)
            tl.current.to(mat.uniforms.uDistortion, { value: 0, duration: 0.1 }, 2); // Snap freeze

            // 3. REWIND (3-4.5s)
            // Camera pulls back slightly
            tl.current.to(camRef.current.position, { z: -20, duration: 1.5, ease: "power2.inOut" }, 3);

            // 4. STABILIZE / PULSE (4.5s)
            tl.current.to(mat.uniforms.uPulse, { value: 2.0, duration: 2, ease: "power2.out" }, 4.5);

            // 5. ASCENSION FLIGHT (5s - 8s)
            // Fly THROUGH the city canyon
            tl.current.to(camRef.current.position, {
                x: 0,
                y: 20, // Rise up
                z: 80, // Fly far forward through city
                duration: 4,
                ease: "power2.inOut"
            }, 4.5);

            tl.current.to(camRef.current.rotation, {
                x: 0,
                duration: 4
            }, 4.5);

        }, 100);

        return () => { tl.current?.kill(); };
    }, [sceneRef]);

    return <PerspectiveCamera ref={camRef} makeDefault position={[0, 5, -20]} fov={75} />;
};

// --- Name Reveal (HTML Overlay) ---
const NameReveal = ({ show }: { show: boolean }) => {
    return (
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="text-center z-10">
                {/* Decorative Line */}
                <div className={`w-[1px] h-32 bg-gradient-to-b from-transparent via-cyan-500 to-transparent mx-auto mb-8 transition-all duration-1000 ${show ? 'h-32 opacity-100' : 'h-0 opacity-0'}`} />

                <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
                    DHANAPRIYAN
                </h1>

                <div className="mt-6 flex items-center justify-center gap-4 text-cyan-400/80 font-mono tracking-[0.3em] text-sm md:text-base uppercase">
                    <span>Senior</span>
                    <span className="w-1 h-1 bg-cyan-500 rounded-full" />
                    <span>Cyber Security</span>
                    <span className="w-1 h-1 bg-cyan-500 rounded-full" />
                    <span>Engineer</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Container ---
const TimeRewindLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [showText, setShowText] = useState(false);
    const sceneRef = useRef<THREE.Group>(null);

    useEffect(() => {
        // Trigger text reveal towards end of flight
        const timer = setTimeout(() => setShowText(true), 7500);

        // Trigger completion (transition to home)
        const exitTimer = setTimeout(onComplete, 9500);

        return () => { clearTimeout(timer); clearTimeout(exitTimer); };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-[#020205]">
            {/* Gradient Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205]/50 pointer-events-none z-10" />

            {/* Skip */}
            <div className="absolute top-8 right-8 z-[60]">
                <button
                    onClick={onComplete}
                    className="text-xs uppercase tracking-[0.2em] text-cyan-500/50 hover:text-cyan-400 transition-colors border border-cyan-900/30 px-6 py-2 bg-black/20 backdrop-blur-md"
                >
                    Skip
                </button>
            </div>

            <NameReveal show={showText} />

            <Canvas>
                <color attach="background" args={['#020205']} />
                <fog attach="fog" args={['#020205', 20, 100]} />

                <group ref={sceneRef}>
                    <DigitalCity timelineRef={sceneRef} />
                </group>

                <Director onComplete={onComplete} sceneRef={sceneRef} />

                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

                <ambientLight intensity={0.5} />
            </Canvas>
        </div>
    );
};

export default TimeRewindLoader;
