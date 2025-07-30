import { useUser, getPersonaConfig } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  Globe, 
  Book, 
  Coins, 
  Users, 
  Sparkles, 
  TrendingUp, 
  Heart,
  ArrowRight,
  Award,
  Target,
  BarChart3,
  Zap
} from "lucide-react";

// Workspace definitions
const workspaces = {
  'sanctum-map': {
    title: 'Sanctum Map',
    description: '3D interactive globe with real-time regenerative data',
    icon: Globe,
    path: '/sanctum-map',
    color: 'atlas-wisdom'
  },
  'library': {
    title: 'Library of Living Meaning',
    description: 'Curated wisdom texts and AI-powered narratives',
    icon: Book,
    path: '/library',
    color: 'atlas-cosmic'
  },
  'pain-transmutation': {
    title: 'Pain Transmutation Studio',
    description: 'Transform crisis into healing through AI alchemy',
    icon: Sparkles,
    path: '/pain-transmutation',
    color: 'atlas-regenerative'
  },
  'dignity-coin': {
    title: 'Dignity Coin Dashboard',
    description: 'Covenant-based investments and impact tracking',
    icon: Coins,
    path: '/dignity-coin',
    color: 'atlas-gold'
  },
  'fellowship': {
    title: 'Fellowship Hub',
    description: 'Connect with regenerative custodians worldwide',
    icon: Users,
    path: '/fellowship',
    color: 'atlas-cosmic'
  },
  'reports': {
    title: 'Impact Reports',
    description: 'Generate ethics-in-motion visualizations',
    icon: BarChart3,
    path: '/reports',
    color: 'atlas-wisdom'
  },
  'project-portal': {
    title: 'Project Portal',
    description: 'Submit and manage regenerative projects',
    icon: Target,
    path: '/project-portal',
    color: 'atlas-regenerative'
  },
  'micro-dashboard': {
    title: 'Micro Dashboard',
    description: 'Local impact and micro-staking interface',
    icon: Heart,
    path: '/micro-dashboard',
    color: 'atlas-gold'
  },
  'advocacy': {
    title: 'Advocacy Toolkit',
    description: 'Share narratives and amplify regenerative stories',
    icon: Zap,
    path: '/advocacy',
    color: 'atlas-cosmic'
  }
};

