import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  Heart, 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Quote,
  MapPin,
  Coins
} from 'lucide-react';

interface DispatchData {
  issue: number;
  date: string;
  invocation: string;
  mapSnapshot: {
    capitalRedirected: string;
    newCovenants: number;
    regionSpotlight: {
      name: string;
      story: string;
      impact: string;
    };
  };
  custodianStory: {
    name: string;
    role: string;
    transformation: string;
    quote: string;
    avatar: string;
  };
  wisdomArchive: {
    quote: string;
    author: string;
    connection: string;
  };
  actions: Array<{
    title: string;
    description: string;
    type: 'explore' | 'join' | 'fund';
    url: string;
  }>;
}

// Sample dispatch data
const sampleDispatch: DispatchData = {
  issue: 12,
  date: "December 2024",
  invocation: "This month, $1.3B moved from harm to healing. Two new regenerative covenants have been born. And we tell the story of a tree planted in Mali that began as a financial number.",
  mapSnapshot: {
    capitalRedirected: "$1.3B",
    newCovenants: 2,
    regionSpotlight: {
      name: "Mali, West Africa",
      story: "A reforestation covenant connected Swedish pension funds with Malian communities, transforming financial abstractions into living roots.",
      impact: "12,000 trees planted, 340 families supported"
    }
  },
  custodianStory: {
    name: "Sofia Chen",
    role: "Impact Portfolio Manager",
    transformation: "Redirected $50M from extractive mining to regenerative agriculture, creating a model for institutional investors seeking meaning beyond returns.",
    quote: "I realized my spreadsheets were actually prayers for the planet. Every cell could hold healing instead of harm.",
    avatar: "💫"
  },
  wisdomArchive: {
    quote: "The Earth does not belong to us; we belong to the Earth. All things are connected like the blood that unites one family.",
    author: "Chief Seattle",
    connection: "This wisdom guides our covenant capital principles - every investment is a relationship, not a transaction."
  },
  actions: [
    {
      title: "Explore Your Regional Map",
      description: "See how capital flows through your bioregion",
      type: "explore",
      url: "/sanctum-map"
    },
    {
      title: "Join the Fellowship",
      description: "Connect with other regenerative custodians",
      type: "join", 
      url: "/fellowship"
    },
    {
      title: "Fund a Covenant",
      description: "Support a verified regenerative project",
      type: "fund",
      url: "/dignity-coin"
    }
  ]
};

interface SanctumDispatchProps {
  data?: DispatchData;
  isPreview?: boolean;
}

