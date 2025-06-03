
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuditService, AuditLog } from '@/services/security/AuditService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Activity, Users, Database, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const SecurityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditSummary, setAuditSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        setLoading(true);
        const [logs, summary] = await Promise.all([
          AuditService.getAuditLogs({}, 50),
          AuditService.getAuditSummary()
        ]);
        setAuditLogs(logs);
        setAuditSummary(summary);
      } catch (err) {
        setError('Failed to load security data');
        console.error('Security dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadSecurityData();
    }
  }, [user]);

  const getOperationBadge = (operation: string) => {
    const variants = {
      INSERT: 'default',
      UPDATE: 'secondary',
      DELETE: 'destructive'
    } as const;
    return <Badge variant={variants[operation as keyof typeof variants] || 'outline'}>{operation}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Shield className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Loading security dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Security Dashboard</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditSummary?.totalEvents || 0}</div>
            <p className="text-xs text-muted-foreground">Audit events logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tables</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditSummary ? Object.keys(auditSummary.eventsByTable).length : 0}
            </div>
            <p className="text-xs text-muted-foreground">Tables being monitored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditSummary?.recentActivity?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Events in last 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit-logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="audit-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Events</CardTitle>
              <CardDescription>
                Real-time monitoring of database operations and user actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getOperationBadge(log.operation)}
                      <div>
                        <p className="font-medium">{log.table_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{log.user_id ? 'User Action' : 'System Action'}</p>
                      <p className="text-xs text-muted-foreground">{log.ip_address || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Events by Table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditSummary && Object.entries(auditSummary.eventsByTable).map(([table, count]) => (
                    <div key={table} className="flex justify-between items-center">
                      <span className="font-medium">{table}</span>
                      <Badge variant="outline">{String(count)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Events by Operation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditSummary && Object.entries(auditSummary.eventsByOperation).map(([operation, count]) => (
                    <div key={operation} className="flex justify-between items-center">
                      <span className="font-medium">{operation}</span>
                      <Badge variant="outline">{String(count)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>
                Current security policies and configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Rate Limiting</h4>
                  <p className="text-sm text-muted-foreground">
                    Active on authentication endpoints with configurable limits
                  </p>
                  <Badge className="mt-2" variant="secondary">Enabled</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Audit Logging</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive logging of all database operations
                  </p>
                  <Badge className="mt-2" variant="secondary">Enabled</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Data Retention</h4>
                  <p className="text-sm text-muted-foreground">
                    Automated cleanup of old audit logs and temporary data
                  </p>
                  <Badge className="mt-2" variant="secondary">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
