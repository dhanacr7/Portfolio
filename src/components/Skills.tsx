import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code, Database, Cpu, Shield, Lock, Terminal, Layout, Palette, FileJson, Smartphone, Laptop, Zap, Globe, FileCode, Coffee, Atom, HardDrive, Server, Layers, ShieldAlert, Search } from 'lucide-react';

const skillCategories = [
  {
    category: 'Frontend Development',
    icon: Layout,
    description: 'I build responsive and modern UIs using HTML, CSS, JavaScript, Flutter, and React.js. I focus on clean design and seamless user experiences.',
    skills: [
      { name: 'HTML', icon: Globe },
      { name: 'CSS', icon: Palette },
      { name: 'JavaScript', icon: FileCode },
      { name: 'Flutter', icon: Smartphone },
      { name: 'React.js', icon: Atom }
    ],
    accent: 'border-cyan-500 text-cyan-400',
    bgColor: 'from-cyan-500/5 to-transparent'
  },
  {
    category: 'Backend Development',
    icon: Server,
    description: 'I work with Spring Boot (Java) and the MERN stack (Node.js + Express.js) to develop secure, scalable, and well-structured backend systems.',
    skills: [
      { name: 'Java', icon: Coffee },
      { name: 'Spring Boot', icon: Zap },
      { name: 'Node.js', icon: Cpu },
      { name: 'Express.js', icon: Terminal },
      { name: 'MERN Stack', icon: Layers }
    ],
    accent: 'border-violet-500 text-violet-400',
    bgColor: 'from-violet-500/5 to-transparent'
  },
  {
    category: 'Databases',
    icon: Database,
    description: 'I manage relational and non-relational databases efficiently using MySQL, PostgreSQL, and MongoDB to ensure data integrity.',
    skills: [
      { name: 'MySQL', icon: Database },
      { name: 'PostgreSQL', icon: HardDrive },
      { name: 'MongoDB', icon: Database }
    ],
    accent: 'border-blue-500 text-blue-400',
    bgColor: 'from-blue-500/5 to-transparent'
  },
  {
    category: 'Cybersecurity',
    icon: Shield,
    description: 'Blue Team Specialist focused on defensive security operations, UTM, Firewall configuration, and threat detection.',
    skills: [
      { name: 'Blue Team', icon: Shield },
      { name: 'UTM Specialist', icon: Lock },
      { name: 'Firewall', icon: ShieldAlert },
      { name: 'Network Sec', icon: Globe },
      { name: 'Threat Detection', icon: Search }
    ],
    accent: 'border-green-500 text-green-400',
    bgColor: 'from-green-500/5 to-transparent'
  },
  {
    category: 'Programming',
    icon: Terminal,
    description: 'I use C++ for problem-solving/DSA, Java for development, and Python for cybersecurity automation and AI.',
    skills: [
      { name: 'C++', icon: Code },
      { name: 'Java', icon: Coffee },
      { name: 'Python', icon: FileJson }
    ],
    accent: 'border-orange-500 text-orange-400',
    bgColor: 'from-orange-500/5 to-transparent'
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
              TECHNICAL <span className="text-violet-400">SKILLS</span>
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
                <div className={`group relative h-full bg-[#0a0a0b] p-6 border ${cat.accent} border-opacity-20 hover:border-opacity-100 transition-all duration-500 rounded-xl overflow-hidden`}>
                  {/* Subtle Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Category Header */}
                  <div className="relative flex items-center gap-4 mb-6 z-10">
                    <div className={`p-3 bg-black border ${cat.accent} border-opacity-30 rounded-lg group-hover:scale-110 transition-transform duration-500`}>
                      <cat.icon className={`w-6 h-6 ${cat.accent.split(" ")[1]}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">{cat.category}</h3>
                      <div className="text-[10px] text-gray-500 font-mono tracking-widest">MODULE_0{index + 1}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="relative text-sm text-gray-400 mb-8 leading-relaxed font-light z-10">
                    {cat.description}
                  </p>

                  {/* Skills Grid */}
                  <div className="relative flex flex-wrap gap-3 z-10">
                    {cat.skills.map(skill => (
                      <div
                        key={skill.name}
                        className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 bg-black/40 border border-gray-800 text-gray-400 rounded-md hover:text-white hover:border-gray-500 hover:bg-black transition-all cursor-default group/skill"
                      >
                        <skill.icon className="w-3.5 h-3.5 text-gray-500 group-hover/skill:text-violet-400 transition-colors" />
                        <span>{skill.name}</span>
                      </div>
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
