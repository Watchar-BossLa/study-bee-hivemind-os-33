
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardStats from '@/components/dashboard/DashboardStats';
import QuickActions from '@/components/dashboard/QuickActions';
import LearningProgress from '@/components/dashboard/LearningProgress';
import FlashcardAnalyticsOverview from '@/components/flashcards/analytics/FlashcardAnalyticsOverview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, Camera, Clock, GraduationCap, Award } from 'lucide-react';

const Dashboard = () => {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container flex-grow py-8 space-y-8">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata?.full_name || 'Student'}</h1>
            <p className="text-muted-foreground mt-1">
              Your learning dashboard and progress tracker
            </p>
          </div>
          <Badge variant="success" className="flex items-center gap-1 py-1 px-3">
            <Clock className="h-3.5 w-3.5" />
            <span>7 Day Streak</span>
          </Badge>
        </div>

        {/* Stats overview */}
        <div className="grid gap-8">
          <DashboardStats />
        </div>

        {/* Quick actions */}
        <div className="grid gap-8">
          <QuickActions />
        </div>

        {/* Main content tabs */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid grid-cols-4 md:w-auto">
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Flashcards</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="qualifications" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Qualifications</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            <div className="grid gap-8">
              <LearningProgress />
              <RecentActivity />
            </div>
          </TabsContent>
          
          <TabsContent value="flashcards">
            <div className="grid gap-8">
              <FlashcardAnalyticsOverview />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActionCard
                  title="Review Flashcards"
                  description="Continue your spaced repetition practice"
                  icon={Brain}
                  linkTo="/flashcards/review"
                  color="bg-purple-500"
                />
                <ActionCard 
                  title="Create Flashcards"
                  description="Scan your notes with OCR technology"
                  icon={Camera}
                  linkTo="/ocr"
                  color="bg-amber-500"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="achievements">
            <div className="grid gap-8">
              <UserAchievements />
            </div>
          </TabsContent>
          
          <TabsContent value="qualifications">
            <div className="grid gap-8">
              <UserQualifications />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

// Helper components for dashboard sections
const ActionCard = ({ title, description, icon: Icon, linkTo, color }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <Link to={linkTo} className="block">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white mb-4`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </Link>
    </CardContent>
  </Card>
);

const RecentActivity = () => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {[
        { action: "Completed quiz", subject: "Introduction to Biology", date: "2 hours ago", score: "85%" },
        { action: "Reviewed flashcards", subject: "Advanced Mathematics", date: "Yesterday", count: "24 cards" },
        { action: "Started course", subject: "World History: Ancient Civilizations", date: "2 days ago" },
      ].map((activity, i) => (
        <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
          <div>
            <p className="font-medium">{activity.action}</p>
            <p className="text-sm text-muted-foreground">{activity.subject}</p>
          </div>
          <div className="text-right">
            <p className="text-sm">{activity.date}</p>
            {activity.score && <p className="text-sm text-emerald-600 font-medium">{activity.score}</p>}
            {activity.count && <p className="text-sm text-blue-600">{activity.count}</p>}
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

const UserAchievements = () => (
  <Card>
    <CardHeader>
      <CardTitle>Your Achievements</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { name: "First Course", description: "Enrolled in your first course", completed: true },
          { name: "Perfect Score", description: "Achieve 100% on any quiz", completed: true },
          { name: "Study Streak", description: "Study for 7 days in a row", completed: true },
          { name: "Flashcard Master", description: "Review 100 flashcards", completed: false },
          { name: "Quiz Champion", description: "Win 10 arena matches", completed: false },
          { name: "Subject Explorer", description: "Study across 5 different subjects", completed: false },
        ].map((achievement, i) => (
          <div key={i} className={`flex items-center p-3 rounded-lg border ${achievement.completed ? 'bg-muted/50' : 'bg-background opacity-70'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${achievement.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium">{achievement.name}</h4>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const UserQualifications = () => (
  <Card>
    <CardHeader>
      <CardTitle>Qualification Progress</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {[
        { name: "Cambridge IGCSE", subject: "Biology", progress: 65, modules: 8 },
        { name: "AP Courses", subject: "Mathematics", progress: 40, modules: 12 },
        { name: "CompTIA", subject: "IT Fundamentals", progress: 20, modules: 15 },
      ].map((qual, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{qual.name}</p>
              <p className="text-sm text-muted-foreground">{qual.subject}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{qual.progress}%</p>
              <p className="text-xs text-muted-foreground">{qual.modules} modules</p>
            </div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${qual.progress}%` }}
            ></div>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

// Import this at the top of the file
import { Link } from 'react-router-dom';

export default Dashboard;
