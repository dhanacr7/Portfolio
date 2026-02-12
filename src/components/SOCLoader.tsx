import { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

// --- Types ---
type AttackLog = {
    id: number;
    timestamp: string;
    source: string;
    target: string;
    type: string;
    status: "BLOCKED" | "DETECTED" | "ANALYZING";
};

// --- Components ---

const Globe = ({ isSecure }: { isSecure: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    // Auto-rotate globe
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
        }
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
        }
    });

    // Generate random points on sphere for "nodes"
    const points = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 50; i++) {
            const phi = Math.acos(-1 + (2 * i) / 50);
            const theta = Math.sqrt(50 * Math.PI) * phi;
            const x = 2 * Math.cos(theta) * Math.sin(phi);
            const y = 2 * Math.sin(theta) * Math.sin(phi);
            const z = 2 * Math.cos(phi);
            temp.push(new THREE.Vector3(x, y, z));
        }
        return temp;
    }, []);

    return (
        <group>
            {/* The Globe Sphere */}
            <Sphere args={[2, 64, 64]} ref={meshRef}>
                <meshPhongMaterial
                    color={isSecure ? "#004d00" : "#050505"}
                    emissive={isSecure ? "#002200" : "#000000"}
                    specular="#111111"
                    shininess={10}
                    wireframe={true}
                    transparent
                    opacity={0.8}
                />
            </Sphere>
            {/* Inner Solid Core to block back-facing lines */}
            <Sphere args={[1.98, 64, 64]}>
                <meshBasicMaterial color="#000000" />
            </Sphere>

            {/* Connection Arcs (Attack Lines) */}
            <group ref={groupRef}>
                {points.map((point, i) => (
                    <AttackArc
                        key={i}
                        start={point}
                        end={points[(i + 5) % points.length]}
                        isSecure={isSecure}
                    />
                ))}
            </group>
        </group>
    );
};

const AttackArc = ({ start, end, isSecure }: { start: THREE.Vector3, end: THREE.Vector3, isSecure: boolean }) => {
    const curve = useMemo(() => {
        const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.5); // Control point for curve
        return new THREE.QuadraticBezierCurve3(start, mid, end);
    }, [start, end]);

    const points = useMemo(() => curve.getPoints(20), [curve]);

    return (
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length}
                    array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial
                color={isSecure ? "#00ff00" : "#ff0000"}
                transparent
                opacity={0.6}
                linewidth={1}
            />
        </line>
    );
};

// --- Main Security Loader ---

const CyberpunkLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [logs, setLogs] = useState<AttackLog[]>([]);
    const [isFrozen, setIsFrozen] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
    const [commandText, setCommandText] = useState("");
    const [isSecure, setIsSecure] = useState(false);
    const [accessGranted, setAccessGranted] = useState(false);
    const [cveList, setCveList] = useState<string[]>([]);

    const terminalRef = useRef<HTMLDivElement>(null);

    // Initial Attack Simulation
    useEffect(() => {
        const attackTypes = ["SSH_BRUTE_FORCE", "SQL_INJECTION", "XSS_ATTEMPT", "DDoS_PACKET_FLOOD", "PORT_SCAN_DETECTED"];
        const targets = ["US-EAST-1", "EU-WEST-2", "AP-SOUTH-1", "SA-EAST-1"];

        const interval = setInterval(() => {
            if (isFrozen) return;

            const newLog: AttackLog = {
                id: Date.now(),
                timestamp: new Date().toISOString().split("T")[1].split(".")[0],
                source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.XXX`,
                target: targets[Math.floor(Math.random() * targets.length)],
                type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
                status: "DETECTED"
            };
            setLogs(prev => [newLog, ...prev].slice(0, 10));

            // Random CVEs
            if (Math.random() > 0.7) {
                const year = 2020 + Math.floor(Math.random() * 4);
                const id = Math.floor(Math.random() * 9999);
                setCveList(prev => [`CVE-${year}-${id}`, ...prev].slice(0, 5));
            }

        }, 200);

        return () => clearInterval(interval);
    }, [isFrozen]);

    // Main Sequence Timeline
    useEffect(() => {
        const timeline = gsap.timeline();

        // 1. Initial Chaos (0-3s) - Handled by interval above

        // 2. Freeze (3s)
        timeline.to({}, {
            duration: 3,
            onComplete: () => {
                setIsFrozen(true);
            }
        });

        // 3. Terminal enters (3.5s)
        timeline.to({}, {
            duration: 0.5,
            onComplete: () => setShowTerminal(true)
        });

        // 4. Typing "assume-control" (3.5s - 4.5s)
        timeline.to({}, {
            duration: 1.5,
            onUpdate: function () {
                const progress = this.progress();
                const text = "assume-control --force";
                setCommandText(text.substring(0, Math.floor(progress * text.length)));
            },
            onComplete: () => {
                setCommandText("assume-control --force");
            }
        });

        // 5. Turn Green (5s)
        timeline.to({}, {
            duration: 0.5,
            onComplete: () => {
                setIsSecure(true);
                setLogs(prev => prev.map(l => ({ ...l, status: "BLOCKED", type: "THREAT_MITIGATED" })));
            }
        });

        // 6. Access Granted (5.5s)
        timeline.to({}, {
            duration: 0.5,
            onComplete: () => setAccessGranted(true)
        });

        // 7. Finish (7s)
        timeline.to({}, {
            duration: 1.5,
            onComplete: onComplete
        });

        return () => { timeline.kill(); };
    }, [onComplete]);


    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] bg-black text-white font-mono overflow-hidden"
                exit={{ opacity: 0, transition: { duration: 1 } }}
            >
                {/* 3D Scene Layer */}
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                        <Globe isSecure={isSecure} />
                        <OrbitControls enableZoom={false} autoRotate={!isFrozen} autoRotateSpeed={0.5} />
                    </Canvas>
                </div>

                {/* Vignette & Scanlines */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />

                {/* UI Overlay Layer */}
                <div className="absolute inset-0 z-20 p-4 md:p-10 flex flex-col justify-between pointer-events-none">

                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="border border-white/20 bg-black/50 p-2 backdrop-blur-md">
                            <h1 className="text-xs md:text-sm font-bold tracking-widest text-cyan-500">GLOBAL_THREAT_INTEL</h1>
                            <div className="text-[10px] text-gray-400">SOC_UNIT_ALPHA // LIVE_FEED</div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            {cveList.map((cve, i) => (
                                <motion.div
                                    key={cve}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-red-900/40 border border-red-500/50 px-2 py-0.5 text-[10px] text-red-300"
                                >
                                    DETECTED: {cve}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Terminal Overlay */}
                    {showTerminal && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-black/90 border border-gray-700 p-6 shadow-2xl backdrop-blur-xl"
                        >
                            <div className="flex items-center space-x-2 mb-4 border-b border-gray-800 pb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-xs text-gray-500 ml-2">root@soc-terminal:~</span>
                            </div>
                            <div className="font-mono text-sm md:text-base space-y-2">
                                <div className="text-gray-400">Authenticating user...</div>
                                <div className="flex">
                                    <span className="text-green-500 mr-2">$</span>
                                    <span className="text-white">{commandText}</span>
                                    <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-green-500" />
                                </div>
                                {isSecure && (
                                    <div className="text-green-400 mt-2">
                                        {`> OVERRIDING PROTOCOLS... SUCCESS`}<br />
                                        {`> THREATS MITIGATED.`}<br />
                                        {`> SYSTEM SECURE.`}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Access Granted Splash */}
                    {accessGranted && (
                        <motion.div
                            initial={{ opacity: 0, scale: 1.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm"
                        >
                            <div className="text-center">
                                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-widest mb-2 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                    DHANAPRIYAN
                                </h1>
                                <div className="h-0.5 w-full bg-cyan-500 mb-4" />
                                <p className="text-xl md:text-2xl text-cyan-400 font-light tracking-[0.5em]">
                                    SENIOR OFFENSIVE SECURITY
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Footer Logs */}
                    <div className="w-full max-w-md self-end mt-auto h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                        <div className="flex flex-col justify-end h-full space-y-1">
                            {logs.map(log => (
                                <motion.div
                                    layout
                                    key={log.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`text-[10px] md:text-xs font-mono border-l-2 pl-2 ${isSecure ? "border-green-500 text-green-400" : "border-red-500 text-red-400"
                                        }`}
                                >
                                    <span className="opacity-50">[{log.timestamp}]</span> {log.type} // {log.source} -&gt; {log.target} :: {log.status}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CyberpunkLoader;
