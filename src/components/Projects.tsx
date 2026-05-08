import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Github, Folder, Lock, AlertTriangle, Users, Database, Smartphone, Brain, GraduationCap, Shield, Terminal, Globe, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

const projects = [
  {
    title: 'Student Portal Management System',
    category: 'Full-Stack Web Application',
    description: 'A comprehensive academic administration portal with role-based authentication for students, teachers, and administrators. Features real-time data management, attendance tracking, marks management, and modern glassmorphism UI design.',
    tags: ['Java 21', 'Spring Boot 3.5.3', 'Spring Security', 'MySQL', 'JPA/Hibernate'],
    status: 'SYS_ADMIN',
    samplePhotos: ['project sample photos/Student Portal Management System project sample photo.png'],
    icon: GraduationCap
  },
  {
    title: 'Student Course Registration System',
    category: 'Web Application',
    description: 'A full-stack student course registration system built with HTML, CSS, and JavaScript for the frontend, Spring Boot for backend services, and MySQL database for data management.',
    tags: ['HTML', 'CSS', 'JS', 'Spring Boot', 'MySQL'],
    status: 'DATABASE',
    samplePhotos: ['project sample photos/Course registration project sample photo.png'],
    icon: Database
  },
  {
    title: 'KK Cafe App',
    category: 'Mobile Application',
    description: 'A Flutter-based mobile app developed for KK Cafe startup. Features include an intuitive UI, real-time order management, and Spring Boot backend integration with PostgreSQL.',
    tags: ['Flutter', 'Spring Boot', 'PostgreSQL', 'Mobile APK'],
    status: 'MOBILE',
    samplePhotos: [
      'project sample photos/KK chat corner sample photo 1.jpeg',
      'project sample photos/KK chat corner sample photo 2.jpeg',
      'project sample photos/KK chat corner sample photo 3.jpeg',
      'project sample photos/KK chat corner sample photos 4.jpeg',
      'project sample photos/KK chat corner sample photos 5.jpeg'
    ],
    icon: Smartphone
  },
  {
    title: 'AI Fake Social Media Handle Detector',
    category: 'AI-Powered Web Application',
    description: 'An intelligent MERN Stack web app that detects fake social media accounts using AI and NLP-based analysis. Integrated with OpenAI APIs and MongoDB for smart pattern detection.',
    tags: ['MERN Stack', 'AI', 'Machine Learning', 'OpenAI API'],
    status: 'AI_SEC',
    samplePhotos: ['project sample photos/fake id detector project sample photo.png'],
    icon: Brain
  },
  {
    title: 'Smart Curriculum System',
    category: 'AI-Integrated Mobile Application',
    description: 'SIH 2025 Finalist. Hybrid attendance system combining Bluetooth and Google MediaPipe-powered facial recognition. Includes an intelligent student dashboard with RAG-based AI insights.',
    tags: ['Flutter', 'Node.js', 'MediaPipe', 'RAG Model'],
    status: 'TOP_TIER',
    samplePhotos: [
      'project sample photos/Smart curriculum project sample photo 1.png',
      'project sample photos/Smart curriculum project sample photo 2.png',
      'project sample photos/Smart curriculum project sample photo 3.png',
      'project sample photos/Smart curriculum project sample photo 4.png'
    ],
    icon: Shield
  },
];

