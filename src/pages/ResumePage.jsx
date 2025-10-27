import { motion } from "framer-motion";
import { Resume } from "@/components/Resume";
import { useEffect } from "react";

export const ResumePage = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page { size: A4; margin: 1.2cm; }
        html, body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .no-print { display: none !important; }
        .print-container { max-width: 800px; margin: 0 auto !important; page-break-inside: avoid; }
        section { background: white !important; color: black !important; }
        .resume-section { page-break-inside: avoid !important; break-inside: avoid !important; margin-bottom: 20px; }
        .glass-effect { box-shadow: none !important; background: white !important; border: 1px solid #ccc !important; }
        .glow-cyan, .glow-magenta, .glow-green { text-shadow: none !important; color: black !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <section className="min-h-screen py-16 px-6 bg-background text-foreground relative">
      <div className="absolute inset-0 cyber-grid opacity-10" />
      <div className="max-w-5xl mx-auto relative z-10 print-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="resume-section">
            <Resume />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumePage;
