
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardStats from "@/components/dashboard/DashboardStats";
import LearningProgress from "@/components/dashboard/LearningProgress";
import QuickActions from "@/components/dashboard/QuickActions";
import { ArrowUpRight } from "lucide-react";
import { Link } from 'react-router-dom';

/**
 * Main dashboard page that combines learning overview, progress tracking, 
 * and quick actions as specified in TSB sections 8 and 16
 */
const Dashboard = () => {
  return (
    <div className="container py-8 space-y-8">
      <Helmet>
        <title>Dashboard | Study Bee</title>
      </Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your progress and access learning tools
          </p>
        </div>
        <Link 
          to="/analytics" 
          className="flex items-center gap-2 text-primary hover:underline"
        >
          View detailed analytics
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <DashboardStats />

      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="progress">Learning Progress</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="progress" className="mt-6">
          <LearningProgress />
        </TabsContent>
        <TabsContent value="actions" className="mt-6">
          <QuickActions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
