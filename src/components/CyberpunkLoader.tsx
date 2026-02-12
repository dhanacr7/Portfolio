import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

// --- Types ---
type LineType = {
    id: number;
    text: string;
    isCommand?: boolean;
    isOutput?: boolean;
};

// --- Component ---
const CyberpunkLoader = ({ onComplete }: { onComplete: () => void }) => {
    const [lines, setLines] = useState<LineType[]>([]);
    const [currentCommand, setCurrentCommand] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const [isFinished, setIsFinished] = useState(false);

    // Skip function
    const handleSkip = () => {
        setIsFinished(true);
        setTimeout(onComplete, 500);
    };

    const addLine = (text: string, isCommand = false, isOutput = false) => {
        setLines(prev => [...prev, { id: Date.now() + Math.random(), text, isCommand, isOutput }]);
    };

    useEffect(() => {
        const sequence = async () => {
            // Helper to type a command
            const typeCommand = async (cmd: string) => {
                for (let i = 0; i <= cmd.length; i++) {
                    setCurrentCommand(cmd.slice(0, i));
                    await new Promise(r => setTimeout(r, Math.random() * 50 + 30)); // Typing speed
                }
                await new Promise(r => setTimeout(r, 300)); // Pause before enter
                addLine(`$ ${cmd}`, true);
                setCurrentCommand("");
            };

            // Helper to wait
            const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

            // --- START SEQUENCE ---

            await wait(800);

            // Command 1: whoami
            await typeCommand("whoami");
            await wait(200);
            addLine("Full Stack Developer & Cybersecurity Enthusiast", false, true);
            await wait(800);

            // Command 2: skills --list
            await typeCommand("skills --list");
            await wait(200);
            addLine("Building efficient webapps | Securing applications with cyber skills", false, true);
            await wait(1000);

            // Command 3: launch_portfolio
            await typeCommand("launch_portfolio");
            await wait(200);
            addLine("Initializing system...", false, true);
            addLine("Loading modules... [OK]", false, true);

            await wait(800);
            setIsFinished(true);
            setTimeout(onComplete, 1000);
        };

        sequence();
    }, [onComplete]);

    // Blinking cursor effect
    useEffect(() => {
        const interval = setInterval(() => setShowCursor(prev => !prev), 500);
        return () => clearInterval(interval);
    }, []);

    // Scroll to bottom
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [lines, currentCommand]);

    return (
        <AnimatePresence>
            {!isFinished && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black text-gray-200 font-mono p-6 md:p-12 overflow-hidden flex flex-col"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8 } }}
                >
                    {/* Skip Button */}
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={handleSkip}
                            className="text-[10px] uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
                        >
                            [ Skip ]
                        </button>
                    </div>

                    {/* Terminal Content */}
                    <div className="max-w-3xl w-full mx-auto mt-10 md:mt-20 space-y-2 text-sm md:text-base">
                        {/* Static Header */}
                        <div className="text-gray-500 mb-6 text-xs">
                            Last login: {new Date().toUTCString()} on ttys001
                        </div>

                        {/* History */}
                        {lines.map((line) => (
                            <div key={line.id} className={`${line.isOutput ? "text-white font-bold ml-2" : "text-gray-300"}`}>
                                {line.text}
                            </div>
                        ))}

                        {/* Valid Input Line */}
                        <div className="flex items-center text-gray-300">
                            <span className="mr-2 text-gray-500">$</span>
                            <span>{currentCommand}</span>
                            <span className={`block w-2.5 h-5 bg-gray-500 ml-1 ${showCursor ? "opacity-100" : "opacity-0"}`} />
                        </div>

                        <div ref={bottomRef} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CyberpunkLoader;
