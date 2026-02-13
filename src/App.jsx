import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/context/ThemeProvider";

import { useState } from "react";
import TimeRewindLoader from "./components/TimeRewindLoader";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          {isLoading && <TimeRewindLoader onComplete={() => setIsLoading(false)} />}
          {!isLoading && (
            <>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* 🏠 Home Page */}
                  <Route path="/" element={<Index />} />

                  {/* 🚫 Remove Resume Page route (using static PDF instead) */}
                  {/* Resume is now served directly as /resume.pdf */}

                  {/* ⚠️ 404 Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </>
          )}
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
