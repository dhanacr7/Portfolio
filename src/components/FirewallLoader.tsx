import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Text, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

// --- Configuration ---
const COLORS = {
    cyan: '#00f0ff',
    magenta: '#ff00aa',
    dark: '#050505',
    barrier: '#1a1a1a',
};

const COUNT = 400; // Tunnel particles
const BARRIER_HEX_COUNT = 60; // Hexagons in the wall

// --- Utility: Random Range ---
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// --- Component: Tunnel Data Streams ---
const Tunnel = ({ speed }: { speed: number }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { viewport } = useThree();

    // Generate initial positions
    const [positions, speeds, colors] = useMemo(() => {
        const pos = new Float32Array(COUNT * 3);
        const spd = new Float32Array(COUNT);
        const col = new Float32Array(COUNT * 3);
        const colorMethods = [new THREE.Color(COLORS.cyan), new THREE.Color(COLORS.magenta)];

        for (let i = 0; i < COUNT; i++) {
            // Cylindrical distribution
            const theta = Math.random() * Math.PI * 2;
            const r = randomRange(5, 15); // Tunnel radius
            const z = randomRange(-50, 50);

            pos[i * 3] = r * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(theta);
            pos[i * 3 + 2] = z;

            spd[i] = randomRange(0.5, 2.0);

            const c = Math.random() > 0.7 ? colorMethods[1] : colorMethods[0];
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }
        return [pos, spd, col];
    }, []);

    const tempObj = new THREE.Object3D();

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Move particles towards camera
        // We'll simulate movement by moving objects +Z. 
        // If z > boundary, reset to deep -Z.

        for (let i = 0; i < COUNT; i++) {
            // Update Z position in our internal array? 
            // InstancedMesh does not keep state, we read from formatted array or just use dummy obj

            // This is tricky with static initial positions. Let's just update the matrix directly.
            // But doing getMatrixAt every frame for 1000 items is slow.
            // BETTER: Use a shader material for movement? Or just iterate. 400 is fine.

            let z = positions[i * 3 + 2];
            z += speeds[i] * speed * delta * 20; // Move fast

            if (z > 20) z = -100; // Reset
            positions[i * 3 + 2] = z;

            tempObj.position.set(
                positions[i * 3],
                positions[i * 3 + 1],
                z
            );
            // Rotation for "stream" effect? Scale z?
            tempObj.scale.z = 5 + speeds[i] * 5; // Long streaks
            tempObj.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObj.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
            <boxGeometry args={[0.05, 0.05, 1]} />
            <meshBasicMaterial toneMapped={false} vertexColors />
            {/* We need to apply colors via attribute */}
            <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
        </instancedMesh>
    );
};

