import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Server, 
  Database, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Globe,
  Shield,
  RefreshCw
} from 'lucide-react';

interface HealthCheck {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  responseTime: number;
  lastCheck: Date;
  uptime: number;
  errorRate: number;
  dependencies: string[];
}

interface SystemMetrics {
  cpu: { usage: number; cores: number; temperature?: number };
  memory: { used: number; total: number; available: number };
  disk: { used: number; total: number; available: number };
  network: { bytesIn: number; bytesOut: number; latency: number };
  requests: { total: number; success: number; errors: number; rps: number };
}

interface Alert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  component: string;
}

class HealthMonitor {
  private healthChecks: Map<string, HealthCheck> = new Map();
  private metrics: SystemMetrics = {
    cpu: { usage: 0, cores: 8 },
    memory: { used: 0, total: 16384, available: 16384 },
    disk: { used: 0, total: 512000, available: 512000 },
    network: { bytesIn: 0, bytesOut: 0, latency: 0 },
    requests: { total: 0, success: 0, errors: 0, rps: 0 }
  };
  private alerts: Alert[] = [];
  private subscribers: ((data: any) => void)[] = [];

  constructor() {
    this.initializeHealthChecks();
    this.startMonitoring();
  }

  private initializeHealthChecks() {
    const checks: Omit<HealthCheck, 'id'>[] = [
      {
        name: 'Web Frontend',
        status: 'healthy',
        responseTime: 150,
        lastCheck: new Date(),
        uptime: 99.95,
        errorRate: 0.01,
        dependencies: ['api-gateway', 'cdn']
      },
      {
        name: 'API Gateway',
        status: 'healthy',
        responseTime: 89,
        lastCheck: new Date(),
        uptime: 99.87,
        errorRate: 0.05,
        dependencies: ['database', 'auth-service']
      },
      {
        name: 'Database Cluster',
        status: 'healthy',
        responseTime: 25,
        lastCheck: new Date(),
        uptime: 99.99,
        errorRate: 0.001,
        dependencies: ['storage']
      },
      {
        name: 'AI Services',
        status: 'warning',
        responseTime: 2340,
        lastCheck: new Date(),
        uptime: 98.76,
        errorRate: 1.2,
        dependencies: ['gpu-cluster', 'model-storage']
      },
      {
        name: 'Blockchain Node',
        status: 'healthy',
        responseTime: 567,
        lastCheck: new Date(),
        uptime: 99.12,
        errorRate: 0.8,
        dependencies: ['network-peers']
      },
      {
        name: 'Analytics Engine',
        status: 'healthy',
        responseTime: 234,
        lastCheck: new Date(),
        uptime: 99.45,
        errorRate: 0.3,
        dependencies: ['data-pipeline', 'storage']
      }
    ];

    checks.forEach((check, index) => {
      this.healthChecks.set(`check-${index}`, { ...check, id: `check-${index}` });
    });
  }

  private startMonitoring() {
    // Simulate real-time monitoring
    setInterval(() => {
      this.updateMetrics();
      this.runHealthChecks();
      this.checkAlerts();
      this.notifySubscribers();
    }, 5000);

    // More frequent metrics update
    setInterval(() => {
      this.updateMetrics();
      this.notifySubscribers();
    }, 1000);
  }

  private updateMetrics() {
    // Simulate realistic metrics with some variance
    const now = Date.now();
    const variance = () => (Math.random() - 0.5) * 0.1;
    
    this.metrics = {
      cpu: {
        usage: Math.max(0, Math.min(100, 45 + variance() * 20)),
        cores: 8,
        temperature: 65 + variance() * 10
      },
      memory: {
        used: Math.max(0, 8192 + variance() * 2048),
        total: 16384,
        available: Math.max(0, 8192 - variance() * 2048)
      },
      disk: {
        used: Math.max(0, 256000 + variance() * 51200),
        total: 512000,
        available: Math.max(0, 256000 - variance() * 51200)
      },
      network: {
        bytesIn: Math.max(0, 1024 * 1024 + variance() * 512 * 1024),
        bytesOut: Math.max(0, 768 * 1024 + variance() * 384 * 1024),
        latency: Math.max(0, 50 + variance() * 20)
      },
      requests: {
        total: Math.floor(Math.random() * 1000000),
        success: Math.floor(Math.random() * 950000),
        errors: Math.floor(Math.random() * 50000),
        rps: Math.max(0, 150 + variance() * 50)
      }
    };
  }

