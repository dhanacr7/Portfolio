import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

// --- Scene Components --- //

const CentralCore = () => {
    const meshRef = useRef<THREE.Group>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tl.fromTo(meshRef.current!.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 2, ease: "elastic.out(1, 0.5)" }, 0);

            // Pulse precisely at impact (3.5s) to signify surviving the attack
            tl.to(meshRef.current!.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.out" }, 3.5);

            // Disperse
            tl.to(meshRef.current!.position, { y: 15, duration: 2.5, ease: "power2.in" }, 6.5);
            tl.to(meshRef.current!.scale, { x: 0, y: 0, z: 0, duration: 2.5, ease: "power2.in" }, 6.5);
        });

        return () => ctx.revert();
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        // Slowly rotate the single core
        meshRef.current.rotation.y += 0.2 * delta;
        meshRef.current.rotation.z += 0.05 * delta;
    });

    return (
        <group ref={meshRef}>
            {/* The main core shape */}
            <mesh>
                <icosahedronGeometry args={[1.5, 2]} />
                <meshStandardMaterial color="#7F77DD" wireframe wireframeLinewidth={3} transparent opacity={0.6} />

                {/* Inner glowing solid */}
                <mesh>
                    <icosahedronGeometry args={[1.3, 1]} />
                    <meshStandardMaterial color="#534AB7" emissive="#7F77DD" emissiveIntensity={1.5} />
                </mesh>
            </mesh>

            {/* The text hovering clearly above the giant core */}
            <Text
                position={[0, 2.5, 0]}
                fontSize={0.8}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.03}
                outlineColor="#7F77DD"
                depthOffset={-1}
            >
                DATABASE
            </Text>
        </group>
    );
};

const AttackSpikes = () => {
    const count = 16;
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const animState = useRef({ progress: 0, opacity: 1 });

    const geometry = useMemo(() => {
        const geo = new THREE.ConeGeometry(0.3, 5, 8); // Long sharp missiles
        geo.rotateX(-Math.PI / 2); // Natively points the tip along the -Z axis (towards target when lookAt is called)
        return geo;
    }, []);

    const initialData = useMemo(() => {
        const data = [];
        const dummyOrient = new THREE.Object3D();

        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            const dir = new THREE.Vector3(
                Math.cos(theta) * Math.sin(phi),
                Math.sin(theta) * Math.sin(phi),
                Math.cos(phi)
            );

            dummyOrient.position.copy(dir);
            dummyOrient.lookAt(0, 0, 0); // With tip natively at -Z, this guarantees perfect 100% accuracy to center

            data.push({ dir, rot: new THREE.Euler().copy(dummyOrient.rotation) });
        }
        return data;
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            // Inbound attack takes 1.5s, allowing user to clearly read the text and see the trajectory
            tl.to(animState.current, { progress: 1, duration: 1.5, ease: "power2.in" }, 2.0); // 2.0s to 3.5s
            tl.set(animState.current, { opacity: 0 }, 3.5); // disappear precisely at impact
        });
        return () => {
            ctx.revert();
            if (meshRef.current) {
                meshRef.current.geometry.dispose();
                (meshRef.current.material as THREE.Material).dispose();
            }
        };
    }, []);

    useFrame(() => {
        if (!meshRef.current) return;
        const { progress, opacity } = animState.current;

        if (opacity === 0 && meshRef.current.visible) {
            meshRef.current.visible = false;
        } else if (opacity > 0 && !meshRef.current.visible) {
            meshRef.current.visible = true;
        }

        const startDist = 20; // Starts further out
        const endDist = 3.5;  // Barrier radius protects the core
        const dist = startDist - (startDist - endDist) * progress;

        for (let i = 0; i < count; i++) {
            const { dir, rot } = initialData[i];
            dummy.position.copy(dir).multiplyScalar(dist);
            dummy.rotation.copy(rot);
            dummy.scale.setScalar(1);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        (meshRef.current.material as THREE.Material).opacity = opacity;
    });

    return (
        <instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} transparent />
        </instancedMesh>
    );
};

const ShatterParticles = () => {
    const count = 144;
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const animState = useRef({ progress: 0, opacity: 1 });

    const initialData = useMemo(() => {
        const data = [];
        for (let i = 0; i < count; i++) {
            const r = 3.5;
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            const basePos = new THREE.Vector3(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );

            const dir = basePos.clone().normalize().add(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.5)).normalize();

            data.push({ basePos, dir, rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI), rotSpeed: new THREE.Euler(Math.random() * 0.2, Math.random() * 0.2, Math.random() * 0.2) });
        }
        return data;
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tl.to(animState.current, { progress: 1, duration: 1.0, ease: "power2.out" }, 3.5);
            tl.to(animState.current, { opacity: 0, duration: 1.0, ease: "power2.out" }, 3.5);
        });
        return () => {
            ctx.revert();
            if (meshRef.current) {
                meshRef.current.geometry.dispose();
                (meshRef.current.material as THREE.Material).dispose();
            }
        };
    }, []);

    useFrame(() => {
        if (!meshRef.current) return;
        const { progress, opacity } = animState.current;
        if (opacity === 0 || progress === 0) {
            meshRef.current.visible = false;
            return;
        }
        meshRef.current.visible = true;

        for (let i = 0; i < count; i++) {
            const { basePos, dir, rot, rotSpeed } = initialData[i];
            dummy.position.copy(basePos).addScaledVector(dir, progress * 4);
            dummy.rotation.set(
                rot.x + rotSpeed.x * progress * 20,
                rot.y + rotSpeed.y * progress * 20,
                rot.z + rotSpeed.z * progress * 20
            );
            const s = 1 - progress;
            dummy.scale.setScalar(s * 0.8);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        (meshRef.current.material as THREE.Material).opacity = opacity;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} visible={false}>
            <tetrahedronGeometry args={[0.2]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} transparent />
        </instancedMesh>
    );
};

