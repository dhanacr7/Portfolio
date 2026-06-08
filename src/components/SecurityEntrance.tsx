import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    Float,
    PerspectiveCamera,
    Text,
    Points,
    PointMaterial,
    Environment,
    OrbitControls,
    ScreenSpace,
    Html
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

// --- Configuration & Constants ---
const COLORS = {
    background: '#020617', // Slate-950
    accent: '#06b6d4', // Cyan (Trust/Security)
    threat: '#ef4444', // Red (Danger)
    neutral: '#94a3b8', // Slate-400
    white: '#ffffff',
};

const ATTACK_TYPES = [
    'DDoS PACKET STREAM',
    'SQL INJECTION',
    'BRUTE-FORCE ATTEMPT',
    'MALICIOUS PAYLOAD',
    'XSS INJECTION',
    'EXPLOIT PACKET'
];

const CODE_FRAGMENTS = [
    'sanitizeInput()',
    'validateRequest()',
    'jwt.verify()',
    'encryptAES256()',
    'rateLimiter()',
    'threatDetection()',
    'accessControl()',
    'securityHeaders()'
];

// --- 3D Components ---

// 1. Digital Origin Particles
const ParticleField = ({ count = 2000 }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 20;
            p[i * 3 + 1] = (Math.random() - 0.5) * 20;
            p[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return p;
    }, [count]);

    const ref = useRef<THREE.Points>(null);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.05;
            ref.current.rotation.x = state.clock.elapsedTime * 0.02;
        }
    });

    return (
        <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color={COLORS.accent}
                size={0.015}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};

// 2. Data Cloud (The Asset to Protect)
const DataCloud = ({ sequence }: { sequence: number }) => {
    const meshRef = useRef<THREE.Group>(null);
    const nodeCount = 50;

    const nodes = useMemo(() => {
        const temp = [];
        for (let i = 0; i < nodeCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / nodeCount);
            const theta = Math.sqrt(nodeCount * Math.PI) * phi;
            const x = Math.cos(theta) * Math.sin(phi);
            const y = Math.sin(theta) * Math.sin(phi);
            const z = Math.cos(phi);
            temp.push(new THREE.Vector3(x * 1, y * 1, z * 1));
        }
        return temp;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
            meshRef.current.scale.set(s, s, s);
        }
    });

    return (
        <group ref={meshRef}>
            {nodes.map((pos, i) => (
                <mesh key={i} position={pos}>
                    <sphereGeometry args={[0.04, 8, 8]} />
                    <meshBasicMaterial color={COLORS.accent} />
                </mesh>
            ))}
            {/* Network Connections */}
            <lineSegments>
                <edgesGeometry args={[new THREE.IcosahedronGeometry(1.2, 1)]} />
                <lineBasicMaterial color={COLORS.accent} transparent opacity={0.2} />
            </lineSegments>
            {/* Inner Glow */}
            <mesh>
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshBasicMaterial color={COLORS.accent} transparent opacity={0.1} />
            </mesh>
        </group>
    );
};

