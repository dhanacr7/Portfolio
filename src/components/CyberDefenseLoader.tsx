import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Text, Float, Trail, Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// --- Constants ---
const PRIMARY_COLOR = '#00f0ff'; // Cyan
const SECONDARY_COLOR = '#ff00aa'; // Magenta
const CORE_COLOR = '#1a1a1a'; // Dark core
const ANIMATION_DURATION = 8000; // 8 seconds total

// --- Components ---

// 1. Hexagonal Sphere (Simulated with Icosahedron + Wireframe shader/material)
const HexSphere = ({ step }: { step: number }) => {
    const meshRef = useRef<THREE.Group>(null);
    const leftRef = useRef<THREE.Mesh>(null);
    const rightRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }

        // Split animation
        if (step >= 3 && leftRef.current && rightRef.current) {
            // Move halves apart
            const openAmount = THREE.MathUtils.lerp(0, 2, 0.05); // Smooth opening
            // We'll just move them on X axis local
            leftRef.current.position.x = THREE.MathUtils.lerp(leftRef.current.position.x, -1.5, 0.1);
            rightRef.current.position.x = THREE.MathUtils.lerp(rightRef.current.position.x, 1.5, 0.1);
        }
    });

    // Geometry for halves - we can't easily split a single geometry in vanilla three w/o CSG or custom buffer geometry manipulation
    // Simplified approach: Two hemispheres (spheres with phiLength)

    return (
        <group ref={meshRef}>
            {/* Left Hemisphere */}
            <mesh ref={leftRef} position={[-0.01, 0, 0]} rotation={[0, Math.PI, 0]}>
                <sphereGeometry args={[1.2, 32, 32, 0, Math.PI]} />
                <meshStandardMaterial
                    color={CORE_COLOR}
                    roughness={0.3}
                    metalness={0.8}
                    emissive={PRIMARY_COLOR}
                    emissiveIntensity={0.1}
                    wireframe={false}
                />
                {/* Hex Pattern Overlay (Wireframe or similar) */}
                <lineSegments>
                    <wireframeGeometry args={[new THREE.IcosahedronGeometry(1.2, 2)]} />
                    <lineBasicMaterial color={PRIMARY_COLOR} opacity={0.1} transparent />
                </lineSegments>
            </mesh>

            {/* Right Hemisphere */}
            <mesh ref={rightRef} position={[0.01, 0, 0]}>
                <sphereGeometry args={[1.2, 32, 32, 0, Math.PI]} />
                <meshStandardMaterial
                    color={CORE_COLOR}
                    roughness={0.3}
                    metalness={0.8}
                    emissive={PRIMARY_COLOR}
                    emissiveIntensity={0.1}
                    wireframe={false}
                />
                <lineSegments>
                    <wireframeGeometry args={[new THREE.IcosahedronGeometry(1.2, 2)]} />
                    <lineBasicMaterial color={PRIMARY_COLOR} opacity={0.1} transparent />
                </lineSegments>
            </mesh>
        </group>
    );
};

// 2. Orbiting Data Lines
const DataRings = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.z += 0.002;
            groupRef.current.rotation.x += 0.001;
        }
    });

    return (
        <group ref={groupRef}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.5, 0.02, 16, 100]} />
                <meshBasicMaterial color={PRIMARY_COLOR} opacity={0.3} transparent />
            </mesh>
            <mesh rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[3.2, 0.01, 16, 100]} />
                <meshBasicMaterial color={SECONDARY_COLOR} opacity={0.2} transparent />
            </mesh>
            <mesh rotation={[-Math.PI / 4, 0, 0]}>
                <torusGeometry args={[1.8, 0.015, 16, 100]} />
                <meshBasicMaterial color={PRIMARY_COLOR} opacity={0.4} transparent />
            </mesh>
        </group>
    )
}

