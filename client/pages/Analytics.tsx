import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import PrivacyCompliance from "@/components/PrivacyCompliance";
import SystemMonitoring from "@/components/SystemMonitoring";
import {
  Globe,
  Coins,
  TrendingUp,
  Users,
  BookOpen,
  Brain,
  Shield,
  DollarSign,
  BarChart3,
  Activity,
  Zap,
  Target,
  Heart,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Server,
  Database,
  Cpu,
  Network,
  Search,
  Share2,
  UserCheck,
  TrendingDown,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Settings,
} from "lucide-react";

const sidebarSections = [
  {
    title: "Capital & Impact",
    icon: TrendingUp,
    dashboards: [
      { id: "sanctum-map", name: "Sanctum Map Operations", icon: Globe },
      { id: "dignity-coin", name: "Dignity Coin & Covenant", icon: Coins },
      { id: "ethics-motion", name: "Ethics-in-Motion", icon: Heart },
    ],
  },
  {
    title: "Community & Engagement",
    icon: Users,
    dashboards: [
      { id: "fellowship", name: "Fellowship Engagement", icon: Users },
      { id: "cultural", name: "Cultural Contribution", icon: BookOpen },
      { id: "user-growth", name: "User Growth & Retention", icon: TrendingUp },
    ],
  },
  {
    title: "AI & Data Intelligence",
    icon: Brain,
    dashboards: [
      { id: "ai-narrative", name: "AI Narrative Engine", icon: Sparkles },
      { id: "data-quality", name: "Data Ingestion & Quality", icon: Database },
    ],
  },
  {
    title: "System Reliability",
    icon: Shield,
    dashboards: [
      { id: "performance", name: "Platform Performance", icon: Activity },
      { id: "security", name: "Security & Compliance", icon: Shield },
    ],
  },
  {
    title: "Business & Growth",
    icon: DollarSign,
    dashboards: [
      { id: "revenue", name: "Revenue & Client", icon: DollarSign },
      { id: "seo", name: "SEO/Acquisition", icon: Search },
    ],
  },
];

// Sample data generators
const generateMetrics = () => ({
  totalFlows: "€2.4B",
  harmVsRegeneration: 73,
  activeCovenants: 156,
  stakedCoins: "1.2M",
  activeCustodians: 3420,
  projectsInitiated: 89,
  narrativeGenerations: 12450,
  dataFreshness: 94,
  uptime: 99.8,
  securityEvents: 0,
  mrr: "€45.2K",
  organicTraffic: "+23%",
});

