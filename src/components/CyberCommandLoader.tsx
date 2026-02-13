import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { Shield, Lock, Hexagon, Crosshair, ChevronRight } from 'lucide-react';

// --- Configuration ---
const HEX_COUNT = 300;
const SPHERE_RADIUS = 3.5;
const COLORS = {
    black: '#000000',
    cyan: '#06b6d4', // Cyan-500
    magenta: '#d946ef', // Fuchsia-500
    dark: '#0f172a', // Slate-900
};

// --- Utils ---
// Fibonacci Sphere Distribution
const getFibonacciSpherePoints = (samples: number, radius: number) => {
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < samples; i++) {
        const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
        const r = Math.sqrt(1 - y * y); // radius at y
        const theta = phi * i; // golden angle increment

        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;

        points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
    }
    return points;
};

// --- 3D Components ---

const HexSphere = ({ sequence }: { sequence: number }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { targetPos, startPos, rotations } = useMemo(() => {
        const starts = new Float32Array(HEX_COUNT * 3);
        const rots = new Float32Array(HEX_COUNT * 3);

        // Targets on sphere surface
        const targets = getFibonacciSpherePoints(HEX_COUNT, SPHERE_RADIUS);
        const targetArr = new Float32Array(HEX_COUNT * 3);

        for (let i = 0; i < HEX_COUNT; i++) {
            // Target
            targetArr[i * 3] = targets[i].x;
            targetArr[i * 3 + 1] = targets[i].y;
            targetArr[i * 3 + 2] = targets[i].z;

            // Start (Exploded)
            const dist = 30 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            starts[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
            starts[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
            starts[i * 3 + 2] = dist * Math.cos(phi);

            // Rotation (Look at center)
            const dummy = new THREE.Object3D();
            dummy.position.copy(targets[i]);
            dummy.lookAt(0, 0, 0);
            rots[i * 3] = dummy.rotation.x;
            rots[i * 3 + 1] = dummy.rotation.y;
            rots[i * 3 + 2] = dummy.rotation.z;
        }
        return { targetPos: targetArr, startPos: starts, rotations: rots };
    }, []);

    const dummy = new THREE.Object3D();
    const currentPos = useMemo(() => new Float32Array(startPos), [startPos]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const t = state.clock.elapsedTime;

        // Sequence Handling
        // 0 -> 1: Assembly (Start -> Target)
        // 2 -> 3: Split (Target -> Outward)

        let moveSpeed = 0;
        let targetMultiplier = 1;

        if (sequence === 1) { // Assembly
            moveSpeed = 3.0; // Fast assembly
        } else if (sequence >= 3) { // Split
            moveSpeed = 2.0;
            targetMultiplier = 3.0; // Push out to 3x radius
        }

        if (sequence >= 1) {
            for (let i = 0; i < HEX_COUNT; i++) {
                const idx = i * 3;

                let tx = targetPos[idx] * targetMultiplier;
                let ty = targetPos[idx + 1] * targetMultiplier;
                let tz = targetPos[idx + 2] * targetMultiplier;

                // Add nice rotation/orbit when assembled
                if (sequence === 2) { // Idle/Integrity Check
                    // Rotate entire sphere group instead of individual positions for performance?
                    // No, let's keep positions stable relative to group rotation.
                    moveSpeed = 0.05; // Tight hold
                }

                // Lerp current to target
                const cx = currentPos[idx];
                const cy = currentPos[idx + 1];
                const cz = currentPos[idx + 2];

                if (moveSpeed > 0) {
                    currentPos[idx] += (tx - cx) * moveSpeed * delta;
                    currentPos[idx + 1] += (ty - cy) * moveSpeed * delta;
                    currentPos[idx + 2] += (tz - cz) * moveSpeed * delta;
                }

                dummy.position.set(currentPos[idx], currentPos[idx + 1], currentPos[idx + 2]);
                dummy.rotation.set(rotations[idx], rotations[idx + 1], rotations[idx + 2]);

                // Scale effect
                let scale = 1;
                if (sequence === 0) scale = 0;
                else if (sequence === 1) scale = Math.min(1, scale + delta); // Grow

                // Pulse scale on scan
                if (sequence === 2) {
                    scale = 0.9 + Math.sin(t * 2 + i) * 0.1;
                }

                dummy.scale.set(scale, scale, scale);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
            }
            meshRef.current.instanceMatrix.needsUpdate = true;
        }

        // Rotate the whole sphere structure
        if (sequence >= 1 && sequence < 3) {
            meshRef.current.rotation.y += delta * 0.1;
            meshRef.current.rotation.z += delta * 0.05;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, HEX_COUNT]}>
            <circleGeometry args={[0.4, 6]} />
            <meshBasicMaterial
                color={COLORS.black}
                side={THREE.DoubleSide}
                transparent
                opacity={0.9}
            />
            {/* Edges? Using a secondary mesh for wireframe is expensive for 200 instances. 
                 Instead, use a texture or simpler geometry. 
                 Actually, just use a Ring geometry or wireframe prop on material? 
                 Wireframe on BasicMaterial is fast. */}
        </instancedMesh>
    );
};

// Wireframe Overlay for Hexagons
const HexWireframe = ({ sequence }: { sequence: number }) => {
    // Exact duplicate of logic but with wireframe material
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { targetPos, startPos, rotations } = useMemo(() => {
        const starts = new Float32Array(HEX_COUNT * 3);
        const rots = new Float32Array(HEX_COUNT * 3);
        const targets = getFibonacciSpherePoints(HEX_COUNT, SPHERE_RADIUS); // Same seed
        const targetArr = new Float32Array(HEX_COUNT * 3);

        for (let i = 0; i < HEX_COUNT; i++) {
            targetArr[i * 3] = targets[i].x;
            targetArr[i * 3 + 1] = targets[i].y;
            targetArr[i * 3 + 2] = targets[i].z;

            // Re-calc starts to match (Must be deterministic or passed down)
            // Ideally we pass props, but for now just copy logic pattern (using deterministic math would be better but random is okay if 'close enough' visual)
            // Actually, visually precise overlay requires exact same positions. 
            // Simplified: Just use a single instanced mesh with a custom shader that draws edges? 
            // Or just 'additive' glowing hexes.

            // Let's use a simpler approach: Just one mesh loop, but this component renders the "glow" dots/edges.
            // Since we can't easily share the animated state across two components without a store, 
            // I will Merge them or use a parent Effect.
            // For now, let's just make the Main HexSphere have an emissive border using a texture or shader.

            // SKIPPING this component to avoid state desync. 
            // Will enhance HexSphere material instead.
        }
        return {};
    }, []);
    return null;
};

// Improved HexSphere with Glow
const HexSphereGlow = ({ sequence }: { sequence: number }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { targetPos, startPos, rotations } = useMemo(() => {
        const starts = new Float32Array(HEX_COUNT * 3);
        const rots = new Float32Array(HEX_COUNT * 3);
        const targets = getFibonacciSpherePoints(HEX_COUNT, SPHERE_RADIUS);
        const targetArr = new Float32Array(HEX_COUNT * 3);

        for (let i = 0; i < HEX_COUNT; i++) {
            targetArr[i * 3] = targets[i].x;
            targetArr[i * 3 + 1] = targets[i].y;
            targetArr[i * 3 + 2] = targets[i].z;

            // Start (Exploded) - same seed logic or just random
            const dist = 40 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            starts[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
            starts[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
            starts[i * 3 + 2] = dist * Math.cos(phi);

            const dummy = new THREE.Object3D();
            dummy.position.copy(targets[i]);
            dummy.lookAt(0, 0, 0);
            rots[i * 3] = dummy.rotation.x;
            rots[i * 3 + 1] = dummy.rotation.y;
            rots[i * 3 + 2] = dummy.rotation.z;
        }
        return { targetPos: targetArr, startPos: starts, rotations: rots };
    }, []);

    const dummy = new THREE.Object3D();
    const currentPos = useMemo(() => new Float32Array(startPos), [startPos]);
    const color = new THREE.Color();

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        const t = state.clock.elapsedTime;

        let moveSpeed = 0;
        let targetMultiplier = 1;

        if (sequence === 1) moveSpeed = 2.0;
        else if (sequence >= 3) {
            moveSpeed = 1.5;
            targetMultiplier = 5.0; // Fly away
        }

        if (sequence >= 1) {
            for (let i = 0; i < HEX_COUNT; i++) {
                const idx = i * 3;
                let tx = targetPos[idx] * targetMultiplier;
                let ty = targetPos[idx + 1] * targetMultiplier;
                let tz = targetPos[idx + 2] * targetMultiplier;

                if (sequence === 2) moveSpeed = 0.05;

                const cx = currentPos[idx];
                const cy = currentPos[idx + 1];
                const cz = currentPos[idx + 2];

                if (moveSpeed > 0 || sequence === 2) {
                    currentPos[idx] += (tx - cx) * moveSpeed * delta;
                    currentPos[idx + 1] += (ty - cy) * moveSpeed * delta;
                    currentPos[idx + 2] += (tz - cz) * moveSpeed * delta;
                }

                dummy.position.set(currentPos[idx], currentPos[idx + 1], currentPos[idx + 2]);
                dummy.rotation.set(rotations[idx], rotations[idx + 1], rotations[idx + 2]);

                // Rotate individual hexes for "opening" effect? 
                if (sequence >= 3) {
                    dummy.rotation.z += delta;
                    dummy.rotation.x += delta;
                }

                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);

                // Color Pulse
                if (sequence >= 1) {
                    const hue = sequence === 2 ? 0.5 + Math.sin(t + i) * 0.05 : 0.5; // Cyan base
                    // sequence 3: Magenta shift?
                    const isMagenta = sequence >= 3;
                    color.set(isMagenta ? COLORS.magenta : COLORS.cyan);
                    meshRef.current.setColorAt(i, color);
                }
            }
            meshRef.current.instanceMatrix.needsUpdate = true;
            if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
        }

        if (sequence >= 1 && sequence < 3) {
            meshRef.current.rotation.y -= delta * 0.1; // Reverse spin to inner
        }
    });

    return (
        <group>
            {/* Main Shell (Black) */}
            {/* <instancedMesh ref={meshRef} args={[undefined, undefined, HEX_COUNT]}> ... </instancedMesh> */}

            {/* Wireframe / Glow Shell */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, HEX_COUNT]}>
                <ringGeometry args={[0.35, 0.4, 6]} /> {/* Hexagon Ring */}
                <meshBasicMaterial
                    toneMapped={false}
                    color={COLORS.cyan}
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                />
            </instancedMesh>
        </group>
    );

};