const ImpactLight = () => {
    const lightRef = useRef<THREE.PointLight>(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(lightRef.current, { intensity: 500, distance: 40, duration: 0.1, yoyo: true, repeat: 1, delay: 3.5 });
        });
        return () => ctx.revert();
    }, []);
    return <pointLight ref={lightRef} intensity={0} color="#ffffff" />;
};

const ShieldRing = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tl.fromTo(meshRef.current!.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }, 3.6);
            tl.fromTo((meshRef.current!.material as THREE.Material), { opacity: 0 }, { opacity: 0.4, duration: 0.5 }, 3.6);

            tl.to(meshRef.current!.position, { y: 15, duration: 2.5, ease: "power2.in" }, 6.5);
            tl.to((meshRef.current!.material as THREE.Material), { opacity: 0, duration: 1 }, 6.5);
        });

        return () => {
            ctx.revert();
            if (meshRef.current) {
                meshRef.current.geometry.dispose();
                if (Array.isArray(meshRef.current.material)) {
                    meshRef.current.material.forEach(m => m.dispose());
                } else {
                    meshRef.current.material.dispose();
                }
            }
        };
    }, []);

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[3.4, 32, 32]} />
            <meshBasicMaterial color="#AFA9EC" wireframe transparent opacity={0} />
        </mesh>
    );
};

const ResponsiveCamera = () => {
    const { camera, size } = useThree();

    useEffect(() => {
        if (camera instanceof THREE.PerspectiveCamera) {
            const isMobile = size.width < size.height;
            camera.fov = isMobile ? 90 : 65;
            camera.position.z = isMobile ? 15 : 13;
            camera.updateProjectionMatrix();
        }
    }, [size, camera]);

    return null;
};


// --- UI Overlay Components --- //

const TextDecoder = ({ text, className }: { text: string, className?: string }) => {
    const [display, setDisplay] = useState(text.replace(/./g, '_'));

    useEffect(() => {
        let iter = 0;
        const chars = "01#@$_";
        const interval = setInterval(() => {
            setDisplay(text.split("").map((letter, index) => {
                if (letter === " ") return " ";
                if (index < iter) return letter;
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(""));

            if (iter >= text.length) clearInterval(interval);
            iter += 0.3;
        }, 30);

        return () => clearInterval(interval);
    }, [text]);

    return <div className={className}>{display}</div>;
};

// --- MAIN COMPONENT --- //

interface Props {
    onComplete: () => void;
}

type PhaseState = 'initial' | 'attack' | 'secured' | 'reveal';

export default function TimeRewindLoader({ onComplete }: Props) {
    const [phase, setPhase] = useState<PhaseState>('initial');

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.delayedCall(2.0, () => setPhase('attack')); // Earlier start to see the attack forming
            gsap.delayedCall(5.0, () => setPhase('secured'));
            gsap.delayedCall(6.5, () => setPhase('reveal'));
            gsap.delayedCall(9.7, () => {
                if (onComplete) onComplete();
            });
        });
        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-[#050505] overflow-hidden select-none">
            <Canvas dpr={[1, 2]}>
                <ResponsiveCamera />
                <color attach="background" args={['#050505']} />
                <ambientLight color="#534AB7" intensity={2.5} />
                <Stars radius={50} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />

                <CentralCore />
                <AttackSpikes />
                <ShatterParticles />
                <ImpactLight />
                <ShieldRing />
            </Canvas>

            {/* Overlays */}

            <AnimatePresence>
                {phase === 'initial' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-[15%] left-1/2 -translate-x-1/2 pointer-events-none"
                    >
                        <div className="text-[#AFA9EC] font-mono text-sm md:text-base tracking-[0.2em] text-center bg-black/40 px-4 py-2 rounded border border-[#AFA9EC]/30">
                            SYSTEM CLOUD ACTIVE
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {phase === 'attack' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="absolute top-[15%] left-1/2 -translate-x-1/2 pointer-events-none w-full px-4"
                    >
                        <div className="text-[#ef4444] font-mono text-lg md:text-2xl font-bold tracking-[0.1em] text-center animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                            ⚠️ HACKERS ARE TRYING TO STEAL THE DATA! ⚠️
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {phase === 'secured' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 pointer-events-none"
                    >
                        <TextDecoder text="WE ARE SECURED" className="text-[#AFA9EC] font-mono text-[1.25rem] tracking-wider text-center w-max drop-shadow-[0_0_8px_rgba(175,169,236,0.6)]" />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {phase === 'reveal' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                        <motion.h1
                            initial={{ y: 80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                            className="text-white font-mono font-medium text-4xl md:text-[3rem] tracking-[0.3em] text-center drop-shadow-lg"
                        >
                            DHANAPRIYAN
                        </motion.h1>

                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 1 }}
                            className="text-[#7F77DD] font-mono text-[0.7rem] md:text-[0.85rem] tracking-[0.25em] mt-4 text-center drop-shadow-[0_0_5px_rgba(127,119,221,0.5)]"
                        >
                            SECURITY IS ENGINEERED
                        </motion.h2>
                    </div>
                )}
            </AnimatePresence>

            <button
                onClick={onComplete}
                className="absolute top-6 right-6 z-50 text-[#7F77DD] font-mono text-xs hover:text-white transition-colors uppercase tracking-widest cursor-pointer bg-transparent border-none appearance-none hover:underline"
            >
                Skip Intro
            </button>
        </div>
    );
}
