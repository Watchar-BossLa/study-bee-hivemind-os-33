
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Clock, Trophy, Brain, Star, MessageCircle } from 'lucide-react';

export const ArenaAbout = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            How It Works
          </CardTitle>
          <CardDescription>Real-time quiz competitions with other students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-primary/10 p-1">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Join a Match</h4>
              <p className="text-sm text-muted-foreground">
                Choose a subject and join a waiting match, or create a new one
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-primary/10 p-1">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Quick Rounds</h4>
              <p className="text-sm text-muted-foreground">
                Answer questions quickly to earn bonus points - every second counts!
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-primary/10 p-1">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Chat During Games</h4>
              <p className="text-sm text-muted-foreground">
                Communicate with other players while waiting or during the match
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Rewards & Achievements
          </CardTitle>
          <CardDescription>Level up and earn achievements as you play</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-primary/10 p-1">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Climb the Leaderboard</h4>
              <p className="text-sm text-muted-foreground">
                Compete against others to reach the top of the global rankings
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-primary/10 p-1">
              <Star className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Earn Achievements</h4>
              <p className="text-sm text-muted-foreground">
                Unlock special achievements for winning streaks and correct answers
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-primary/10 p-1">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Master New Subjects</h4>
              <p className="text-sm text-muted-foreground">
                Test and improve your knowledge across various subject areas
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline">View Available Achievements</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
