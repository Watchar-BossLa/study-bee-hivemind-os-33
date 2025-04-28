
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, Users } from 'lucide-react';

const StudyGroups = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container flex-grow py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Study Groups
            </h1>
            <p className="text-muted-foreground mt-1">
              Join or create study groups to learn together
            </p>
          </div>
          
          <Button>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Create New Group
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Biology Study Group</CardTitle>
              <CardDescription>Advanced Cell Biology</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">8 members • Active</p>
                <p className="text-sm">Next session: Tomorrow at 2 PM</p>
                <Button className="w-full" variant="outline">Join Group</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Math Champions</CardTitle>
              <CardDescription>Calculus & Linear Algebra</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">12 members • Active</p>
                <p className="text-sm">Next session: Today at 6 PM</p>
                <Button className="w-full" variant="outline">Join Group</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudyGroups;
