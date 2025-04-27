
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Camera, Book, Award, GraduationCap } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Start Learning",
      description: "Browse our course catalog",
      icon: Book,
      href: "/courses",
      color: "bg-blue-500"
    },
    {
      title: "AI Tutor",
      description: "Get personalized help",
      icon: Brain,
      href: "/tutor",
      color: "bg-purple-500"
    },
    {
      title: "Qualifications",
      description: "Explore qualification paths",
      icon: GraduationCap,
      href: "/qualifications",
      color: "bg-green-500"
    },
    {
      title: "Create Flashcards",
      description: "Scan your notes",
      icon: Camera,
      href: "/ocr",
      color: "bg-amber-500"
    },
    {
      title: "Quiz Arena",
      description: "Test your knowledge",
      icon: Award,
      href: "/arena",
      color: "bg-rose-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Quick Actions</h2>
        <p className="text-muted-foreground">Get started with these learning tools</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {actions.map((action) => (
          <Link key={action.title} to={action.href}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white mb-4`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
