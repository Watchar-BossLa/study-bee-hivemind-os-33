
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecurityDashboard from '@/components/admin/SecurityDashboard';
import GDPRCompliancePanel from '@/components/privacy/GDPRCompliancePanel';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

const SecuritySettings: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please log in to access security settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Security Settings - Study Bee</title>
        <meta name="description" content="Manage your security and privacy settings" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Security & Privacy</h1>
        </div>

        <Tabs defaultValue="privacy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="privacy">Privacy & Data</TabsTrigger>
            <TabsTrigger value="security">Security Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="privacy">
            <GDPRCompliancePanel />
          </TabsContent>

          <TabsContent value="security">
            <SecurityDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SecuritySettings;