// --- Component: Firewall Barrier ---
const FirewallBarrier = ({ openProgress, rotationSpeed }: { openProgress: number, rotationSpeed: number }) => {
    const meshRef = useRef<THREE.Group>(null);
    const hexRef = useRef<THREE.InstancedMesh>(null);

    // Grid layout for hexagons
    const { positions, uvs } = useMemo(() => {
        const pos = [];
        const uvCoords = [];
        // Create a circular wall of hexes
        const layers = 6;
        let hexCount = 0;

        // Hex logic: 
        // x = size * 3/2 * q
        // y = size * sqrt(3) * (r + q/2)
        const size = 0.8;
        const spacing = 1.05;

        for (let q = -layers; q <= layers; q++) {
            for (let r = -layers; r <= layers; r++) {
                if (Math.abs(q + r) <= layers) { // Hex grid shape
                    const x = size * 1.5 * q * spacing;
                    const z = size * Math.sqrt(3) * (r + q / 2) * spacing; // Swap Y/Z for vertical wall facing camera? No, usually XY plane.
                    // Let's stick to XY plane for the wall, Z is depth.
                    const y = z;

                    // Don't spawn centered ones to leave a small opening? No, solid first.
                    pos.push({ x, y: -y, z: 0, q, r });
                    uvCoords.push({ u: q, v: r });
                    hexCount++;
                }
            }
        }
        return { positions: pos, uvs: uvCoords };
    }, []);

    const tempObj = new THREE.Object3D();

    useFrame((state, delta) => {
        if (!meshRef.current || !hexRef.current) return;

        // Rotate entire barrier
        meshRef.current.rotation.z += rotationSpeed * delta;

        // Animate Opening
        // Hexes move away from center based on openProgress
        // We can simply scale the positions?

        const openFactor = THREE.MathUtils.smoothstep(openProgress, 0, 1) * 15; // Max separation

        positions.forEach((p, i) => {
            // Calculate distance from center
            const dist = Math.sqrt(p.x * p.x + p.y * p.y);
            const moveDir = Math.atan2(p.y, p.x);

            // Add noise/wave effect?
            const noise = Math.sin(state.clock.elapsedTime * 2 + dist * 0.5) * 0.2;
            const zOff = noise * (1 - openProgress); // Flatten as it opens

            // Move out
            const currentX = p.x + Math.cos(moveDir) * openFactor * (dist * 0.2 + 0.5);
            const currentY = p.y + Math.sin(moveDir) * openFactor * (dist * 0.2 + 0.5);

            tempObj.position.set(currentX, currentY, zOff);

            // Scale down as they fly out?
            const scale = Math.max(0, 1 - openProgress * 0.5);
            tempObj.scale.set(scale, scale, scale);

            tempObj.rotation.x = noise;
            tempObj.rotation.y = noise;

            tempObj.updateMatrix();
            hexRef.current!.setMatrixAt(i, tempObj.matrix);
        });
        hexRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group ref={meshRef} position={[0, 0, -20]}> {/* Start in front of camera */}
            <instancedMesh ref={hexRef} args={[undefined, undefined, positions.length]}>
                <cylinderGeometry args={[0.7, 0.7, 0.2, 6]} />
                <meshStandardMaterial
                    color={COLORS.barrier}
                    emissive={COLORS.cyan}
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.9}
                />
            </instancedMesh>
            {/* Inner Ring Light */}
            <mesh position={[0, 0, -0.5]}>
                <ringGeometry args={[0, 8, 32]} />
                <meshBasicMaterial color="black" side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

// --- Component: Camera Controller ---
const CameraController = ({ step, onOpen }: { step: number, onOpen: () => void }) => {
    const camRef = useRef<THREE.PerspectiveCamera>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!camRef.current) return;

        // Initial fly-in
        // Z: 10 -> -15 (Stopping at barrier at -20)

        const ctx = gsap.context(() => {
            tl.current = gsap.timeline();

            // Step 0: Initial Rush
            tl.current.to(camRef.current!.position, {
                z: -10,
                duration: 4,
                ease: "power2.inOut",
            });

            // Step 1: Wait for HUD (handled by parent step state)
        }, camRef);

        return () => ctx.revert();
    }, []);

    // Handle "Scan Complete" -> Open Barrier
    useEffect(() => {
        if (step === 3 && camRef.current) {
            // Triggered externally when HUD says Access Granted
            gsap.to(camRef.current.position, {
                z: -40, // Fly THROUGH the gate
                duration: 2.5,
                ease: "power3.in",
                delay: 0.5,
                onComplete: onOpen // Call parent to unmount loader
            });
        }
    }, [step, onOpen]);

    return <PerspectiveCamera ref={camRef} makeDefault position={[0, 0, 30]} fov={70} />;
};

// --- Main Scene ---
const Scene = ({ step, setStep, onComplete }: any) => {
    // Derived animation states
    const [openProgress, setOpenProgress] = useState(0);

    useFrame((state, delta) => {
        if (step === 3) {
            // Manually animate open prop for React component
            // We could use GSAP directly on a ref too, but this propagates to the barrier component
            setOpenProgress(prev => Math.min(prev + delta * 0.8, 1)); // Open over ~1.2s
        }
    });

    return (
        <>
            <color attach="background" args={[COLORS.dark]} />
            <fog attach="fog" args={[COLORS.dark, 10, 60]} />

            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 10]} intensity={2} color={COLORS.cyan} distance={20} decay={2} />
            <spotLight position={[0, 10, -10]} intensity={5} color={COLORS.magenta} angle={0.5} penumbra={1} />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Tunnel speed={step === 3 ? 10 : (step === 0 ? 5 : 0.5)} />
            {/* Slow down tunnel when stopped at barrier, speed up when flying through */}

            <FirewallBarrier
                openProgress={openProgress}
                rotationSpeed={step === 0 ? 0.2 : 0.05}
            />

            <CameraController step={step} onOpen={onComplete} />

            {/* <EffectComposer>
                <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.6} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer> */}
        </>
    );
};