// 3. Particles Assembly
const ParticleField = ({ assemble }: { assemble: boolean }) => {
    const count = 1000;
    const mesh = useRef<THREE.Points>(null);

    const [positions, targetPositions] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const target = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Random start
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

            // Target sphere surface
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 1.2 + Math.random() * 0.1;

            target[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            target[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            target[i * 3 + 2] = r * Math.cos(phi);
        }
        return [pos, target];
    }, []);

    useFrame((state) => {
        if (!mesh.current) return;

        const currentPos = mesh.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            if (assemble) {
                // Move towards target
                currentPos[ix] += (targetPositions[ix] - currentPos[ix]) * 0.05;
                currentPos[iy] += (targetPositions[iy] - currentPos[iy]) * 0.05;
                currentPos[iz] += (targetPositions[iz] - currentPos[iz]) * 0.05;
            } else {
                // Float randomly?
            }
        }
        mesh.current.geometry.attributes.position.needsUpdate = true;
        mesh.current.rotation.y += 0.001;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.03} color={PRIMARY_COLOR} transparent opacity={0.6} sizeAttenuation />
        </points>
    );
};

// 4. Revealed Name
const RevealedName = ({ show }: { show: boolean }) => {
    return (
        <group visible={show}>
            <Text
                fontSize={0.5}
                color={PRIMARY_COLOR}
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            >
                DHANAPRIYAN
                <meshBasicMaterial color={PRIMARY_COLOR} toneMapped={false} />
            </Text>
            <Text
                position={[0, -0.4, 0]}
                fontSize={0.15}
                color="white"
                font="https://fonts.gstatic.com/s/robotomono/v22/L0x5DF4xlVMF-BfR8bXMIjhLq3-cXbKDO1w.woff"
            >
                SECURE SYSTEM ACCESS GRANTED
            </Text>
        </group>
    )
}


// --- Main Scene ---
const Scene = ({ step, setStep }: { step: number, setStep: (s: number) => void }) => {
    // Post Processing

    return (
        <>
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 5, 20]} />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color={PRIMARY_COLOR} />
            <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={2} color={SECONDARY_COLOR} />

            <ParticleField assemble={step >= 1} />

            {step >= 2 && <HexSphere step={step} />}
            {step >= 2 && <DataRings />}
            {step >= 4 && <RevealedName show={true} />}

            {/* <EffectComposer>
                <Bloom luminanceThreshold={0} mipmapBlur intensity={1.5} radius={0.4} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer> */}
        </>
    );
};


// --- Main Component ---
const CyberDefenseLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(0); // 0: Start, 1: Assemble, 2: Sphere Formed, 3: Scanning, 4: Open/Reveal, 5: Exit
    const [text, setText] = useState("");

    useEffect(() => {
        // Sequence Timeline
        const timeline = async () => {
            await new Promise(r => setTimeout(r, 500));
            setStep(1); // Particles assemble
            setText("INITIALIZING SECURE ENVIRONMENT...");

            await new Promise(r => setTimeout(r, 2000));
            setStep(2); // Sphere solidifies
            setText("SYSTEM INTEGRITY CHECK...");

            await new Promise(r => setTimeout(r, 1500));
            setStep(3); // Scan/Split start
            setText("OPERATOR AUTHENTICATED.");

            await new Promise(r => setTimeout(r, 1000));
            setStep(4); // Name Reveal

            await new Promise(r => setTimeout(r, 2500));
            setStep(5); // Done
            onComplete();
        };
        timeline();
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-black text-white font-mono overflow-hidden">
            {/* Skip Button */}
            <div className="absolute top-8 right-8 z-[60]">
                <button onClick={onComplete} className="text-xs uppercase tracking-[0.2em] text-cyan-500 hover:text-white transition-colors border border-cyan-900 px-4 py-2 bg-black/50 backdrop-blur-sm">
                    Skip Sequence
                </button>
            </div>

            {/* HUD Overlay */}
            <div className="absolute bottom-12 left-12 z-[60]">
                <div className="text-xs text-cyan-500 tracking-widest mb-1">STATUS</div>
                <div className="text-xl md:text-2xl font-bold tracking-tighter text-white">
                    {text} <span className="animate-pulse">_</span>
                </div>
                <div className="mt-2 text-[10px] text-gray-500 flex flex-col gap-1">
                    <div>MEM_ALLOC: 0x8493A2... OK</div>
                    <div>NET_SEC: ENCRYPTED (AES-256)</div>
                </div>
            </div>

            {/* 3D Scene */}
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <Scene step={step} setStep={setStep} />
            </Canvas>
        </div>
    );
};

export default CyberDefenseLoader;
