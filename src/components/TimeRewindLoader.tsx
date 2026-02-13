import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// --- Configuration ---
const CITY_SIZE = 100;
const BUILDING_COUNT = 1200; // Dense city
const STREAM_COUNT = 800;    // Dense data

const COLORS = {
    chaos: new THREE.Color('#ef4444'),    // Red-500
    stable: new THREE.Color('#3b82f6'),   // Blue-500
    cyan: new THREE.Color('#06b6d4'),     // Cyan-500
    dark: '#020617'                       // Slate-950
};

// --- Shaders ---
const CityShader = {
    uniforms: {
        uTime: { value: 0 },
        uGlitchStrength: { value: 0 }, // 0 to 1
        uRewind: { value: 0 },         // 0 to 1
        uScanLine: { value: 0 },       // Vertical scan position
        uColorA: { value: COLORS.stable },
        uColorB: { value: COLORS.chaos }
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        varying float vHeight;
        attribute float aHeight;
        
        uniform float uTime;
        uniform float uGlitchStrength;
        
        void main() {
            vUv = uv;
            vHeight = aHeight;
            vec3 pos = position;
            
            // Glitch Displacement
            if(uGlitchStrength > 0.0) {
                float noise = sin(pos.y * 10.0 + uTime * 20.0) * cos(pos.x * 5.0);
                if(abs(noise) > 0.9 - (uGlitchStrength * 0.2)) {
                    pos.x += noise * uGlitchStrength * 2.0;
                    pos.z += noise * uGlitchStrength * 2.0;
                }
            }
            
            vec4 worldPos = instanceMatrix * vec4(pos, 1.0);
            vPos = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        varying float vHeight;
        
        uniform float uTime;
        uniform float uGlitchStrength;
        uniform float uRewind;
        uniform float uScanLine; // 0 to 100
        uniform vec3 uColorA; // Stable
        uniform vec3 uColorB; // Chaos
        
        void main() {
            // Base Color Mix
            float chaosMix = smoothstep(0.0, 1.0, uGlitchStrength);
            vec3 color = mix(uColorA, uColorB, chaosMix);
            
            // Grid Lines
            float gridY = step(0.98, fract(vUv.y * vHeight * 0.5));
            float gridX = step(0.95, fract(vUv.x));
            
            // Glitch Artifacts
            if(uGlitchStrength > 0.0) {
                 float glitchBar = step(0.9, sin(vPos.y * 5.0 + uTime * 10.0));
                 if(glitchBar > 0.5) color = vec3(1.0, 1.0, 1.0);
            }
            
            // Stabilization Scanline
            if(uRewind > 0.0) {
                float dist = length(vPos.xz);
                float wave = smoothstep(uScanLine - 5.0, uScanLine, dist) * (1.0 - smoothstep(uScanLine, uScanLine + 2.0, dist));
                color += vec3(0.0, 1.0, 1.0) * wave * 2.0;
                
                // Force stable behind wave
                if(dist < uScanLine) {
                    color = uColorA;
                    // Add "restored" grid
                    if(gridY > 0.5 || gridX > 0.5) color += vec3(0.2, 0.4, 1.0); 
                }
            }
            
            // Edges logic for chaos
            if(uGlitchStrength > 0.5 && (gridY > 0.5 || gridX > 0.5)) {
                color = vec3(1.0, 0.2, 0.2); // Red edges in chaos
            }
            
            // Darken bottom
            color *= smoothstep(0.0, 10.0, vPos.y);

            gl_FragColor = vec4(color, 1.0);
        }
    `
};

// --- Components ---

const DataRain = ({ mode }: { mode: 'chaos' | 'freeze' | 'rewind' | 'stable' }) => {
    // Mode affects speed and direction
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const count = STREAM_COUNT;

    // Initial state
    const { speeds, offsets } = useMemo(() => {
        const s = new Float32Array(count);
        const o = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            s[i] = Math.random() * 0.5 + 0.2; // Speed
            o[i * 3] = (Math.random() - 0.5) * CITY_SIZE * 1.5;
            o[i * 3 + 1] = Math.random() * 40 + 5;
            o[i * 3 + 2] = (Math.random() - 0.5) * CITY_SIZE * 1.5;
        }
        return { speeds: s, offsets: o };
    }, []);

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        for (let i = 0; i < count; i++) {
            let y = offsets[i * 3 + 1];

            if (mode === 'chaos') {
                y -= speeds[i] * delta * 20; // Fall down
                if (y < 0) y = 45;
            } else if (mode === 'rewind') {
                y += speeds[i] * delta * 60; // Up fast
                if (y > 50) y = 0;
            } else if (mode === 'freeze') {
                // No movement
            }

            offsets[i * 3 + 1] = y;

            dummy.position.set(offsets[i * 3], y, offsets[i * 3 + 2]);
            // Stretch based on speed
            let len = (mode === 'freeze') ? 0.2 : speeds[i] * 5;
            dummy.scale.set(0.1, len, 0.1);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);

            // Color
            if (mode === 'chaos') color.set(COLORS.chaos);
            else color.set(COLORS.cyan);

            meshRef.current.setColorAt(i, color);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial transparent opacity={0.6} toneMapped={false} />
        </instancedMesh>
    );
};

const City = ({ matRef }: { matRef: React.MutableRefObject<THREE.ShaderMaterial | null> }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    // Generate City Layout
    const { positions, heights } = useMemo(() => {
        const p = new Float32Array(BUILDING_COUNT * 3);
        const h = new Float32Array(BUILDING_COUNT);

        for (let i = 0; i < BUILDING_COUNT; i++) {
            let x = (Math.random() - 0.5) * CITY_SIZE;
            let z = (Math.random() - 0.5) * CITY_SIZE;

            // Avoid center channel for camera flyby
            if (Math.abs(x) < 5) x += (x > 0 ? 5 : -5);

            p[i * 3] = x;
            p[i * 3 + 1] = 0; // Ground
            p[i * 3 + 2] = z;

            // Variable height, taller near center-ish
            let dist = Math.sqrt(x * x + z * z);
            let height = Math.random() * 30 + 5;
            if (dist < 20) height += 20;

            h[i] = height;
        }
        return { positions: p, heights: h };
    }, []);

    const dummy = new THREE.Object3D();

    useEffect(() => {
        if (!meshRef.current) return;
        for (let i = 0; i < BUILDING_COUNT; i++) {
            dummy.position.set(positions[i * 3], heights[i] / 2, positions[i * 3 + 2]);
            dummy.scale.set(2 + Math.random(), heights[i], 2 + Math.random());
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        // Attribute for shader
        meshRef.current.geometry.setAttribute('aHeight', new THREE.InstancedBufferAttribute(heights, 1));
    }, []);

    useFrame((state) => {
        if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, BUILDING_COUNT]}>
            <boxGeometry args={[1, 1, 1]} />
            <shaderMaterial
                ref={matRef}
                uniforms={THREE.UniformsUtils.clone(CityShader.uniforms)}
                vertexShader={CityShader.vertexShader}
                fragmentShader={CityShader.fragmentShader}
                transparent
            />
        </instancedMesh>
    );
};

const TextDecoder = ({ text, start, className }: any) => {
    const [display, setDisplay] = useState("");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@$";

    useEffect(() => {
        if (!start) return;

        let iter = 0;
        const interval = setInterval(() => {
            setDisplay(text.split("").map((letter: string, index: number) => {
                if (index < iter) return letter;
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(""));

            if (iter >= text.length) clearInterval(interval);
            iter += 1 / 2; // Speed
        }, 30);
        return () => clearInterval(interval);
    }, [start, text]);

    return <div className={className}>{display}</div>;
};

// --- Scene Logic ---
// Controls camera and animation state inside R3F Canvas context
const SceneDirector = ({ onComplete, setMode, setShowText, matRef }: any) => {
    const camRef = useRef<THREE.PerspectiveCamera>(null);

    useEffect(() => {
        // Wait for refs to be ready
        if (!camRef.current || !matRef.current) return;

        const tl = gsap.timeline();

        // 1. Chaos (0s - 3s)
        // Camera flies forward
        tl.to(camRef.current.position, {
            z: 0,
            duration: 3,
            ease: "none"
        });

        // Glitch intensity ramps up
        tl.to(matRef.current.uniforms.uGlitchStrength, { value: 1.0, duration: 2.5, ease: "rough" }, 0);

        // 2. Freeze (3s)
        tl.call(() => setMode('freeze'));
        tl.to({}, { duration: 0.2 }); // Hold

        // 3. Rewind (3.2s - 5.5s)
        tl.call(() => setMode('rewind'));

        // Camera SUCTION effect (Pull back fast + FOV warp)
        tl.to(camRef.current.position, { z: -80, y: 40, duration: 2.3, ease: "power3.inOut" }, "rewind");
        tl.to(camRef.current, { fov: 100, duration: 1, yoyo: true, repeat: 1 }, "rewind");

        // Shader clean up
        tl.to(matRef.current.uniforms.uGlitchStrength, { value: 0, duration: 1.5 }, "rewind");
        tl.to(matRef.current.uniforms.uRewind, { value: 1, duration: 0.1 }, "rewind"); // Enable scanline
        tl.to(matRef.current.uniforms.uScanLine, { value: 50, duration: 2, ease: "power2.out" }, "rewind");

        // 4. Stable (5.5s)
        tl.call(() => setMode('stable'));
        tl.call(() => setShowText(true));

        // 5. Finish (8.5s)
        tl.call(onComplete, [], 8.5);

        return () => { tl.kill(); };

    }, [onComplete, setMode, setShowText]); // Runs once when component mounts inside Canvas

    return <PerspectiveCamera ref={camRef} makeDefault position={[0, 5, -40]} fov={60} />;
};

const TimeRewindLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [mode, setMode] = useState<'chaos' | 'freeze' | 'rewind' | 'stable'>('chaos');
    const [showText, setShowText] = useState(false);

    // We create the Ref here, pass it to City (to attach material) and Director (to animate it)
    const matRef = useRef<THREE.ShaderMaterial>(null);

    return (
        <div className="fixed inset-0 z-50 bg-[#020617] text-white overflow-hidden">
            <Canvas>
                <color attach="background" args={['#020617']} />
                <fog attach="fog" args={['#020617', 10, 150]} />

                {/* Director handles camera and timeline inside Canvas context */}
                <SceneDirector
                    onComplete={onComplete}
                    setMode={setMode}
                    setShowText={setShowText}
                    matRef={matRef}
                />

                <City matRef={matRef} />
                <DataRain mode={mode} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={0.5} />
            </Canvas>

            {/* Overlay UI */}
            {showText && (
                <div className="absolute inset-0 flex items-center justify-center flex-col z-20 pointer-events-none">
                    <TextDecoder
                        text="SECURITY IS ENGINEERED"
                        start={showText}
                        className="text-cyan-500 text-xs md:text-sm tracking-[0.5em] font-mono mb-4"
                    />
                    <div className="overflow-hidden">
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter animate-in slide-in-from-bottom duration-700">
                            DHANAPRIYAN
                        </h1>
                    </div>
                </div>
            )}

            {/* Playback Controls / Skip */}
            <button onClick={onComplete} className="absolute top-8 right-8 z-50 text-[10px] text-cyan-600 border border-cyan-900 px-3 py-1 hover:bg-cyan-900/20 transition-all uppercase tracking-widest">
                Skip Intro
            </button>
        </div>
    );
};

export default TimeRewindLoader;
