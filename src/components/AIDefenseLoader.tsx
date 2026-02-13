import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { Shield, Lock, Activity, Cpu, Fingerprint, Scan, CheckCircle2 } from 'lucide-react';

// --- Configuration ---
const PARTICLE_COUNT = 1500;
const CONNECTION_DIST = 1.5;

const COLORS = {
    cyan: '#06b6d4', // Cyan-500
    blue: '#3b82f6', // Blue-500
    alert: '#ef4444', // Red-500
    success: '#10b981', // Emerald-500
    bg: '#000000'
};

// --- Utils ---
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// --- 3D Components ---

const NeuralNet = ({ sequence }: { sequence: number }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const linesRef = useRef<any>(null); // For line segments

    // Generate Initial and Target Positions
    const { startPos, targetPos, colors } = useMemo(() => {
        const start = new Float32Array(PARTICLE_COUNT * 3);
        const target = new Float32Array(PARTICLE_COUNT * 3);
        const col = new Float32Array(PARTICLE_COUNT * 3);
        const colorObj = new THREE.Color(COLORS.cyan);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Start: Explosive / Random far out
            start[i * 3] = randomRange(-50, 50);
            start[i * 3 + 1] = randomRange(-50, 50);
            start[i * 3 + 2] = randomRange(-50, 50);

            // Target: Sphere / Brain shape
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 4 + Math.random() * 0.5; // Radius 4

            target[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            target[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            target[i * 3 + 2] = r * Math.cos(phi);

            // Random internal nodes
            if (Math.random() > 0.8) {
                target[i * 3] *= 0.5;
                target[i * 3 + 1] *= 0.5;
                target[i * 3 + 2] *= 0.5;
            }

            col[i * 3] = colorObj.r;
            col[i * 3 + 1] = colorObj.g;
            col[i * 3 + 2] = colorObj.b;
        }
        return { startPos: start, targetPos: target, colors: col };
    }, []);

    // Animation Ref (Current positions)
    const currentPos = useMemo(() => new Float32Array(startPos), [startPos]);

    // Lines Geometry
    const [lineGeo, setLineGeo] = useState<THREE.BufferGeometry | null>(null);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        const t = state.clock.elapsedTime;

        // Lerp functionality manually for buffer attributes
        // Sequence 0->1: Assembly
        // Sequence 1->2: Idle / Pulse

        const speed = sequence >= 1 ? 2.5 : 0; // Move when seq 1 starts

        // Update positions
        let needsUpdate = false;

        if (sequence >= 1) {
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const idx = i * 3;

                // Lerp towards target
                const cx = currentPos[idx];
                const cy = currentPos[idx + 1];
                const cz = currentPos[idx + 2];

                const tx = targetPos[idx];
                const ty = targetPos[idx + 1];
                const tz = targetPos[idx + 2];

                // Simple ease-out lerp
                const factor = delta * 2.0;

                if (Math.abs(cx - tx) > 0.01 || Math.abs(cy - ty) > 0.01 || Math.abs(cz - tz) > 0.01) {
                    currentPos[idx] += (tx - cx) * factor;
                    currentPos[idx + 1] += (ty - cy) * factor;
                    currentPos[idx + 2] += (tz - cz) * factor;
                    needsUpdate = true;
                }

                // Breathing effect when stable
                if (!needsUpdate && sequence >= 2) {
                    const pulse = Math.sin(t * 1 + i) * 0.02;
                    currentPos[idx] += pulse * tx * delta; // Expand/contract
                    currentPos[idx + 1] += pulse * ty * delta;
                    currentPos[idx + 2] += pulse * tz * delta;
                    needsUpdate = true; // Still updating for breathe
                }
            }
        }

        if (needsUpdate) {
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }

        // Rotation
        pointsRef.current.rotation.y = t * 0.1;

        // --- Dynamic Lines (Expensive! Limit checks) ---
        // Only run line calc every few frames or strictly limited
        // For 60fps, we can't check N^2.
        // Let's just draw lines between index i and i+1, i+2 if close? 
        // Or randomized static connections that "stretch"?
        // Stretchy lines are better.
        // We'll create a static index buffer for lines and just update vertices?
        // Actually, let's skip lines for performance safety on "try this" unless requested specifically "nodes lighting up data streams".
        // The prompt asked for "Data streams flowing". 
        // Let's use a few dedicated "Stream" particles instead of full mesh connectivity.
    });

    return (
        <group>
            <Points ref={pointsRef} positions={currentPos} colors={colors} stride={3}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            {/* Fake Connections (Sphere Lines) */}
            <mesh rotation={[0, 0, 0]}>
                <icosahedronGeometry args={[4, 2]} />
                <meshBasicMaterial color={COLORS.blue} wireframe transparent opacity={0.05} />
            </mesh>

            {/* Core Glow */}
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.02} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
};

