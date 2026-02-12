import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowDown, Github, Linkedin, Mail, Radio, ShieldCheck, Terminal } from 'lucide-react';

export const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] pointer-events-none" />

      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* 🔹 Tactical Badge */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
                System Online // Welcome
              </span>
            </div>
          </motion.div>

          {/* 🔹 Profile Photo (Tactical) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            className="mb-10 relative inline-block group"
          >
            {/* Rotating Data Ring */}
            <div className="absolute -inset-4 border border-dashed border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute -inset-4 border border-t-2 border-t-cyan-500 rounded-full animate-[spin_3s_linear_infinite]" />

            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-cyan-500 shadow-[0_0_20px_rgba(0,255,255,0.3)] bg-black">
              <img
                src="/myphoto.jpeg"
                alt="Dhana Priyan"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              {/* Scanline overlay on image */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-50" />
            </div>
          </motion.div>

          {/* 🔹 Name + Glitch */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight text-white">
            <span className="glitch-text hover:text-cyan-400 transition-colors cursor-default">
              DHANA PRIYAN
            </span>
          </h1>

          <div className="text-xl md:text-2xl font-mono text-cyan-500 mb-8 h-8">
            <span className="mr-2 text-cyan-700">&gt;</span>
            <TypeAnimation
              sequence={[
                'Cybersecurity Enthusiast',
                2000,
                'Full Stack Developer',
                2000,
                'Problem Solver',
                2000,
                'Tech Explorer',
                2000,
              ]}
              wrapper="span"
              speed={60}
              className="text-cyan-400"
              repeat={Infinity}
            />
            <span className="animate-pulse">_</span>
          </div>

          {/* 🔹 Mission Statement */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Crafting secure, scalable solutions with modern technologies.
            Passionate about <span className="text-white">cybersecurity</span> and building innovative web applications
            that make an impact.
          </motion.p>

          {/* 🔹 Comms Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-4"
          >
            {[
              { icon: Github, href: "https://github.com/dhanacr7", label: "GITHUB" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/dhanapriyan7", label: "LINKEDIN" },
              { icon: Mail, href: "mailto:dhanapriyan81@gmail.com", label: "EMAIL" }
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
              >
                <social.icon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                <span className="text-xs font-bold text-gray-500 group-hover:text-cyan-400 tracking-wider">
                  [{social.label}]
                </span>
              </a>
            ))}
          </motion.div>

          {/* 🔹 Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1.2, y: { repeat: Infinity, duration: 2 } }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-900">Scroll Down</span>
              <ArrowDown className="w-5 h-5 text-cyan-500/50" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
