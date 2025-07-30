import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

export default function PlaceholderPage({
  title,
  description,
  icon,
  comingSoon = true,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-atlas-gold via-atlas-cosmic to-atlas-wisdom" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--atlas-cosmic)/0.1),transparent)]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-foreground/80 hover:text-atlas-gold transition-colors">
              Back to Sanctum
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 text-atlas-gold">{icon}</div>
            <span className="text-xl font-semibold text-foreground">
              {title}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center max-w-2xl mx-auto px-6">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-atlas-cosmic/20 border border-atlas-cosmic/30">
              {comingSoon ? (
                <Construction className="w-12 h-12 text-atlas-cosmic" />
              ) : (
                <div className="w-12 h-12 text-atlas-cosmic">{icon}</div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              {title}
            </h1>

            <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
              {description}
            </p>

            {comingSoon && (
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-atlas-wisdom/20 border border-atlas-wisdom/30 text-atlas-wisdom mb-8">
                <span className="w-2 h-2 bg-atlas-wisdom rounded-full mr-3 animate-pulse" />
                Coming Soon - In Development
              </div>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-foreground/60">
              This module is being carefully crafted with immersive storytelling
              and cutting-edge technology. Continue exploring or return to the
              main Sanctum to discover other available features.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/">
                <Button className="bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-deep font-semibold">
                  Explore Sanctum
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-atlas-cosmic text-atlas-cosmic hover:bg-atlas-cosmic/10"
              >
                Get Notified
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
