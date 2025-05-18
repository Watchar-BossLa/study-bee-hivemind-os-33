
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { Clock, MessageSquare, Users, Pencil, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSessionAnalytics, SessionAnalytics as SessionAnalyticsType } from '@/hooks/useSessionAnalytics';

interface SessionAnalyticsProps {
  sessionId: string;
}

export const SessionAnalytics: React.FC<SessionAnalyticsProps> = ({ sessionId }) => {
  const { analytics, isLoading, error } = useSessionAnalytics(sessionId);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
          <p className="text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }
  
  if (error || !analytics) {
    return (
      <div className="rounded-md bg-destructive/10 p-6 text-center">
        <p className="font-medium text-destructive">Failed to load analytics</p>
        <p className="mt-2 text-sm text-muted-foreground">Please try refreshing the page</p>
      </div>
    );
  }

  // Prepare activity data for charts
  const activityChartData = analytics.participantActivities.map(p => ({
    name: p.userName.split(' ')[0], // Just first name for brevity
    messages: p.messageCount,
    whiteboard: p.whiteBoardEdits,
    role: p.isActive ? 'Active' : 'Inactive',
    total: p.messageCount + p.whiteBoardEdits
  }));
  
  // Sort by total activity
  activityChartData.sort((a, b) => b.total - a.total);
  
  // Prepare engagement metrics
  const totalActivities = analytics.totalMessages + analytics.totalWhiteboardEdits;
  const messagesPercentage = analytics.totalMessages > 0 
    ? Math.round((analytics.totalMessages / totalActivities) * 100) 
    : 0;
  const whiteboardPercentage = analytics.totalWhiteboardEdits > 0 
    ? Math.round((analytics.totalWhiteboardEdits / totalActivities) * 100) 
    : 0;

  // Calculate overall session duration
  const sessionStartDate = new Date(analytics.startTime);
  const sessionDuration = formatDistanceToNow(sessionStartDate, { addSuffix: false });
  
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="participants">Participants</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeParticipants} / {analytics.totalParticipants}</div>
              <p className="text-xs text-muted-foreground">active members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalMessages}</div>
              <p className="text-xs text-muted-foreground">total messages</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Whiteboard</CardTitle>
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalWhiteboardEdits}</div>
              <p className="text-xs text-muted-foreground">drawing elements</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageSessionTime} min</div>
              <p className="text-xs text-muted-foreground">per participant</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Session Engagement</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={activityChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <p className="font-bold">{label}</p>
                          <p className="text-sm text-blue-500">
                            Messages: {payload[0].value}
                          </p>
                          <p className="text-sm text-green-500">
                            Whiteboard: {payload[1].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="messages" name="Messages" stackId="a" fill="#3b82f6" />
                <Bar dataKey="whiteboard" name="Whiteboard" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="participants" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Participant Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {analytics.participantActivities.map((participant) => (
                  <div key={participant.userId} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {participant.userName.charAt(0)}
                          </div>
                          {participant.isActive && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{participant.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {participant.isActive
                              ? `Joined ${formatDistanceToNow(new Date(participant.joinedAt), { addSuffix: true })}`
                              : `Left ${formatDistanceToNow(new Date(participant.leftAt || participant.joinedAt), { addSuffix: true })}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant={participant.isActive ? "default" : "outline"}>
                        {participant.isActive ? "Online" : "Offline"}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">Messages</p>
                          <span className="text-sm text-muted-foreground">{participant.messageCount}</span>
                        </div>
                        <Progress value={participant.messageCount > 0 
                          ? Math.min(100, (participant.messageCount / Math.max(...analytics.participantActivities.map(p => p.messageCount))) * 100) 
                          : 0} 
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">Whiteboard</p>
                          <span className="text-sm text-muted-foreground">{participant.whiteBoardEdits}</span>
                        </div>
                        <Progress value={participant.whiteBoardEdits > 0 
                          ? Math.min(100, (participant.whiteBoardEdits / Math.max(...analytics.participantActivities.map(p => p.whiteBoardEdits))) * 100) 
                          : 0} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="activity" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Messages</p>
                  <p className="text-lg font-bold">{messagesPercentage}%</p>
                </div>
              </div>
              <Progress value={messagesPercentage} className="h-2" />
            </div>
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Pencil className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Whiteboard</p>
                  <p className="text-lg font-bold">{whiteboardPercentage}%</p>
                </div>
              </div>
              <Progress value={whiteboardPercentage} className="h-2" />
            </div>
            
            <div className="md:col-span-2">
              <Card className="mt-4">
                <CardHeader className="border-b">
                  <CardTitle className="text-sm font-medium">Top Contributors</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-3 divide-x text-center">
                    {[...activityChartData]
                      .sort((a, b) => b.messages - a.messages)
                      .slice(0, 1)
                      .map((participant, idx) => (
                        <div key={`msg-${idx}`} className="p-4">
                          <div className="flex flex-col items-center">
                            <Badge className="mb-1" variant="secondary">Top Messages</Badge>
                            <p className="font-bold">{participant.name}</p>
                            <div className="mt-1 flex items-center gap-1">
                              <MessageSquare className="h-4 w-4 text-blue-500" />
                              <span className="font-mono">{participant.messages}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                    {[...activityChartData]
                      .sort((a, b) => b.whiteboard - a.whiteboard)
                      .slice(0, 1)
                      .map((participant, idx) => (
                        <div key={`wb-${idx}`} className="p-4">
                          <div className="flex flex-col items-center">
                            <Badge className="mb-1" variant="secondary">Top Whiteboard</Badge>
                            <p className="font-bold">{participant.name}</p>
                            <div className="mt-1 flex items-center gap-1">
                              <Pencil className="h-4 w-4 text-green-500" />
                              <span className="font-mono">{participant.whiteboard}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                    {[...activityChartData]
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 1)
                      .map((participant, idx) => (
                        <div key={`total-${idx}`} className="p-4">
                          <div className="flex flex-col items-center">
                            <Badge className="mb-1" variant="secondary">Overall MVP</Badge>
                            <p className="font-bold">{participant.name}</p>
                            <div className="mt-1 flex items-center gap-1">
                              <Award className="h-4 w-4 text-amber-500" />
                              <span className="font-mono">{participant.total}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Session Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Clock className="h-12 w-12 text-primary/50 mb-2" />
              <h3 className="text-lg font-medium">Session Duration</h3>
              <p className="mt-1 text-3xl font-bold">{sessionDuration}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Started {formatDistanceToNow(sessionStartDate, { addSuffix: true })}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SessionAnalytics;
