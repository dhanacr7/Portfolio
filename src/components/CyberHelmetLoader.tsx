import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Environment, Float, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// --- Constants ---
const CYAN = '#00f0ff';
const DARK_METAL = '#111111';
const GLASS = '#000000';

// --- Procedural Helmet Component ---
const CyberHelmet = ({ phase }: { phase: string }) => {
    const group = useRef<THREE.Group>(null);
    const visorRef = useRef<THREE.Mesh>(null);
    const ringRef1 = useRef<THREE.Mesh>(null);
    const ringRef2 = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (group.current) {
            // Idle float
            group.current.position.y = Math.sin(time * 0.5) * 0.1;
            group.current.rotation.y = Math.sin(time * 0.2) * 0.1;
        }

        // HUD Rings Animation
        if (ringRef1.current) {
            ringRef1.current.rotation.z -= 0.01;
            ringRef1.current.rotation.x = Math.sin(time) * 0.1;
        }
        if (ringRef2.current) {
            ringRef2.current.rotation.z += 0.02;
            ringRef2.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
        }

        // Visor Pulse
        if (visorRef.current && phase !== 'start') {
            const material = visorRef.current.material as THREE.MeshStandardMaterial;
            material.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.2;
        }
    });

    return (
        <group ref={group}>
            {/* Main Shell */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
                <meshStandardMaterial
                    color={DARK_METAL}
                    roughness={0.2}
                    metalness={0.9}
                />
            </mesh>

            {/* Jaw / Chin Guard */}
            <mesh position={[0, -0.6, 0.4]} rotation={[0.4, 0, 0]}>
                <boxGeometry args={[1.2, 0.8, 1]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.3}
                    metalness={0.8}
                />
            </mesh>

            {/* Side Ear Panels */}
            <mesh position={[0.95, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#222" roughness={0.4} metalness={0.8} />
            </mesh>
            <mesh position={[-0.95, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#222" roughness={0.4} metalness={0.8} />
            </mesh>

            {/* Visor (Glowing) */}
            <mesh ref={visorRef} position={[0, 0.1, 0.15]}>
                <sphereGeometry args={[0.92, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
                <meshStandardMaterial
                    color={GLASS}
                    roughness={0.1}
                    metalness={1}
                    emissive={CYAN}
                    emissiveIntensity={phase === 'start' ? 0 : 0.5}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Interior 'Brain' Light (Fake Volumetric) */}
            {phase !== 'start' && (
                <pointLight position={[0, 0.2, 0.5]} color={CYAN} intensity={2} distance={3} decay={2} />
            )}

            {/* HUD Rings */}
            {phase !== 'start' && (
                <group position={[0, 0, 0]}>
                    <mesh ref={ringRef1} rotation={[0, Math.PI / 2, 0]}>
                        <torusGeometry args={[1.4, 0.005, 16, 100]} />
                        <meshBasicMaterial color={CYAN} transparent opacity={0.3} />
                    </mesh>
                    <mesh ref={ringRef2} rotation={[0, Math.PI / 2, 0]}>
                        <torusGeometry args={[1.3, 0.01, 16, 100]} />
                        <meshBasicMaterial color={CYAN} transparent opacity={0.1} />
                    </mesh>
                </group>
            )}
        </group>
    );
};

// --- Scene ---
const Scene = ({ phase }: { phase: string }) => {
    return (
        <>
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 5, 20]} />

            <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={35} />

            <Environment preset="city" />

            <ambientLight intensity={0.2} />
            <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={10} color="#ffffff" castShadow />
            <pointLight position={[-5, 0, 5]} intensity={2} color={CYAN} />

            <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade />

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                <CyberHelmet phase={phase} />
            </Float>
        </>
    );
};

// --- Main Component ---
const CyberHelmetLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [phase, setPhase] = useState('start'); // start, active, transition
    const [text, setText] = useState("");

    useEffect(() => {
        const sequence = async () => {
            // 1. Black Screen -> Helmet Fade In happens via Canvas/Lights naturally
            await new Promise(r => setTimeout(r, 1000));
            setPhase('active');
            setText("INITIALIZING SECURE ENVIRONMENT...");

            await new Promise(r => setTimeout(r, 2000));
            setText("LOADING THREAT INTELLIGENCE...");

            await new Promise(r => setTimeout(r, 2000));
            setText("IDENTITY CONFIRMED.");

            await new Promise(r => setTimeout(r, 1500));
            setPhase('transition');

            await new Promise(r => setTimeout(r, 1000));
            onComplete();
        };
        sequence();
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-black text-white font-sans overflow-hidden">
            {/* Skip */}
            <button
                onClick={onComplete}
                className="absolute top-6 right-6 z-[60] text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-cyan-400 transition-colors"
            >
                Skip Sequence
            </button>

            {/* Dynamic UI Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
                <AnimatePresence mode='wait'>
                    {phase === 'active' && (
                        <motion.div
                            key="status"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute bottom-20 text-center"
                        >
                            <div className="text-cyan-400 text-xs tracking-[0.3em] mb-2">SYSTEM STATUS</div>
                            <div className="text-white text-lg font-light tracking-wider">{text}</div>
                        </motion.div>
                    )}

                    {phase === 'transition' && (
                        <motion.div
                            key="name"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                                DHANAPRIYAN
                            </h1>
                            <div className="flex items-center justify-center gap-4 mt-4 opacity-50">
                                <span className="h-[1px] w-12 bg-cyan-500"></span>
                                <span className="text-xs tracking-[0.3em] text-cyan-400">CYBER DEFENSE</span>
                                <span className="h-[1px] w-12 bg-cyan-500"></span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)]" />

            <Canvas>
                <Scene phase={phase} />
            </Canvas>
        </div>
    );
};

export default CyberHelmetLoader;
