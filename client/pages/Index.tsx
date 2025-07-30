import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { ChevronDown, Globe, Book, Coins, Zap, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Three.js constellation component
function ConstellationBackground() {
  return (
    <>
      <Stars
        radius={300}
        depth={60}
        count={2000}
        factor={7}
        saturation={0}
        fade
        speed={0.5}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.2}
      />
    </>
  );
}

// Navigation Header
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="h-8 w-8 text-atlas-gold" />
          <span className="text-2xl font-bold text-foreground">Atlas Sanctum</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/sanctum-map" className="text-foreground/80 hover:text-atlas-gold transition-colors">
            Sanctum Map
          </Link>
          <Link to="/library" className="text-foreground/80 hover:text-atlas-gold transition-colors">
            Library
          </Link>
          <Link to="/dignity-coin" className="text-foreground/80 hover:text-atlas-gold transition-colors">
            Dignity Coin
          </Link>
          <Link to="/fellowship" className="text-foreground/80 hover:text-atlas-gold transition-colors">
            Fellowship
          </Link>
        </div>

        <Button className="bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-deep font-semibold">
          Connect Wallet
        </Button>
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* WebGL Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ConstellationBackground />
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background z-10" />

      {/* Hero Content */}
      <div className="relative z-20 text-center max-w-5xl mx-auto px-6">
        <div className="mb-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-atlas-cosmic/20 border border-atlas-cosmic/30 text-atlas-cosmic mb-8">
            <Zap className="w-4 h-4 mr-2" />
            Renaissance of Regenerative Finance
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-atlas-gold via-atlas-wisdom to-atlas-cosmic">
            Capital becomes
          </span>
          <br />
          <span className="text-foreground">conscience</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-atlas-cosmic via-atlas-wisdom to-atlas-gold">
            Wealth becomes
          </span>
          <br />
          <span className="text-foreground">wisdom</span>
        </h1>

        <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
          Welcome to Atlas Sanctum, where financial empires transform into forces of planetary healing. 
          Experience the future of regenerative finance through immersive storytelling and ethical analytics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-deep font-semibold text-lg px-8 py-4 group">
            Enter Sanctum
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="border-atlas-cosmic text-atlas-cosmic hover:bg-atlas-cosmic/10 text-lg px-8 py-4">
            Watch Story
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-foreground/60" />
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: "Sanctum Map",
      description: "3D interactive globe revealing financial empires and regeneration flows with real-time data overlays.",
      color: "atlas-wisdom"
    },
    {
      icon: Book,
      title: "Library of Living Meaning",
      description: "Curated wisdom texts with AI-powered semantic search and ethics-in-motion narratives.",
      color: "atlas-cosmic"
    },
    {
      icon: Coins,
      title: "Dignity Coin",
      description: "Covenant-based investments linked to planetary healing metrics and SDG impact tracking.",
      color: "atlas-gold"
    },
    {
      icon: Zap,
      title: "Pain Transmutation",
      description: "Transform crisis into poetry, ritual, and music through our AI-powered meaning engine.",
      color: "atlas-regenerative"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Planetary-Scale Consciousness
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Four pillars of transformation connecting financial flows to regenerative outcomes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative p-8 rounded-2xl bg-card border border-border hover:border-atlas-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-atlas-gold/20">
              <div className={`w-16 h-16 rounded-xl bg-${feature.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-8 h-8 text-${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-atlas-gold transition-colors">
                {feature.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Fellowship CTA Section
function FellowshipSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-atlas-cosmic/10 to-atlas-regenerative/10 relative">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Users className="w-16 h-16 text-atlas-cosmic mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Join the Regenerative Custodianship Fellowship
          </h2>
          <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
            Become a guardian of planetary consciousness. Access advanced analytics, 
            curated wisdom, and connect with visionaries reshaping finance for regeneration.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-atlas-cosmic hover:bg-atlas-cosmic/90 text-white font-semibold text-lg px-8 py-4">
            Begin Fellowship
          </Button>
          <Button size="lg" variant="outline" className="border-atlas-wisdom text-atlas-wisdom hover:bg-atlas-wisdom/10 text-lg px-8 py-4">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Globe className="h-6 w-6 text-atlas-gold" />
            <span className="text-lg font-semibold text-foreground">Atlas Sanctum</span>
          </div>
          
          <div className="flex space-x-6 text-foreground/60">
            <a href="#" className="hover:text-atlas-gold transition-colors">Privacy</a>
            <a href="#" className="hover:text-atlas-gold transition-colors">Terms</a>
            <a href="#" className="hover:text-atlas-gold transition-colors">Documentation</a>
            <a href="#" className="hover:text-atlas-gold transition-colors">Support</a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-foreground/60">
          <p>© 2024 Atlas Sanctum. Transforming capital into planetary consciousness.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <FellowshipSection />
      <Footer />
    </div>
  );
}
