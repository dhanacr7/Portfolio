import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

const certificates = [
    { file: 'CTF event star performer.jpg', title: 'CTF Event Star Performer' },
    { file: 'DHANAPRIYAN C++ CERTIFICATE.jpg', title: 'C++ Certificate' },
    { file: 'DHANAPRIYAN Cpp practice cerrtifiate.jpg', title: 'C++ Practice Certificate' },
    { file: 'DHANAPRIYAN HTML CERTIFICATE.jpg', title: 'HTML Certificate' },
    { file: 'FOUNDATIONS OF CYBERSECURITY.jpg', title: 'Foundations of Cybersecurity' },
    { file: 'GOOGLE CYBERSECURITY 2.jpg', title: 'Google Cybersecurity 2' },
    { file: 'GOOGLE CYBERSECURITY 3.jpg', title: 'Google Cybersecurity 3' },
    { file: 'HTML AND CSS CERRTIFICATE.jpg', title: 'HTML & CSS Certificate' },
    { file: 'IBM Agentic AI Workshop.jpg', title: 'IBM Agentic AI Workshop' },
    { file: 'JAVA SCRIPT CERTIFICATE.jpg', title: 'JavaScript Certificate' },
    { file: 'NETWORKS BASICS.jpg', title: 'Networks Basics' },
    { file: 'NEW YORK UNIVERSITY CYBER ATTACK COUNTERMEASURES.jpg', title: 'NYU Cyber Attack Countermeasures' },
    { file: 'NEW YORK UNIVERSITY CYBER ATTACKS.jpg', title: 'NYU Cyber Attacks' },
    { file: 'OS CERTIFICATE.jpg', title: 'OS Certificate' },
    { file: 'PSG TECH KRIYA COMP.jpg', title: 'PSG Tech KRIYA' }
];

export const Certificates = () => {
    return (
        <section id="certificates" className="py-32 relative bg-black overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-violet-500/30 rounded-full bg-violet-500/10 backdrop-blur-sm">
                        <Award className="w-3 h-3 text-violet-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-violet-400 tracking-[0.2em] uppercase">Verified Credentials</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-600">Certificates</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-light text-sm md:text-base">
                        Verified accomplishments and skill validations.
                        <span className="block mt-2 text-violet-400 font-mono text-xs">/// SECURE_VALIDATION_ACTIVE</span>
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                            viewport={{ once: true }}
                            className="relative group h-[400px] rounded-xl overflow-hidden border border-violet-500 hover:border-violet-500 transition-all duration-300 bg-[#0a0a0f] flex flex-col"
                        >
                            {/* Overlay removed to keep photos original */}
                            {/* Title Bar */}
                            <div className="bg-black/80 backdrop-blur-md p-3 border-b border-violet-500 z-20 flex items-center justify-between">
                                <h3 className="text-violet-400 text-sm font-semibold truncate pr-2">{cert.title}</h3>
                                <Award className="w-4 h-4 text-violet-400 flex-shrink-0" />
                            </div>

                            {/* Content Viewer */}
                            <div className="flex-1 relative bg-white/5 overflow-hidden">
                                <img
                                    src={`/certificates/${cert.file}`}
                                    alt={cert.title}
                                    className="w-full h-full object-contain p-2"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
