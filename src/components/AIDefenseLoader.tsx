import { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Activity, Server, Database, UserCheck, Cpu } from "lucide-react";

// --- 3D Components ---

function ParticleNetwork({ opacity }: { opacity: number }) {
    const ref = useRef<THREE.Points>(null);

    // Generate particles in a sphere shape
    const positions = useMemo(() => {
        const count = 2000;
        const positions = new Float32Array(count * 3);
        const distance = 4;

        for (let i = 0; i < count; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);

            // Sphere distribution
            const x = distance * Math.sin(theta) * Math.cos(phi);
            const y = distance * Math.sin(theta) * Math.sin(phi);
            const z = distance * Math.cos(theta);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        return positions;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;

            // Pulsing effect
            const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
            ref.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#00ffff"
                    size={0.03}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={opacity}
                />
            </Points>
        </group>
    );
}

// --- Main Loader Component ---

const CyberpunkLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [status, setStatus] = useState("SYSTEM_OFFLINE");
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    // Sequence State
    // 0: Init, 1: Neural Formation, 2: Threat Scan, 3: Operator Match, 4: Reveal
    const [sequence, setSequence] = useState(0);

    // --- Timeline ---
    useEffect(() => {
        const runSequence = async () => {
            // Step 1: Initialize
            setTimeout(() => {
                setSequence(1);
                setStatus("INITIALIZING_NEURAL_GRID");
            }, 500);

            // Step 2: Scanning (2s)
            setTimeout(() => {
                setSequence(2);
                setStatus("ANALYZING_THREAT_VECTORS");
            }, 2500);

            // Step 3: Operator (4.5s)
            setTimeout(() => {
                setSequence(3);
                setStatus("BIOMETRIC_MATCH_CONFIRMED");
            }, 5000);

            // Step 4: Reveal (6s)
            setTimeout(() => {
                setSequence(4);
                onComplete();
            }, 7000); // Give time for reveal animation
        };

        runSequence();
    }, [onComplete]);

    // --- Simulated Logs ---
    useEffect(() => {
        if (sequence < 1) return;
        const systemLogs = [
            "Loading Core Modules...",
            "Encrypting Data Streams...",
            "Firewall Integrity: 100%",
            "Neural Pattern Recognition: ACTIVE",
            "Scanning Incoming Traffic...",
            "Threat Level: LOW",
            "Operator Identity Verified."
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < systemLogs.length) {
                setLogs(prev => [...prev.slice(-5), systemLogs[index]]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 800);
        return () => clearInterval(interval);
    }, [sequence]);


    // --- Progress Bar ---
    useEffect(() => {
        if (sequence === 0) return;
        const interval = setInterval(() => {
            setProgress(prev => Math.min(prev + 1.5, 100));
        }, 50);
        return () => clearInterval(interval);
    }, [sequence]);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] bg-[#050505] text-cyan-500 font-mono overflow-hidden"
                exit={{ opacity: 0, transition: { duration: 1 } }}
            >
                {/* 3D Layer */}
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
                        <ambientLight intensity={0.5} />
                        <ParticleNetwork opacity={sequence >= 1 ? 1 : 0} />
                    </Canvas>
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)]" />

                {/* HUD UI */}
                <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 md:p-12 pointer-events-none">

                    {/* Top Bar */}
                    <div className="flex justify-between items-start">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex items-center gap-2 border border-cyan-900/50 bg-black/50 px-4 py-2 backdrop-blur-sm"
                        >
                            <Shield className="w-5 h-5 animate-pulse" />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold tracking-[0.2em] text-cyan-100">AI DEFENSE MATRIX</span>
                                <span className="text-[10px] text-cyan-600">SYSTEM_VERSION_4.0.2</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex gap-4 text-[10px] text-cyan-600 uppercase tracking-widest"
                        >
                            <div className="flex items-center gap-1">
                                <Server className="w-3 h-3" />
                                <span className="text-cyan-600">Online</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Database className="w-3 h-3" />
                                <span className="text-cyan-600">Secure</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Center Content */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                        {/* Init Text */}
                        {sequence === 1 && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.1, opacity: 0 }}
                                className="text-center"
                            >
                                <Cpu className="w-16 h-16 mx-auto mb-4 text-cyan-500 animate-[spin_10s_linear_infinite]" />
                                <h2 className="text-2xl font-light tracking-[0.3em] animate-pulse">
                                    INITIALIZING
                                </h2>
                            </motion.div>
                        )}

                        {/* Scanner UI */}
                        {sequence === 2 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-64 h-64 border border-cyan-500/30 rounded-full flex items-center justify-center relative"
                            >
                                <div className="absolute inset-0 border-t-2 border-cyan-500 animate-[spin_2s_linear_infinite] rounded-full" />
                                <div className="absolute inset-4 border-b-2 border-cyan-500 animate-[spin_3s_linear_infinite_reverse] rounded-full opacity-50" />
                                <div className="text-xs tracking-widest animate-pulse">SCANNING...</div>
                            </motion.div>
                        )}

                        {/* Reveal */}
                        {sequence >= 3 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center bg-black/80 p-8 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_50px_rgba(0,255,255,0.1)]"
                            >
                                <UserCheck className="w-12 h-12 mx-auto mb-4 text-green-400" />
                                <div className="text-xs text-green-500 tracking-widest mb-2">ACCESS GRANTED</div>
                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                                    DHANAPRIYAN
                                </h1>
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent mb-4" />
                                <div className="flex justify-center gap-3 text-[10px] md:text-xs text-cyan-400 font-bold tracking-widest uppercase">
                                    <span>Security Architect</span>
                                    <span>•</span>
                                    <span>Red Team</span>
                                    <span>•</span>
                                    <span>AI Security</span>
                                </div>
                            </motion.div>
                        )}

                    </div>

                    {/* Bottom Bar */}
                    <div className="flex justify-between items-end">
                        {/* Logs */}
                        <div className="w-64 h-32 overflow-hidden flex flex-col justify-end text-[10px] font-mono opacity-70 border-l border-cyan-800 pl-2">
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mb-1"
                                >
                                    <span className="text-cyan-700">[{new Date().toLocaleTimeString()}]</span> {log}
                                </motion.div>
                            ))}
                        </div>

                        {/* Status & Progress */}
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-2 text-cyan-300">
                                <Activity className="w-4 h-4 animate-pulse" />
                                <span className="text-sm tracking-widest">{status.replace(/_/g, " ")}</span>
                            </div>
                            <div className="w-48 h-1 bg-cyan-900/50 overflow-hidden">
                                <motion.div
                                    className="h-full bg-cyan-500 shadow-[0_0_10px_#00ffff]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CyberpunkLoader;