export default function SanctumDispatch({ data = sampleDispatch, isPreview = false }: SanctumDispatchProps) {
  return (
    <div className="max-w-2xl mx-auto bg-background text-foreground">
      {/* Header */}
      <div className="text-center py-8 space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="w-8 h-8 text-atlas-gold" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">The Sanctum Dispatch</h1>
            <p className="text-sm text-foreground/60">Capital Becomes Conscience</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-sm text-foreground/70">
          <Badge variant="outline">Issue #{data.issue}</Badge>
          <span>{data.date}</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Opening Invocation */}
        <Card className="border-atlas-cosmic/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-atlas-cosmic/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-atlas-cosmic" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Opening Invocation</h2>
                <p className="text-foreground/80 leading-relaxed italic">
                  "{data.invocation}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Living Map Snapshot */}
        <Card className="border-atlas-wisdom/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-atlas-wisdom" />
              The Living Map Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-atlas-regenerative/10 rounded-lg">
                <div className="text-2xl font-bold text-atlas-regenerative">
                  {data.mapSnapshot.capitalRedirected}
                </div>
                <div className="text-sm text-foreground/70">Capital Redirected</div>
              </div>
              <div className="text-center p-4 bg-atlas-gold/10 rounded-lg">
                <div className="text-2xl font-bold text-atlas-gold">
                  {data.mapSnapshot.newCovenants}
                </div>
                <div className="text-sm text-foreground/70">New Covenants</div>
              </div>
            </div>

            <Separator />

            {/* Region Spotlight */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-atlas-wisdom" />
                Region Spotlight: {data.mapSnapshot.regionSpotlight.name}
              </h3>
              <p className="text-foreground/80 mb-2 leading-relaxed">
                {data.mapSnapshot.regionSpotlight.story}
              </p>
              <Badge variant="secondary" className="text-xs">
                Impact: {data.mapSnapshot.regionSpotlight.impact}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Custodian Story */}
        <Card className="border-atlas-gold/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-atlas-gold" />
              Custodian Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-atlas-gold/20 flex items-center justify-center text-2xl flex-shrink-0">
                {data.custodianStory.avatar}
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <h3 className="font-semibold text-foreground">{data.custodianStory.name}</h3>
                  <p className="text-sm text-foreground/70">{data.custodianStory.role}</p>
                </div>
                <p className="text-foreground/80 mb-4 leading-relaxed">
                  {data.custodianStory.transformation}
                </p>
                <blockquote className="border-l-4 border-atlas-gold pl-4 italic text-foreground/70">
                  <Quote className="w-4 h-4 inline mr-2" />
                  "{data.custodianStory.quote}"
                </blockquote>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wisdom Archive */}
        <Card className="border-atlas-cosmic/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-atlas-cosmic" />
              Wisdom Archive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-lg text-foreground/90 mb-4 italic leading-relaxed">
              "{data.wisdomArchive.quote}"
            </blockquote>
            <div className="text-right mb-4">
              <span className="text-atlas-cosmic font-medium">— {data.wisdomArchive.author}</span>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-foreground/70 leading-relaxed">
                <strong>Connection to Finance:</strong> {data.wisdomArchive.connection}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Participate Section */}
        <Card className="border-atlas-regenerative/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-atlas-regenerative" />
              Three Dignified Actions You Can Take Right Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.actions.map((action, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    action.type === 'explore' ? 'bg-atlas-wisdom/20' :
                    action.type === 'join' ? 'bg-atlas-cosmic/20' :
                    'bg-atlas-gold/20'
                  }`}>
                    {action.type === 'explore' ? <Globe className="w-5 h-5 text-atlas-wisdom" /> :
                     action.type === 'join' ? <Users className="w-5 h-5 text-atlas-cosmic" /> :
                     <Coins className="w-5 h-5 text-atlas-gold" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{action.title}</h3>
                    <p className="text-sm text-foreground/70">{action.description}</p>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={action.url} target="_blank" rel="noopener noreferrer">
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Closing */}
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-atlas-regenerative/20 flex items-center justify-center">
            <Heart className="w-8 h-8 text-atlas-regenerative" />
          </div>
          <p className="text-lg font-medium text-foreground italic">
            "Every month, the Map changes because someone cared. Will you?"
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-foreground/60">
            <span>Atlas Sanctum</span>
            <span>•</span>
            <span>Where Capital Becomes Conscience</span>
          </div>
        </div>

        {/* Preview Notice */}
        {isPreview && (
          <div className="bg-atlas-cosmic/10 border border-atlas-cosmic/30 rounded-lg p-4 text-center">
            <p className="text-atlas-cosmic font-medium mb-2">This is a preview of The Sanctum Dispatch</p>
            <p className="text-sm text-foreground/70">
              Subscribe to receive monthly wisdom, impact stories, and regenerative actions in your inbox
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Newsletter Preview Component for modal/page display
export function NewsletterPreview({ onSubscribe }: { onSubscribe?: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">The Sanctum Dispatch</h2>
        <p className="text-foreground/70">A monthly letter where capital stories become healing wisdom</p>
      </div>
      
      <SanctumDispatch isPreview={true} />
      
      {onSubscribe && (
        <div className="text-center pt-6">
          <Button onClick={onSubscribe} className="bg-atlas-cosmic hover:bg-atlas-cosmic/90 text-white">
            Subscribe to The Dispatch
          </Button>
        </div>
      )}
    </div>
  );
}
