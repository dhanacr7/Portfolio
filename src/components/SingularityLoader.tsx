import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Stars, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// --- Configuration ---
const PARTICLE_COUNT = 3000;
const CORE_RADIUS = 2.5;

const COLORS = {
    void: '#000000',
    eventHorizon: '#050510',
    threat: new THREE.Color('#ff0033'),
    safe: new THREE.Color('#00f0ff'),
    coreStable: new THREE.Color('#ffffff'), // Diamond/Glass
};

// --- Shaders ---

// 1. Singularity Core Shader
// Handles the black hole look -> transforms to glass
const CoreMaterial = {
    vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    uniform float uTime;
    uniform float uStabilized; // 0 = chaos/blackhole, 1 = stable/glass
    uniform vec3 uColorCore;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Fresnel
      float fresnel = pow(1.0 - dot(viewDir, normal), 3.0);
      
      // Black Hole Distortion (Chaos)
      float noise = sin(vUv.y * 20.0 + uTime * 5.0) * 0.1;
      
      // Core Color Logic
      vec3 chaoticColor = vec3(0.0); // Pure black
      vec3 horizonColor = vec3(0.1, 0.0, 0.2); // Violet rim
      
      // Stable Color Logic (Glass/Diamond)
      vec3 stableColor = vec3(0.8, 0.9, 1.0); // White/Blueish
      
      // Mix based on state
      vec3 baseColor = mix(chaoticColor, stableColor, uStabilized);
      
      // Emission/Glow
      vec3 emission = mix(horizonColor, vec3(0.0, 1.0, 1.0), uStabilized);
      
      // Final Composite
      vec3 finalColor = baseColor + (emission * fresnel * 2.0);
      
      // Add "glint" if stable
      if (uStabilized > 0.5) {
          float glint = pow(max(0.0, dot(reflect(-viewDir, normal), vec3(0.0, 1.0, 0.0))), 30.0);
          finalColor += vec3(1.0) * glint;
      }
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

// 2. Accretion Disk Particles Shader
const ParticleMaterial = {
    vertexShader: `
    attribute float aSize;
    attribute float aSpeed;
    attribute float aOffset;
    attribute vec3 aColor; // Start color (Red)
    
    varying vec3 vColor;
    varying float vAlpha;
    
    uniform float uTime;
    uniform float uSuction; // 1 = sucking in, 0 = orbiting/stable
    
    void main() {
      vColor = aColor;
      
      vec3 pos = position;
      
      // Orbit Logic
      float angle = aOffset + uTime * aSpeed * 0.5;
      float radius = length(pos.xz);
      
      // Suction: Reduce radius over time if active
      if (uSuction > 0.5) {
         // Spiral in
         float suctionFactor = mod(uTime * 0.5 + aOffset, 1.0); // 0 to 1 loop
         // If "threat", spiral all the way in. 
         // For visual flair, let's just rotate them and scale radius
      }
      
      // Apply rotation
      float c = cos(angle);
      float s = sin(angle);
      // Rotation matrix around Y
      float x = pos.x * c - pos.z * s;
      float z = pos.x * s + pos.z * c;
      
      pos.x = x;
      pos.z = z;
      
      // Vertical wave
      pos.y += sin(uTime + aOffset * 10.0) * 0.2;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Size attenuation
      gl_PointSize = aSize * (30.0 / -mvPosition.z);
      
      // Fade out if too close to core (consumed)
      float dist = length(pos);
      vAlpha = smoothstep(2.5, 4.0, dist); // Fade inside radius 4 to 2.5
    }
  `,
    fragmentShader: `
    varying vec3 vColor;
    varying float vAlpha;
    
    uniform vec3 uColorSafe; // Cyan
    uniform float uStabilized; // 0 -> 1
    
    void main() {
      // Circular particle
      vec2 coord = gl_PointCoord - vec2(0.5);
      if(length(coord) > 0.5) discard;
      
      // Color transition: Red (vColor) -> Cyan (Safe)
      vec3 finalColor = mix(vColor, uColorSafe, uStabilized);
      
      // Glow center
      float strength = 1.0 - (length(coord) * 2.0);
      strength = pow(strength, 3.0);
      
      gl_FragColor = vec4(finalColor, vAlpha * strength);
    }
  `
};

// --- Components ---

const SingularityCore = ({ timelineRef }: { timelineRef: any }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
        if (meshRef.current) {
            // Subtle float
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[CORE_RADIUS, 64, 64]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={CoreMaterial.vertexShader}
                fragmentShader={CoreMaterial.fragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uStabilized: { value: 0 },
                    uColorCore: { value: new THREE.Color(0, 0, 0) }
                }}
            />
        </mesh>
    );
};

