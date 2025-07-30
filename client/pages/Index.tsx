import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { ChevronDown, Globe, Book, Coins, Zap, Users, ArrowRight, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import WalletModal from "@/components/WalletModal";
import OnboardingWizard from "@/components/OnboardingWizard";
import SEOHead from "@/components/SEOHead";

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
  const { state, dispatch } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWalletClick = () => {
    if (state.user.isConnected) {
      // Show user menu or dashboard
      window.location.href = '/dashboard';
    } else {
      dispatch({ type: 'SET_WALLET_MODAL', payload: true });
    }
  };

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

        <Button
          onClick={handleWalletClick}
          className="bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-deep font-semibold"
        >
          {state.user.isConnected ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-atlas-regenerative rounded-full" />
              {state.user.address?.slice(0, 6)}...{state.user.address?.slice(-4)}
            </div>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const { state, dispatch } = useUser();

  const handleEnterSanctum = () => {
    if (state.user.isConnected && state.user.onboardingComplete) {
      window.location.href = '/dashboard';
    } else if (state.user.isConnected) {
      dispatch({ type: 'SET_ONBOARDING', payload: true });
    } else {
      dispatch({ type: 'SET_WALLET_MODAL', payload: true });
    }
  };

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
          {state.user.isConnected && state.user.onboardingComplete ? (
            `Welcome back, ${state.user.persona ? state.user.persona.charAt(0).toUpperCase() + state.user.persona.slice(1) : 'Guardian'}. Your regenerative journey continues.`
          ) : (
            'Welcome to Atlas Sanctum, where financial empires transform into forces of planetary healing. Experience the future of regenerative finance through immersive storytelling and ethical analytics.'
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            size="lg"
            onClick={handleEnterSanctum}
            className="bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-deep font-semibold text-lg px-8 py-4 group"
          >
            {state.user.isConnected && state.user.onboardingComplete ? 'Continue Journey' : 'Enter Sanctum'}
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
      title: "Interactive Sanctum Map",
      description: "Revolutionary 3D financial flow visualization revealing how capital moves through regenerative ecosystems. Track ethical investment impacts across planetary healing projects with real-time ESG analytics.",
      color: "atlas-wisdom",
      keywords: "financial flow map, ethical investment tracking, ESG analytics, impact investing dashboard",
      schema: {
        "@type": "SoftwareApplication",
        "name": "Sanctum Map",
        "description": "3D interactive globe for tracking regenerative financial flows",
        "applicationCategory": "Finance",
        "featureList": ["Real-time data visualization", "Impact tracking", "Geographic insights"]
      }
    },
    {
      icon: Book,
      title: "AI-Powered Wisdom Library",
      description: "Global repository of regenerative finance wisdom with semantic search across cultures. Access curated texts, indigenous knowledge, and AI-generated ethics-in-motion narratives for conscious decision-making.",
      color: "atlas-cosmic",
      keywords: "wisdom library, AI semantic search, regenerative finance education, ethical decision making",
      schema: {
        "@type": "DigitalDocument",
        "name": "Library of Living Meaning",
        "description": "Curated wisdom texts for regenerative finance",
        "genre": "Educational Resource"
      }
    },
    {
      icon: Coins,
      title: "Dignity Coin Ecosystem",
      description: "Breakthrough covenant-based cryptocurrency linking investments to measurable planetary healing outcomes. Track SDG impact scores, regenerative project funding, and transparent capital allocation.",
      color: "atlas-gold",
      keywords: "dignity coin, covenant investing, impact cryptocurrency, SDG tracking, regenerative funding",
      schema: {
        "@type": "Product",
        "name": "Dignity Coin",
        "description": "Covenant-based cryptocurrency for impact investing",
        "category": "Cryptocurrency"
      }
    },
    {
      icon: Zap,
      title: "Crisis Transformation AI",
      description: "Proprietary AI engine converting personal and collective crises into healing poetry, sacred rituals, and regenerative music. Transform pain into purpose with our meaning-making algorithms.",
      color: "atlas-regenerative",
      keywords: "AI crisis transformation, pain to art, healing algorithms, regenerative storytelling",
      schema: {
        "@type": "SoftwareApplication",
        "name": "Pain Transmutation Studio",
        "description": "AI-powered platform for transforming crisis into healing art",
        "applicationCategory": "Creativity"
      }
    }
  ];

  return (
    <section className="py-20 px-6" itemScope itemType="https://schema.org/ItemList">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Regenerative Finance Revolution: Four Breakthrough Technologies
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Connect ethical capital to planetary healing through AI-powered insights, interactive mapping,
            and transparent impact tracking. The future of conscious investing starts here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <article
              key={index}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-atlas-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-atlas-gold/20"
              itemScope
              itemType="https://schema.org/SoftwareApplication"
              itemProp="itemListElement"
            >
              <meta itemProp="position" content={String(index + 1)} />
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                feature.color === 'atlas-gold' ? 'bg-atlas-gold/20' :
                feature.color === 'atlas-cosmic' ? 'bg-atlas-cosmic/20' :
                feature.color === 'atlas-regenerative' ? 'bg-atlas-regenerative/20' :
                'bg-atlas-wisdom/20'
              }`}>
                <feature.icon className={`w-8 h-8 ${
                  feature.color === 'atlas-gold' ? 'text-atlas-gold' :
                  feature.color === 'atlas-cosmic' ? 'text-atlas-cosmic' :
                  feature.color === 'atlas-regenerative' ? 'text-atlas-regenerative' :
                  'text-atlas-wisdom'
                }`} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-atlas-gold transition-colors" itemProp="name">
                {feature.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed" itemProp="description">
                {feature.description}
              </p>
              <meta itemProp="keywords" content={feature.keywords} />
              <script type="application/ld+json">
                {JSON.stringify(feature.schema)}
              </script>
            </article>
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
  const { state } = useUser();

  // Generate persona-specific SEO
  const seoTitle = state.user.persona
    ? `Atlas Sanctum - ${state.user.persona === 'custodian' ? 'Ethical Investment Platform' :
         state.user.persona === 'creator' ? 'AI-Powered Creative Platform' :
         state.user.persona === 'regenerator' ? 'Regenerative Project Funding' :
         'Conscious Finance Map'}`
    : "Atlas Sanctum - Capital Becomes Conscience, Wealth Becomes Wisdom";

  const seoDescription = state.user.persona
    ? `${state.user.persona === 'custodian' ? 'Professional dashboard for ethical capital custodians to redirect investments into regenerative projects with real-time impact analytics.' :
         state.user.persona === 'creator' ? 'AI-powered platform for artists to transform crisis into healing through poetry, music, and wisdom narratives.' :
         state.user.persona === 'regenerator' ? 'Transparent funding platform connecting planetary regeneration projects with ethical capital through AI-powered matching.' :
         'Interactive map and tools for citizens to understand financial flows and take micro-actions for planetary healing.'}`
    : "Transform finance for planetary healing with the world's first regenerative finance platform. Connect ethical capital to regenerative projects through AI-powered insights and immersive storytelling.";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Atlas Sanctum",
    "url": "https://atlassanctum.com",
    "description": seoDescription,
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://atlassanctum.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "Atlas Sanctum Platform",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "category": "Free Tier Available"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "3D Interactive Sanctum Map",
        "AI-Powered Pain Transmutation Studio",
        "Dignity Coin Tracking",
        "Regenerative Project Funding",
        "Ethics-in-Motion Analytics"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        persona={state.user.persona}
        structuredData={structuredData}
        keywords="regenerative finance, ethical investing, impact investment platform, conscious capitalism, dignity coin, planetary healing, AI finance, Web3 sustainability, interactive financial map, crisis transformation"
      />

      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <FellowshipSection />
      <Footer />

      {/* Modals */}
      <WalletModal />
      <OnboardingWizard />
    </div>
  );
}