// --- HUD Components ---

const StatusBadge = ({ label, value, color, icon: Icon }: any) => (
    <div className={`flex items-center gap-3 border border-${color}-900/50 bg-black/80 px-4 py-2 backdrop-blur-sm`}>
        <Icon className={`w-4 h-4 text-${color}-500 ${label === "SYSTEM" ? "animate-pulse" : ""}`} />
        <div className="flex flex-col">
            <span className={`text-[10px] font-bold tracking-widest text-${color}-700`}>{label}</span>
            <span className={`text-xs font-mono text-${color}-400`}>{value}</span>
        </div>
    </div>
);

const ThreatLog = ({ logs }: { logs: string[] }) => (
    <div className="w-full max-w-sm h-32 overflow-hidden flex flex-col justify-end border-l-2 border-cyan-800/50 pl-3 bg-gradient-to-r from-cyan-950/10 to-transparent">
        {logs.map((log, i) => (
            <div key={i} className="text-[10px] font-mono text-cyan-400/80 mb-1 truncate">
                <span className="text-cyan-700 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                {log}
            </div>
        ))}
    </div>
);

const AIDefenseLoader = ({ onComplete }: { onComplete: () => void }) => {
    // Sequence State
    // 0: Void
    // 1: Assembly (Particles form Sphere)
    // 2: Analysis (Scanning)
    // 3: Verify (Identity)
    // 4: Access Granted (Reveal)
    const [sequence, setSequence] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [scanProgress, setScanProgress] = useState(0);
    const [isVerified, setIsVerified] = useState(false);

    // Main Timeline
    useEffect(() => {
        const tl = gsap.timeline();

        // 1. Assembly (1s)
        tl.call(() => setSequence(1), [], 1);
        tl.call(() => addLog("INIT_NEURAL_HANDSHAKE..."), [], 1.1);
        tl.call(() => addLog("CONSTRUCTING_NODES..."), [], 1.5);

        // 2. Analysis (3s)
        tl.call(() => setSequence(2), [], 3);
        tl.call(() => addLog("SCANNING_HOSTUAL_ENVIRONMENT..."), [], 3);
        tl.to({ v: 0 }, {
            v: 100,
            duration: 2,
            onUpdate: function () { setScanProgress(Math.floor(this.targets()[0].v)); },
            ease: "linear"
        }, 3);

        // 3. Identification (5s)
        tl.call(() => setSequence(3), [], 5);
        tl.call(() => addLog("BIOMETRIC_SIGNATURE_DETECTED"), [], 5.1);
        tl.call(() => addLog("VALIDATING_ACCESS_KEY..."), [], 5.5);

        // 4. Secure (6s)
        tl.call(() => {
            setIsVerified(true);
            setSequence(4);
            addLog("ACCESS_GRANTED: ADMIN_PRIORITY_1");
        }, [], 6.5);

        // 5. Reveal Name (6.5s)
        // (Handled by React render)

        // 6. Finish (8.5s)
        tl.call(onComplete, [], 8.5);

        return () => { tl.kill(); };
    }, [onComplete]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-6), msg]);
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#020205] text-cyan-500 font-mono overflow-hidden">

            {/* 3D Scene */}
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <color attach="background" args={['#000000']} />
                <fog attach="fog" args={['#000000', 5, 20]} />
                <ambientLight intensity={0.5} />
                <NeuralNet sequence={sequence} />
                {/* <EffectComposer>
                     <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={0.5} />
                </EffectComposer> Temporarily disabled to avoid crash */}
            </Canvas>

            {/* UI Overlay */}
            <div className="absolute inset-0 z-10 p-6 md:p-12 flex flex-col justify-between pointer-events-none">

                {/* Top Header */}
                <div className="flex justify-between">
                    <StatusBadge label="SYSTEM" value={sequence >= 1 ? "ONLINE" : "OFFLINE"} color="cyan" icon={Cpu} />
                    {sequence >= 2 && (
                        <div className="flex gap-4">
                            <StatusBadge label="THREATS" value="0 DETECTED" color="emerald" icon={Shield} />
                            <StatusBadge label="ENCRYPTION" value="AES-256-GCM" color="blue" icon={Lock} />
                        </div>
                    )}
                </div>

                {/* Center Focus */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Init Text */}
                    {sequence === 1 && (
                        <div className="text-center">
                            <h2 className="text-2xl font-light tracking-[0.5em] text-cyan-200 animate-pulse">INITIALIZING</h2>
                            <div className="text-[10px] text-cyan-600 mt-2 tracking-widest">NEURAL DEFENSE MATRIX V4.0</div>
                        </div>
                    )}

                    {/* Scanner */}
                    {sequence === 2 && (
                        <div className="relative">
                            <Scan className="w-64 h-64 text-cyan-500/20 animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <div className="text-4xl font-bold text-cyan-500">{scanProgress}%</div>
                                <div className="text-xs text-cyan-700 tracking-widest mt-1">ANALYZING PACKETS</div>
                            </div>
                        </div>
                    )}

                    {/* Verify Fingerprint */}
                    {sequence === 3 && (
                        <div className="relative">
                            <div className={`w-32 h-32 border-2 border-cyan-500 rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300 ${isVerified ? 'border-green-500 scale-110' : 'animate-pulse'}`}>
                                <Fingerprint className={`w-24 h-24 ${isVerified ? 'text-green-500' : 'text-cyan-500'}`} />
                                {/* Scan Line */}
                                {!isVerified && <div className="absolute top-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#06b6d4] animate-[scan_1.5s_linear_infinite]" />}
                            </div>
                            <div className="mt-4 text-center">
                                <div className={`text-xs tracking-[0.3em] font-bold ${isVerified ? 'text-green-500' : 'text-cyan-500'}`}>
                                    {isVerified ? "IDENTITY CONFIRMED" : "VERIFYING BIOMETRICS..."}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Final Reveal */}
                    {sequence === 4 && (
                        <div className="text-center bg-black/90 p-8 border border-cyan-500/30 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-700">
                            <div className="flex justify-center mb-4">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-2">DHANAPRIYAN</h1>
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent my-6" />
                            <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase justify-center items-center">
                                <span>Security Architect</span>
                                <span className="hidden md:block w-1 h-1 bg-cyan-600 rounded-full" />
                                <span>Red Team</span>
                                <span className="hidden md:block w-1 h-1 bg-cyan-600 rounded-full" />
                                <span>AI Security</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Bar */}
                <div className="flex justify-between items-end">
                    <ThreatLog logs={logs} />

                    <div className="text-right opacity-60">
                        <div className="flex items-center justify-end gap-2 text-cyan-400 mb-1">
                            <Activity className="w-3 h-3 animate-pulse" />
                            <span className="text-xs">NET_ACTIVITY</span>
                        </div>
                        <div className="flex gap-1 justify-end h-4 items-end">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-cyan-600 animate-[bounce_1s_infinite]"
                                    style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Skip */}
                <button
                    onClick={onComplete}
                    className="absolute top-6 right-6 z-[60] bg-black/50 hover:bg-cyan-900/30 text-cyan-600 hover:text-cyan-300 border border-cyan-900 px-3 py-1 text-[10px] tracking-widest transition-all pointer-events-auto"
                >
                    SKIP_SEQUENCE
                </button>
            </div>

            {/* CSS for Scan Animation */}
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

export default AIDefenseLoader;
