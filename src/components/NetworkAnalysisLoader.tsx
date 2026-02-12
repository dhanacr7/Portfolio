import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Text, Float, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// --- Constants ---
const NODE_COUNT = 150;
const CONNECTION_DISTANCE = 3.5;
const PRIMARY_COLOR = new THREE.Color('#00f0ff');
const ALERT_COLOR = new THREE.Color('#ff0033');
const SAFE_COLOR = new THREE.Color('#00ff88');

// --- Helper: Generate Graph Data ---
const generateGraph = (count: number) => {
    const nodes = [];
    for (let i = 0; i < count; i++) {
        const r = 10 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        nodes.push(new THREE.Vector3(x, y, z));
    }
    return nodes;
};

// --- Components ---

const NetworkGraph = ({ phase }: { phase: 'scan' | 'attack' | 'defense' | 'stable' }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const linesRef = useRef<THREE.LineSegments>(null);
    const nodes = useMemo(() => generateGraph(NODE_COUNT), []);

    // Connections
    const linesGeometry = useMemo(() => {
        const points = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[i].distanceTo(nodes[j]) < CONNECTION_DISTANCE) {
                    points.push(nodes[i]);
                    points.push(nodes[j]);
                }
            }
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return geometry;
    }, [nodes]);

    const tempColor = new THREE.Color();
    const tempMatrix = new THREE.Matrix4();

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (meshRef.current) {
            // Rotate entire graph slowly
            meshRef.current.rotation.y = time * 0.05;
            if (linesRef.current) linesRef.current.rotation.y = time * 0.05;

            for (let i = 0; i < NODE_COUNT; i++) {
                // Determine color based on phase
                if (phase === 'scan') {
                    tempColor.set(PRIMARY_COLOR);
                } else if (phase === 'attack') {
                    // Random flashing red
                    if (Math.random() > 0.95 || (i % 5 === 0)) {
                        tempColor.set(ALERT_COLOR);
                    } else {
                        tempColor.set(PRIMARY_COLOR).lerp(ALERT_COLOR, Math.sin(time * 5 + i) * 0.5 + 0.5);
                    }
                } else if (phase === 'defense') {
                    // Wave of safe color
                    const dist = nodes[i].distanceTo(new THREE.Vector3(0, 0, 0));
                    const wave = Math.sin(time * 8 - dist * 0.5);
                    if (wave > 0) tempColor.set(SAFE_COLOR);
                    else tempColor.set(PRIMARY_COLOR);
                } else {
                    tempColor.set(PRIMARY_COLOR);
                }

                meshRef.current.setColorAt(i, tempColor);

                // Slight breathing movement
                tempMatrix.makeTranslation(
                    nodes[i].x,
                    nodes[i].y + Math.sin(time + i) * 0.1,
                    nodes[i].z
                );
                meshRef.current.setMatrixAt(i, tempMatrix);
            }
            meshRef.current.instanceColor!.needsUpdate = true;
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <group>
            <instancedMesh ref={meshRef} args={[undefined, undefined, NODE_COUNT]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial toneMapped={false} />
            </instancedMesh>
            <lineSegments ref={linesRef} geometry={linesGeometry}>
                <lineBasicMaterial color="#004455" transparent opacity={0.2} depthWrite={false} />
            </lineSegments>
        </group>
    );
};

const AttackParticles = () => {
    // Fast moving red particles along random paths - simplified as floating sprites for now
    const count = 50;
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.children.forEach((child, i) => {
                const time = state.clock.elapsedTime;
                child.position.x = Math.sin(time * 2 + i) * 10;
                child.position.y = Math.cos(time * 3 + i) * 10;
                child.position.z = Math.sin(time + i) * 10;
            });
        }
    });

    return (
        <group ref={group}>
            {Array.from({ length: count }).map((_, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial color={ALERT_COLOR} toneMapped={false} />
                </mesh>
            ))}
        </group>
    )
}

