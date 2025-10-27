import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'dhanapriyan81@gmail.com',
    href: 'mailto:dhanapriyan81@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '7358922549',
    href: 'tel:+917358922549',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Kuniyamuthur, Coimbatore',
    href: '#',
  },
];

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const handleEmailClick = () => {
    const subject = encodeURIComponent("Let's collaborate! 🚀");
    const body = encodeURIComponent(
      "Hi Dhana Priyan,\n\nI found your portfolio and wanted to reach out to discuss a potential project or opportunity.\n\nLooking forward to hearing from you!\n\nBest regards,\n[Your Name]"
    );
    window.location.href = `mailto:dhanapriyan81@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-20 relative" ref={ref}>
      <div className="absolute inset-0 cyber-grid opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Get In <span className="glow-cyan">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6" />
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">
            Want to collaborate, hire me, or discuss your project? You can reach me directly
            through any of the contact options below — or send me an email instantly.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-effect cyber-border p-8 h-full">
                <h3 className="text-2xl font-bold mb-6 glow-magenta">Contact Information</h3>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-4 group hover:translate-x-2 transition-transform"
                    >
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">{item.label}</div>
                        <div className="font-medium group-hover:text-primary transition-colors">
                          {item.value}
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <h4 className="text-lg font-semibold mb-4">Social Links</h4>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://github.com/dhanacr7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-muted cyber-border hover:bg-primary/20 transition-colors text-sm"
                    >
                      Github
                    </a>
                    <a
                      href="https://www.linkedin.com/in/dhanapriyan7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-muted cyber-border hover:bg-primary/20 transition-colors text-sm"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://www.instagram.com/orewa_dhana"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-muted cyber-border hover:bg-primary/20 transition-colors text-sm"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Send Email Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-effect cyber-border p-8 flex flex-col items-center justify-center h-full text-center">
                <h3 className="text-2xl font-bold mb-4 glow-cyan">Send Me an Email</h3>
                <p className="text-muted-foreground mb-8">
                  Click the button below to instantly open your email app with my details pre-filled.
                </p>
                <Button
                  onClick={handleEmailClick}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:scale-105 hover:shadow-[0_0_20px_hsl(var(--primary))] transition-all"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send Email
                </Button>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
