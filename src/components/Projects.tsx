import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Github, Folder, Lock, AlertTriangle, Users, Database, Smartphone, Brain, GraduationCap, Shield, Terminal, Globe } from 'lucide-react';

const projects = [
  {
    title: 'Student Portal Management System',
    category: 'Full-Stack Web Application',
    description: 'A comprehensive academic administration portal with role-based authentication for students, teachers, and administrators. Features real-time data management, attendance tracking, marks management, and modern glassmorphism UI design.',
    tags: ['Java 21', 'Spring Boot 3.5.3', 'Spring Security', 'MySQL', 'JPA/Hibernate'],
    status: 'SYS_ADMIN',
    icon: GraduationCap
  },
  {
    title: 'Student Course Registration System',
    category: 'Web Application',
    description: 'A full-stack student course registration system built with HTML, CSS, and JavaScript for the frontend, Spring Boot for backend services, and MySQL database for data management.',
    tags: ['HTML', 'CSS', 'JS', 'Spring Boot', 'MySQL'],
    status: 'DATABASE',
    icon: Database
  },
  {
    title: 'KK Cafe App',
    category: 'Mobile Application',
    description: 'A Flutter-based mobile app developed for KK Cafe startup. Features include an intuitive UI, real-time order management, and Spring Boot backend integration with PostgreSQL.',
    tags: ['Flutter', 'Spring Boot', 'PostgreSQL', 'Mobile APK'],
    status: 'MOBILE',
    icon: Smartphone
  },
  {
    title: 'AI Fake Social Media Handle Detector',
    category: 'AI-Powered Web Application',
    description: 'An intelligent MERN Stack web app that detects fake social media accounts using AI and NLP-based analysis. Integrated with OpenAI APIs and MongoDB for smart pattern detection.',
    tags: ['MERN Stack', 'AI', 'Machine Learning', 'OpenAI API'],
    status: 'AI_SEC',
    icon: Brain
  },
  {
    title: 'Smart Curriculum System',
    category: 'AI-Integrated Mobile Application',
    description: 'SIH 2025 Finalist. Hybrid attendance system combining Bluetooth and Google MediaPipe-powered facial recognition. Includes an intelligent student dashboard with RAG-based AI insights.',
    tags: ['Flutter', 'Node.js', 'MediaPipe', 'RAG Model'],
    status: 'TOP_TIER',
    icon: Shield
  },
];

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Holographic Background Layer */}
      <div className={`absolute inset-0 bg-[#0a0a0f] border border-cyan-900/30 rounded-xl transition-all duration-300 ${isHovered ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(0,240,255,0.1)]' : ''}`} />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay rounded-xl" />

      {/* Corner Decorative Brackets */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-xl transition-all duration-300 ${isHovered ? 'w-full h-full border-cyan-500/80 rounded-xl' : ''}`} />
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl transition-all duration-300 ${isHovered ? 'opacity-0' : ''}`} />

      {/* Content Container */}
      <div className="relative p-6 h-full flex flex-col z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-cyan-950/20 border border-cyan-900/50 rounded-lg group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-colors">
            <project.icon className="w-6 h-6 text-cyan-400 group-hover:text-cyan-200" />
          </div>
          {/* Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1 bg-black/50 border border-cyan-900/50 rounded-full">
            <div className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-cyan-400 animate-pulse' : 'bg-gray-600'}`} />
            <span className={`text-[10px] font-mono tracking-wider ${isHovered ? 'text-cyan-400' : 'text-gray-500'}`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Title & Desc */}
        <div className="mb-auto">
          <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isHovered ? 'text-cyan-100' : 'text-gray-300'}`}>
            {project.title}
          </h3>
          <div className="h-[1px] w-12 bg-cyan-600/30 mb-4 group-hover:w-full transition-all duration-500" />
          <p className="text-sm text-gray-400 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 text-[10px] font-mono text-cyan-300 bg-cyan-950/30 border border-cyan-900/30 rounded">
                {tag}
              </span>
            ))}
          </div>

          {/* Action Button */}
          <button className={`w-full py-3 mt-2 flex items-center justify-center gap-2 text-sm font-bold tracking-wider uppercase transition-all duration-300 rounded-lg overflow-hidden relative group/btn border border-cyan-700/50 ${isHovered ? 'bg-cyan-500/10 text-cyan-300' : 'bg-transparent text-gray-500'}`}>
            <span className="relative z-10 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Initialize Project
            </span>
            {/* Button Glow BG */}
            <div className="absolute inset-0 bg-cyan-600/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects = () => {
  return (
    <section id="projects" className="py-32 relative bg-black overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-cyan-800/30 rounded-full bg-cyan-950/10 backdrop-blur-sm">
            <Globe className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-400 tracking-[0.2em] uppercase">Global Systems Active</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Operations</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light text-sm md:text-base">
            Deployed enterprise-grade solutions across web, mobile, and AI sectors.
            <span className="block mt-2 text-cyan-500/50 font-mono text-xs">/// SECURE_ACCESS_LEVEL_ADMIN</span>
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};