// 3. Attack Packets
const Attacks = ({ sequence }: { sequence: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [attackPackets, setAttackPackets] = useState<any[]>([]);

    useEffect(() => {
        if (sequence === 1) { // Threat detection start
            const interval = setInterval(() => {
                const id = Math.random();
                const startPos = new THREE.Vector3(
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20
                ).normalize().multiplyScalar(10);

                setAttackPackets(prev => [...prev, { id, startPos, progress: 0, text: ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)] }]);
            }, 150);
            return () => clearInterval(interval);
        } else if (sequence >= 4) {
            setAttackPackets([]);
        }
    }, [sequence]);

    useFrame((state, delta) => {
        if (sequence === 1 || sequence === 2 || sequence === 3) {
            setAttackPackets(prev => prev.map(p => {
                const speed = 2.5;
                const newProgress = p.progress + delta * speed;
                return { ...p, progress: newProgress };
            }).filter(p => p.progress < 1));
        }
    });

    return (
        <group ref={groupRef}>
            {attackPackets.map(p => {
                const currentPos = p.startPos.clone().lerp(new THREE.Vector3(0, 0, 0), p.progress);
                const opacity = p.progress > 0.8 && sequence >= 2 ? 0 : 1; // Disintegrate near shield
                if (opacity === 0) return null;

                return (
                    <group key={p.id} position={currentPos}>
                        <mesh>
                            <sphereGeometry args={[0.08, 8, 8]} />
                            <meshBasicMaterial color={COLORS.threat} transparent opacity={0.8} />
                        </mesh>
                        <pointLight color={COLORS.threat} intensity={0.5} distance={1} />
                        {/* Trail */}
                        <mesh position={p.startPos.clone().sub(currentPos).multiplyScalar(0.1)}>
                            <boxGeometry args={[0.02, 0.02, 0.5]} />
                            <meshBasicMaterial color={COLORS.threat} transparent opacity={0.3} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
};

// 4. Defense Shield
const SecurityShield = ({ sequence }: { sequence: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    const shieldScale = sequence >= 2 ? 1 : 0;

    useFrame((state) => {
        if (groupRef.current && sequence >= 2) {
            groupRef.current.rotation.y += 0.02;
            groupRef.current.rotation.z += 0.01;
        }
    });

    return (
        <group ref={groupRef} scale={shieldScale}>
            {/* Hex Mesh */}
            <mesh>
                <icosahedronGeometry args={[1.5, 2]} />
                <meshBasicMaterial
                    color={COLORS.accent}
                    wireframe
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            {/* Rotating Rings */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.8, 0.02, 16, 64]} />
                <meshBasicMaterial color={COLORS.accent} transparent opacity={0.5} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[2.0, 0.01, 16, 64]} />
                <meshBasicMaterial color={COLORS.accent} transparent opacity={0.3} />
            </mesh>
            {/* Code Layers */}
            {sequence >= 2 && CODE_FRAGMENTS.map((text, i) => (
                <Text
                    key={i}
                    position={[
                        Math.cos(i * (Math.PI * 2 / CODE_FRAGMENTS.length)) * 2.2,
                        Math.sin(i * (Math.PI * 2 / CODE_FRAGMENTS.length)) * 2.2,
                        0
                    ]}
                    fontSize={0.12}
                    color={COLORS.accent}
                    font="https://fonts.gstatic.com/s/robotomono/v12/L0X5DF4xlVMF-9hA8PbeGh96VAs.woff"
                >
                    {text}
                </Text>
            ))}
        </group>
    );
};

// --- Main Stage ---

const SecurityEntrance = ({ onComplete }: { onComplete: () => void }) => {
    const [sequence, setSequence] = useState(0);
    // 0: Digital Origin, 1: Attack, 2: Shield Activation, 3: Neutralization, 4: Stabilization, 5: Reveal

    const [message, setMessage] = useState("INITIALIZING SYSTEMS...");

    useEffect(() => {
        const tl = gsap.timeline();

        // Sequence 0: Start (Digital Origin)
        tl.to({}, { duration: 2 });

        // Sequence 1: Incoming Threats
        tl.call(() => {
            setSequence(1);
            setMessage("THREAT DETECTED: INCOMING CYBER ATTACK");
        }, [], 2);

        // Sequence 2: Defense Activation
        tl.call(() => {
            setSequence(2);
            setMessage("ACTIVATING SECURITY PROTOCOLS...");
        }, [], 3.5);

        // Sequence 3: Neutralization
        tl.call(() => {
            setSequence(3);
            setMessage("NEUTRALIZING THREATS - ACCESS DENIED");
        }, [], 5);

        // Sequence 4: Stabilization
        tl.call(() => {
            setSequence(4);
            setMessage("SYSTEM STABILIZED. SECURITY INTEGRITY: 100%");
        }, [], 6.5);

        // Sequence 5: Final Brand Reveal
        tl.call(() => {
            setSequence(5);
        }, [], 8);

        // Final Complete
        tl.to({}, { duration: 10, onComplete }); // Total duration ~10s as per request + buffer

        return () => { tl.kill(); };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-[#020617] overflow-hidden flex flex-col justify-center items-center">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <color attach="background" args={[COLORS.background]} />
                <fog attach="fog" args={[COLORS.background, 5, 15]} />

                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} color={COLORS.accent} />

                <group>
                    <ParticleField />
                    <DataCloud sequence={sequence} />
                    <Attacks sequence={sequence} />
                    <SecurityShield sequence={sequence} />
                </group>

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>

            {/* Cinematic HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-12">
                {/* Top Bar */}
                <div className="flex justify-between items-start opacity-60">
                    <div className="text-[10px] tracking-[0.4em] text-cyan-500 font-mono">
                        SEC_CHANNEL: 0x88F2A<br />
                        ENCRYPTION: AES-GCM-256
                    </div>
                    <div className="text-[10px] tracking-[0.4em] text-cyan-500 font-mono text-right">
                        COORD: 37.7749° N, 122.4194° W<br />
                        UPLINK: ACTIVE
                    </div>
                </div>

                {/* Center Message */}
                <div className="flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        {sequence < 5 && (
                            <motion.div
                                key={message}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`font-mono text-xs tracking-[0.3em] uppercase ${sequence === 1 ? 'text-red-500' : 'text-cyan-500'}`}
                            >
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Reveal Content */}
                    <AnimatePresence>
                        {sequence === 5 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="flex flex-col items-center text-center"
                            >
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4">
                                    DHANAPRIYAN S
                                </h1>
                                <div className="h-[2px] w-24 bg-cyan-500 mb-6" />
                                <h2 className="text-xl md:text-2xl font-bold tracking-[0.2em] text-cyan-400 uppercase mb-2">
                                    SECURITY WITHOUT COMPROMISE.
                                </h2>
                                <div className="text-[10px] md:text-sm tracking-[0.4em] text-slate-400 uppercase">
                                    Security Analyst • Full Stack Developer • Software Engineer
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 2 }}
                                    className="mt-12 text-[10px] tracking-[0.8em] text-cyan-500 font-mono animate-pulse"
                                >
                                    SECURITY IS ENGINEERED
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Elements */}
                <div className="flex justify-center">
                    <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                </div>
            </div>

            {/* Skip Button */}
            <button
                onClick={onComplete}
                className="absolute bottom-10 right-10 z-50 text-[10px] tracking-[0.4em] text-slate-500 hover:text-cyan-400 transition-colors uppercase cursor-pointer"
            >
                Skip Arrival //
            </button>

            <style>{`
        @font-face {
            font-family: 'Geist';
            src: url('https://vercel.com/font/geist-regular.woff2') format('woff2');
        }
      `}</style>
        </div>
    );
};

export default SecurityEntrance;
