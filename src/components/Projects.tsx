import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Smartphone, Database, Brain, GraduationCap, Users } from 'lucide-react';

const projects = [
  {
    title: 'Student Portal Management System',
    category: 'Full-Stack Web Application',
    description:
      'A comprehensive academic administration portal with role-based authentication for students, teachers, and administrators. Features real-time data management, attendance tracking, marks management, and modern glassmorphism UI design.',
    icon: Users,
    tags: ['Java 21', 'Spring Boot 3.5.3', 'Spring Security', 'MySQL', 'JPA/Hibernate', 'HTML5', 'CSS3', 'JavaScript ES6+'],
    gradient: 'from-blue-500 to-indigo-600',
    codeLink: '#',
    demoLink: '#',
  },
  {
    title: 'Student Course Registration System',
    category: 'Web Application',
    description:
      'A full-stack student course registration system built with HTML, CSS, and JavaScript for the frontend, Spring Boot for backend services, and MySQL database for data management.',
    icon: Database,
    tags: ['HTML', 'CSS', 'JavaScript', 'Spring Boot', 'MySQL'],
    gradient: 'from-primary to-cyan-600',
    codeLink: '#',
    demoLink: '#',
  },
  {
    title: 'KK Cafe App',
    category: 'Mobile Application',
    description:
      'A Flutter-based mobile app developed for KK Cafe startup. Features include an intuitive UI, real-time order management, and Spring Boot backend integration with PostgreSQL.',
    icon: Smartphone,
    tags: ['Flutter', 'Spring Boot', 'PostgreSQL', 'Mobile APK'],
    gradient: 'from-secondary to-purple-600',
    codeLink: '#',
    demoLink: '#',
  },
  {
    title: 'AI Fake Social Media Handle Detector',
    category: 'AI-Powered Web Application',
    description:
      'An intelligent MERN Stack web app that detects fake social media accounts using AI and NLP-based analysis. Integrated with OpenAI APIs and MongoDB for smart pattern detection, ensuring authenticity and digital safety.',
    icon: Brain,
    tags: ['MERN Stack', 'AI', 'Machine Learning', 'OpenAI API', 'Cybersecurity'],
    gradient: 'from-pink-500 to-red-600',
    codeLink: '#',
    demoLink: '#',
  },
  {
    title: 'Smart Curriculum System for Higher Education',
    category: 'AI-Integrated Mobile Application',
    description:
      'A nationally acclaimed EdTech mobile application that revolutionizes academic management. Selected as TOP 7 in India for Smart India Hackathon 2025 Problem Statement 25016 and advanced to the FINAL ROUND of PEC Hacks 3.0 national event. Features a hybrid attendance system combining Bluetooth and Google MediaPipe-powered facial recognition for 99% accuracy. Includes an intelligent student dashboard with RAG-based AI insights, real-time analytics, and seamless integration across Spring Boot and Node.js backend services.',
    icon: GraduationCap,
    tags: ['Flutter', 'Spring Boot', 'Node.js', 'Express.js', 'Google MediaPipe', 'AI', 'Facial Recognition', 'Bluetooth', 'RAG Model', 'SIH 2025', 'PEC Hacks 3.0'],
    gradient: 'from-green-500 to-emerald-700',
    codeLink: '#',
    demoLink: '#',
  },
];

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="projects" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Featured <span className="glow-green">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="glass-effect cyber-border p-6 h-full hover:scale-105 transition-all duration-300 group cursor-pointer">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <project.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Category */}
                  <div className="text-xs text-primary font-semibold mb-2 uppercase tracking-wider">
                    {project.category}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 glow-cyan">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded bg-muted cyber-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 cyber-border"
                      disabled
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Code (Private)
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-primary text-primary-foreground"
                      disabled
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Demo (Coming Soon)
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
