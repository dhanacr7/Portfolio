import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dhana Priyan. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Made with <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" /> and React + Three.js
          </div>
        </div>
      </div>
    </footer>
  );
};
