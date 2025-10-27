import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Phone, Github, Linkedin } from "lucide-react";

export const Resume = () => {
  return (
    <section id="resume" className="py-20 relative">
      <div className="absolute inset-0 cyber-grid opacity-10" />

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <h1 className="text-4xl font-bold text-center mb-2 glow-cyan">
            Dhanapriyan S
          </h1>
          <p className="text-center text-muted-foreground text-lg mb-6">
            Full Stack Developer | Specialist Programmer | Cyber Security Analyst
          </p>

          {/* Contact Section */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm">
            <a
              href="mailto:dhanapriyan81@gmail.com"
              className="flex items-center gap-2 hover:text-primary transition"
            >
              <Mail className="w-4 h-4" /> dhanapriyan81@gmail.com
            </a>
            <a
              href="tel:+917358922549"
              className="flex items-center gap-2 hover:text-primary transition"
            >
              <Phone className="w-4 h-4" /> 7358922549
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Kuniyamuthur, Coimbatore
            </span>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-12">
            <a
              href="https://github.com/dhanacr7"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/dhanapriyan7"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-primary transition">
              🌐 Portfolio (Coming Soon)
            </a>
          </div>

          {/* Career Summary */}
          <Card className="glass-effect cyber-border p-8 mb-8">
            <h2 className="text-2xl font-bold mb-3 glow-magenta">
              Career Summary
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              I am a passionate and curious developer currently pursuing a{" "}
              <b>BE in Computer Science and Engineering (Cyber Security)</b> at
              Sri Krishna College of Engineering and Technology (2024–2028).
              A quick learner and strong team player, I focus on building secure,
              scalable, and efficient solutions.
              I thrive in both <b>full-stack development</b> and{" "}
              <b>cybersecurity</b>, and I constantly explore how systems interact
              to create secure, impactful technology.
            </p>
          </Card>

          {/* Technical Skills */}
          <Card className="glass-effect cyber-border p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 glow-green">
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p>
                  <b>Frontend:</b> HTML, CSS, JavaScript, React, Flutter
                </p>
                <p>
                  <b>Backend:</b> Java (Spring Boot), Node.js, Express.js
                </p>
                <p>
                  <b>Databases:</b> MySQL, PostgreSQL, MongoDB
                </p>
              </div>
              <div>
                <p>
                  <b>Programming Languages:</b> C++, Java, Python
                </p>
                <p>
                  <b>Other Tools:</b> Git, Linux, REST APIs, Networking Basics
                </p>
              </div>
            </div>
          </Card>

          {/* Projects */}
          <Card className="glass-effect cyber-border p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 glow-cyan">Projects</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  Student Course Registration System
                </h3>
                <p className="text-sm">
                  Developed a full-stack student portal to manage course enrollments
                  using HTML, CSS, and JavaScript for frontend and Spring Boot + MySQL
                  for backend.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  KK Café App
                </h3>
                <p className="text-sm">
                  Built a mobile app for an emerging startup using Flutter (frontend)
                  with Spring Boot and PostgreSQL backend integration for smooth order
                  and data management.
                </p>
              </div>
            </div>
          </Card>

          {/* Education */}
          <Card className="glass-effect cyber-border p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 glow-magenta">Education</h2>
            <div className="text-muted-foreground">
              <p className="font-semibold text-foreground">
                BE CSE (Cyber Security)
              </p>
              <p>
                Sri Krishna College of Engineering and Technology, Coimbatore
              </p>
              <p>2024 – 2028</p>
            </div>
          </Card>

          {/* Certifications */}
          <Card className="glass-effect cyber-border p-8">
            <h2 className="text-2xl font-bold mb-4 glow-cyan">
              Certifications & Achievements
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                Infosys Certified in HTML, CSS, and JavaScript (Web Development)
              </li>
              <li>
                Amazon (Coursera) Full Stack Development using Spring Boot
              </li>
              <li>Google Cybersecurity Certification (Coursera)</li>
              <li>
                Participated in “Binary Exploitation” at PSG Kriya Event
              </li>
              <li>
                Participated in “Rootforwar” Cybersecurity Event at PSNA College
              </li>
              <li>
                Infosys Networking Certificate – System & Network Understanding
              </li>
              <li>
                Operating Systems Certificate – System Functioning Fundamentals
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
