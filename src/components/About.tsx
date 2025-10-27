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
  },
  {
    icon: Code,
    title: 'Full Stack Expertise',
    description: 'Building end-to-end solutions with modern web technologies',
  },
  {
    icon: Rocket,
    title: 'Problem Solver',
    description: 'Tackling complex challenges with innovative technical solutions',
  },
  {
    icon: Award,
    title: 'Continuous Learner',
    description: 'Always exploring new technologies and security practices',
  },
];

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="about" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            About <span className="glow-cyan">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-12" />

          <div className="max-w-4xl mx-auto mb-16">
            <Card className="glass-effect cyber-border p-8">
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                I'm a passionate <span className="text-primary font-semibold">Cybersecurity Enthusiast</span> and{' '}
                <span className="text-secondary font-semibold">Full Stack Developer</span> with a strong foundation
                in building secure, scalable web applications. My journey in tech has been driven by curiosity
                and a desire to create solutions that make a difference.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                With expertise in multiple programming languages and frameworks, I specialize in developing
                robust applications while maintaining a security-first mindset. I'm constantly exploring new
                technologies, from AI model training to advanced web development techniques.
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="glass-effect cyber-border p-6 h-full hover:scale-105 transition-transform">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-full bg-primary/10 mb-4">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 glow-cyan">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
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
