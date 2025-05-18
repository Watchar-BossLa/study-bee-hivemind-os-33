
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Award, Clock, BookOpen } from "lucide-react";

const DashboardStats = () => {
  const stats = [
    {
      title: "Courses Enrolled",
      value: "12",
      icon: BookOpen,
      description: "Active courses",
      change: "+2 this month",
      trend: "up"
    },
    {
      title: "Study Hours",
      value: "48.5",
      icon: Clock,
      description: "Last 30 days",
      change: "+5.2 hrs vs. last month",
      trend: "up"
    },
    {
      title: "Questions Answered",
      value: "256",
      icon: Brain,
      description: "With AI tutor",
      change: "+64 this week",
      trend: "up"
    },
    {
      title: "Achievements",
      value: "8",
      icon: Award,
      description: "Unlocked",
      change: "3 more to unlock next level",
      trend: "neutral"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Learning Overview</h2>
        <p className="text-muted-foreground">Your learning statistics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/50">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                <p className={`text-xs ${
                  stat.trend === 'up' ? 'text-emerald-600' : 
                  stat.trend === 'down' ? 'text-rose-600' : 
                  'text-muted-foreground'}`}>
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
