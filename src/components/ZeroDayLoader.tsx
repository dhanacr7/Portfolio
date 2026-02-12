import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Terminal, Shield, Wifi, Battery, Search, X, Loader2 } from "lucide-react";

const CyberpunkLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [stage, setStage] = useState<"BROWSER" | "GLITCH" | "TERMINAL" | "REVEAL">("BROWSER");
    const [typedText, setTypedText] = useState("");
    const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

    // --- SKip Function ---
    const handleSkip = () => onComplete();

    // --- Stage 1: Browser Interaction (0s - 3.5s) ---
    useEffect(() => {
        if (stage !== "BROWSER") return;

        const payload = "' OR 1=1; --";
        let currentIndex = 0;

        // Delay before typing
        const startTypingTimeout = setTimeout(() => {
            const typingInterval = setInterval(() => {
                if (currentIndex <= payload.length) {
                    setTypedText(payload.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    // Typed. Now wait, then trigger glitch
                    setTimeout(() => setStage("GLITCH"), 800);
                }
            }, 100); // Typing speed
            return () => clearInterval(typingInterval);
        }, 800);

        return () => clearTimeout(startTypingTimeout);
    }, [stage]);

    // --- Stage 2: Glitch Transition (3.5s - 4s) ---
    useEffect(() => {
        if (stage !== "GLITCH") return;
        const timeout = setTimeout(() => setStage("TERMINAL"), 500);
        return () => clearTimeout(timeout);
    }, [stage]);

    // --- Stage 3: Terminal/Shell (4s - 7s) ---
    useEffect(() => {
        if (stage !== "TERMINAL") return;

        const commands = [
            { text: "root@kali:~# nc -lvnp 4444", delay: 500 },
            { text: "listening on [any] 4444 ...", delay: 1000 },
            { text: "connect to [192.168.1.105] from (UNKNOWN) [10.10.10.5] 58322", delay: 2000 },
            { text: "GET /shell.php HTTP/1.1", delay: 2500 },
            { text: "Host: vulnerable-target.com", delay: 2600 },
            { text: "Connection Established.", delay: 3200 },
            { text: "Access Granted.", delay: 3500, highlight: true }
        ];

        let timeouts: NodeJS.Timeout[] = [];

        commands.forEach((cmd) => {
            const t = setTimeout(() => {
                setTerminalOutput(prev => [...prev, cmd.text]);
                if (cmd.text === "Access Granted.") {
                    setTimeout(() => setStage("REVEAL"), 1000);
                }
            }, cmd.delay);
            timeouts.push(t);
        });

        return () => timeouts.forEach(clearTimeout);
    }, [stage]);

    // --- Stage 4: Reveal (7s+) ---
    useEffect(() => {
        if (stage === "REVEAL") {
            const timeout = setTimeout(onComplete, 2500);
            return () => clearTimeout(timeout);
        }
    }, [stage, onComplete]);


    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="fixed inset-0 z-[100] bg-neutral-950 text-neutral-200 font-mono overflow-hidden flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 1 } }}
            >
                {/* Skip Button */}
                <button
                    onClick={handleSkip}
                    className="absolute top-8 right-8 text-xs text-neutral-600 hover:text-cyan-500 transition-colors uppercase tracking-widest z-50 cursor-pointer"
                >
                    [ Skip Sequence ]
                </button>

                {/* --- STAGE 1: BROWSER --- */}
                {stage === "BROWSER" && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
                        className="w-full max-w-4xl bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 overflow-hidden"
                    >
                        {/* Browser Bar */}
                        <div className="bg-neutral-800 p-3 flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="flex-1 bg-neutral-950 rounded px-3 py-1 text-xs text-neutral-400 flex items-center">
                                <Shield className="w-3 h-3 mr-2 text-red-500" />
                                <span>target-system.com/login.php?id=1</span>
                            </div>
                        </div>
                        {/* Browser Content */}
                        <div className="p-12 min-h-[400px] flex flex-col items-center justify-center bg-white/5 relative">
                            <div className="w-full max-w-md space-y-4">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-neutral-100">Secure Client Login</h2>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Authorized Personnel Only</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-neutral-500">Username</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value="admin"
                                            className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 text-sm focus:outline-none text-neutral-400"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-neutral-500">Password</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            readOnly
                                            value={typedText}
                                            className="w-full bg-neutral-950 border border-red-900/50 rounded p-3 text-sm text-red-400 focus:outline-none font-mono"
                                        />
                                        <div className="absolute right-3 top-3">
                                            {typedText.length < 13 && <div className="w-2 h-4 bg-red-500 animate-pulse" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button className="w-full bg-neutral-800 text-neutral-500 py-3 rounded text-sm uppercase font-bold cursor-not-allowed">
                                        Authenticate
                                    </button>
                                </div>
                            </div>

                            {/* Injected Data Dump Overlay */}
                            {typedText.includes("--") && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="absolute inset-x-0 bottom-0 bg-red-950/90 backdrop-blur border-t border-red-500/30 p-4 font-mono text-[10px] text-red-300 overflow-hidden"
                                >
                                    <div className="opacity-50 mb-1">SQL_ERROR_DUMP_DETECTED:</div>
                                    <pre>{`[{"id":1,"user":"admin","pass_hash":"$2y$10$..."},\n{"id":2,"user":"root","pass_hash":"$2y$10$..."}]`}</pre>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* --- STAGE 2: GLITCH --- */}
                {stage === "GLITCH" && (
                    <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center">
                        <div className="text-red-500 font-mono text-6xl font-black animate-[pulse_0.1s_infinite] scale-150">
                            SYSTEM FAILURE
                        </div>
                        <div className="absolute inset-0 bg-white/10 mix-blend-overlay animate-[ping_0.1s_infinite]" />
                    </div>
                )}

                {/* --- STAGE 3: TERMINAL --- */}
                {stage === "TERMINAL" && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        className="w-full max-w-3xl h-[60vh] bg-neutral-900/95 border border-neutral-700/50 rounded-t-lg shadow-2xl overflow-hidden backdrop-blur-md"
                    >
                        <div className="bg-neutral-800/80 p-2 flex items-center justify-between border-b border-neutral-700">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-neutral-400" />
                                <span className="text-xs text-neutral-400">kali-linux — bash — 80x24</span>
                            </div>
                        </div>
                        <div className="p-4 font-mono text-sm text-green-500/80 space-y-1">
                            {terminalOutput.map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={line === "Access Granted." ? "text-cyan-400 font-bold mt-4" : ""}
                                >
                                    {line}
                                </motion.div>
                            ))}
                            <div className="w-2 h-4 bg-green-500 animate-pulse mt-2" />
                        </div>
                    </motion.div>
                )}

                {/* --- STAGE 4: REVEAL --- */}
                {stage === "REVEAL" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center z-50"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">
                            DHANAPRIYAN
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-cyan-500/80 tracking-widest text-sm md:text-md uppercase">
                            <span>Senior Offensive Security Engineer</span>
                            <span className="w-1 h-1 bg-cyan-500 rounded-full" />
                            <span>Pentester</span>
                        </div>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-8 max-w-md mx-auto"
                        />
                    </motion.div>
                )}

                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none -z-10" />
            </motion.div>
        </AnimatePresence>
    );
};

export default CyberpunkLoader;
