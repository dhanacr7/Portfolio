import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { Shield, Smartphone, Globe as GlobeIcon, Activity, Lock, Unlock, Terminal } from 'lucide-react';

// --- Configuration ---
const COLORS = {
    threat: '#ef4444', // Red-500
    safe: '#22c55e',   // Green-500
    neutral: '#0ea5e9', // Sky-500
    bg: '#020617',     // Slate-950
};

const LOG_COUNT = 8;

// --- Mock Data ---
const ATTACK_TYPES = [
    "SSH_BRUTE_FORCE", "SQL_INJECTION", "XSS_PAYLOAD",
    "RCE_ATTEMPT", "DDoS_SYN_FLOOD", "PORT_SCAN", "MALWARE_C2"
];

const LOCATIONS = [
    { city: "San Francisco", lat: 37.77, lon: -122.41 },
    { city: "New York", lat: 40.71, lon: -74.00 },
    { city: "London", lat: 51.50, lon: -0.12 },
    { city: "Tokyo", lat: 35.67, lon: 139.65 },
    { city: "Sydney", lat: -33.86, lon: 151.20 },
    { city: "Sao Paulo", lat: -23.55, lon: -46.63 },
    { city: "Moscow", lat: 55.75, lon: 37.61 },
    { city: "Beijing", lat: 39.90, lon: 116.40 },
    { city: "Mumbai", lat: 19.07, lon: 72.87 },
    { city: "Cairo", lat: 30.04, lon: 31.23 }
];

// --- Utils ---
const getPositionFromLatLon = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
};

// --- Components ---

const Earth = ({ isSecure, groupRef }: { isSecure: boolean, groupRef: React.MutableRefObject<THREE.Group> }) => {
    // Generate dot matrix sphere
    const { points } = useMemo(() => {
        const pts = [];
        const r = 2.5;
        const count = 1800; // Dot count
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;

            pts.push(
                r * Math.cos(theta) * Math.sin(phi),
                r * Math.sin(theta) * Math.sin(phi),
                r * Math.cos(phi)
            );
        }
        return { points: new Float32Array(pts) };
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <group ref={groupRef}>
            {/* World Core */}
            <mesh>
                <sphereGeometry args={[2.45, 64, 64]} />
                <meshBasicMaterial color="#000" />
            </mesh>

            {/* Dot Matrix Surface */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={points.length / 3}
                        array={points}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.03}
                    color={isSecure ? COLORS.safe : "#334155"}
                    transparent
                    opacity={0.6}
                />
            </points>

            {/* Atmosphere Glow */}
            <mesh scale={[1.1, 1.1, 1.1]}>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshBasicMaterial
                    color={isSecure ? COLORS.safe : COLORS.neutral}
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
};

const AttackLines = ({ isSecure, worldGroup }: { isSecure: boolean, worldGroup: React.MutableRefObject<THREE.Group> }) => {
    const linesRef = useRef<THREE.Group>(null);
    const [attacks, setAttacks] = useState<any[]>([]);

    useEffect(() => {
        // Spawn cyclic attacks
        const interval = setInterval(() => {
            if (isSecure) return; // Stop spawning threats if secure

            const startLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
            let endLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
            while (startLoc === endLoc) endLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

            const start = getPositionFromLatLon(startLoc.lat, startLoc.lon, 2.5);
            const end = getPositionFromLatLon(endLoc.lat, endLoc.lon, 2.5);

            // Curve control point (push out for arc)
            const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(4.0);
            const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
            const points = curve.getPoints(30);

            setAttacks(prev => [...prev.slice(-15), { id: Math.random(), points, progress: 0 }]);
        }, 300);

        return () => clearInterval(interval);
    }, [isSecure]);

    useFrame((state, delta) => {
        // We can't easily animate standard lines without complex loop.
        // Simplified: Re-render lines isn't ideal for perf. 
        // Better: Use a fixed pool or TubeGeometry, but for "6 seconds" load, 
        // let's use a simpler static set that flashes or just standard Lines that appear/disappear.
    });

    return (
        <group ref={linesRef}>
            {attacks.map((att) => (
                <LineParticles key={att.id} curvePoints={att.points} isSecure={isSecure} />
            ))}
        </group>
    );
};

const LineParticles = ({ curvePoints, isSecure }: { curvePoints: THREE.Vector3[], isSecure: boolean }) => {
    // Animate a particle along the curve
    const meshRef = useRef<THREE.Mesh>(null);
    const [progress, setProgress] = useState(0);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        const newProg = progress + delta * 1.5; // speed
        if (newProg >= 1) {
            // Reset or hide? 
            meshRef.current.visible = false;
        } else {
            setProgress(newProg);
            // Get point at progress
            // curvePoints is array of 30.
            const idx = Math.floor(newProg * (curvePoints.length - 1));
            const p = curvePoints[idx];
            meshRef.current.position.copy(p);
        }
    });

    if (isSecure) return null; // Hide attacks when secure

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={COLORS.threat} />
        </mesh>
    );
};

