import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Code, Database, Cpu, Shield } from 'lucide-react';

const skillCategories = [
  {
    category: 'Frontend Development',
    icon: Code,
    description:
      'I build responsive and modern UIs using HTML, CSS, JavaScript, Flutter, and React.js. I focus on clean design and seamless user experiences across web and mobile platforms.',
    skills: ['HTML', 'CSS', 'JavaScript', 'Flutter', 'React.js'],
    gradient: 'from-primary to-cyan-500',
  },
  {
    category: 'Backend Development',
    icon: Cpu,
    description:
      'I work with Spring Boot (Java) and the MERN stack (Node.js + Express.js) to develop secure, scalable, and well-structured backend systems.',
    skills: ['Java', 'Spring Boot', 'Node.js', 'Express.js', 'MERN Stack'],
    gradient: 'from-secondary to-purple-500',
  },
  {
    category: 'Databases',
    icon: Database,
    description:
      'I manage relational and non-relational databases efficiently using MySQL, PostgreSQL, and MongoDB to ensure data integrity and performance.',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB'],
    gradient: 'from-accent to-blue-600',
  },
  {
    category: 'Programming Languages',
    icon: Shield,
    description:
      'I use C++ for problem-solving and DSA, Java for application development, and Python for cybersecurity automation and AI-related projects.',
    skills: ['C++', 'Java', 'Python'],
    gradient: 'from-green-400 to-emerald-600',
  },
];

export const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="skills" className="py-20 relative" ref={ref}>
      <div className="absolute inset-0 cyber-grid opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Technical <span className="glow-magenta">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-secondary to-accent mx-auto mb-16" />

          {/* Skill Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card className="glass-effect cyber-border p-8 h-full hover:scale-105 transition-all duration-300">
                  <div
                    className={`w-14 h-14 mb-4 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center`}
                  >
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 glow-cyan">
                    {category.category}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-sm rounded-full bg-muted cyber-border font-medium hover:bg-primary/20 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
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