const AccretionDisk = ({ timelineRef }: { timelineRef: any }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const { positions, sizes, speeds, offsets, colors } = useMemo(() => {
        const pos = new Float32Array(PARTICLE_COUNT * 3);
        const sz = new Float32Array(PARTICLE_COUNT);
        const spd = new Float32Array(PARTICLE_COUNT);
        const off = new Float32Array(PARTICLE_COUNT);
        const col = new Float32Array(PARTICLE_COUNT * 3);

        const red = new THREE.Color(COLORS.threat);
        const white = new THREE.Color('#ffffff');

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Disk distribution
            const r = Math.random() * 15 + 4; // Radius 4 to 19
            const theta = Math.random() * Math.PI * 2;

            pos[i * 3] = r * Math.cos(theta);
            pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5; // Thin disk
            pos[i * 3 + 2] = r * Math.sin(theta);

            sz[i] = Math.random() * 2 + 1;
            spd[i] = (1 / r) * 5.0; // Faster near center (Kepler-ish)
            off[i] = Math.random() * 100;

            // Color: Mostly white/grey, some Red threats
            const isThreat = Math.random() > 0.8;
            const c = isThreat ? red : white;
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }
        return { positions: pos, sizes: sz, speeds: spd, offsets: off, colors: col };
    }, []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-aSize" count={PARTICLE_COUNT} array={sizes} itemSize={1} />
                <bufferAttribute attach="attributes-aSpeed" count={PARTICLE_COUNT} array={speeds} itemSize={1} />
                <bufferAttribute attach="attributes-aOffset" count={PARTICLE_COUNT} array={offsets} itemSize={1} />
                <bufferAttribute attach="attributes-aColor" count={PARTICLE_COUNT} array={colors} itemSize={3} />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexShader={ParticleMaterial.vertexShader}
                fragmentShader={ParticleMaterial.fragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uSuction: { value: 1 }, // Always rotating/sucking
                    uStabilized: { value: 0 },
                    uColorSafe: { value: COLORS.safe }
                }}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const CoreText = ({ show }: { show: boolean }) => {
    return (
        <group visible={show}>
            {/* Using Drei Text for 3D integration inside the core */}
            <Text
                fontSize={0.35}
                color="black"
                anchorX="center"
                anchorY="middle"
                position={[0, 0.2, 3]} // Slightly in front of core surface
                fillOpacity={show ? 1 : 0}
            >
                DHANAPRIYAN
            </Text>
            <Text
                fontSize={0.15}
                color="#001133"
                anchorX="center"
                anchorY="middle"
                position={[0, -0.2, 3]}
                letterSpacing={0.1}
            >
                SECURITY SINGULARITY REACHED
            </Text>
        </group>
    );
}

const Director = ({ onComplete, sceneRef }: any) => {
    const camRef = useRef<THREE.PerspectiveCamera>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!camRef.current) return;

        // Helper to find materials
        const getMaterials = () => {
            // @ts-ignore
            const core = sceneRef.current?.children.find(c => c.geometry?.type === 'SphereGeometry')?.material;
            // @ts-ignore
            const particles = sceneRef.current?.children.find(c => c.isPoints)?.material;
            return { core, particles };
        }

        setTimeout(() => {
            const { core, particles } = getMaterials();
            if (!core || !particles) return;

            tl.current = gsap.timeline();

            // 1. Initial State (0-3s)
            // Camera slowly spiraling in?
            camRef.current.position.set(0, 5, 20);
            tl.current.to(camRef.current.position, {
                x: 0, y: 0, z: 12, duration: 4, ease: "power2.inOut"
            }, 0);

            // 2. Stabilization (3-5s)
            // Particles turn safe
            tl.current.to(particles.uniforms.uStabilized, { value: 1, duration: 2 }, 3);
            // Core turns to glass
            tl.current.to(core.uniforms.uStabilized, { value: 1, duration: 2 }, 3.5);

            // 3. Reveal (5-7s)
            // Camera close up to core
            tl.current.to(camRef.current.position, {
                z: 8, duration: 2, ease: "power2.out"
            }, 5);

            // 4. Exit
            tl.current.call(onComplete, [], 8);

        }, 100);

        return () => { tl.current?.kill() };
    }, [sceneRef, onComplete]);

    return <PerspectiveCamera ref={camRef} makeDefault position={[0, 5, 20]} fov={50} />;
};

const SingularityLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [showText, setShowText] = useState(false);
    const sceneRef = useRef<THREE.Group>(null);

    useEffect(() => {
        const t = setTimeout(() => setShowText(true), 5000); // Show text when stabilized
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-[#000000]">
            {/* Skip */}
            <div className="absolute top-8 right-8 z-[60]">
                <button
                    onClick={onComplete}
                    className="text-xs uppercase tracking-[0.2em] text-cyan-500/50 hover:text-cyan-400 transition-colors border border-cyan-900/30 px-6 py-2 bg-black/20 backdrop-blur-md"
                >
                    Skip
                </button>
            </div>

            <Canvas>
                <color attach="background" args={['#000000']} />
                <group ref={sceneRef}>
                    <SingularityCore timelineRef={sceneRef} />
                    <AccretionDisk timelineRef={sceneRef} />
                    <CoreText show={showText} />
                </group>
                <Director onComplete={onComplete} sceneRef={sceneRef} />
                <Stars radius={50} depth={20} count={2000} factor={3} fade />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#4444ff" />
            </Canvas>
        </div>
    );
};

export default SingularityLoader;