  private runHealthChecks() {
    this.healthChecks.forEach((check) => {
      // Simulate health check variation
      const variance = Math.random();
      check.lastCheck = new Date();
      check.responseTime = Math.max(10, check.responseTime + (Math.random() - 0.5) * 100);
      
      if (variance < 0.05) {
        check.status = 'critical';
        check.errorRate = Math.min(10, check.errorRate + 1);
      } else if (variance < 0.15) {
        check.status = 'warning';
        check.errorRate = Math.max(0, check.errorRate + 0.1);
      } else {
        check.status = 'healthy';
        check.errorRate = Math.max(0, check.errorRate - 0.05);
      }
    });
  }

  private checkAlerts() {
    const now = new Date();
    
    // Check for critical metrics
    if (this.metrics.cpu.usage > 90) {
      this.addAlert('critical', 'High CPU usage detected', 'cpu');
    }
    
    if (this.metrics.memory.available / this.metrics.memory.total < 0.1) {
      this.addAlert('critical', 'Low memory available', 'memory');
    }
    
    if (this.metrics.disk.available / this.metrics.disk.total < 0.1) {
      this.addAlert('warning', 'Low disk space', 'disk');
    }
    
    // Check health check statuses
    this.healthChecks.forEach((check) => {
      if (check.status === 'critical') {
        this.addAlert('critical', `${check.name} is down`, check.id);
      } else if (check.status === 'warning') {
        this.addAlert('warning', `${check.name} performance degraded`, check.id);
      }
    });
    
    // Clean old alerts (keep last 50)
    this.alerts = this.alerts.slice(-50);
  }

  private addAlert(level: Alert['level'], message: string, component: string) {
    // Don't duplicate recent alerts
    const recentAlert = this.alerts.find(alert => 
      alert.message === message && 
      alert.component === component &&
      Date.now() - alert.timestamp.getTime() < 300000 // 5 minutes
    );
    
    if (!recentAlert) {
      this.alerts.push({
        id: crypto.randomUUID(),
        level,
        message,
        timestamp: new Date(),
        acknowledged: false,
        component
      });
    }
  }

  subscribe(callback: (data: any) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    const data = {
      healthChecks: Array.from(this.healthChecks.values()),
      metrics: this.metrics,
      alerts: this.alerts.filter(alert => !alert.acknowledged)
    };
    
    this.subscribers.forEach(callback => callback(data));
  }

  getHealthChecks() {
    return Array.from(this.healthChecks.values());
  }

  getMetrics() {
    return this.metrics;
  }

  getAlerts() {
    return this.alerts;
  }

  acknowledgeAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }
}

// Global monitor instance
const monitor = new HealthMonitor();

