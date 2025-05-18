
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Camera, Book, Award, GraduationCap, ChevronRight } from "lucide-react";

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
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {actions.map((action) => (
          <Link key={action.title} to={action.href} className="group">
            <Card className="h-full hover:shadow-md transition-shadow border-t-4" style={{ borderTopColor: action.color.replace('bg-', '') }}>
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
