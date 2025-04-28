import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, BookUser } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CollaborativeNotes = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container flex-grow py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8" />
              Collaborative Notes
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and share notes with your study groups
            </p>
          </div>
          
          <Button>
            <BookUser className="mr-2 h-4 w-4" />
            Create New Note
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Biology Notes</CardTitle>
                <Badge>Shared</Badge>
              </div>
              <CardDescription>Cell Biology - Chapter 5</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Last edited 2 hours ago by John
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">4 collaborators</Badge>
                  <Badge variant="outline">25 pages</Badge>
                </div>
                <Button className="w-full" variant="outline">Open Notes</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Physics Notes</CardTitle>
                <Badge>Private</Badge>
              </div>
              <CardDescription>Quantum Mechanics Fundamentals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Last edited 5 minutes ago by you
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">1 collaborator</Badge>
                  <Badge variant="outline">12 pages</Badge>
                </div>
                <Button className="w-full" variant="outline">Open Notes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CollaborativeNotes;
