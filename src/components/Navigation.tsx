import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeProvider";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showResumeOptions, setShowResumeOptions] = useState(false);
  const { theme, toggleTheme } = useTheme();

  /* Scroll shadow */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close resume dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".resume-dropdown")) {
        setShowResumeOptions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* Open PDF */
  const openResumePDF = () => {
    window.open("/resume.pdf", "_blank", "noopener,noreferrer");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-effect shadow-lg" : ""
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* LOGO (FIXED SIZE) */}
          <motion.a
            href="/"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center cursor-pointer"
          >
            <img
              src="/DP_logo.png"
              alt="DP Logo"
              className="
                h-14 md:h-16 
                w-auto 
                max-h-16 
                object-contain 
                glow-cyan
                transition-transform duration-300
                hover:scale-105
              "
            />
          </motion.a>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="text-foreground hover:text-primary transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </motion.a>
            ))}

            {/* RESUME DROPDOWN */}
            <div className="relative resume-dropdown">
              <Button
                variant="outline"
                onClick={() => setShowResumeOptions((p) => !p)}
                className="cyber-border flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Resume
              </Button>

              {showResumeOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-primary/20 bg-background/95 backdrop-blur-md shadow-lg p-2 z-50"
                >
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowResumeOptions(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition"
                  >
                    <FileText className="w-4 h-4 text-primary" />
                    View Resume
                  </a>

                  <button
                    onClick={() => {
                      setShowResumeOptions(false);
                      openResumePDF();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition"
                  >
                    <Download className="w-4 h-4 text-primary" />
                    Download Resume
                  </button>
                </motion.div>
              )}
            </div>

            {/* THEME TOGGLE */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
            </Button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* MOBILE NAV */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden mt-4 glass-effect rounded-lg p-4"
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 text-foreground hover:text-primary"
              >
                {item.name}
              </a>
            ))}

            <div className="flex flex-col gap-2 mt-4">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-center cyber-border rounded-md"
              >
                View Resume
              </a>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openResumePDF();
                }}
                className="py-2 text-center cyber-border rounded-md"
              >
                Download Resume
              </button>
            </div>

            <Button
              onClick={() => {
                toggleTheme();
                setIsMobileMenuOpen(false);
              }}
              variant="outline"
              size="icon"
              className="mt-4 rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
