
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, Trophy, Star, Medal } from 'lucide-react';
import { format } from 'date-fns';
import type { Achievement } from '@/types/arena';

interface ArenaAchievementsProps {
  achievements: Achievement[];
}

export const ArenaAchievements = ({ achievements }: ArenaAchievementsProps) => {
  // Map achievement IDs to their respective icons
  const getAchievementIcon = (id: string) => {
    switch (id) {
      case 'first-match':
        return <Award className="h-5 w-5" />;
      case 'first-win':
        return <Trophy className="h-5 w-5" />;
      case 'perfect-score':
        return <Star className="h-5 w-5" />;
      case 'five-matches':
        return <Medal className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Achievements
        </CardTitle>
        <CardDescription>
          Unlock achievements by participating in matches and winning games
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-start gap-3 rounded-md border p-3 transition-colors ${
                achievement.earned ? 'bg-accent/40' : 'opacity-60'
              }`}
            >
              <div className={`rounded-full p-2 ${achievement.earned ? 'bg-primary/20' : 'bg-muted'}`}>
                {React.cloneElement(getAchievementIcon(achievement.id), {
                  className: `h-5 w-5 ${achievement.earned ? 'text-primary' : 'text-muted-foreground'}`
                })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{achievement.name}</h3>
                  {achievement.earned && (
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                      Earned
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                {achievement.earned_at && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Earned on {format(new Date(achievement.earned_at), 'MMM d, yyyy')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