function DashboardSidebar({ activeDashboard, setActiveDashboard }: {
  activeDashboard: string;
  setActiveDashboard: (id: string) => void;
}) {
  return (
    <div className="w-64 bg-card border-r border-border h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center space-x-2">
          <Globe className="h-6 w-6 text-atlas-gold" />
          <span className="text-lg font-bold text-foreground">Analytics</span>
        </Link>
      </div>
      
      <nav className="p-4 space-y-6">
        {sidebarSections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 px-2 py-1 mb-2">
              <section.icon className="w-4 h-4 text-atlas-gold" />
              <span className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                {section.title}
              </span>
            </div>
            <div className="space-y-1">
              {section.dashboards.map((dashboard) => (
                <button
                  key={dashboard.id}
                  onClick={() => setActiveDashboard(dashboard.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeDashboard === dashboard.id
                      ? "bg-atlas-gold/20 text-atlas-gold"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <dashboard.icon className="w-4 h-4" />
                  <span className="text-sm">{dashboard.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

function MetricCard({ title, value, change, icon: Icon, color = "atlas-gold" }: {
  title: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  icon: any;
  color?: string;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground/60 mb-1">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 mt-1 text-sm ${
                change.positive ? "text-atlas-regenerative" : "text-destructive"
              }`}>
                {change.positive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {change.value}
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            color === "atlas-gold" ? "bg-atlas-gold/20" :
            color === "atlas-cosmic" ? "bg-atlas-cosmic/20" :
            color === "atlas-regenerative" ? "bg-atlas-regenerative/20" :
            "bg-atlas-wisdom/20"
          }`}>
            <Icon className={`w-6 h-6 ${
              color === "atlas-gold" ? "text-atlas-gold" :
              color === "atlas-cosmic" ? "text-atlas-cosmic" :
              color === "atlas-regenerative" ? "text-atlas-regenerative" :
              "text-atlas-wisdom"
            }`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SanctumMapDashboard() {
  const metrics = generateMetrics();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Sanctum Map Operations</h2>
          <p className="text-foreground/70">Global capital flows and regenerative data visualization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Capital Flows"
          value={metrics.totalFlows}
          change={{ value: "+12.3%", positive: true }}
          icon={Globe}
          color="atlas-wisdom"
        />
        <MetricCard
          title="Harm vs Regeneration Score"
          value={`${metrics.harmVsRegeneration}%`}
          change={{ value: "+5.2%", positive: true }}
          icon={Heart}
          color="atlas-regenerative"
        />
        <MetricCard
          title="Top Financial Entities"
          value="247"
          change={{ value: "+8.1%", positive: true }}
          icon={Building}
          color="atlas-cosmic"
        />
        <MetricCard
          title="Regional Coverage"
          value="94"
          change={{ value: "+2.3%", positive: true }}
          icon={Target}
          color="atlas-gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-atlas-gold" />
              Flow Distribution by Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { region: "North America", percentage: 34, amount: "€816M" },
                { region: "Europe", percentage: 28, amount: "€672M" },
                { region: "Asia Pacific", percentage: 22, amount: "€528M" },
                { region: "Latin America", percentage: 16, amount: "€384M" },
              ].map((item) => (
                <div key={item.region} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{item.region}</span>
                    <span className="text-sm font-medium text-foreground">{item.amount}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-atlas-regenerative" />
              Ethics Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-atlas-regenerative">73%</div>
                <div className="text-sm text-foreground/60">Current Ethics Score</div>
              </div>
              <div className="space-y-3">
                {[
                  { month: "Jan", score: 68 },
                  { month: "Feb", score: 71 },
                  { month: "Mar", score: 73 },
                ].map((item) => (
                  <div key={item.month} className="flex justify-between items-center">
                    <span className="text-sm text-foreground/70">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={item.score} className="w-20 h-2" />
                      <span className="text-sm font-medium text-foreground">{item.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DignityCoinDashboard() {
  const metrics = generateMetrics();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dignity Coin & Covenant Dashboard</h2>
          <p className="text-foreground/70">Token economics and covenant investment tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-deep">
            <Coins className="w-4 h-4 mr-2" />
            Stake Coins
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Covenants"
          value={metrics.activeCovenants}
          change={{ value: "+15", positive: true }}
          icon={CheckCircle}
          color="atlas-regenerative"
        />
        <MetricCard
          title="Total Staked Coins"
          value={metrics.stakedCoins}
          change={{ value: "+8.7%", positive: true }}
          icon={Coins}
          color="atlas-gold"
        />
        <MetricCard
          title="Impact Allocation"
          value="€892K"
          change={{ value: "+22.1%", positive: true }}
          icon={Target}
          color="atlas-cosmic"
        />
        <MetricCard
          title="Coin Value"
          value="€1.47"
          change={{ value: "+3.2%", positive: true }}
          icon={TrendingUp}
          color="atlas-wisdom"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-atlas-gold" />
              Covenant Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Ocean Regeneration Initiative", funded: "€125K", impact: 94, status: "Active" },
                { name: "Indigenous Land Protection", funded: "€89K", impact: 87, status: "Active" },
                { name: "Urban Food Forest Project", funded: "€67K", impact: 91, status: "Completed" },
                { name: "Renewable Energy Cooperative", funded: "€156K", impact: 89, status: "Active" },
              ].map((covenant) => (
                <div key={covenant.name} className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{covenant.name}</h4>
                    <Badge variant={covenant.status === "Active" ? "default" : "secondary"}>
                      {covenant.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-foreground/60">Funded: </span>
                      <span className="font-medium text-foreground">{covenant.funded}</span>
                    </div>
                    <div>
                      <span className="text-foreground/60">Impact Score: </span>
                      <span className="font-medium text-atlas-regenerative">{covenant.impact}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-atlas-cosmic" />
              Impact Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "Environmental", percentage: 45, color: "atlas-regenerative" },
                { category: "Social Justice", percentage: 30, color: "atlas-cosmic" },
                { category: "Economic Regeneration", percentage: 25, color: "atlas-gold" },
              ].map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{item.category}</span>
                    <span className="text-sm font-medium text-foreground">{item.percentage}%</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FellowshipDashboard() {
  const metrics = generateMetrics();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Fellowship Engagement Dashboard</h2>
          <p className="text-foreground/70">Monitor custodian growth and community participation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Custodians"
          value={metrics.activeCustodians}
          change={{ value: "+127", positive: true }}
          icon={Users}
          color="atlas-cosmic"
        />
        <MetricCard
          title="Projects Initiated"
          value={metrics.projectsInitiated}
          change={{ value: "+23", positive: true }}
          icon={Target}
          color="atlas-regenerative"
        />
        <MetricCard
          title="Weekly Engagement"
          value="2.4K"
          change={{ value: "+18.5%", positive: true }}
          icon={Activity}
          color="atlas-wisdom"
        />
        <MetricCard
          title="Badge Progressions"
          value="156"
          change={{ value: "+45", positive: true }}
          icon={Award}
          color="atlas-gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-atlas-cosmic" />
              Custodian Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { tier: "Guardian", count: 45, growth: "+12" },
                { tier: "Steward", count: 234, growth: "+34" },
                { tier: "Apprentice", count: 892, growth: "+67" },
                { tier: "Seeker", count: 2249, growth: "+124" },
              ].map((tier) => (
                <div key={tier.tier} className="flex justify-between items-center p-3 border border-border rounded-lg">
                  <div>
                    <span className="font-medium text-foreground">{tier.tier}</span>
                    <span className="text-sm text-atlas-regenerative ml-2">({tier.growth})</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{tier.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-atlas-wisdom" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { activity: "Ritual: Full Moon Ceremony", participants: 67, time: "2 hours ago" },
                { activity: "Workshop: Regenerative Finance 101", participants: 134, time: "1 day ago" },
                { activity: "Forum: Climate Action Strategies", participants: 89, time: "2 days ago" },
                { activity: "Project Review: Ocean Cleanup", participants: 23, time: "3 days ago" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-start p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.activity}</p>
                    <p className="text-foreground/60 text-xs">{item.participants} participants</p>
                  </div>
                  <span className="text-xs text-foreground/50">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EthicsMotionDashboard() {
  const metrics = generateMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Ethics-in-Motion Dashboard</h2>
          <p className="text-foreground/70">Track the evolving ethics score of capital and projects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Global Ethics Index"
          value="73.2"
          change={{ value: "+2.1", positive: true }}
          icon={Heart}
          color="atlas-regenerative"
        />
        <MetricCard
          title="Red-to-Green Ratio"
          value="68%"
          change={{ value: "+5.3%", positive: true }}
          icon={TrendingUp}
          color="atlas-wisdom"
        />
        <MetricCard
          title="Positive Redirections"
          value="234"
          change={{ value: "+45", positive: true }}
          icon={Target}
          color="atlas-cosmic"
        />
        <MetricCard
          title="Impact Score"
          value="8.4/10"
          change={{ value: "+0.7", positive: true }}
          icon={Sparkles}
          color="atlas-gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-atlas-regenerative" />
              Ethics Trend by Sector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { sector: "Financial Services", score: 6.8, trend: "+0.4" },
                { sector: "Technology", score: 7.2, trend: "+0.8" },
                { sector: "Energy", score: 5.9, trend: "+1.2" },
                { sector: "Healthcare", score: 8.1, trend: "+0.3" },
              ].map((item) => (
                <div key={item.sector} className="flex justify-between items-center p-3 border border-border rounded-lg">
                  <div>
                    <span className="font-medium text-foreground">{item.sector}</span>
                    <span className="text-sm text-atlas-regenerative ml-2">({item.trend})</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{item.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-atlas-cosmic" />
              Regional Ethics Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { region: "Nordic Countries", score: 8.9, color: "atlas-regenerative" },
                { region: "Western Europe", score: 7.6, color: "atlas-wisdom" },
                { region: "North America", score: 6.8, color: "atlas-cosmic" },
                { region: "Asia Pacific", score: 6.2, color: "atlas-gold" },
              ].map((item) => (
                <div key={item.region} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{item.region}</span>
                    <span className="text-sm font-medium text-foreground">{item.score}/10</span>
                  </div>
                  <Progress value={item.score * 10} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CulturalDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Cultural Contribution Dashboard</h2>
          <p className="text-foreground/70">Track content generated by artists and wisdom keepers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Contributions"
          value="1,847"
          change={{ value: "+156", positive: true }}
          icon={BookOpen}
          color="atlas-cosmic"
        />
        <MetricCard
          title="Engagement Rate"
          value="87.3%"
          change={{ value: "+4.2%", positive: true }}
          icon={Heart}
          color="atlas-regenerative"
        />
        <MetricCard
          title="Transmutation Sessions"
          value="423"
          change={{ value: "+67", positive: true }}
          icon={Sparkles}
          color="atlas-wisdom"
        />
        <MetricCard
          title="Story Integrations"
          value="234"
          change={{ value: "+34", positive: true }}
          icon={Share2}
          color="atlas-gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-atlas-cosmic" />
              Content Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Healing Poetry", count: 567, engagement: 89 },
                { type: "Ritual Scripts", count: 234, engagement: 92 },
                { type: "Wisdom Stories", count: 345, engagement: 85 },
                { type: "Art Pieces", count: 701, engagement: 94 },
              ].map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{item.type}</span>
                    <span className="text-sm font-medium text-foreground">{item.count} ({item.engagement}% eng.)</span>
                  </div>
                  <Progress value={item.engagement} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-atlas-wisdom" />
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Luna Healer", contributions: 89, type: "Poetry" },
                { name: "River Sage", contributions: 67, type: "Rituals" },
                { name: "Forest Keeper", contributions: 54, type: "Stories" },
                { name: "Star Weaver", contributions: 78, type: "Art" },
              ].map((contributor, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground text-sm">{contributor.name}</p>
                    <p className="text-foreground/60 text-xs">{contributor.type} • {contributor.contributions} pieces</p>
                  </div>
                  <Badge variant="secondary">{index + 1}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UserGrowthDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">User Growth & Retention Dashboard</h2>
          <p className="text-foreground/70">Measure adoption and user engagement patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Daily Active Users"
          value="4,672"
          change={{ value: "+234", positive: true }}
          icon={Users}
          color="atlas-cosmic"
        />
        <MetricCard
          title="Weekly Retention"
          value="78.9%"
          change={{ value: "+3.4%", positive: true }}
          icon={TrendingUp}
          color="atlas-regenerative"
        />
        <MetricCard
          title="Conversion Rate"
          value="12.4%"
          change={{ value: "+1.8%", positive: true }}
          icon={Target}
          color="atlas-wisdom"
        />
        <MetricCard
          title="Avg Session Time"
          value="14:32"
          change={{ value: "+2:15", positive: true }}
          icon={Clock}
          color="atlas-gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-atlas-cosmic" />
              User Acquisition Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: "Visitors", count: 24567, percentage: 100 },
                { stage: "Map Demo", count: 8934, percentage: 36 },
                { stage: "Sign-ups", count: 3456, percentage: 39 },
                { stage: "Fellowship Join", count: 1234, percentage: 36 },
              ].map((item) => (
                <div key={item.stage} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{item.stage}</span>
                    <span className="text-sm font-medium text-foreground">{item.count.toLocaleString()}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-atlas-wisdom" />
              Usage Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { device: "Desktop", percentage: 67, users: "3,129" },
                { device: "Mobile", percentage: 28, users: "1,308" },
                { device: "Tablet", percentage: 5, users: "235" },
              ].map((item) => (
                <div key={item.device} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{item.device}</span>
                    <span className="text-sm font-medium text-foreground">{item.users} users</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AINarrativeDashboard() {
  const metrics = generateMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">AI Narrative Engine Dashboard</h2>
          <p className="text-foreground/70">Monitor AI systems generating ethics, poetry, and meaning</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Narratives Generated"
          value={metrics.narrativeGenerations}
          change={{ value: "+1,234", positive: true }}
          icon={Sparkles}
          color="atlas-cosmic"
        />
        <MetricCard
          title="Average Latency"
          value="247ms"
          change={{ value: "-23ms", positive: true }}
          icon={Zap}
          color="atlas-wisdom"
        />
        <MetricCard
          title="Sentiment Score"
          value="8.7/10"
          change={{ value: "+0.3", positive: true }}
          icon={Heart}
          color="atlas-regenerative"
        />
        <MetricCard
          title="Human Feedback"
          value="94.2%"
          change={{ value: "+2.1%", positive: true }}
          icon={UserCheck}
          color="atlas-gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-atlas-cosmic" />
              Generation Pipeline Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: "Data Ingestion", status: "Active", throughput: "245/min" },
                { stage: "Sentiment Analysis", status: "Active", throughput: "189/min" },
                { stage: "Narrative Generation", status: "Active", throughput: "67/min" },
                { stage: "Quality Review", status: "Active", throughput: "34/min" },
              ].map((stage) => (
                <div key={stage.stage} className="flex justify-between items-center p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-atlas-regenerative rounded-full" />
                    <span className="font-medium text-foreground">{stage.stage}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{stage.throughput}</div>
                    <div className="text-xs text-atlas-regenerative">{stage.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-atlas-wisdom" />
              Content Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Poetry", count: 4567, percentage: 37 },
                { type: "Ethics Analysis", count: 3234, percentage: 26 },
                { type: "Healing Narratives", count: 2890, percentage: 23 },
                { type: "Impact Stories", count: 1759, percentage: 14 },
              ].map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{item.type}</span>
                    <span className="text-sm font-medium text-foreground">{item.count}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DataQualityDashboard() {
  const metrics = generateMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Data Ingestion & Quality Dashboard</h2>
          <p className="text-foreground/70">Ensure clean, up-to-date data streams for finance and ecology</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Data Sources"
          value="127"
          change={{ value: "+8", positive: true }}
          icon={Database}
          color="atlas-cosmic"
        />
        <MetricCard
          title="Data Freshness"
          value={`${metrics.dataFreshness}%`}
          change={{ value: "+2.1%", positive: true }}
          icon={RefreshCw}
          color="atlas-regenerative"
        />
        <MetricCard
          title="Error Rate"
          value="0.3%"
          change={{ value: "-0.2%", positive: true }}
          icon={AlertTriangle}
          color="atlas-wisdom"
        />
        <MetricCard
          title="Processing Volume"
          value="2.4M"
          change={{ value: "+340K", positive: true }}
          icon={Activity}
          color="atlas-gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-atlas-cosmic" />
              Data Source Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: "Financial APIs", status: "Healthy", freshness: 98 },
                { source: "ESG Datasets", status: "Healthy", freshness: 94 },
                { source: "Impact Metrics", status: "Warning", freshness: 89 },
                { source: "Blockchain Data", status: "Healthy", freshness: 99 },
              ].map((source) => (
                <div key={source.source} className="flex justify-between items-center p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      source.status === 'Healthy' ? 'bg-atlas-regenerative' : 'bg-yellow-500'
                    }`} />
                    <span className="font-medium text-foreground">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{source.freshness}%</div>
                    <div className={`text-xs ${
                      source.status === 'Healthy' ? 'text-atlas-regenerative' : 'text-yellow-500'
                    }`}>{source.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-atlas-wisdom" />
              Data Quality Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: "Completeness", score: 96, target: 95 },
                { metric: "Accuracy", score: 94, target: 98 },
                { metric: "Consistency", score: 91, target: 90 },
                { metric: "Timeliness", score: 98, target: 95 },
              ].map((item) => (
                <div key={item.metric} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{item.metric}</span>
                    <span className={`text-sm font-medium ${
                      item.score >= item.target ? 'text-atlas-regenerative' : 'text-yellow-500'
                    }`}>{item.score}% (target: {item.target}%)</span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PerformanceDashboard() {
  const metrics = generateMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Platform Performance Dashboard</h2>
          <p className="text-foreground/70">Track uptime, latency, and system performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="System Uptime"
          value={`${metrics.uptime}%`}
          change={{ value: "+0.1%", positive: true }}
          icon={Server}
          color="atlas-regenerative"
        />
        <MetricCard
          title="Avg Response Time"
          value="123ms"
          change={{ value: "-45ms", positive: true }}
          icon={Zap}
          color="atlas-wisdom"
        />
        <MetricCard
          title="Active Connections"
          value="2,847"
          change={{ value: "+234", positive: true }}
          icon={Network}
          color="atlas-cosmic"
        />
        <MetricCard
          title="Error Rate"
          value="0.02%"
          change={{ value: "-0.01%", positive: true }}
          icon={AlertTriangle}
          color="atlas-gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-atlas-regenerative" />
              System Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { resource: "CPU Usage", value: 34, unit: "%" },
                { resource: "Memory Usage", value: 67, unit: "%" },
                { resource: "Disk Usage", value: 23, unit: "%" },
                { resource: "Network I/O", value: 45, unit: "%" },
              ].map((item) => (
                <div key={item.resource} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{item.resource}</span>
                    <span className="text-sm font-medium text-foreground">{item.value}{item.unit}</span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-atlas-wisdom" />
              Service Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { service: "Web Frontend", status: "Healthy", uptime: "99.9%" },
                { service: "API Gateway", status: "Healthy", uptime: "99.8%" },
                { service: "Database", status: "Healthy", uptime: "100%" },
                { service: "AI Services", status: "Healthy", uptime: "99.7%" },
              ].map((service) => (
                <div key={service.service} className="flex justify-between items-center p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-atlas-regenerative rounded-full" />
                    <span className="font-medium text-foreground">{service.service}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{service.uptime}</div>
                    <div className="text-xs text-atlas-regenerative">{service.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-atlas-cosmic" />
              Request Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-atlas-cosmic">847K</div>
                <div className="text-sm text-foreground/60">Requests Today</div>
              </div>
              <div className="space-y-3">
                {[
                  { hour: "12:00", requests: 89 },
                  { hour: "13:00", requests: 97 },
                  { hour: "14:00", requests: 112 },
                  { hour: "15:00", requests: 134 },
                ].map((item) => (
                  <div key={item.hour} className="flex justify-between items-center">
                    <span className="text-sm text-foreground/70">{item.hour}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={item.requests / 2} className="w-20 h-2" />
                      <span className="text-sm font-medium text-foreground">{item.requests}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SecurityDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Security & Compliance Dashboard</h2>
          <p className="text-foreground/70">Monitor security events and compliance in multi-user environment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Security Events"
          value="0"
          change={{ value: "No incidents", positive: true }}
          icon={Shield}
          color="atlas-regenerative"
        />
        <MetricCard
          title="Failed Logins"
          value="23"
          change={{ value: "-12", positive: true }}
          icon={AlertTriangle}
          color="atlas-wisdom"
        />
        <MetricCard
          title="Compliance Score"
          value="98.7%"
          change={{ value: "+1.2%", positive: true }}
          icon={CheckCircle}
          color="atlas-cosmic"
        />
        <MetricCard
          title="Transaction Integrity"
          value="100%"
          change={{ value: "Perfect", positive: true }}
          icon={Lock}
          color="atlas-gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-atlas-regenerative" />
              Authentication Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Successful Logins", count: 4672, percentage: 97.3 },
                { type: "Failed Attempts", count: 23, percentage: 0.5 },
                { type: "2FA Enabled", count: 4234, percentage: 88.2 },
                { type: "Password Resets", count: 89, percentage: 1.9 },
              ].map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{item.type}</span>
                    <span className="text-sm font-medium text-foreground">{item.count} ({item.percentage}%)</span>
                  </div>
                  <Progress value={item.percentage > 10 ? item.percentage : 10} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-atlas-cosmic" />
              Recent Security Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { event: "Security scan completed", severity: "Info", time: "5 min ago" },
                { event: "Password policy updated", severity: "Info", time: "2 hours ago" },
                { event: "Unusual login pattern detected", severity: "Low", time: "1 day ago" },
                { event: "Compliance audit passed", severity: "Info", time: "2 days ago" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-start p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.event}</p>
                    <p className="text-foreground/60 text-xs">{item.time}</p>
                  </div>
                  <Badge variant={item.severity === "Info" ? "secondary" : "outline"}>
                    {item.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RevenueDashboard() {
  const metrics = generateMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Revenue & Client Dashboard</h2>
          <p className="text-foreground/70">Track SaaS subscription revenue and client partnerships</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Monthly Recurring Revenue"
          value={metrics.mrr}
          change={{ value: "+€8.3K", positive: true }}
          icon={DollarSign}
          color="atlas-gold"
        />
        <MetricCard
          title="Customer LTV"
          value="€12,450"
          change={{ value: "+€1,230", positive: true }}
          icon={TrendingUp}
          color="atlas-regenerative"
        />
        <MetricCard
          title="Churn Rate"
          value="2.1%"
          change={{ value: "-0.8%", positive: true }}
          icon={TrendingDown}
          color="atlas-wisdom"
        />
        <MetricCard
          title="Active Clients"
          value="89"
          change={{ value: "+12", positive: true }}
          icon={Users}
          color="atlas-cosmic"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-atlas-gold" />
              Revenue by Segment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { segment: "Custodian Pro", revenue: "€18.2K", percentage: 40 },
                { segment: "Creator Studio", revenue: "€13.6K", percentage: 30 },
                { segment: "NGO Partnership", revenue: "€9.1K", percentage: 20 },
                { segment: "Enterprise", revenue: "€4.5K", percentage: 10 },
              ].map((item) => (
                <div key={item.segment} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{item.segment}</span>
                    <span className="text-sm font-medium text-foreground">{item.revenue}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-atlas-regenerative" />
              Growth Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: "Monthly Growth Rate", value: "+18.4%", trend: "Positive" },
                { metric: "Customer Acquisition Cost", value: "€234", trend: "Decreasing" },
                { metric: "Avg Deal Size", value: "€567", trend: "Increasing" },
                { metric: "Time to Value", value: "12 days", trend: "Decreasing" },
              ].map((item) => (
                <div key={item.metric} className="flex justify-between items-center p-3 border border-border rounded-lg">
                  <span className="font-medium text-foreground text-sm">{item.metric}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.value}</div>
                    <div className="text-xs text-atlas-regenerative">{item.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SEODashboard() {
  const metrics = generateMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">SEO/Acquisition Dashboard</h2>
          <p className="text-foreground/70">Manage growth metrics for inbound traffic and conversions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Organic Traffic"
          value={metrics.organicTraffic}
          change={{ value: "+23%", positive: true }}
          icon={Search}
          color="atlas-cosmic"
        />
        <MetricCard
          title="Newsletter Signups"
          value="2,847"
          change={{ value: "+456", positive: true }}
          icon={Users}
          color="atlas-regenerative"
        />
        <MetricCard
          title="Bounce Rate"
          value="24.3%"
          change={{ value: "-5.2%", positive: true }}
          icon={TrendingDown}
          color="atlas-wisdom"
        />
        <MetricCard
          title="Avg Session Duration"
          value="4:32"
          change={{ value: "+1:15", positive: true }}
          icon={Clock}
          color="atlas-gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-atlas-cosmic" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: "Organic Search", visitors: 8934, percentage: 45 },
                { source: "Direct", visitors: 5623, percentage: 28 },
                { source: "Social Media", visitors: 3456, percentage: 17 },
                { source: "Referrals", visitors: 1987, percentage: 10 },
              ].map((item) => (
                <div key={item.source} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{item.source}</span>
                    <span className="text-sm font-medium text-foreground">{item.visitors.toLocaleString()}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-atlas-regenerative" />
              Engagement by Persona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { persona: "Custodians", engagement: 87, conversions: 156 },
                { persona: "Creators", engagement: 92, conversions: 89 },
                { persona: "Regenerators", engagement: 76, conversions: 67 },
                { persona: "Citizens", engagement: 84, conversions: 234 },
              ].map((item) => (
                <div key={item.persona} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{item.persona}</span>
                    <span className="text-sm font-medium text-foreground">{item.conversions} conversions</span>
                  </div>
                  <Progress value={item.engagement} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Default dashboard content
function DefaultDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Analytics Overview</h2>
        <p className="text-foreground/70">Select a dashboard from the sidebar to view detailed metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sidebarSections.map((section) => (
          <Card key={section.title} className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="w-5 h-5 text-atlas-gold" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.dashboards.map((dashboard) => (
                  <div key={dashboard.id} className="flex items-center gap-2 text-sm text-foreground/70">
                    <dashboard.icon className="w-4 h-4" />
                    {dashboard.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [activeDashboard, setActiveDashboard] = useState("overview");

  const renderDashboard = () => {
    switch (activeDashboard) {
      case "sanctum-map":
        return <SanctumMapDashboard />;
      case "dignity-coin":
        return <DignityCoinDashboard />;
      case "ethics-motion":
        return <EthicsMotionDashboard />;
      case "fellowship":
        return <FellowshipDashboard />;
      case "cultural":
        return <CulturalDashboard />;
      case "user-growth":
        return <UserGrowthDashboard />;
      case "ai-narrative":
        return <AINarrativeDashboard />;
      case "data-quality":
        return <DataQualityDashboard />;
      case "performance":
        return <PerformanceDashboard />;
      case "security":
        return <SecurityDashboard />;
      case "revenue":
        return <RevenueDashboard />;
      case "seo":
        return <SEODashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Analytics Dashboard - Atlas Sanctum"
        description="Comprehensive analytics and monitoring for regenerative finance operations, community engagement, and system performance"
        keywords="regenerative finance analytics, impact dashboard, community metrics, AI monitoring, system performance"
      />

      <div className="flex">
        <DashboardSidebar 
          activeDashboard={activeDashboard} 
          setActiveDashboard={setActiveDashboard} 
        />
        
        <main className="flex-1 p-8">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
}

// Missing imports
import { Building, Award, Lock } from "lucide-react";
