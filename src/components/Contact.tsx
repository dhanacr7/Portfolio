import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, Github, Linkedin, Terminal, Send, Phone, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const handleEmailClick = () => {
    window.location.href = `mailto:dhanapriyan81@gmail.com`;
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 cyber-grid opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="border border-cyan-900/50 bg-[#0a0a0b] p-2">

            {/* Terminal Header */}
            <div className="bg-cyan-900/20 border-b border-cyan-900/30 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-mono text-cyan-400">CONTACT_UPLINK // V.1.0</span>
              </div>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                  Get In <span className="text-cyan-500">Touch</span>
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
                  Want to collaborate, hire me, or discuss your project? You can reach me directly
                  through any of the contact options below.
                </p>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="flex flex-col items-center p-4 border border-gray-800 bg-black/50 hover:border-cyan-500/50 transition-colors">
                  <Mail className="w-6 h-6 text-cyan-500 mb-3" />
                  <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">Email</span>
                  <span className="text-sm text-gray-300 font-mono">dhanapriyan81@gmail.com</span>
                </div>
                <div className="flex flex-col items-center p-4 border border-gray-800 bg-black/50 hover:border-amber-500/50 transition-colors">
                  <Phone className="w-6 h-6 text-amber-500 mb-3" />
                  <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">Phone</span>
                  <span className="text-sm text-gray-300 font-mono">7358922549</span>
                </div>
                <div className="flex flex-col items-center p-4 border border-gray-800 bg-black/50 hover:border-cyan-500/50 transition-colors">
                  <MapPin className="w-6 h-6 text-cyan-500 mb-3" />
                  <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">Location</span>
                  <span className="text-sm text-gray-300 font-mono">Kuniyamuthur, Coimbatore</span>
                </div>
              </div>

              <div className="flex justify-center mb-8">
                <button
                  onClick={handleEmailClick}
                  className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 transition-all clip-path-polygon w-full md:w-auto"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  <div className="flex items-center justify-center gap-3 font-bold text-black tracking-widest uppercase">
                    <Send className="w-5 h-5" />
                    <span>Send Direct Email</span>
                  </div>
                </button>
              </div>

              {/* Footer Links */}
              <div className="flex justify-center gap-8 text-sm font-mono text-cyan-800">
                <a href="https://github.com/dhanacr7" className="hover:text-cyan-400 transition-colors">GITHUB</a>
                <span>|</span>
                <a href="https://www.linkedin.com/in/dhanapriyan7" className="hover:text-cyan-400 transition-colors">LINKEDIN</a>
                <span>|</span>
                <a href="https://www.instagram.com/orewa_dhana" className="hover:text-cyan-400 transition-colors">INSTAGRAM</a>
              </div>
            </div>

            {/* Terminal Footer */}
            <div className="bg-black/50 border-t border-cyan-900/30 p-2 text-[10px] text-center text-gray-700 font-mono">
              encrypted_connection_active :: 128-bit tls
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
