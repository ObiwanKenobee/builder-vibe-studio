import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { SecurityProvider } from "@/contexts/SecurityContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SanctumMap from "./pages/SanctumMap";
import Library from "./pages/Library";
import DignityCoin from "./pages/DignityCoin";
import Fellowship from "./pages/Fellowship";
import Dashboard from "./pages/Dashboard";
import PainTransmutation from "./pages/PainTransmutation";
import Analytics from "./pages/Analytics";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Register Service Worker for PWA functionality
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New content available, prompt user to refresh
                  if (
                    confirm(
                      "New version available! Reload to update Atlas Sanctum?",
                    )
                  ) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
}

function AppWithPWA() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/sanctum-map" element={<SanctumMap />} />
              <Route path="/library" element={<Library />} />
              <Route path="/dignity-coin" element={<DignityCoin />} />
              <Route path="/fellowship" element={<Fellowship />} />
              <Route
                path="/pain-transmutation"
                element={<PainTransmutation />}
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<AppWithPWA />);
