import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, useTexture, Html } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Globe, Sparkles, ArrowRight, Mail, Heart, Zap } from 'lucide-react';
import * as THREE from 'three';

// Animated Globe Component
function AnimatedGlobe({ isHovered, userRegion }: { isHovered: boolean; userRegion: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [flows, setFlows] = useState<Array<{
    position: [number, number, number];
    color: string;
    intensity: number;
    type: 'healing' | 'harming';
  }>>([]);

  // Generate random capital flows
  useEffect(() => {
    const newFlows = Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      ] as [number, number, number],
      color: Math.random() > 0.6 ? '#10B981' : '#EF4444', // Green healing vs Red harming
      intensity: Math.random() * 0.8 + 0.2,
      type: Math.random() > 0.6 ? 'healing' : 'harming'
    }));
    setFlows(newFlows);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.005;
      
      // Zoom effect on hover
      if (isHovered) {
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 3, 0.1);
      } else {
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5, 0.1);
      }
    }
  });

  return (
    <group>
      {/* Main Globe */}
      <Sphere ref={meshRef} args={[1.5, 32, 32]}>
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.8}
          emissive="#16213e"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Capital Flow Lines */}
      {flows.map((flow, i) => (
        <group key={i}>
          <mesh position={flow.position}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color={flow.color} />
          </mesh>
          
          {/* Flowing particles */}
          <mesh position={[
            flow.position[0] + Math.sin(Date.now() * 0.001 + i) * 0.1,
            flow.position[1] + Math.cos(Date.now() * 0.001 + i) * 0.1,
            flow.position[2]
          ]}>
            <sphereGeometry args={[0.01, 4, 4]} />
            <meshBasicMaterial 
              color={flow.type === 'healing' ? '#D4AF37' : '#ff6b6b'} 
              transparent
              opacity={flow.intensity}
            />
          </mesh>
        </group>
      ))}

      {/* Golden Rivers */}
      <mesh>
        <ringGeometry args={[1.6, 1.65, 32]} />
        <meshBasicMaterial 
          color="#D4AF37" 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Newsletter Form Component
function NewsletterForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 p-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-atlas-regenerative/20 flex items-center justify-center">
          <Heart className="w-8 h-8 text-atlas-regenerative" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Welcome to the Map</h3>
        <p className="text-foreground/70">
          Your first Sanctum Dispatch will arrive when the next capital flow completes its healing journey.
        </p>
        <Badge variant="secondary" className="bg-atlas-gold/20 text-atlas-gold">
          ✨ Custodian Awakening
        </Badge>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Receive the Map's Heartbeat
        </h3>
        <p className="text-sm text-foreground/70">
          The Sanctum Dispatch: Where capital stories become healing wisdom
        </p>
      </div>

      <div className="space-y-3">
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-background/50 border-border"
          required
        />
        
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background/50 border-border"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 bg-background/50 border border-border rounded-md text-foreground"
          required
        >
          <option value="">Choose your path...</option>
          <option value="custodian">Ethical Capital Custodian</option>
          <option value="creator">Cultural Creator</option>
          <option value="regenerator">Planetary Regenerator</option>
          <option value="citizen">Citizen of Conscience</option>
        </select>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-atlas-cosmic hover:bg-atlas-cosmic/90 text-white"
      >
        {isSubmitting ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
            Connecting to the Map...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            Send Me the Dispatch
          </>
        )}
      </Button>

      <div className="text-xs text-foreground/50 text-center">
        Monthly wisdom • Impact stories • No spam, only meaning
      </div>
    </form>
  );
}

// Main Floating Banner Component
export default function FloatingBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [userRegion, setUserRegion] = useState('Global');

  const headlines = [
    "See where money breathes. Then help it heal.",
    "See where capital flows. See where meaning grows.",
    "Watch wealth become wisdom in real time.",
    "Every transaction tells a story of choice."
  ];

  // Show banner after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Rotate headlines
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [headlines.length]);

  // Auto-expand after showing newsletter prompt
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        if (!showNewsletter) {
          setShowNewsletter(true);
        }
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, showNewsletter]);

  // Detect user region (simplified)
  useEffect(() => {
    const detectRegion = () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone.includes('America')) setUserRegion('Americas');
      else if (timezone.includes('Europe')) setUserRegion('Europe');
      else if (timezone.includes('Asia')) setUserRegion('Asia');
      else if (timezone.includes('Africa')) setUserRegion('Africa');
    };
    detectRegion();
  }, []);

  if (!isVisible) return null;

  const handleExploreMap = () => {
    window.open('/sanctum-map', '_blank');
  };

  const handleJoinCustodians = () => {
    setShowNewsletter(true);
    setIsExpanded(true);
  };

  return (
    <>
      {/* Main Floating Banner */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        isExpanded ? 'w-96' : 'w-80'
      }`}>
        <Card className="bg-card/95 backdrop-blur-lg border-atlas-gold/30 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-background/50 flex items-center justify-center hover:bg-background/80 transition-colors"
            >
              <X className="w-3 h-3 text-foreground/60" />
            </button>

            {showNewsletter ? (
              <NewsletterForm onClose={() => setIsVisible(false)} />
            ) : (
              <>
                {/* 3D Globe Section */}
                <div 
                  className="relative h-32 bg-gradient-to-br from-atlas-deep to-atlas-cosmic/50 overflow-hidden cursor-pointer"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} intensity={0.8} />
                    <Suspense fallback={null}>
                      <AnimatedGlobe isHovered={isHovered} userRegion={userRegion} />
                    </Suspense>
                  </Canvas>

                  {/* Hover Info */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Globe className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-xs font-medium">{userRegion} Region</div>
                        <div className="text-xs opacity-80">Click to explore flows</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-3">
                  {/* Dynamic Headline */}
                  <h3 className="text-sm font-semibold text-foreground leading-tight transition-all duration-500">
                    {headlines[headlineIndex]}
                  </h3>

                  {/* Subtext */}
                  <p className="text-xs text-foreground/70 leading-relaxed">
                    Atlas Sanctum is a living map of conscience. Join to redirect wealth into dignity and regeneration.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleExploreMap}
                      variant="outline"
                      className="flex-1 text-xs border-atlas-wisdom text-atlas-wisdom hover:bg-atlas-wisdom/10"
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      Explore Map
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleJoinCustodians}
                      className="flex-1 text-xs bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-deep"
                    >
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Join Now
                    </Button>
                  </div>

                  {/* Live Stats */}
                  <div className="flex items-center justify-between text-xs text-foreground/60 pt-2 border-t border-border">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-atlas-regenerative rounded-full animate-pulse" />
                      <span>$1.3B healing flows</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>Live updates</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Newsletter Prompt Overlay */}
      {showNewsletter && !isExpanded && (
        <div className="fixed bottom-24 right-6 z-40">
          <div className="bg-atlas-cosmic text-white px-3 py-2 rounded-lg text-xs shadow-lg animate-pulse">
            Do you want to receive the Map's monthly heartbeat?
            <div className="absolute bottom-0 right-4 transform translate-y-1">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-atlas-cosmic" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