// --- Component: HUD Overlay ---
const HUD = ({ step, setStep }: { step: number, setStep: (s: number) => void }) => {
    const [text, setText] = useState("");
    const [threat, setThreat] = useState(0);
    const [status, setStatus] = useState("SCANNING...");

    useEffect(() => {
        const sequence = async () => {
            // Wait for camera to arrive (approx 3s)
            await new Promise(r => setTimeout(r, 2500));
            setStep(1); // Arrived at barrier
            setText("EXTERNAL ENTITY DETECTED");

            // Threat Calc
            const interval = setInterval(() => {
                setThreat(prev => Math.min(prev + Math.floor(Math.random() * 10), 99));
            }, 100);

            await new Promise(r => setTimeout(r, 1500));
            clearInterval(interval);
            setThreat(0); // Reset or Keep? Let's verify identity.
            setStatus("IDENTIFYING...");

            await new Promise(r => setTimeout(r, 1000));
            setStatus("VERIFIED: ADMIN");
            setText("ACCESS GRANTED");
            setStep(2); // Verified

            await new Promise(r => setTimeout(r, 800));
            setStep(3); // Open
        };
        sequence();
    }, [setStep]);

    if (step === 3) return null; // Hide HUD on entry

    return (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
            {step >= 1 && (
                <div className="flex flex-col items-center">
                    {/* Crosshair */}
                    <div className="relative w-64 h-64 border border-cyan-500/30 rounded-full flex items-center justify-center animate-spin-slow">
                        <div className="absolute top-0 bottom-0 w-[1px] bg-cyan-500/50" />
                        <div className="absolute left-0 right-0 h-[1px] bg-cyan-500/50" />
                        <div className="w-56 h-56 border border-dashed border-cyan-500/20 rounded-full" />
                    </div>

                    {/* Text Data */}
                    <div className="absolute mt-32 text-center bg-black/60 backdrop-blur-md p-4 border-l-2 border-r-2 border-cyan-500">
                        <h2 className="text-cyan-400 font-mono text-xl tracking-[0.2em] font-bold">{text}</h2>
                        <div className="mt-2 flex justify-between text-xs font-mono text-cyan-200/70 w-64">
                            <span>THREAT_LVL: {threat}%</span>
                            <span>{status}</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-2 w-full h-1 bg-gray-800">
                            <div
                                className="h-full bg-cyan-500 transition-all duration-300"
                                style={{ width: step === 2 ? '100%' : `${threat}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Corner Decor */}
            <div className="absolute top-8 left-8 text-[10px] text-cyan-800 font-mono">
                <div>SYS.32.99.1</div>
                <div>SECURE CONNECTION</div>
            </div>
            <div className="absolute bottom-8 right-8 text-[10px] text-cyan-800 font-mono text-right">
                <div>LATENCY: 12ms</div>
                <div>ENCRYPTION: ON</div>
            </div>
        </div>
    );
};

// --- Main Export ---
const FirewallLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(0); // 0: Approach, 1: Arrive/Scan, 2: Verified, 3: Open/Enter

    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* Skip Button (Clickable) */}
            <div className="absolute top-8 right-8 z-[60]">
                <button
                    onClick={onComplete}
                    className="text-xs uppercase tracking-[0.2em] text-cyan-500 hover:text-white transition-colors border border-cyan-900 px-4 py-2 bg-black/50 backdrop-blur-sm cursor-pointer"
                >
                    Skip Intro
                </button>
            </div>

            <HUD step={step} setStep={setStep} />

            <Canvas>
                <Scene step={step} setStep={setStep} onComplete={onComplete} />
            </Canvas>
        </div>
    );
};

export default FirewallLoader;
