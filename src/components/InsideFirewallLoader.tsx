import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

// --- Configuration ---
const COLORS = {
    cyan: '#00f0ff',
    magenta: '#ff00aa',
    dark: '#050505',
    barrier: '#1a1a1a',
    emissive: '#00f0ff'
};

const TUNNEL_COUNT = 800;
const HEX_LAYERS = 8;

// --- Shaders ---
const TunnelMaterial = {
    vertexShader: `
    attribute float speed;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vAlpha;
    uniform float uTime;
    uniform float uSpeedMultiplier;
    
    void main() {
        vColor = color;
        
        vec3 pos = position;
        
        // Move particles along Z
        // Simulate infinite tunnel by wrapping Z
        float zPos = pos.z + (uTime * speed * uSpeedMultiplier);
        pos.z = mod(zPos, 100.0) - 80.0; // Range -80 to 20
        
        // Stretch based on speed
        float stretch = 1.0 + (speed * uSpeedMultiplier * 0.5);
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        // Scale z by stretch
        // We do this by modifying the projected position or just scaling the instance before this? 
        // Simpler: assume box geometry and scale vertices? 
        // Let's just use the fact they are long boxes and scale them in JS, 
        // or just let them be naturally moving. 
        // Actually, stretch effect is key. 
        // Let's rely on high speed for blur, or scale.z in JS. 
        
        gl_Position = projectionMatrix * mvPosition;
        
        // Fade out at ends
        float dist = abs(pos.z + 30.0); // Center around -30
        vAlpha = 1.0 - smoothstep(20.0, 50.0, dist);
    }
  `,
    fragmentShader: `
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
        if (vAlpha < 0.01) discard;
        gl_FragColor = vec4(vColor, vAlpha);
    }
  `
};

// --- Components ---

const Tunnel = ({ speedMultiplier }: { speedMultiplier: number }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { viewport } = useThree();

    // Data generation
    const { positions, speeds, colors } = useMemo(() => {
        const pos = new Float32Array(TUNNEL_COUNT * 3);
        const spd = new Float32Array(TUNNEL_COUNT);
        const col = new Float32Array(TUNNEL_COUNT * 3);
        const c1 = new THREE.Color(COLORS.cyan);
        const c2 = new THREE.Color(COLORS.magenta);

        for (let i = 0; i < TUNNEL_COUNT; i++) {
            // Tunnel shape
            const r = 8 + Math.random() * 15; // Radius 8-23
            const theta = Math.random() * Math.PI * 2;

            pos[i * 3] = r * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(theta);
            pos[i * 3 + 2] = (Math.random() * 100) - 80;

            spd[i] = 5 + Math.random() * 10;

            const color = Math.random() > 0.8 ? c2 : c1;
            col[i * 3] = color.r;
            col[i * 3 + 1] = color.g;
            col[i * 3 + 2] = color.b;
        }

        return { positions: pos, speeds: spd, colors: col };
    }, []);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSpeedMultiplier: { value: speedMultiplier }
    }), []);

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Update uniforms
            // We'll use a custom ShaderMaterial if we weren't using InstancedMesh with standard material support.
            // But standard material doesn't support custom vertex animation easily without hacking onBeforeCompile.
            // Let's use simple JS animation for compatibility if perf is fine, or simple loop.
            // Actually, for "Neon streams", pure JS loop on 800 items is trivial.
        }
    });

    // Switch to JS animation for reliability with standard materials (ensures bloom works easily)
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Manual "shader" in JS
        for (let i = 0; i < TUNNEL_COUNT; i++) {
            let z = positions[i * 3 + 2];
            // Move
            z += speeds[i] * speedMultiplier * delta;

            // Loop
            if (z > 20) z = -100;
            positions[i * 3 + 2] = z;

            dummy.position.set(
                positions[i * 3],
                positions[i * 3 + 1],
                z
            );

            // Stretch effect
            const stretch = 1 + (speeds[i] * speedMultiplier * 0.05);
            dummy.scale.set(1, 1, stretch * 5); // Long streaks
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, TUNNEL_COUNT]}>
            <boxGeometry args={[0.05, 0.05, 1]} />
            <meshBasicMaterial vertexColors toneMapped={false} />
            <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
        </instancedMesh>
    );
};

