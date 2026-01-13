import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

export const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />

      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* 🔹 Welcome Tag */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-primary via-secondary to-accent">
              <div className="bg-background rounded-full px-6 py-2">
                <span className="text-sm font-medium glow-cyan">
                  Welcome to my portfolio
                </span>
              </div>
            </div>
          </motion.div>

          {/* 🔹 Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className="relative inline-block group">
              {/* Rotating border rings */}
              <div className="absolute inset-0 rounded-full">
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-spin-slow opacity-75"></div>
              </div>
              <div className="absolute inset-1 rounded-full">
                <div className="w-30 h-30 md:w-38 md:h-38 lg:w-46 lg:h-46 rounded-full border-2 border-transparent bg-gradient-to-l from-blue-400 via-green-400 to-yellow-400 animate-spin-reverse opacity-60"></div>
              </div>
              
              {/* Main photo container */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full p-1 bg-gradient-to-r from-primary via-secondary to-accent group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/myphoto.jpeg"
                  alt="Dhana Priyan"
                  className="w-full h-full rounded-full object-cover border-2 border-background shadow-2xl"
                />
              </div>
              
              {/* Floating particles */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full animate-float-1 opacity-80"></div>
              <div className="absolute top-4 right-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float-2 opacity-70"></div>
              <div className="absolute bottom-2 left-4 w-1 h-1 bg-pink-400 rounded-full animate-float-3 opacity-60"></div>
              <div className="absolute bottom-4 right-0 w-2 h-2 bg-green-400 rounded-full animate-float-4 opacity-75"></div>
              
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </motion.div>

          {/* 🔹 Name + Animation */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            Hey, I'm <span className="glow-cyan">Dhana Priyan</span>
          </motion.h1>

          <div className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-8 h-20">
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
              speed={50}
              className="glow-magenta"
              repeat={Infinity}
            />
          </div>

          {/* 🔹 Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Crafting secure, scalable solutions with modern technologies. 
            Passionate about cybersecurity and building innovative web applications 
            that make an impact.
          </motion.p>

          {/* 🔹 Social Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center gap-6"
          >
            {/* GitHub */}
            <a
              href="https://github.com/dhanacr7"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="p-3 rounded-full glass-effect hover:bg-primary/20 transition-all hover:scale-110"
            >
              <Github className="w-6 h-6" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/dhanapriyan7"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="p-3 rounded-full glass-effect hover:bg-primary/20 transition-all hover:scale-110"
            >
              <Linkedin className="w-6 h-6" />
            </a>

            {/* Email */}
            <a
              href="mailto:dhanapriyan81@gmail.com"
              title="Email Me"
              className="p-3 rounded-full glass-effect hover:bg-primary/20 transition-all hover:scale-110"
            >
              <Mail className="w-6 h-6" />
            </a>
          </motion.div>

          {/* 🔹 Scroll Down Icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1.2, y: { repeat: Infinity, duration: 2 } }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <ArrowDown className="w-8 h-8 text-primary" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
