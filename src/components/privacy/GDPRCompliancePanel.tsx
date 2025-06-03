
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { GDPRComplianceService, DataExportRequest } from '@/services/security/GDPRComplianceService';
import { useAuth } from '@/contexts/AuthContext';
import { Download, Trash2, Shield, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const GDPRCompliancePanel: React.FC = () => {
  const { user } = useAuth();
  const [exportRequests, setExportRequests] = useState<DataExportRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadExportRequests();
    }
  }, [user]);

  const loadExportRequests = async () => {
    if (!user) return;
    
    try {
      const requests = await GDPRComplianceService.getExportRequests(user.id);
      setExportRequests(requests);
    } catch (err) {
      setError('Failed to load export requests');
    }
  };

  const handleDataExport = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await GDPRComplianceService.requestDataExport(user.id);
      if (result.success) {
        toast.success('Data export request submitted successfully');
        await loadExportRequests();
      } else {
        toast.error(result.error || 'Failed to request data export');
      }
    } catch (err) {
      toast.error('An error occurred while requesting data export');
    } finally {
      setLoading(false);
    }
  };

  const handleDataDeletion = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to request account deletion? This action cannot be undone and will permanently delete all your data.'
    );
    
    if (!confirmed) return;
    
    setLoading(true);
    try {
      const result = await GDPRComplianceService.requestDataDeletion(user.id);
      if (result.success) {
        toast.success('Data deletion request submitted successfully');
        await loadExportRequests();
      } else {
        toast.error(result.error || 'Failed to request data deletion');
      }
    } catch (err) {
      toast.error('An error occurred while requesting data deletion');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock },
      processing: { variant: 'default' as const, icon: Clock },
      completed: { variant: 'secondary' as const, icon: CheckCircle },
      failed: { variant: 'destructive' as const, icon: AlertTriangle }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (!user) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Please log in to access privacy and data management options.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Privacy & Data Management</h2>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Your Data
            </CardTitle>
            <CardDescription>
              Download a copy of all your personal data stored in our system. This includes your profile, flashcards, study progress, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleDataExport} 
              disabled={loading}
              className="w-full"
            >
              Request Data Export
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Export files are available for 30 days and will be sent to your email address.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Your Account
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleDataDeletion} 
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              Request Account Deletion
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Your account will be scheduled for deletion after a 7-day grace period.
            </p>
          </CardContent>
        </Card>
      </div>

      {exportRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Privacy Requests</CardTitle>
            <CardDescription>
              Track the status of your data export and deletion requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exportRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {request.request_type === 'export' ? 'Data Export' : 'Account Deletion'}
                      </span>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Requested: {new Date(request.requested_at).toLocaleDateString()}
                    </p>
                    {request.completed_at && (
                      <p className="text-sm text-muted-foreground">
                        Completed: {new Date(request.completed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {request.file_url && request.status === 'completed' && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={request.file_url} download>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Privacy Rights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Right to Access:</strong> You can request a copy of your personal data at any time.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Right to Rectification:</strong> You can update your personal information in your profile settings.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Right to Erasure:</strong> You can request complete deletion of your account and data.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Right to Portability:</strong> You can export your data in a machine-readable format.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GDPRCompliancePanel;
