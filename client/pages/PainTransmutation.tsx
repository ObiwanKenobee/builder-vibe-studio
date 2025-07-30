import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser, getPersonaConfig } from "@/contexts/UserContext";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import {
  ArrowLeft,
  Sparkles,
  FileText,
  Music,
  Heart,
  Zap,
  Download,
  Share,
  Loader2,
  Volume2,
  Play,
  Pause
} from "lucide-react";

type TransmutationType = 'poem' | 'ritual' | 'music' | 'narrative';

interface TransmutationResult {
  type: TransmutationType;
  title: string;
  content: string;
  tags: string[];
  timestamp: Date;
}

const transmutationTypes = [
  {
    id: 'poem' as TransmutationType,
    title: 'Healing Poetry',
    description: 'Transform pain into verses of wisdom and beauty',
    icon: FileText,
    color: 'atlas-cosmic',
    example: 'Turn crisis into compassionate poetry'
  },
  {
    id: 'ritual' as TransmutationType,
    title: 'Sacred Ritual',
    description: 'Create ceremonial practices for transformation',
    icon: Heart,
    color: 'atlas-wisdom',
    example: 'Design a healing ritual for community'
  },
  {
    id: 'music' as TransmutationType,
    title: 'Regenerative Music',
    description: 'Convert emotional energy into harmonic healing',
    icon: Music,
    color: 'atlas-regenerative',
    example: 'Compose sounds for planetary restoration'
  },
  {
    id: 'narrative' as TransmutationType,
    title: 'Ethics-in-Motion',
    description: 'Weave crisis into stories of hope and action',
    icon: Zap,
    color: 'atlas-gold',
    example: 'Create a narrative of financial transformation'
  }
];

