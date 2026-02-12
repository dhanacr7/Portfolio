import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, Database, Lock, Unlock, FileCheck, Binary, Smartphone, Globe } from "lucide-react";

// --- Utility: Generate Random Hex ---
const generateHex = (length: number) => {
    let result = "";
    const characters = "0123456789ABCDEF";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// --- Component ---
const CyberpunkLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [stage, setStage] = useState<"SCATTER" | "RECONSTRUCT" | "DECRYPT" | "REVEAL">("SCATTER");
    const [progress, setProgress] = useState(0);
    const [recoveredFiles, setRecoveredFiles] = useState<string[]>([]);

    // --- Sequence Controller ---
    useEffect(() => {
        // Stage 1: Scatter -> Reconstruct (1.5s)
        setTimeout(() => setStage("RECONSTRUCT"), 1500);

        // Stage 2: Reconstruct -> Decrypt (4.0s)
        setTimeout(() => setStage("DECRYPT"), 4000);

        // Stage 3: Decrypt -> Reveal (5.5s)
        setTimeout(() => setStage("REVEAL"), 5500);

        // End (7s)
        setTimeout(onComplete, 7000);
    }, [onComplete]);

    // --- Progress Simulation ---
    useEffect(() => {
        if (stage === "RECONSTRUCT") {
            const interval = setInterval(() => {
                setProgress(prev => {
                    const next = prev + 2;
                    return next > 100 ? 100 : next;
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [stage]);

    // --- File Recovery Simulation ---
    useEffect(() => {
        if (stage !== "RECONSTRUCT") return;
        const files = [
            "packet_capture.pcap",
            "heap_dump.bin",
            "access_logs.db",
            "sys_core.dmp"
        ];
        files.forEach((file, i) => {
            setTimeout(() => {
                setRecoveredFiles(prev => [...prev, file]);
            }, i * 600 + 500);
        });
    }, [stage]);


    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] bg-[#0a0a0a] text-amber-500 font-mono overflow-hidden flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 1 } }}
            >
                {/* Background: Rolling Hex Stream */}
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute text-[10px] break-all leading-3 animate-pulse"
                            style={{
                                left: `${i * 5}%`,
                                top: -20,
                                animation: `fall ${Math.random() * 5 + 5}s linear infinite`,
                                animationDelay: `-${Math.random() * 5}s`,
                                opacity: Math.random() * 0.5 + 0.1
                            }}
                        >
                            {Array.from({ length: 50 }).map(() => generateHex(2)).join(" ")}
                        </div>
                    ))}
                </div>

                {/* --- STAGE 1 & 2: PACKET RECONSTRUCTION --- */}
                {(stage === "SCATTER" || stage === "RECONSTRUCT") && (
                    <div className="relative w-full max-w-4xl h-96 border border-amber-900/50 bg-black/80 backdrop-blur-sm p-4 rounded-lg overflow-hidden flex flex-col">

                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-amber-900/50 pb-2 mb-4">
                            <div className="flex items-center gap-2">
                                <FileSearch className="w-4 h-4 text-amber-500" />
                                <span className="text-xs tracking-widest text-amber-100">FORENSIC_ANALYZER_V9</span>
                            </div>
                            <div className="text-[10px] text-amber-700">CASE_ID: #884-XJ</div>
                        </div>

                        {/* Hex Grid Content */}
                        <div className="flex-1 font-mono text-xs relative overflow-hidden">
                            {/* Scattered bits aligning */}
                            {Array.from({ length: 12 }).map((_, row) => (
                                <motion.div
                                    key={row}
                                    className="flex gap-4 mb-1"
                                    initial={{ x: Math.random() * 500 - 250, opacity: 0, filter: "blur(10px)" }}
                                    animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                                    transition={{ duration: 1, delay: row * 0.1, type: "spring" }}
                                >
                                    <span className="text-amber-800 select-none">0x{generateHex(4)}:</span>
                                    <span className={stage === "RECONSTRUCT" ? "text-amber-300" : "text-amber-900/50"}>
                                        {generateHex(8)} {generateHex(8)} {generateHex(8)} {generateHex(8)}
                                    </span>
                                    <span className="text-gray-600 hidden md:inline">| ...data... |</span>
                                </motion.div>
                            ))}

                            {/* Floating "Reconstructing" Badges */}
                            {recoveredFiles.map((file, i) => (
                                <motion.div
                                    key={file}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute right-4 bg-amber-900/80 text-amber-100 px-3 py-1 rounded border border-amber-500/50 text-xs flex items-center gap-2"
                                    style={{ top: i * 40 + 20 }}
                                >
                                    <FileCheck className="w-3 h-3" />
                                    RECOVERED: {file}
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer Progress */}
                        <div className="mt-auto">
                            <div className="flex justify-between text-[10px] text-amber-500 mb-1">
                                <span>RECONSTRUCTING_DATA_STRUCTURES...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-1 w-full bg-amber-900/30">
                                <motion.div
                                    className="h-full bg-amber-500 box-shadow-[0_0_10px_orange]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* --- STAGE 3: DECRYPT --- */}
                {stage === "DECRYPT" && (
                    <motion.div
                        className="flex flex-col items-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                    >
                        <div className="mb-8 relative">
                            <div className="w-24 h-24 border-2 border-amber-500 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                <div className="w-20 h-20 border border-t-transparent border-b-transparent border-amber-300 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
                            </div>
                            <Lock className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-bold text-amber-100 tracking-[0.2em] mb-2">DECRYPTING IDENTITY</h2>
                        <div className="font-mono text-amber-700 text-sm">
                            KEY: 0x{generateHex(16)}...
                        </div>
                    </motion.div>
                )}

                {/* --- STAGE 4: REVEAL --- */}
                {stage === "REVEAL" && (
                    <motion.div
                        className="text-center z-50 p-12 border-y border-amber-500/30 bg-black/90 backdrop-blur-xl w-full max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex justify-center mb-6">
                            <Unlock className="w-12 h-12 text-cyan-400" />
                        </div>

                        <motion.h1
                            className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4"
                            initial={{ filter: "blur(10px)" }}
                            animate={{ filter: "blur(0px)" }}
                            transition={{ duration: 0.8 }}
                        >
                            DHANAPRIYAN
                        </motion.h1>

                        <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-6" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold tracking-widest text-amber-500/80 uppercase">
                            <div className="flex items-center justify-center gap-2">
                                <Binary className="w-4 h-4" />
                                <span>Malware Analysis</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Database className="w-4 h-4" />
                                <span>Digital Forensics</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Smartphone className="w-4 h-4" />
                                <span>Mobile Security</span>
                            </div>
                        </div>
                    </motion.div>
                )}

            </motion.div>
        </AnimatePresence>
    );
};

export default CyberpunkLoader;
