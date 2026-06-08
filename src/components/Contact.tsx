import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Github, Linkedin, Terminal, Send, Phone, MapPin, Code, Shield, Cpu, ChevronRight, MessageSquare, User, Globe, Laptop } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner'; // Assuming sonner is used for notifications

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEstablishLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in the identification and transmission data.");
      return;
    }

    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        project_type: formData.projectType || 'General Inquiry',
        message: formData.message,
        to_name: 'Dhanapriyan',
      };

      // Pre-initialize EmailJS
      emailjs.init('Pc_1Vrtm3KnfEjqAy');

      await emailjs.send(
        'service_bg1tpka',
        'template_2s0zsxy',
        templateParams
      );

      // Reset form
      setFormData({
        name: '',
        email: '',
        projectType: '',
        message: ''
      });

      alert("MISSION SUCCESSFUL: Transmission established. Data synchronized with central command.");
    } catch (error) {
      console.error('FAILED...', error);
      alert("CRITICAL ERROR: Transmission failed. Frequency collision detected. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative bg-black overflow-hidden" ref={ref}>
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* 1. HERO HEADER */}
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Need <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-500 italic">Secure Software?</span>
            </h2>
            <p className="text-xl md:text-2xl font-light text-gray-400 tracking-wide">
              Let's <span className="text-violet-400 font-medium">Build It Right.</span>
            </p>
          </div>

          {/* 2. THREE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {[
              { label: 'Build', sub: 'Full Stack', icon: Laptop, color: 'text-blue-400' },
              { label: 'Secure', sub: 'Security', icon: Shield, color: 'text-violet-400' },
              { label: 'Scale', sub: 'Engineering', icon: Cpu, color: 'text-cyan-400' }
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="group p-8 bg-[#0a0a0b] border border-gray-800 rounded-2xl hover:border-violet-500/50 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-600/5 to-transparent -mr-12 -mt-12 rounded-full blur-2xl" />
                <div className="mb-6 p-3 bg-black border border-gray-800 rounded-xl inline-block group-hover:scale-110 transition-transform duration-500">
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{card.label}</h3>
                <p className="text-sm font-mono text-gray-500 tracking-widest uppercase">{card.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* 3. FORM SECTION */}
          <div className="max-w-4xl mx-auto py-20 border-t border-gray-900">
            <div className="flex flex-col md:flex-row gap-16">
              {/* Form Info */}
              <div className="md:w-1/3">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-violet-500/30 rounded-full bg-violet-500/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-violet-400 tracking-widest uppercase">Direct Uplink</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
                  SECURE <span className="block text-violet-500">CONNECTION</span>
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light">
                  Establish a secure channel for your next software initiative.
                  Encrypted communication for mission-critical projects.
                </p>
              </div>

              {/* Actual Form */}
              <form onSubmit={handleEstablishLink} className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-600 group-focus-within:text-violet-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="IDENTIFY YOURSELF"
                        className="w-full bg-[#0a0a0b] border border-gray-800 rounded-lg py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-700 focus:border-violet-500 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-600 group-focus-within:text-violet-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="COMMUNICATION_ADDRESS"
                        className="w-full bg-[#0a0a0b] border border-gray-800 rounded-lg py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-700 focus:border-violet-500 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Project Type</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Code className="h-4 w-4 text-gray-600 group-focus-within:text-violet-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      placeholder="INITIATIVE_TYPE (e.g. WEB_APP, SECURITY_AUDIT)"
                      className="w-full bg-[#0a0a0b] border border-gray-800 rounded-lg py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-700 focus:border-violet-500 focus:outline-none transition-all uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Message</label>
                  <div className="relative group">
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <MessageSquare className="h-4 w-4 text-gray-600 group-focus-within:text-violet-500 transition-colors" />
                    </div>
                    <textarea
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="TRANSMIT_DATA_HERE..."
                      className="w-full bg-[#0a0a0b] border border-gray-800 rounded-lg py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-700 focus:border-violet-500 focus:outline-none transition-all resize-none"
                      required
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-10 py-5 ${isSubmitting ? 'bg-green-600' : 'bg-violet-600 hover:bg-violet-500'} text-white font-bold tracking-[0.2em] uppercase rounded-xl transition-all shadow-[0_0_30px_rgba(139,92,246,0.1)] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Link Initiated
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Establish Link
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* 4. FOOTER INFO */}
          <div className="text-center pt-24 border-t border-gray-900">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-[#0a0a0b] border border-gray-800 px-6 py-2 rounded-full inline-flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">
                  Response Time: <span className="text-white">Within 24 Hours</span>
                </span>
              </div>
              <h4 className="text-2xl md:text-3xl font-black text-white/50 tracking-tight mt-4 uppercase">
                Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500/50 to-blue-500/50 italic">Without Compromise.</span>
              </h4>
              <div className="text-[10px] font-mono text-gray-800 tracking-[0.5em] uppercase mt-4">
                /// END_OF_TRANSMISSION ///
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
