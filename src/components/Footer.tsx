import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dhana Priyan. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