function TransmutationStudio() {
  const { state } = useUser();
  const [crisisText, setCrisisText] = useState('');
  const [selectedType, setSelectedType] = useState<TransmutationType>('poem');
  const [isTransmuting, setIsTransmuting] = useState(false);
  const [results, setResults] = useState<TransmutationResult[]>([]);
  const [activeResult, setActiveResult] = useState<TransmutationResult | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTransmute = async () => {
    if (!crisisText.trim()) return;

    setIsTransmuting(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockResults: Record<TransmutationType, TransmutationResult> = {
      poem: {
        type: 'poem',
        title: 'From Ashes, Wisdom',
        content: `In the depths where shadows dwell,
Where broken dreams and stories tell
Of systems built on greed and fear,
A new song whispers, crystal clear.

Capital flows like sacred streams,
No longer bound by selfish dreams,
But guided by the earth's own voice,
In regeneration, we rejoice.

From crisis blooms the lotus bright,
Transforming darkness into light,
Where wealth becomes a healing balm,
And finance finds its truest calm.`,
        tags: ['healing', 'transformation', 'regenerative-finance'],
        timestamp: new Date()
      },
      ritual: {
        type: 'ritual',
        title: 'Ritual of Financial Awakening',
        content: `**Preparation:**
Gather in a circle with four candles representing the elements.
Place a bowl of water in the center for purification.

**Opening (5 minutes):**
Light each candle while speaking:
"Earth, anchor our intentions in wisdom."
"Water, flow abundance to all beings."
"Fire, transform greed into generosity."
"Air, carry our vision to the world."

**Intention Setting (10 minutes):**
Each participant holds a coin and speaks their commitment to regenerative finance.
Drop the coins into the water, visualizing wealth serving life.

**Closing (5 minutes):**
Pour the water onto earth, returning abundance to its source.
"As we give, so we receive. As we heal, so we are healed."`,
        tags: ['ceremony', 'transformation', 'community'],
        timestamp: new Date()
      },
      music: {
        type: 'music',
        title: 'Harmonic Restoration Suite',
        content: `🎵 **Movement I: "Crisis Chord"** (2:30)
Dissonant tones representing financial chaos
Key: Atonal, gradually resolving to C minor
Instruments: Prepared piano, distorted strings

🎵 **Movement II: "The Awakening"** (4:15)
Transition from discord to harmony
Key: C minor to F major
Instruments: Flute, harp, gentle percussion

🎵 **Movement III: "Regenerative Dawn"** (3:45)
Celebration of new financial consciousness
Key: F major, bright and uplifting
Instruments: Full orchestra with nature sounds

**Healing Frequencies:**
- 528 Hz (Love & DNA repair)
- 432 Hz (Earth resonance)
- 396 Hz (Guilt & fear release)`,
        tags: ['healing-frequencies', 'composition', 'restoration'],
        timestamp: new Date()
      },
      narrative: {
        type: 'narrative',
        title: 'The Custodian\'s Transformation',
        content: `Maria had built an empire on extraction. Her hedge fund moved billions, but her dreams were haunted by the communities displaced by her investments. The climate reports grew darker each quarter, yet the profits soared higher.

Then came the Atlas Sanctum invitation—a simple message about capital becoming conscience. Skeptical but curious, she entered the digital realm where financial flows were mapped against planetary health. For the first time, she saw the true cost of her success.

The Sanctum Map revealed her portfolio's impact: deforestation in the Amazon linked to her agricultural futures, water scarcity connected to her mining investments. But it also showed something else—pathways to regeneration.

Within months, Maria had restructured her entire fund around regenerative principles. Her new investments in soil restoration, clean energy, and community resilience generated not just returns, but renewal. The communities she once displaced became her partners in planetary healing.

As she watched the Sanctum Map update with each regenerative decision, Maria understood: wealth wasn't about accumulation—it was about circulation. Like blood in a healthy body, money was meant to nourish, not stagnate.

Her transformation became a template others followed, proving that even the most hardened financial hearts could awaken to their role as planetary custodians.`,
        tags: ['transformation', 'finance', 'regeneration'],
        timestamp: new Date()
      }
    };

    const result = mockResults[selectedType];
    setResults(prev => [result, ...prev]);
    setActiveResult(result);
    setIsTransmuting(false);
    setCrisisText('');
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-atlas-cosmic/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-atlas-cosmic" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Pain Transmutation Studio</h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Transform crisis into healing through AI-powered alchemy. Submit your challenges and receive 
          poetry, rituals, music, and narratives for regenerative transformation.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-atlas-gold" />
              Crisis Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Describe your crisis, challenge, or pain
              </label>
              <Textarea
                value={crisisText}
                onChange={(e) => setCrisisText(e.target.value)}
                placeholder="Share what weighs on your heart... financial stress, environmental despair, social injustice, personal crisis..."
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Transmutation Type Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Choose your transmutation
              </label>
              <div className="grid grid-cols-2 gap-3">
                {transmutationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedType === type.id
                        ? (type.color === 'atlas-gold' ? 'border-atlas-gold bg-atlas-gold/5' :
                           type.color === 'atlas-cosmic' ? 'border-atlas-cosmic bg-atlas-cosmic/5' :
                           type.color === 'atlas-regenerative' ? 'border-atlas-regenerative bg-atlas-regenerative/5' :
                           'border-atlas-wisdom bg-atlas-wisdom/5')
                        : 'border-border hover:border-atlas-gold/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <type.icon className={`w-5 h-5 mt-1 ${
                        type.color === 'atlas-gold' ? 'text-atlas-gold' :
                        type.color === 'atlas-cosmic' ? 'text-atlas-cosmic' :
                        type.color === 'atlas-regenerative' ? 'text-atlas-regenerative' :
                        'text-atlas-wisdom'
                      }`} />
                      <div>
                        <h3 className="font-medium text-foreground">{type.title}</h3>
                        <p className="text-sm text-foreground/60 mt-1">{type.example}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleTransmute}
              disabled={!crisisText.trim() || isTransmuting}
              className="w-full bg-atlas-cosmic hover:bg-atlas-cosmic/90 text-white"
            >
              {isTransmuting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Transmuting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Begin Transmutation
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-atlas-regenerative" />
              Healing Transmutations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center py-12 text-foreground/60">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Your transmutations will appear here</p>
                <p className="text-sm mt-2">Share your crisis to begin the healing process</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveResult(result)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      activeResult === result
                        ? 'border-atlas-gold bg-atlas-gold/5'
                        : 'border-border hover:border-atlas-gold/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{result.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{result.type}</Badge>
                          <span className="text-xs text-foreground/60">
                            {result.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Share className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Result Display */}
      {activeResult && (
        <Card className="border-atlas-gold/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {transmutationTypes.find(t => t.id === activeResult.type)?.icon && (
                  <div className="w-6 h-6">
                    {(() => {
                      const IconComponent = transmutationTypes.find(t => t.id === activeResult.type)?.icon;
                      return IconComponent ? <IconComponent className="w-full h-full text-atlas-gold" /> : null;
                    })()}
                  </div>
                )}
                {activeResult.title}
              </CardTitle>
              <div className="flex gap-2">
                {activeResult.type === 'music' && (
                  <Button size="sm" variant="outline" onClick={toggleMusic}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                {activeResult.content}
              </pre>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {activeResult.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            {/* Hidden audio element for music playback */}
            {activeResult.type === 'music' && (
              <audio ref={audioRef} loop>
                <source src="/placeholder-music.mp3" type="audio/mpeg" />
              </audio>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function PainTransmutation() {
  const { state } = useUser();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Pain Transmutation Studio - Atlas Sanctum",
    "description": "AI-powered platform for transforming personal and collective crises into healing poetry, sacred rituals, and regenerative music.",
    "applicationCategory": "CreativeApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "AI crisis transformation",
      "Poetry generation from pain",
      "Sacred ritual creation",
      "Regenerative music composition",
      "Emotional healing algorithms"
    ],
    "creator": {
      "@type": "Organization",
      "name": "Atlas Sanctum"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Artists, Healers, Spiritual Practitioners, Community Workers"
    }
  };

  if (!state.user.isConnected) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <SEOHead
          title="Access Pain Transmutation Studio - AI Crisis to Healing Platform"
          description="Connect your wallet to access the revolutionary AI-powered Pain Transmutation Studio. Transform personal and collective crises into healing poetry, rituals, and music."
          keywords="pain transmutation studio access, AI crisis transformation, healing art platform, crisis to poetry AI, emotional healing tools"
          structuredData={structuredData}
        />
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-atlas-cosmic/20 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-atlas-cosmic" />
          </div>
          <h1 className="text-3xl font-bold">Connect to Access Studio</h1>
          <p className="text-foreground/70">
            Please connect your wallet to access the Pain Transmutation Studio
          </p>
          <Link to="/">
            <Button className="bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-deep">
              Connect Wallet
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Pain Transmutation Studio - AI Crisis to Healing Transformation | Atlas Sanctum"
        description="Transform personal and collective crises into healing poetry, sacred rituals, and regenerative music with our proprietary AI meaning-making algorithms. Turn pain into purpose."
        keywords="pain transmutation AI, crisis to art platform, healing poetry generator, sacred ritual creation, AI emotional transformation, regenerative music, meaning making algorithms, trauma to healing"
        persona={state.user.persona}
        structuredData={structuredData}
      />

      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-foreground/80 hover:text-atlas-gold transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Sanctum</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-atlas-cosmic" />
            <span className="text-xl font-semibold text-foreground">Pain Transmutation Studio</span>
          </div>

          <div className="flex items-center space-x-4">
            {state.user.persona && (
              <Badge variant="secondary">
                {getPersonaConfig(state.user.persona)?.icon} {getPersonaConfig(state.user.persona)?.title}
              </Badge>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        <TransmutationStudio />
      </main>
    </div>
  );
}