function PersonaStats() {
  const { state } = useUser();
  const config = getPersonaConfig(state.user.persona);

  const stats = [
    { label: 'Dignity Coins', value: state.user.dignityCoins.toLocaleString(), icon: Coins },
    { label: 'Impact Score', value: state.user.impactScore, icon: TrendingUp },
    { label: 'Level', value: state.user.level, icon: Award },
    { label: 'Active Projects', value: '3', icon: Target }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                config?.color === 'atlas-gold' ? 'bg-atlas-gold/20' :
                config?.color === 'atlas-cosmic' ? 'bg-atlas-cosmic/20' :
                config?.color === 'atlas-regenerative' ? 'bg-atlas-regenerative/20' :
                'bg-atlas-wisdom/20'
              }`}>
                <stat.icon className={`w-5 h-5 ${
                  config?.color === 'atlas-gold' ? 'text-atlas-gold' :
                  config?.color === 'atlas-cosmic' ? 'text-atlas-cosmic' :
                  config?.color === 'atlas-regenerative' ? 'text-atlas-regenerative' :
                  'text-atlas-wisdom'
                }`} />
              </div>
              <div>
                <p className="text-sm text-foreground/60">{stat.label}</p>
                <p className="text-lg font-semibold text-foreground">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function WorkspaceGrid() {
  const { state } = useUser();
  const config = getPersonaConfig(state.user.persona);
  
  if (!config) return null;

  const userWorkspaces = config.workspaces.map(id => ({
    id,
    ...workspaces[id as keyof typeof workspaces]
  })).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Your Workspaces</h2>
        <Badge variant="secondary" className="text-sm">
          {config.icon} {config.title}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userWorkspaces.map((workspace) => (
          <Card key={workspace.id} className="border-border hover:border-atlas-gold/50 transition-all duration-200 group cursor-pointer">
            <Link to={workspace.path}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                    workspace.color === 'atlas-gold' ? 'bg-atlas-gold/20' :
                    workspace.color === 'atlas-cosmic' ? 'bg-atlas-cosmic/20' :
                    workspace.color === 'atlas-regenerative' ? 'bg-atlas-regenerative/20' :
                    'bg-atlas-wisdom/20'
                  }`}>
                    <workspace.icon className={`w-6 h-6 ${
                      workspace.color === 'atlas-gold' ? 'text-atlas-gold' :
                      workspace.color === 'atlas-cosmic' ? 'text-atlas-cosmic' :
                      workspace.color === 'atlas-regenerative' ? 'text-atlas-regenerative' :
                      'text-atlas-wisdom'
                    }`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-foreground/40 group-hover:text-atlas-gold group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="text-lg group-hover:text-atlas-gold transition-colors">
                  {workspace.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {workspace.description}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    {
      type: 'transmutation',
      title: 'Created healing poetry',
      time: '2 hours ago',
      icon: Sparkles,
      color: 'atlas-cosmic'
    },
    {
      type: 'investment',
      title: 'Staked 100 Dignity Coins',
      time: '1 day ago',
      icon: Coins,
      color: 'atlas-gold'
    },
    {
      type: 'fellowship',
      title: 'Joined custodian session',
      time: '2 days ago',
      icon: Users,
      color: 'atlas-wisdom'
    }
  ];

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-atlas-regenerative" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
            <div className={`w-10 h-10 rounded-full bg-${activity.color}/20 flex items-center justify-center`}>
              <activity.icon className={`w-5 h-5 text-${activity.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium">{activity.title}</p>
              <p className="text-foreground/60 text-sm">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ImpactProgress() {
  const { state } = useUser();
  const config = getPersonaConfig(state.user.persona);
  
  const impactGoals = {
    custodian: { current: 750, target: 1000, label: 'Portfolio Regeneration Score' },
    creator: { current: 12, target: 20, label: 'Narratives Published' },
    regenerator: { current: 3, target: 5, label: 'Projects Funded' },
    citizen: { current: 150, target: 200, label: 'Micro-Impacts Created' }
  };

  const goal = state.user.persona ? impactGoals[state.user.persona] : impactGoals.citizen;
  const progress = (goal.current / goal.target) * 100;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-atlas-regenerative" />
          Impact Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-foreground font-medium">{goal.label}</span>
            <span className="text-foreground/70">{goal.current}/{goal.target}</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
        
        <div className="pt-4 border-t border-border">
          <h4 className="font-medium text-foreground mb-3">Next Milestones</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-atlas-gold rounded-full" />
              <span className="text-foreground/70">Complete onboarding tutorial</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-atlas-cosmic rounded-full" />
              <span className="text-foreground/70">Join fellowship discussion</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-atlas-regenerative rounded-full" />
              <span className="text-foreground/70">Create first transmutation</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { state } = useUser();

  if (!state.user.isConnected || !state.user.onboardingComplete) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-atlas-gold/20 flex items-center justify-center">
            <Globe className="w-8 h-8 text-atlas-gold" />
          </div>
          <h1 className="text-3xl font-bold">Complete Setup</h1>
          <p className="text-foreground/70">
            Please complete your onboarding to access your personalized dashboard
          </p>
          <Link to="/">
            <Button className="bg-atlas-gold hover:bg-atlas-gold/90 text-atlas-deep">
              Continue Setup
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const config = getPersonaConfig(state.user.persona);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-atlas-gold" />
            <span className="text-2xl font-bold text-foreground">Atlas Sanctum</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-foreground/60">Welcome back</p>
              <p className="font-semibold text-foreground">
                {config?.title}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-atlas-gold/20 flex items-center justify-center">
              <span className="text-lg">{config?.icon}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Your Regenerative Journey
          </h1>
          <p className="text-lg text-foreground/70">
            {config?.description}
          </p>
          
          {/* User Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {state.user.badges.map((badge) => (
              <Badge key={badge} variant="secondary">
                ✨ {badge}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats */}
        <PersonaStats />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Workspaces */}
          <div className="lg:col-span-2">
            <WorkspaceGrid />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ImpactProgress />
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}
