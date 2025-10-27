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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Open resume PDF in a new tab (and let browser handle download/open)
  const handleResumeOpen = () => {
    // This will open file in a new tab. If server returns PDF it will display; user can save.
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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold glow-cyan select-none"
          >
            &lt;DP /&gt;
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-foreground hover:text-primary transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </motion.a>
            ))}

            {/* Resume Dropdown Trigger */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowResumeOptions((p) => !p)}
                className="cyber-border hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Resume
              </Button>

              {showResumeOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-2 bg-background/95 backdrop-blur-md rounded-lg shadow-lg border border-primary/20 p-2 w-48 z-50"
                >
                  <a
                    href="/resume"
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-all block text-foreground"
                    onClick={() => setShowResumeOptions(false)}
                  >
                    <FileText className="w-4 h-4 text-primary" /> View Resume
                  </a>

                  <button
                    onClick={() => {
                      setShowResumeOptions(false);
                      handleResumeOpen();
                    }}
                    className="flex items-center gap-2 px-3 py-2 w-full rounded-md hover:bg-primary/10 transition-all text-foreground"
                  >
                    <Download className="w-4 h-4 text-primary" /> Download Resume
                  </button>
                </motion.div>
              )}
            </div>

            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="ml-2 p-2 rounded-full hover:bg-primary/20 transition-all"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
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
                className="block py-3 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}

            {/* Resume Buttons inside Mobile Menu */}
            <div className="flex flex-col gap-2 mt-4">
              <a
                href="/resume"
                className="block w-full py-2 text-center cyber-border rounded-md hover:bg-primary/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                View Resume
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleResumeOpen();
                }}
                className="block w-full py-2 text-center cyber-border rounded-md hover:bg-primary/10"
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
              className="mt-4 p-2 rounded-full"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
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