const HexagonWall = ({ openState }: { openState: number }) => {
    // openState: 0 (closed) -> 1 (open)
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const { transformData, count } = useMemo(() => {
        const transforms = [];
        const size = 1.2;
        const spacing = 1.02; // Tight gap

        for (let q = -HEX_LAYERS; q <= HEX_LAYERS; q++) {
            for (let r = -HEX_LAYERS; r <= HEX_LAYERS; r++) {
                if (Math.abs(q + r) <= HEX_LAYERS) {
                    const x = size * 1.5 * q * spacing;
                    const z = size * Math.sqrt(3) * (r + q / 2) * spacing;
                    const y = z; // Map to XY plane

                    // Distance from center
                    const dist = Math.sqrt(x * x + y * y);
                    if (dist < 2) continue; // Small hole in very center for lens

                    transforms.push({ x, y: -y, dist });
                }
            }
        }
        return { transformData: transforms, count: transforms.length };
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!meshRef.current) return;

        const t = state.clock.elapsedTime;

        transformData.forEach((data, i) => {
            // Animation logic
            // 1. Idle breathing
            // 2. Open sequence: move away from center

            let x = data.x;
            let y = data.y;
            let z = 0;

            // Breathing z
            z = Math.sin(t * 2 + data.dist * 0.5) * 0.2;

            // Opening
            const openFactor = Math.pow(openState, 2) * 25; // Exponential open
            const angle = Math.atan2(y, x);

            // Add some rotation to the opening
            const rotOffset = openState * Math.PI * 0.5 * (data.dist * 0.1);

            x += Math.cos(angle + rotOffset) * openFactor * (data.dist * 0.5 + 1);
            y += Math.sin(angle + rotOffset) * openFactor * (data.dist * 0.5 + 1);

            // Random jitter when "locked" ? 

            dummy.position.set(x, y, z);

            // Scale down on open
            const s = Math.max(0, 1 - openState * 0.8);
            dummy.scale.set(s, s, s);

            dummy.rotation.z = openState * Math.PI; // Spin while opening

            dummy.updateMatrix();
            meshRef.current?.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group position={[0, 0, -50]}> {/* Barrier Location */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                <cylinderGeometry args={[1, 1, 0.4, 6]} />
                <meshStandardMaterial
                    color={COLORS.barrier}
                    emissive={COLORS.cyan}
                    emissiveIntensity={0.8}
                    roughness={0.2}
                    metalness={0.8}
                />
            </instancedMesh>

            {/* Central locking mechanism (visual only) */}
            <mesh scale={[1 - openState, 1 - openState, 1 - openState]}>
                <ringGeometry args={[3, 4, 6]} />
                <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

const HUD = ({ step, onComplete }: { step: number, onComplete: () => void }) => {
    const [text, setText] = useState("");
    const [threatScore, setThreatScore] = useState(0);
    const [isGranted, setIsGranted] = useState(false);

    useEffect(() => {
        if (step === 1) { // Barrier reached
            const seq = async () => {
                // Typing effect
                const msg = "EXTERNAL ENTITY DETECTED";
                for (let i = 0; i <= msg.length; i++) {
                    setText(msg.slice(0, i));
                    await new Promise(r => setTimeout(r, 30));
                }

                await new Promise(r => setTimeout(r, 500));

                // Threat calc
                const interval = setInterval(() => {
                    setThreatScore(prev => {
                        if (prev > 90) return 0; // Glitchy
                        return prev + Math.floor(Math.random() * 15);
                    });
                }, 50);

                await new Promise(r => setTimeout(r, 1500));
                clearInterval(interval);
                setThreatScore(0);
                setText("THREAT ASSESSMENT: NEGATIVE");

                await new Promise(r => setTimeout(r, 800));
                setText("WELCOME, USER.");
                setIsGranted(true);

                await new Promise(r => setTimeout(r, 800));
                // Trigger open
                onComplete();
            };
            seq();
        }
    }, [step, onComplete]);

    if (step === 0) return null; // Just flying

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center font-mono z-10 text-cyan-500">
            {/* Dynamic Crosshair */}
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                <div className={`absolute border border-cyan-500/50 w-full h-full rounded-full transition-all duration-700 ${isGranted ? 'scale-110 border-green-500' : 'animate-pulse'}`} />
                <div className={`absolute border-2 border-dashed border-cyan-500/30 w-[80%] h-[80%] rounded-full animate-spin-slow`} />

                {/* Center Text */}
                <div className="bg-black/80 backdrop-blur-md p-6 border-y border-cyan-500 text-center min-w-[300px]">
                    <div className="text-xl tracking-widest font-bold mb-2 break-normal whitespace-nowrap overflow-hidden">
                        {text}
                    </div>
                    {!isGranted && threatScore > 0 && (
                        <div className="flex items-center justify-between text-xs text-red-400 mt-2">
                            <span>THREAT_SCORE</span>
                            <span>{threatScore}%</span>
                        </div>
                    )}
                    {isGranted && (
                        <div className="text-green-400 text-sm tracking-[0.5em] animate-pulse mt-2">
                            ACCESS GRANTED
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-10 left-10 w-32 h-32 border-l-2 border-t-2 border-cyan-500/30" />
            <div className="absolute bottom-10 right-10 w-32 h-32 border-r-2 border-b-2 border-cyan-500/30" />
        </div>
    );
};

const Scene = ({ onFinish }: { onFinish: () => void }) => {
    const camRef = useRef<THREE.PerspectiveCamera>(null);
    const [step, setStep] = useState(0); // 0: Fly in, 1: Scan, 2: Open
    const [openState, setOpenState] = useState(0);

    // Animation Sequence
    useEffect(() => {
        if (!camRef.current) return;

        const tl = gsap.timeline();

        // 1. Initial fly-in to barrier
        tl.to(camRef.current.position, {
            z: -40, // Barrier is at -50
            duration: 3.5,
            ease: "power2.out",
            onComplete: () => setStep(1)
        });

    }, []);

    const handleAccessGranted = () => {
        setStep(2);

        // Animate Opening
        gsap.to({}, {
            duration: 1.5,
            onUpdate: function () {
                setOpenState(this.progress());
            },
            ease: "power2.inOut"
        });

        if (camRef.current) {
            gsap.to(camRef.current.position, {
                z: -100, // Fly through
                delay: 0.5,
                duration: 2,
                ease: "power4.in",
                onComplete: onFinish
            });
        }
    };

    return (
        <>
            <PerspectiveCamera ref={camRef} makeDefault position={[0, 0, 10]} fov={75} />
            <color attach="background" args={[COLORS.dark]} />
            <fog attach="fog" args={[COLORS.dark, 10, 100]} />

            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, -30]} intensity={2} color={COLORS.cyan} distance={50} />

            {/* Tunnel Speed control based on phase */}
            <Tunnel speedMultiplier={step === 2 ? 40 : (step === 0 ? 20 : 2)} />

            <HexagonWall openState={openState} />

            {/* Post Processing - Temporarily Disabled due to WebGL build crash */}
            {/* <EffectComposer>
                <Bloom luminanceThreshold={0.4} intensity={2.0} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer> */}

            <Html fullscreen style={{ pointerEvents: 'none' }}>
                <HUD step={step} onComplete={handleAccessGranted} />
            </Html>
        </>
    );
};

const InsideFirewallLoader = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black text-white">
            <Canvas dpr={[1, 2]}>
                <Scene onFinish={onComplete} />
            </Canvas>

            {/* Skip Button */}
            <button
                onClick={onComplete}
                className="absolute items-center top-6 right-6 z-[60] text-xs font-mono text-cyan-500/50 hover:text-cyan-400 border border-cyan-500/20 px-3 py-1 bg-black/50 backdrop-blur"
            >
                SKIP_SEQ //
            </button>

            {/* Mobile Fallback Hint (Hidden on Desktop) */}
            <div className="md:hidden absolute bottom-4 w-full text-center text-[10px] text-gray-600">
                OPTIMIZED FOR DESKTOP
            </div>
        </div>
    );
};

export default InsideFirewallLoader;
