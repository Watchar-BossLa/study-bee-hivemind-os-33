
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PeerLearning = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container flex-grow py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <User className="h-8 w-8" />
              Peer Learning
            </h1>
            <p className="text-muted-foreground mt-1">
              Connect with peers and learn together
            </p>
          </div>
          
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            Find Study Partner
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sarah Williams</CardTitle>
              <CardDescription>Computer Science Student</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="secondary">Data Structures</Badge>
                  <Badge variant="secondary">Algorithms</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Looking for a study partner for Algorithm Analysis
                </p>
                <Button className="w-full" variant="outline">Connect</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Michael Chen</CardTitle>
              <CardDescription>Physics Major</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Quantum Mechanics</Badge>
                  <Badge variant="secondary">Mathematics</Badge>
                  <Badge variant="secondary">Physics</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Available for Physics problem-solving sessions
                </p>
                <Button className="w-full" variant="outline">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PeerLearning;