const OrbitingRings = ({ sequence }: { sequence: number }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.x += delta * 0.2;
            groupRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group ref={groupRef} rotation={[Math.PI / 4, 0, 0]}>
            {/* Ring 1 */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[SPHERE_RADIUS * 1.5, 0.02, 16, 100]} />
                <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.3} />
            </mesh>
            {/* Ring 2 */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[SPHERE_RADIUS * 1.8, 0.02, 16, 100]} />
                <meshBasicMaterial color={COLORS.magenta} transparent opacity={0.2} />
            </mesh>
        </group>
    );
};

// --- HUD Components ---
const CyberHUD = ({ sequence, integrity }: { sequence: number, integrity: number }) => {
    return (
        <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-20">
            {/* Top Header */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Hexagon className={`w-6 h-6 text-cyan-500 ${sequence === 2 ? 'animate-spin' : ''}`} />
                        <span className="text-cyan-400 font-bold tracking-[0.3em] text-sm">CYBER_COMMAND_CORE</span>
                    </div>
                    <div className="text-[10px] text-cyan-700 mt-1">SECURE_CHANNEL_ESTABLISHED</div>
                </div>

                <div className="text-right">
                    <div className="text-[10px] text-cyan-700 tracking-widest">SYSTEM_STATUS</div>
                    <div className={`text-xl font-mono ${sequence >= 2 ? 'text-cyan-400' : 'text-cyan-900'}`}>
                        {sequence === 0 ? "OFFLINE" : sequence < 3 ? "ARMED" : "UNLOCKED"}
                    </div>
                </div>
            </div>

            {/* Center Scan Reticle */}
            {sequence === 2 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[300px] h-[300px] border border-cyan-500/20 rounded-full flex items-center justify-center animate-pulse">
                        <Crosshair className="w-full h-full text-cyan-500/10 absolute p-4" />
                        <div className="absolute bottom-10 text-xs text-cyan-400 font-mono tracking-widest">
                            INTEGRITY CHECK: {integrity}%
                        </div>
                        <div className="w-[100%] h-[2px] bg-cyan-500/50 absolute animate-[scan_2s_linear_infinite]" />
                    </div>
                </div>
            )}

            {/* Center Reveal */}
            {sequence === 4 && (
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="z-50 text-center animate-in zoom-in duration-1000">
                        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-500 tracking-tighter drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                            DHANAPRIYAN
                        </h1>
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <div className="h-[1px] w-12 bg-cyan-700" />
                            <span className="text-cyan-400 font-mono text-sm tracking-[0.4em] uppercase">Senior Security Engineer</span>
                            <div className="h-[1px] w-12 bg-cyan-700" />
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Bar */}
            <div className="flex justify-between items-end">
                <div className="flex gap-4 text-[10px] text-cyan-800 font-mono">
                    <div>LAT: 32.544</div>
                    <div>LNG: -117.23</div>
                    <div>ENC: AES-256</div>
                </div>

                <div className="flex items-center gap-2 text-cyan-600/50 text-xs tracking-widest uppercase">
                    <Lock className="w-3 h-3" />
                    <span>Classified Clearance</span>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

const CyberCommandLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [sequence, setSequence] = useState(0);
    // 0: Init, 1: Assembly, 2: Scan, 3: Split, 4: Reveal
    const [integrity, setIntegrity] = useState(0);

    useEffect(() => {
        const tl = gsap.timeline();

        // 1. Assembly (0.5s start)
        tl.call(() => setSequence(1), [], 0.5);

        // 2. Scan (2.5s)
        tl.call(() => setSequence(2), [], 2.5);
        tl.to({ v: 0 }, {
            v: 100,
            duration: 2,
            onUpdate: function () { setIntegrity(Math.floor(this.targets()[0].v)); },
            ease: "linear"
        }, 2.5);

        // 3. Split (5s)
        tl.call(() => setSequence(3), [], 5.0);

        // 4. Reveal (5.5s)
        tl.call(() => setSequence(4), [], 5.5);

        // 5. Finish (8s)
        tl.call(onComplete, [], 8.0);

        return () => { tl.kill(); };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-[#000000] text-cyan-500 overflow-hidden">

            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <color attach="background" args={['#000000']} />
                <fog attach="fog" args={['#000000', 8, 25]} />

                <group>
                    <HexSphereGlow sequence={sequence} />
                    <OrbitingRings sequence={sequence} />
                    {/* Inner Core Light */}
                    <pointLight position={[0, 0, 0]} intensity={sequence >= 3 ? 5 : 0} color={COLORS.cyan} distance={20} />
                </group>

                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color={COLORS.cyan} />
                <pointLight position={[-10, -10, 5]} intensity={0.5} color={COLORS.magenta} />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate={sequence >= 1 && sequence < 3} autoRotateSpeed={2} />
            </Canvas>

            <CyberHUD sequence={sequence} integrity={integrity} />

            {/* Skip */}
            <button
                onClick={onComplete}
                className="absolute top-6 right-6 z-[60] text-cyan-800 hover:text-cyan-400 text-[10px] tracking-widest uppercase border border-cyan-900 px-4 py-2 hover:bg-cyan-950/50 transition-all"
            >
                Start Session <ChevronRight className="w-3 h-3 inline ml-1" />
            </button>
        </div>
    );
};

export default CyberCommandLoader;
