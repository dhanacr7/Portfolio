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
    color: 'text-cyan-400'
  },
  {
    icon: Code,
    title: 'Full Stack Expertise',
    description: 'Building end-to-end solutions with modern web technologies',
    color: 'text-amber-400'
  },
  {
    icon: Rocket,
    title: 'Problem Solver',
    description: 'Tackling complex challenges with innovative technical solutions',
    color: 'text-cyan-400'
  },
  {
    icon: Award,
    title: 'Continuous Learner',
    description: 'Always exploring new technologies and security practices',
    color: 'text-amber-400'
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
              About <span className="text-cyan-500">Me</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 mx-auto" />
          </div>

          {/* Main Bio */}
          <div className="max-w-4xl mx-auto mb-20">
            <Card className="bg-[#0f0f10] border-l-4 border-l-cyan-500 border-y border-r border-[#1f1f22] p-8 md:p-10 shadow-lg">
              <p className="text-lg leading-relaxed text-gray-400 mb-6 font-light">
                I'm a passionate <span className="text-white font-medium">Cybersecurity Enthusiast</span> and{' '}
                <span className="text-white font-medium">Full Stack Developer</span> with a strong foundation
                in building secure, scalable web applications. My journey in tech has been driven by curiosity
                and a desire to create solutions that make a difference.
              </p>
              <p className="text-lg leading-relaxed text-gray-400 font-light">
                With expertise in multiple programming languages and frameworks, I specialize in developing
                robust applications while maintaining a security-first mindset. I'm constantly exploring new
                technologies, from AI model training to advanced web development techniques.
              </p>
            </Card>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="h-full p-6 bg-[#0a0a0b] border border-[#1f1f22] hover:border-cyan-500/50 transition-colors group">
                  <div className="mb-4 flex justify-between items-start">
                    <item.icon className={`w-8 h-8 ${item.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-200 mb-2 tracking-wider">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
