
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Award, Clock, BookOpen } from "lucide-react";
import { Link } from 'react-router-dom';

const DashboardStats = () => {
  const stats = [
    {
      title: "Courses Enrolled",
      value: "12",
      icon: BookOpen,
      description: "Active courses",
      link: "/courses"
    },
    {
      title: "Study Hours",
      value: "48.5",
      icon: Clock,
      description: "Last 30 days",
      link: "/analytics"
    },
    {
      title: "Questions Answered",
      value: "256",
      icon: Brain,
      description: "With AI tutor",
      link: "/graph-tutor"
    },
    {
      title: "Achievements",
      value: "8",
      icon: Award,
      description: "Unlocked",
      link: "/arena"
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
          <Link key={stat.title} to={stat.link} className="block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