const HUD = ({ logs, showTerminal, terminalText, isSecure, accessGranted }: any) => {
    return (
        <div className="absolute inset-0 pointer-events-none p-4 md:p-8 flex flex-col justify-between font-mono text-[10px] md:text-xs">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
                <div className="bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded shadow-lg w-64">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
                        <GlobeIcon className={`w-4 h-4 ${isSecure ? 'text-green-500' : 'text-red-500 animate-pulse'}`} />
                        <span className="font-bold text-slate-200 tracking-widest">GLOBAL_THREAT_MAP</span>
                    </div>
                    <div className="space-y-1 text-slate-400">
                        <div className="flex justify-between">
                            <span>STATUS:</span>
                            <span className={isSecure ? "text-green-400" : "text-red-400 font-bold"}>
                                {isSecure ? "SECURE" : "CRITICAL"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>THREATS:</span>
                            <span>{isSecure ? "0" : Math.floor(Math.random() * 500 + 1000)} / MIN</span>
                        </div>
                        <div className="flex justify-between">
                            <span>UPTIME:</span>
                            <span>99.998%</span>
                        </div>
                    </div>
                </div>

                {/* Top Right: Live Feed */}
                <div className="hidden md:block bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded shadow-lg w-72">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
                        <Activity className="w-4 h-4 text-sky-500" />
                        <span className="font-bold text-slate-200 tracking-widest">LIVE_INTEL_FEED</span>
                    </div>
                    <div className="space-y-1 h-32 overflow-hidden flex flex-col justify-end">
                        {logs.map((log: any) => (
                            <div key={log.id} className="flex gap-2 opacity-80">
                                <span className="text-slate-500">[{log.time}]</span>
                                <span className={isSecure ? "text-green-500" : "text-red-400"}>{log.type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Center: Terminal */}
            {showTerminal && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
                    <div className="bg-black/90 border border-slate-600 rounded-lg shadow-2xl overflow-hidden backdrop-blur-xl">
                        <div className="bg-slate-800/50 p-2 flex items-center gap-2 border-b border-slate-700">
                            <Terminal className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">root@soc-command:~</span>
                        </div>
                        <div className="p-4 space-y-2 h-48 flex flex-col font-mono text-sm">
                            <div className="text-slate-300">Target system identified. Initiating override...</div>
                            <div className="flex">
                                <span className="text-green-500 mr-2">$</span>
                                <span className="text-white">{terminalText}</span>
                                <span className="w-2 h-4 bg-green-500 animate-pulse ml-1" />
                            </div>
                            {isSecure && (
                                <div className="text-green-400 mt-2 space-y-1">
                                    <div>[SUCCESS] Root privileges acquired.</div>
                                    <div>[SUCCESS] Firewalls hardened.</div>
                                    <div>[SUCCESS] Threats neutralized.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Reveal Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-1000 z-50 ${accessGranted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Shield className="w-8 h-8 text-green-500" />
                        <span className="text-green-500 tracking-[0.3em]">SYSTEM SECURED</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-2">DHANAPRIYAN</h1>
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent my-4" />
                    <p className="text-cyan-400 tracking-[0.5em] text-sm md:text-lg">SENIOR OFFENSIVE SECURITY ENGINEER</p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex justify-between items-end">
                <div className="flex gap-4 text-slate-500">
                    <div>IP: 192.168.X.X</div>
                    <div>LATENCY: 14ms</div>
                </div>
            </div>
        </div>
    );
};

const SOCLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [showTerminal, setShowTerminal] = useState(false);
    const [terminalText, setTerminalText] = useState("");
    const [isSecure, setIsSecure] = useState(false);
    const [accessGranted, setAccessGranted] = useState(false);

    // Attack Interval
    useEffect(() => {
        if (isSecure) return;
        const interval = setInterval(() => {
            const types = ATTACK_TYPES;
            const type = types[Math.floor(Math.random() * types.length)];
            setLogs(prev => [...prev.slice(-(LOG_COUNT - 1)), {
                id: Math.random(),
                time: new Date().toLocaleTimeString('en-US', { hour12: false }).split(' ')[0],
                type
            }]);
        }, 400);
        return () => clearInterval(interval);
    }, [isSecure]);

    // Sequence
    useEffect(() => {
        const tl = gsap.timeline();

        // 0s-2.5s: Just attacks viewing

        // 2.5s: Freeze/Terminal
        tl.call(() => setShowTerminal(true), [], 2.5);

        // 3s-4.5s: Type Command
        tl.to({}, {
            duration: 1.5,
            onUpdate: function () {
                const txt = "assume-control --force";
                setTerminalText(txt.substring(0, Math.floor(this.progress() * txt.length)));
            }
        }, 3.0);

        // 5s: Secure
        tl.call(() => setIsSecure(true), [], 5.0);

        // 5.5s: Reveal
        tl.call(() => setAccessGranted(true), [], 5.5);

        // 8s: Finish
        tl.call(onComplete, [], 8.0);

        return () => { tl.kill(); };
    }, []);

    const groupRef = useRef<THREE.Group>(null!);

    return (
        <div className="fixed inset-0 z-50 bg-[#020617] text-white">
            <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
                <color attach="background" args={['#020617']} />

                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#0ea5e9" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ef4444" />

                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

                <Earth isSecure={isSecure} groupRef={groupRef} />
                <AttackLines isSecure={isSecure} worldGroup={groupRef} />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>

            <HUD
                logs={logs}
                showTerminal={showTerminal}
                terminalText={terminalText}
                isSecure={isSecure}
                accessGranted={accessGranted}
            />

            {/* Skip Button */}
            <button onClick={onComplete} className="absolute top-6 right-6 z-[60] bg-slate-900/50 border border-slate-700 text-slate-400 px-3 py-1 text-[10px] tracking-widest hover:text-white hover:border-white transition-colors">
                SKIP_SEQ
            </button>
        </div>
    );
};

export default SOCLoader;