function SystemStatus({ healthChecks }: { healthChecks: HealthCheck[] }) {
  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-atlas-regenerative" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-foreground/40" />;
    }
  };

  const getStatusColor = (status: HealthCheck['status']) => {
    switch (status) {
      case 'healthy': return 'atlas-regenerative';
      case 'warning': return 'yellow-500';
      case 'critical': return 'destructive';
      default: return 'foreground/40';
    }
  };

  const overallStatus = healthChecks.every(check => check.status === 'healthy') 
    ? 'healthy' 
    : healthChecks.some(check => check.status === 'critical')
    ? 'critical'
    : 'warning';

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-atlas-gold" />
            Overall System Status
            <Badge variant={overallStatus === 'healthy' ? 'default' : 'destructive'}>
              {overallStatus.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthChecks.map((check) => (
              <div key={check.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{check.name}</h4>
                  {getStatusIcon(check.status)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Response Time</span>
                    <span className="text-foreground">{check.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Uptime</span>
                    <span className="text-foreground">{check.uptime}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Error Rate</span>
                    <span className="text-foreground">{check.errorRate}%</span>
                  </div>
                  <div className="mt-2">
                    <Progress 
                      value={check.uptime} 
                      className={`h-2 [&>div]:bg-${getStatusColor(check.status)}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SystemMetricsDisplay({ metrics }: { metrics: SystemMetrics }) {
  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-8 h-8 text-atlas-cosmic" />
              <div>
                <h3 className="font-semibold text-foreground">CPU</h3>
                <p className="text-sm text-foreground/60">{metrics.cpu.cores} cores</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-foreground/60">Usage</span>
                <span className="text-sm font-medium text-foreground">
                  {metrics.cpu.usage.toFixed(1)}%
                </span>
              </div>
              <Progress value={metrics.cpu.usage} className="h-2" />
              {metrics.cpu.temperature && (
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Temperature</span>
                  <span className="text-sm font-medium text-foreground">
                    {metrics.cpu.temperature.toFixed(1)}°C
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MemoryStick className="w-8 h-8 text-atlas-regenerative" />
              <div>
                <h3 className="font-semibold text-foreground">Memory</h3>
                <p className="text-sm text-foreground/60">{formatBytes(metrics.memory.total)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-foreground/60">Used</span>
                <span className="text-sm font-medium text-foreground">
                  {formatBytes(metrics.memory.used)}
                </span>
              </div>
              <Progress 
                value={(metrics.memory.used / metrics.memory.total) * 100} 
                className="h-2" 
              />
              <div className="flex justify-between">
                <span className="text-sm text-foreground/60">Available</span>
                <span className="text-sm font-medium text-foreground">
                  {formatBytes(metrics.memory.available)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <HardDrive className="w-8 h-8 text-atlas-wisdom" />
              <div>
                <h3 className="font-semibold text-foreground">Storage</h3>
                <p className="text-sm text-foreground/60">{formatBytes(metrics.disk.total)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-foreground/60">Used</span>
                <span className="text-sm font-medium text-foreground">
                  {formatBytes(metrics.disk.used)}
                </span>
              </div>
              <Progress 
                value={(metrics.disk.used / metrics.disk.total) * 100} 
                className="h-2" 
              />
              <div className="flex justify-between">
                <span className="text-sm text-foreground/60">Available</span>
                <span className="text-sm font-medium text-foreground">
                  {formatBytes(metrics.disk.available)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wifi className="w-8 h-8 text-atlas-gold" />
              <div>
                <h3 className="font-semibold text-foreground">Network</h3>
                <p className="text-sm text-foreground/60">{metrics.network.latency.toFixed(0)}ms</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-foreground/60">In</span>
                <span className="text-sm font-medium text-foreground">
                  {formatBytes(metrics.network.bytesIn)}/s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground/60">Out</span>
                <span className="text-sm font-medium text-foreground">
                  {formatBytes(metrics.network.bytesOut)}/s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground/60">RPS</span>
                <span className="text-sm font-medium text-foreground">
                  {metrics.requests.rps.toFixed(0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AlertsPanel({ alerts, onAcknowledge }: { 
  alerts: Alert[], 
  onAcknowledge: (alertId: string) => void 
}) {
  const getAlertIcon = (level: Alert['level']) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-atlas-cosmic" />;
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  return (
    <div className="space-y-4">
      {activeAlerts.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Active Alerts ({activeAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts.map((alert) => (
              <Alert key={alert.id} className="border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getAlertIcon(alert.level)}
                    <div>
                      <p className="font-medium text-foreground">{alert.message}</p>
                      <p className="text-sm text-foreground/60">
                        {alert.component} • {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onAcknowledge(alert.id)}
                  >
                    Acknowledge
                  </Button>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {acknowledgedAlerts.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-atlas-regenerative" />
              Recent Acknowledged Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {acknowledgedAlerts.slice(-5).map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                {getAlertIcon(alert.level)}
                <div className="flex-1">
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="text-xs text-foreground/60">
                    {alert.component} • {alert.timestamp.toLocaleString()}
                  </p>
                </div>
                <Badge variant="secondary">Acknowledged</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeAlerts.length === 0 && acknowledgedAlerts.length === 0 && (
        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-atlas-regenerative mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">All Systems Healthy</h3>
            <p className="text-foreground/60">No alerts or issues detected.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function SystemMonitoring() {
  const [data, setData] = useState<{
    healthChecks: HealthCheck[];
    metrics: SystemMetrics;
    alerts: Alert[];
  }>({
    healthChecks: monitor.getHealthChecks(),
    metrics: monitor.getMetrics(),
    alerts: monitor.getAlerts(),
  });

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    return monitor.subscribe(setData);
  }, []);

  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    monitor.acknowledgeAlert(alertId);
  }, []);

  const handleRefresh = () => {
    setData({
      healthChecks: monitor.getHealthChecks(),
      metrics: monitor.getMetrics(),
      alerts: monitor.getAlerts(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">System Monitoring</h2>
          <p className="text-foreground/70">Real-time system health and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={autoRefresh}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Badge variant={autoRefresh ? "default" : "secondary"}>
            Auto-refresh: {autoRefresh ? "ON" : "OFF"}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">System Status</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts 
            {data.alerts.filter(a => !a.acknowledged).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {data.alerts.filter(a => !a.acknowledged).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <SystemStatus healthChecks={data.healthChecks} />
        </TabsContent>

        <TabsContent value="metrics">
          <SystemMetricsDisplay metrics={data.metrics} />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsPanel alerts={data.alerts} onAcknowledge={handleAcknowledgeAlert} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { monitor as systemMonitor };
