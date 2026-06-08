import { motion } from 'framer-motion';
import { Award, Shield, Code, ChevronRight, ExternalLink } from 'lucide-react';

const certificateCategories = [
    {
        name: 'Cybersecurity',
        icon: Shield,
        items: [
            { file: 'FOUNDATIONS OF CYBERSECURITY.jpg', title: 'Foundations of Cybersecurity' },
            { file: 'GOOGLE CYBERSECURITY 2.jpg', title: 'Google Cybersecurity 2' },
            { file: 'GOOGLE CYBERSECURITY 3.jpg', title: 'Google Cybersecurity 3' },
            { file: 'NEW YORK UNIVERSITY CYBER ATTACK COUNTERMEASURES.jpg', title: 'NYU Cyber Attack Countermeasures' },
            { file: 'NEW YORK UNIVERSITY CYBER ATTACKS.jpg', title: 'NYU Cyber Attacks' },
            { file: 'NETWORKS BASICS.jpg', title: 'Networks Basics' },
            { file: 'CTF event star performer.jpg', title: 'CTF Event Star Performer' }
        ]
    },
    {
        name: 'Software Development',
        icon: Code,
        items: [
            { file: 'DHANAPRIYAN C++ CERTIFICATE.jpg', title: 'C++ Mastery' },
            { file: 'DHANAPRIYAN Cpp practice cerrtifiate.jpg', title: 'C++ Applications' },
            { file: 'HTML AND CSS CERRTIFICATE.jpg', title: 'HTML & CSS Essentials' },
            { file: 'DHANAPRIYAN HTML CERTIFICATE.jpg', title: 'HTML Foundations' },
            { file: 'JAVA SCRIPT CERTIFICATE.jpg', title: 'JavaScript Advanced' },
            { file: 'OS CERTIFICATE.jpg', title: 'Operating Systems' }
        ]
    },
    {
        name: 'Workshops & Events',
        icon: Award,
        items: [
            { file: 'IBM Agentic AI Workshop.jpg', title: 'IBM Agentic AI' },
            { file: 'PSG TECH KRIYA COMP.jpg', title: 'PSG Tech KRIYA' }
        ]
    }
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

                <div className="space-y-16 max-w-7xl mx-auto">
                    {certificateCategories.map((category, catIndex) => (
                        <div key={category.name}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                                    <category.icon className="w-5 h-5 text-violet-400" />
                                </div>
                                <h3 className="text-xl font-bold font-mono text-violet-300 tracking-wider">
                                    {category.name.toUpperCase()}
                                </h3>
                                <div className="h-px bg-gradient-to-r from-violet-500/30 to-transparent flex-1" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.items.map((cert, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
                                        viewport={{ once: true }}
                                        className="relative group bg-[#0a0a0f] border border-gray-800 hover:border-violet-500/50 rounded-xl overflow-hidden transition-all duration-500 hover:translate-y-[-4px]"
                                    >
                                        {/* Certificate Image View */}
                                        <div className="aspect-[4/3] relative bg-white/5 overflow-hidden group-hover:bg-white/10 transition-colors">
                                            <img
                                                src={`/certificates/${cert.file}`}
                                                alt={cert.title}
                                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-violet-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        </div>

                                        {/* Footer / Info */}
                                        <div className="p-4 border-t border-gray-800 bg-black/40 backdrop-blur-sm group-hover:bg-violet-950/20 transition-colors flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">
                                                {cert.title}
                                            </span>
                                            <div className="p-1.5 bg-gray-900 rounded group-hover:bg-violet-600 transition-all">
                                                <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-white" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