const ProjectCard = ({ project, index, onOpenPhotos }: { project: any, index: number, onOpenPhotos: (photos: string[]) => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative group h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Holographic Background Layer */}
      <div className={`absolute inset-0 bg-[#0a0a0f] border border-violet-500 rounded-xl transition-all duration-300 ${isHovered ? 'border-violet-500 shadow-[0_0_30px_rgba(0,240,255,0.1)]' : ''}`} />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay rounded-xl pointer-events-none" />

      {/* Corner Decorative Brackets */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-violet-500 rounded-tl-xl transition-all duration-300 ${isHovered ? 'w-full h-full border-violet-500 rounded-xl' : ''} pointer-events-none`} />
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-violet-500 rounded-br-xl transition-all duration-300 ${isHovered ? 'opacity-0' : ''} pointer-events-none`} />

      {/* Content Container */}
      <div className="relative p-6 h-full flex flex-col z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg group-hover:bg-violet-500/20 group-hover:border-violet-500/50 transition-colors">
            <project.icon className="w-6 h-6 text-violet-400 group-hover:text-violet-400" />
          </div>
          {/* Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1 bg-black/50 border border-violet-500 rounded-full">
            <div className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-violet-500 animate-pulse' : 'bg-gray-600'}`} />
            <span className={`text-[10px] font-mono tracking-wider ${isHovered ? 'text-violet-400' : 'text-gray-500'}`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Title & Desc */}
        <div className="mb-auto">
          <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isHovered ? 'text-violet-400' : 'text-gray-300'}`}>
            {project.title}
          </h3>
          <div className="h-[1px] w-12 bg-violet-500 mb-4 group-hover:w-full transition-all duration-500" />
          <p className="text-sm text-gray-400 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 text-[10px] font-mono text-violet-400 bg-violet-500/20 border border-violet-500/30 rounded">
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <button className={`w-full py-3 flex items-center justify-center gap-2 text-sm font-bold tracking-wider uppercase transition-all duration-300 rounded-lg overflow-hidden relative group/btn border border-violet-500/30 ${isHovered ? 'bg-transparent text-white' : 'bg-transparent text-gray-500'}`}>
              <span className="relative z-10 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Initialize Project
              </span>
              <div className="absolute inset-0 bg-violet-500/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0" />
            </button>

            {project.samplePhotos && project.samplePhotos.length > 0 && (
              <button
                onClick={() => onOpenPhotos(project.samplePhotos)}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 rounded-lg border border-purple-500/30 bg-purple-950/20 hover:border-purple-400 hover:bg-purple-900/40 hover:scale-[1.02] text-purple-300 relative overflow-hidden group/photo"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Sample Photos
                </span>
                <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 ease-out z-0" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Projects = () => {
  const [viewerPhotos, setViewerPhotos] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (photos: string[]) => {
    setViewerPhotos(photos);
    setViewerIndex(0);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeViewer = () => {
    setViewerPhotos([]);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewerIndex((prev) => (prev + 1) % viewerPhotos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewerIndex((prev) => (prev === 0 ? viewerPhotos.length - 1 : prev - 1));
  };

  return (
    <section id="projects" className="py-32 relative bg-black overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-violet-500/30 rounded-full bg-violet-500/10 backdrop-blur-sm">
            <Globe className="w-3 h-3 text-violet-400 animate-pulse" />
            <span className="text-[10px] font-mono text-violet-400 tracking-[0.2em] uppercase">Global Systems Active</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-600">Operations</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light text-sm md:text-base">
            Deployed enterprise-grade solutions across web, mobile, and AI sectors.
            <span className="block mt-2 text-violet-400 font-mono text-xs">/// SECURE_ACCESS_LEVEL_ADMIN</span>
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} onOpenPhotos={openViewer} />
          ))}
        </div>

      </div>

      {/* Lightbox / Fullscreen Viewer */}
      <AnimatePresence>
        {viewerPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeViewer}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-0 md:p-8 overflow-hidden touch-none"
          >
            {/* Close Button */}
            <button
              onClick={closeViewer}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 bg-black/50 hover:bg-red-500/30 text-white rounded-full transition-all border border-white/10 hover:border-red-500/50 shadow-lg"
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Navigation Arrows */}
            {viewerPhotos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 md:left-8 z-50 p-3 bg-black/50 hover:bg-violet-500 text-white rounded-full transition-colors border border-white/10 hover:border-violet-500 backdrop-blur-md shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 md:right-8 z-50 p-3 bg-black/50 hover:bg-violet-500 text-white rounded-full transition-colors border border-white/10 hover:border-violet-500 backdrop-blur-md shadow-lg"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              </>
            )}

            {/* Image Container */}
            <div
              className="relative w-full h-full md:max-w-7xl flex items-center justify-center overflow-auto md:overflow-visible"
              onClick={(e) => e.stopPropagation()} /* Prevent closing when clicking the image container */
            >
              <motion.img
                key={viewerIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={`/${viewerPhotos[viewerIndex]}`}
                alt={`Sample photo ${viewerIndex + 1}`}
                className="w-full h-full object-contain max-h-[100vh] cursor-zoom-in active:cursor-grabbing"
                style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
              />
            </div>

            {/* Counter */}
            {viewerPhotos.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white font-mono text-sm shadow-lg tracking-widest z-50">
                {viewerIndex + 1} / {viewerPhotos.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
