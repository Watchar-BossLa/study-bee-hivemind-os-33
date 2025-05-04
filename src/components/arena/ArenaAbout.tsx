
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Clock, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ArenaAbout: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Quiz Arena</CardTitle>
        <CardDescription>
          Test your knowledge and compete with other students in real-time quiz battles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center p-4 text-center">
            <Users className="h-8 w-8 mb-2 text-primary" />
            <h3 className="text-lg font-medium">Multiplayer Competition</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Compete against up to 3 other students in real-time quiz matches
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 text-center">
            <Trophy className="h-8 w-8 mb-2 text-primary" />
            <h3 className="text-lg font-medium">Earn Achievements</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Unlock achievements and climb the global leaderboard
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 text-center">
            <Clock className="h-8 w-8 mb-2 text-primary" />
            <h3 className="text-lg font-medium">Quick Rounds</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Fast-paced 5-question rounds that test your knowledge and speed
            </p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">How to Play</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click "Join Match" to enter the waiting room</li>
            <li>Wait for other players to join (or play solo)</li>
            <li>Answer questions as quickly as possible</li>
            <li>Earn points based on correct answers and speed</li>
            <li>The player with the most points at the end wins!</li>
          </ol>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Question Categories</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Education</Badge>
            <Badge variant="secondary">Technology</Badge>
            <Badge variant="secondary">Science</Badge>
            <Badge variant="secondary">Mathematics</Badge>
            <Badge variant="secondary">History</Badge>
            <Badge variant="secondary">General Knowledge</Badge>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Quiz Question Management</h3>
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link to="/arena/admin">
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Access the admin panel to manage quiz questions for the arena.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