const UIOverlay = ({ logs, phase }: { logs: string[], phase: string }) => {
    return (
        <Html fullscreen className="pointer-events-none">
            <div className="absolute top-10 left-10 text-xs font-mono text-cyan-500/80">
                <div className="border-l-2 border-cyan-500 pl-4 mb-4">
                    <h1 className="text-xl font-bold text-white tracking-widest">NET_WATCH // V4.0</h1>
                    <p>REAL-TIME THREAT MONITORING</p>
                </div>

                <div className="space-y-1">
                    {logs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${log.includes('BLOCKED') ? 'text-green-400' : log.includes('DETECTED') ? 'text-red-500' : 'text-cyan-300'}`}
                        >
                            {`> ${log}`}
                        </motion.div>
                    ))}
                </div>
            </div>

            {phase === 'stable' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-white to-cyan-400">
                            DHANAPRIYAN
                        </h1>
                        <p className="text-cyan-500 tracking-[0.5em] mt-2 text-sm md:text-base">CYBERSECURITY ENGINEER</p>
                    </motion.div>
                </div>
            )}

            <div className="absolute bottom-10 right-10 flex gap-2">
                <div className={`w-3 h-3 rounded-full ${phase === 'attack' ? 'bg-red-500 animate-ping' : 'bg-green-500'}`} />
                <span className="text-xs text-white uppercase tracking-widest">
                    STATUS: {phase === 'attack' ? 'CRITICAL' : phase === 'defense' ? 'MITIGATING' : phase === 'stable' ? 'SECURE' : 'SCANNING'}
                </span>
            </div>
        </Html>
    );
};

const Scene = ({ phase, setPhase }: { phase: any, setPhase: any }) => {
    // Camera rig
    useFrame((state) => {
        // Subtle Mouse parallax or auto movement
        const time = state.clock.elapsedTime;
        state.camera.position.x = Math.sin(time * 0.1) * 20;
        state.camera.position.z = Math.cos(time * 0.1) * 20;
        state.camera.lookAt(0, 0, 0);
    });

    return (
        <>
            <color attach="background" args={['#020205']} />
            <fog attach="fog" args={['#020205', 10, 40]} />
            <ambientLight intensity={0.2} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <NetworkGraph phase={phase} />
            {phase === 'attack' && <AttackParticles />}

            {/* Post Processing - Wrapped to verify if it works now */}
            {/* <EffectComposer>
                <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.5} />
                <Noise opacity={0.05} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer> */}
        </>
    )
}

const NetworkAnalysisLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [phase, setPhase] = useState<'scan' | 'attack' | 'defense' | 'stable'>('scan');
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const addLog = (msg: string) => setLogs(prev => [...prev.slice(-6), msg]); // Keep last 7

        const sequence = async () => {
            await new Promise(r => setTimeout(r, 1000));
            addLog("System initialized.");
            addLog("Monitoring traffic...");

            await new Promise(r => setTimeout(r, 2000));
            setPhase('attack');
            addLog("[ALERT] Unusual traffic detected.");
            addLog("[WARNING] SSH Brute Force attempt (IP: 192.168.x.x)");

            await new Promise(r => setTimeout(r, 1500));
            addLog("[CRITICAL] SQL Injection payload identified.");

            await new Promise(r => setTimeout(r, 1000));
            setPhase('defense');
            addLog("Deploying counter-measures...");
            addLog("Firewall rules updated. IP Blocked.");
            addLog("Sanitizing inputs...");

            await new Promise(r => setTimeout(r, 2000));
            setPhase('stable');
            addLog("Threat neutralized.");
            addLog("System Integrity: 100%");

            await new Promise(r => setTimeout(r, 3000));
            onComplete();
        };
        sequence();
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* Skip */}
            <button
                onClick={onComplete}
                className="absolute top-5 right-5 z-[60] text-cyan-500 text-xs border border-cyan-500/30 px-3 py-1 hover:bg-cyan-500/10 transition-colors uppercase tracking-widest"
            >
                Skip Analysis
            </button>

            <Canvas camera={{ position: [0, 0, 25], fov: 35 }}>
                <Scene phase={phase} setPhase={setPhase} />
                <UIOverlay logs={logs} phase={phase} />
            </Canvas>
        </div>
    );
};

export default NetworkAnalysisLoader;
