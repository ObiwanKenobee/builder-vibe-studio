import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSecurity } from '@/contexts/SecurityContext';
import { 
  Shield, 
  Eye, 
  Download, 
  Trash2, 
  FileText, 
  Globe, 
  Lock,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';

interface DataCategory {
  id: string;
  name: string;
  description: string;
  purpose: string;
  retention: string;
  canOptOut: boolean;
  essential: boolean;
}

const DATA_CATEGORIES: DataCategory[] = [
  {
    id: 'authentication',
    name: 'Authentication Data',
    description: 'Email, password hash, login timestamps',
    purpose: 'Account security and access control',
    retention: '2 years after account deletion',
    canOptOut: false,
    essential: true,
  },
  {
    id: 'profile',
    name: 'Profile Information',
    description: 'Name, persona type, badges, preferences',
    purpose: 'Personalized experience and community features',
    retention: 'Until account deletion',
    canOptOut: true,
    essential: false,
  },
  {
    id: 'financial',
    name: 'Financial Data',
    description: 'Dignity Coin transactions, covenant investments',
    purpose: 'Financial services and impact tracking',
    retention: '7 years (regulatory requirement)',
    canOptOut: false,
    essential: true,
  },
  {
    id: 'analytics',
    name: 'Usage Analytics',
    description: 'Page views, feature usage, performance metrics',
    purpose: 'Platform improvement and optimization',
    retention: '2 years',
    canOptOut: true,
    essential: false,
  },
  {
    id: 'content',
    name: 'User-Generated Content',
    description: 'Poetry, narratives, comments, contributions',
    purpose: 'Community features and AI training',
    retention: 'Until deletion request',
    canOptOut: true,
    essential: false,
  },
  {
    id: 'communications',
    name: 'Communications',
    description: 'Email preferences, notifications, support messages',
    purpose: 'Service communications and support',
    retention: '3 years',
    canOptOut: true,
    essential: false,
  },
];

interface PrivacySettings {
  dataMinimization: boolean;
  analyticsOptOut: boolean;
  marketingOptOut: boolean;
  dataPortability: boolean;
  autoDelete: boolean;
  encryptionLevel: 'standard' | 'enhanced';
}

function ConsentManager() {
  const { state, dispatch } = useSecurity();
  const [settings, setSettings] = useState<PrivacySettings>({
    dataMinimization: true,
    analyticsOptOut: false,
    marketingOptOut: false,
    dataPortability: true,
    autoDelete: false,
    encryptionLevel: 'standard',
  });

  const [dataRequests, setDataRequests] = useState<Array<{
    id: string;
    type: 'export' | 'delete' | 'rectify';
    status: 'pending' | 'processing' | 'completed';
    requestDate: Date;
    completionDate?: Date;
  }>>([]);

  const handleConsentUpdate = (gdprConsent?: boolean, ccpaOptOut?: boolean) => {
    dispatch({ type: 'UPDATE_CONSENT', payload: { gdprConsent, ccpaOptOut } });
  };

  const requestDataExport = async () => {
    const requestId = crypto.randomUUID();
    const newRequest = {
      id: requestId,
      type: 'export' as const,
      status: 'pending' as const,
      requestDate: new Date(),
    };
    
    setDataRequests(prev => [...prev, newRequest]);
    
    // Simulate API call
    setTimeout(() => {
      setDataRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'completed', completionDate: new Date() }
          : req
      ));
    }, 3000);
  };

  const requestDataDeletion = async () => {
    const requestId = crypto.randomUUID();
    const newRequest = {
      id: requestId,
      type: 'delete' as const,
      status: 'pending' as const,
      requestDate: new Date(),
    };
    
    setDataRequests(prev => [...prev, newRequest]);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-atlas-regenerative" />
            Privacy Consent Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">GDPR Consent</p>
              <p className="text-sm text-foreground/60">
                Consent to process personal data under GDPR
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={state.user?.gdprConsent ? "default" : "destructive"}>
                {state.user?.gdprConsent ? "Granted" : "Not Granted"}
              </Badge>
              <Switch
                checked={state.user?.gdprConsent || false}
                onCheckedChange={(checked) => handleConsentUpdate(checked)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">CCPA Opt-Out</p>
              <p className="text-sm text-foreground/60">
                Opt-out of data sale under CCPA (California residents)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={state.user?.ccpaOptOut ? "default" : "secondary"}>
                {state.user?.ccpaOptOut ? "Opted Out" : "Not Opted Out"}
              </Badge>
              <Switch
                checked={state.user?.ccpaOptOut || false}
                onCheckedChange={(checked) => handleConsentUpdate(undefined, checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-atlas-cosmic" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-foreground/60">
                  {key === 'dataMinimization' && 'Collect only necessary data'}
                  {key === 'analyticsOptOut' && 'Disable usage analytics tracking'}
                  {key === 'marketingOptOut' && 'Disable marketing communications'}
                  {key === 'dataPortability' && 'Enable data export features'}
                  {key === 'autoDelete' && 'Automatically delete old data'}
                  {key === 'encryptionLevel' && 'Data encryption strength'}
                </p>
              </div>
              {typeof value === 'boolean' ? (
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, [key]: checked }))}
                />
              ) : (
                <Badge variant="outline">{value}</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-atlas-wisdom" />
            Data Rights & Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={requestDataExport}
            >
              <Download className="w-4 h-4" />
              Export My Data
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={requestDataDeletion}
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View Data Usage
            </Button>
          </div>

          {dataRequests.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Recent Requests</h4>
              {dataRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground capitalize">{request.type} Request</p>
                    <p className="text-sm text-foreground/60">
                      Requested: {request.requestDate.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={
                    request.status === 'completed' ? 'default' :
                    request.status === 'processing' ? 'secondary' : 'outline'
                  }>
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DataCatalog() {
  return (
    <div className="space-y-4">
      {DATA_CATEGORIES.map((category) => (
        <Card key={category.id} className="border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  {category.essential && (
                    <Badge variant="destructive">Essential</Badge>
                  )}
                  {category.canOptOut && (
                    <Badge variant="secondary">Optional</Badge>
                  )}
                </div>
                <p className="text-sm text-foreground/70">{category.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-foreground">Purpose: </span>
                    <span className="text-foreground/70">{category.purpose}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Retention: </span>
                    <span className="text-foreground/70">{category.retention}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {category.essential ? (
                  <Lock className="w-4 h-4 text-atlas-wisdom" />
                ) : (
                  <Switch defaultChecked={!category.canOptOut} disabled={!category.canOptOut} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ComplianceStatus() {
  const compliance = {
    gdpr: { status: 'compliant', score: 95, lastAudit: '2024-01-15' },
    ccpa: { status: 'compliant', score: 92, lastAudit: '2024-01-10' },
    sox: { status: 'partial', score: 78, lastAudit: '2024-01-05' },
    iso27001: { status: 'compliant', score: 88, lastAudit: '2024-01-20' },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(compliance).map(([standard, info]) => (
          <Card key={standard} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground uppercase">{standard}</h3>
                {info.status === 'compliant' ? (
                  <CheckCircle className="w-5 h-5 text-atlas-regenerative" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/60">Compliance Score</span>
                  <span className="font-medium text-foreground">{info.score}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/60">Last Audit</span>
                  <span className="text-sm text-foreground/70">{info.lastAudit}</span>
                </div>
                <Badge variant={info.status === 'compliant' ? 'default' : 'secondary'}>
                  {info.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-atlas-cosmic" />
            Regional Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { region: 'European Union', regulations: ['GDPR', 'DPA 2018'], status: 'Compliant' },
              { region: 'California, USA', regulations: ['CCPA', 'CPRA'], status: 'Compliant' },
              { region: 'Canada', regulations: ['PIPEDA'], status: 'Compliant' },
              { region: 'United Kingdom', regulations: ['UK GDPR', 'DPA 2018'], status: 'Compliant' },
            ].map((item) => (
              <div key={item.region} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{item.region}</p>
                  <p className="text-sm text-foreground/60">{item.regulations.join(', ')}</p>
                </div>
                <Badge variant="default">{item.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PrivacyCompliance() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Privacy Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-atlas-regenerative" />
            Privacy & Compliance Management
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="consent" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="consent">Consent</TabsTrigger>
            <TabsTrigger value="catalog">Data Catalog</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="consent">
            <ConsentManager />
          </TabsContent>

          <TabsContent value="catalog">
            <DataCatalog />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceStatus />
          </TabsContent>

          <TabsContent value="audit">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Privacy Audit Log</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/60">
                  Detailed audit logs will be implemented here showing all privacy-related actions,
                  data access, consent changes, and compliance events.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
