import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code, Database, Cpu, Shield, Lock, Terminal } from 'lucide-react';

const skillCategories = [
  {
    category: 'Frontend Development',
    icon: Code,
    description: 'I build responsive and modern UIs using HTML, CSS, JavaScript, Flutter, and React.js. I focus on clean design and seamless user experiences.',
    skills: ['HTML', 'CSS', 'JavaScript', 'Flutter', 'React.js'],
    accent: 'border-cyan-500/50 text-cyan-400'
  },
  {
    category: 'Backend Development',
    icon: Cpu,
    description: 'I work with Spring Boot (Java) and the MERN stack (Node.js + Express.js) to develop secure, scalable, and well-structured backend systems.',
    skills: ['Java', 'Spring Boot', 'Node.js', 'Express.js', 'MERN Stack'],
    accent: 'border-amber-500/50 text-amber-400'
  },
  {
    category: 'Databases',
    icon: Database,
    description: 'I manage relational and non-relational databases efficiently using MySQL, PostgreSQL, and MongoDB to ensure data integrity.',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB'],
    accent: 'border-blue-500/50 text-blue-400'
  },
  {
    category: 'Cybersecurity',
    icon: Lock,
    description: 'Blue Team Specialist focused on defensive security operations, UTM, Firewall configuration, and threat detection.',
    skills: ['Blue Team Operations', 'UTM Specialist', 'Firewall Configuration', 'Network Security', 'Threat Detection'],
    accent: 'border-green-500/50 text-green-400'
  },
  {
    category: 'Programming Languages',
    icon: Terminal,
    description: 'I use C++ for problem-solving/DSA, Java for development, and Python for cybersecurity automation and AI.',
    skills: ['C++', 'Java', 'Python'],
    accent: 'border-purple-500/50 text-purple-400'
  },
];

export const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="skills" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-16 flex items-center gap-4">
            <div className="h-px bg-gray-800 flex-1" />
            <h2 className="text-3xl font-bold text-center tracking-widest text-gray-200">
              TECHNICAL <span className="text-cyan-500">SKILLS</span>
            </h2>
            <div className="h-px bg-gray-800 flex-1" />
          </div>

          {/* Skill Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {skillCategories.map((cat, index) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className={`h-full bg-[#0a0a0b] p-6 border ${cat.accent} border-opacity-30 hover:border-opacity-80 transition-all hover:bg-[#0f0f12]`}>
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 bg-black border ${cat.accent} border-opacity-40 rounded`}>
                      <cat.icon className={`w-6 h-6 ${cat.accent.split(" ")[1]}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-200">{cat.category}</h3>
                      <div className="text-[10px] text-gray-600 font-mono tracking-wider">MODULE_0{index + 1}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed border-l-2 border-gray-800 pl-4">
                    {cat.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map(skill => (
                      <span
                        key={skill}
                        className="text-xs font-mono px-2 py-1 bg-black border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                      >
                        [ {skill} ]
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
