import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import {
  Globe,
  Shield,
  Heart,
  Scale,
  Users,
  Leaf,
  Eye,
  Zap,
  BookOpen,
  TrendingUp,
  Crown,
  Bird,
  Plus,
  TreePine,
  Waves,
  Sun,
  Mountain,
  Star,
  Church,
  Compass,
  Lightbulb,
  Target,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

// Biblical Foundation Data
const biblicalPillars = [
  {
    id: "stewardship",
    title: "Stewardship Engine",
    subtitle: "Genesis 2:15 - 'Work it and take care of it'",
    icon: Leaf,
    color: "atlas-regenerative",
    description: "Capital flows prioritize healing nature and wildlife before profit. Every transaction has a stewardship index.",
    verse: "The Lord God took the man and put him in the Garden of Eden to work it and take care of it.",
    metrics: {
      stewardshipIndex: 87.3,
      natureHealingProjects: 156,
      carbonOffset: "2.4M tons",
      biodiversityImpact: 94.2
    },
    features: [
      "Real-time environmental impact scoring",
      "Automatic wildlife protection allocation",
      "Regenerative project priority routing",
      "Ecosystem restoration tracking"
    ]
  },
  {
    id: "truth",
    title: "Truth & Transparency Layer",
    subtitle: "John 8:32 - 'The truth will set you free'",
    icon: Eye,
    color: "atlas-wisdom",
    description: "All data on the map is transparent, immutable, and traceable. No hidden flows, no manipulation—truth as a foundational service.",
    verse: "Then you will know the truth, and the truth will set you free.",
    metrics: {
      transparencyScore: 99.8,
      immutableRecords: "847K",
      verifiedTransactions: 100,
      auditTrails: "Complete"
    },
    features: [
      "Blockchain-verified transaction records",
      "Real-time data validation",
      "Public audit capabilities",
      "Zero hidden flow tolerance"
    ]
  },
  {
    id: "justice",
    title: "Justice Gateway",
    subtitle: "Amos 5:24 - 'Let justice roll on like a river'",
    icon: Scale,
    color: "atlas-cosmic",
    description: "System continuously identifies where harm is occurring and redirects resources automatically towards repairing injustice.",
    verse: "But let justice roll on like a river, righteousness like a never-failing stream!",
    metrics: {
      justiceScore: 91.7,
      exploitationAlerts: 23,
      resourceRedirection: "€2.1M",
      injusticeRepaired: 78
    },
    features: [
      "Exploitation detection algorithms",
      "Automatic harm prevention",
      "Justice-based resource allocation",
      "Community protection protocols"
    ]
  },
  {
    id: "reconciliation",
    title: "Reconciliation Engine",
    subtitle: "2 Corinthians 5:18 - 'Ministry of reconciliation'",
    icon: Heart,
    color: "atlas-gold",
    description: "Converts conflict into covenant through AI storytelling, restorative economic covenants, and community rituals.",
    verse: "All this is from God, who reconciled us to himself through Christ and gave us the ministry of reconciliation.",
    metrics: {
      conflictsResolved: 342,
      covenantsCreated: 89,
      healingRituals: 567,
      communityBonds: 94.5
    },
    features: [
      "Conflict transformation algorithms",
      "Healing narrative generation",
      "Restorative covenant creation",
      "Community ritual facilitation"
    ]
  },
  {
    id: "creation",
    title: "Creation Choir",
    subtitle: "Psalm 19:1 - 'The heavens declare the glory of God'",
    icon: TreePine,
    color: "atlas-regenerative",
    description: "Wildlife and ecosystems have voice and representation. Nature becomes a stakeholder with agency, not a passive resource.",
    verse: "The heavens declare the glory of God; the skies proclaim the work of his hands.",
    metrics: {
      ecosystemVoices: 1247,
      speciesRepresented: 3456,
      habitatHealth: 89.3,
      creationTestimony: "Active"
    },
    features: [
      "IoT ecosystem monitoring",
      "Wildlife voice translation",
      "Habitat health scoring",
      "Species advocacy protocols"
    ]
  }
];

const architectureLayers = [
  {
    id: "spirit",
    title: "Spirit-led Intent",
    icon: Crown,
    description: "Purpose-based algorithms guided by biblical ethics: Mercy > Profit, Restoration > Extraction, Service > Domination",
    principles: ["Mercy over Profit", "Restoration over Extraction", "Service over Domination", "Love over Fear"],
    status: "Active",
    coverage: 100
  },
  {
    id: "fellowship",
    title: "Human Fellowship",
    icon: Users,
    description: "A global circle modeled after Acts 2: Shared resources, radical generosity, training in wisdom + tech + stewardship",
    principles: ["Shared Resources", "Radical Generosity", "Wisdom Training", "Collective Stewardship"],
    status: "Growing",
    coverage: 78
  },
  {
    id: "creation",
    title: "Creation Data Mesh",
    icon: Globe,
    description: "Wildlife, forests, oceans are sensed and heard: IoT + AI interprets these signals as non-human needs",
    principles: ["Ecosystem Monitoring", "Species Advocacy", "Habitat Protection", "Natural Voice"],
    status: "Expanding",
    coverage: 62
  },
  {
    id: "regenerative",
    title: "Regenerative Intelligence",
    icon: Lightbulb,
    description: "Artificial Regenerative Intelligence (ARI): Algorithms optimized for long-term flourishing, not just efficiency",
    principles: ["Long-term Thinking", "Holistic Optimization", "Life-Centered Design", "Ethical Learning"],
    status: "Evolving",
    coverage: 85
  }
];

function BiblicalPillarCard({ pillar }: { pillar: typeof biblicalPillars[0] }) {
  const IconComponent = pillar.icon;
  
  return (
    <Card className="border-border hover:border-atlas-gold/50 transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
            pillar.color === "atlas-gold" ? "bg-atlas-gold/20" :
            pillar.color === "atlas-cosmic" ? "bg-atlas-cosmic/20" :
            pillar.color === "atlas-regenerative" ? "bg-atlas-regenerative/20" :
            "bg-atlas-wisdom/20"
          }`}>
            <IconComponent className={`w-6 h-6 ${
              pillar.color === "atlas-gold" ? "text-atlas-gold" :
              pillar.color === "atlas-cosmic" ? "text-atlas-cosmic" :
              pillar.color === "atlas-regenerative" ? "text-atlas-regenerative" :
              "text-atlas-wisdom"
            }`} />
          </div>
          <Badge variant="secondary" className="text-xs">
            {pillar.id.toUpperCase()}
          </Badge>
        </div>
        <CardTitle className="text-xl group-hover:text-atlas-gold transition-colors">
          {pillar.title}
        </CardTitle>
        <p className="text-sm text-foreground/60 font-medium">
          {pillar.subtitle}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-foreground/80 leading-relaxed">
          {pillar.description}
        </p>
        
        <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-atlas-gold">
          <p className="text-sm italic text-foreground/90">
            "{pillar.verse}"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(pillar.metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className={`text-2xl font-bold ${
                pillar.color === "atlas-gold" ? "text-atlas-gold" :
                pillar.color === "atlas-cosmic" ? "text-atlas-cosmic" :
                pillar.color === "atlas-regenerative" ? "text-atlas-regenerative" :
                "text-atlas-wisdom"
              }`}>
                {value}
              </div>
              <div className="text-xs text-foreground/60 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Key Features:</h4>
          {pillar.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-foreground/70">
              <div className="w-1.5 h-1.5 bg-atlas-gold rounded-full" />
              {feature}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ArchitectureLayerCard({ layer }: { layer: typeof architectureLayers[0] }) {
  const IconComponent = layer.icon;
  
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-atlas-cosmic/20 flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-atlas-cosmic" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{layer.title}</CardTitle>
            <Badge variant={layer.status === "Active" ? "default" : "secondary"} className="text-xs">
              {layer.status}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-atlas-cosmic">{layer.coverage}%</div>
            <div className="text-xs text-foreground/60">Coverage</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground/80 text-sm leading-relaxed">
          {layer.description}
        </p>
        
        <div className="space-y-2">
          <Progress value={layer.coverage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {layer.principles.map((principle, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-foreground/70">
              <div className="w-1 h-1 bg-atlas-cosmic rounded-full" />
              {principle}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NewJerusalemVision() {
  return (
    <Card className="border-border bg-gradient-to-br from-atlas-gold/5 to-atlas-cosmic/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Church className="w-8 h-8 text-atlas-gold" />
          <div>
            <CardTitle className="text-2xl">The New Jerusalem Vision</CardTitle>
            <p className="text-foreground/70">Revelation 21 - Digital Rehearsal for Heaven's Economy</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-foreground/90 leading-relaxed">
          "On earth as it is in heaven." (Matthew 6:10) - Atlas Sanctum becomes a digital rehearsal 
          for heaven's economy: an economy of justice, mercy, and wisdom.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-atlas-wisdom" />
              <h4 className="font-semibold">Rivers of Living Water</h4>
            </div>
            <p className="text-sm text-foreground/70">
              Financial flows that heal ecosystems and restore creation's original design
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-atlas-regenerative" />
              <h4 className="font-semibold">Leaves for Healing</h4>
            </div>
            <p className="text-sm text-foreground/70">
              Cultural wisdom and indigenous narratives stored in the Library for the healing of nations
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-atlas-cosmic" />
              <h4 className="font-semibold">God Among People</h4>
            </div>
            <p className="text-sm text-foreground/70">
              Platform removes barriers, focuses on direct connection and restoration
            </p>
          </div>
        </div>

        <div className="p-4 bg-atlas-gold/10 rounded-lg border border-atlas-gold/20">
          <h4 className="font-semibold text-atlas-gold mb-2">Beyond Consciousness Implementation</h4>
          <p className="text-sm text-foreground/80">
            Instead of man-centered AI, our architecture recognizes God as the source of wisdom, 
            models systems after God's revealed purposes, and aligns innovation with reconciliation and restoration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function HolisticKPIs() {
  const kpis = [
    { name: "Shalom Index", value: 87.3, target: 95, icon: Bird },
    { name: "Justice Score", value: 91.7, target: 100, icon: Scale },
    { name: "Restoration Rate", value: 78.9, target: 90, icon: TreePine },
    { name: "Mercy Quotient", value: 94.2, target: 98, icon: Heart },
    { name: "Truth Transparency", value: 99.8, target: 100, icon: Eye },
    { name: "Creation Voice", value: 83.1, target: 95, icon: Mountain },
  ];

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-6 h-6 text-atlas-gold" />
          Holistic Kingdom KPIs
        </CardTitle>
        <p className="text-foreground/70">
          Metrics measuring justice, shalom (peace), and restoration, not just ROI
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.name} className="space-y-3">
              <div className="flex items-center gap-2">
                <kpi.icon className="w-4 h-4 text-atlas-cosmic" />
                <span className="text-sm font-medium">{kpi.name}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Current</span>
                  <span className="font-medium">{kpi.value}%</span>
                </div>
                <Progress value={kpi.value} className="h-2" />
                <div className="text-xs text-foreground/60">
                  Target: {kpi.target}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function BiblicalFoundations() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Biblical Foundations - Atlas Sanctum"
        description="Discover how Atlas Sanctum is built on biblical principles of stewardship, justice, truth, reconciliation, and creation care"
        keywords="biblical finance, kingdom economics, regenerative stewardship, biblical AI, creation care"
      />

      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Cross className="h-6 w-6 text-atlas-gold" />
            <span className="text-lg font-bold text-foreground">Biblical Foundations</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/analytics" className="text-foreground/70 hover:text-atlas-gold transition-colors">
              Analytics
            </Link>
            <Link to="/dashboard" className="text-foreground/70 hover:text-atlas-gold transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-atlas-gold/20 border border-atlas-gold/30 text-atlas-gold mb-4">
            <Crown className="w-4 h-4 mr-2" />
            God's Character as Architecture Blueprint
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-atlas-gold via-atlas-cosmic to-atlas-regenerative">
              Beyond Consciousness
            </span>
          </h1>
          <p className="text-xl text-foreground/80 max-w-4xl mx-auto leading-relaxed">
            Atlas Sanctum is built on the solid foundation of God's character, implementing biblical principles 
            of justice, mercy, truth, stewardship, and creation care in every algorithm and interface.
          </p>
        </div>

        {/* Core Biblical Pillars */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Five Biblical Pillars
            </h2>
            <p className="text-foreground/70 max-w-3xl mx-auto">
              Each pillar represents a core aspect of God's character implemented as functional system architecture
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {biblicalPillars.map((pillar) => (
              <BiblicalPillarCard key={pillar.id} pillar={pillar} />
            ))}
          </div>
        </section>

        {/* Architecture Layers */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Four Layers of Architecture
            </h2>
            <p className="text-foreground/70 max-w-3xl mx-auto">
              Systematic implementation from divine intent to practical regenerative intelligence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {architectureLayers.map((layer) => (
              <ArchitectureLayerCard key={layer.id} layer={layer} />
            ))}
          </div>
        </section>

        {/* New Jerusalem Vision */}
        <NewJerusalemVision />

        {/* Holistic KPIs */}
        <HolisticKPIs />

        {/* Call to Action */}
        <Card className="border-border bg-gradient-to-r from-atlas-cosmic/10 to-atlas-regenerative/10">
          <CardContent className="text-center p-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Join the Kingdom Economy Revolution
            </h3>
            <p className="text-foreground/80 mb-8 max-w-2xl mx-auto">
              Experience finance as God intended: just, merciful, truth-filled, and restorative. 
              Be part of building heaven's economy on earth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-deep">
                  Enter the Sanctum
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/fellowship">
                <Button size="lg" variant="outline" className="border-atlas-cosmic text-atlas-cosmic hover:bg-atlas-cosmic/10">
                  Join the Fellowship
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
