import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Code, Rocket, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';

const highlights = [
  {
    icon: Shield,
    title: 'Cybersecurity Focus',
    description: 'Specializing in secure application development and vulnerability assessment',
    color: 'text-violet-400'
  },
  {
    icon: Code,
    title: 'Full Stack Expertise',
    description: 'Building end-to-end solutions with modern web technologies',
    color: 'text-violet-300'
  },
  {
    icon: Rocket,
    title: 'Problem Solver',
    description: 'Tackling complex challenges with innovative technical solutions',
    color: 'text-violet-400'
  },
  {
    icon: Award,
    title: 'Continuous Learner',
    description: 'Always exploring new technologies and security practices',
    color: 'text-violet-300'
  },
];

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="about" className="py-24 relative bg-black/50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              About <span className="text-violet-400">Me</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-violet-500 to-violet-300 mx-auto" />
          </div>

          {/* Main Bio */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#0a0a0b] border border-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-violet-600" />
                <p className="text-lg md:text-xl leading-relaxed text-gray-300 mb-8 font-light italic">
                  "Engineering secure, resilient digital ecosystems where security meets innovation."
                </p>
                <div className="space-y-6 text-gray-400 text-sm md:text-base leading-relaxed font-light">
                  <p>
                    I am a <span className="text-white font-medium">Cybersecurity Specialist</span> and <span className="text-white font-medium">Full-Stack Developer</span> dedicated to crafting high-performance applications with integrated security at their core. My approach combines deep technical expertise with a proactive defensive mindset.
                  </p>
                  <p>
                    From developing sophisticated <span className="text-violet-400">Java/Spring Boot</span> backends to architecting intelligent <span className="text-blue-400">AI-driven</span> solutions, I focus on building systems that are not only functional but also inherently robust against modern threats.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="h-full p-8 bg-[#0a0a0b] border border-gray-800 rounded-xl hover:border-violet-500/50 transition-all duration-500 group relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-600/10 to-transparent -mr-12 -mt-12 rounded-full blur-2xl group-hover:bg-violet-600/20 transition-all duration-500`} />
                  <div className="mb-6 relative">
                    <div className="p-3 bg-violet-500/5 border border-violet-500/20 rounded-lg inline-block group-hover:scale-110 transition-transform duration-500">
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-3 tracking-wider font-mono">{item.title.toUpperCase()}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
