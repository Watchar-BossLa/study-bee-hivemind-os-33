
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArenaLeaderboard } from './ArenaLeaderboard';
import { ArenaStats } from './ArenaStats';
import { ArenaAchievements } from './ArenaAchievements';
import { ArenaAbout } from './ArenaAbout';
import { ArenaMatchView } from './ArenaMatchView';
import { ArenaMatch, MatchPlayer, QuizQuestion, LeaderboardEntry, ArenaStats as ArenaStatsType, Achievement } from '@/types/arena';

interface ArenaTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  currentMatch: ArenaMatch | null;
  players: MatchPlayer[];
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  timeLeft: number;
  matchComplete: boolean;
  leaderboard: LeaderboardEntry[];
  arenaStats: ArenaStatsType | null;
  achievements: Achievement[];
  onAnswer: (answer: 'a' | 'b' | 'c' | 'd') => void;
  onJoinMatch: () => void;
}

export const ArenaTabs: React.FC<ArenaTabsProps> = ({
  activeTab,
  onTabChange,
  currentMatch,
  players,
  questions,
  currentQuestionIndex,
  selectedAnswer,
  timeLeft,
  matchComplete,
  leaderboard,
  arenaStats,
  achievements,
  onAnswer,
  onJoinMatch
}) => {
  if (currentMatch) {
    return (
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="match">Current Match</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="match" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ArenaMatchView
              currentMatch={currentMatch}
              players={players}
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              selectedAnswer={selectedAnswer}
              timeLeft={timeLeft}
              matchComplete={matchComplete}
              onAnswer={onAnswer}
              onJoinMatch={onJoinMatch}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="mt-4">
          <ArenaLeaderboard leaderboard={leaderboard} />
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ArenaStats stats={arenaStats} />
            <ArenaAchievements achievements={achievements} />
          </div>
        </TabsContent>
      </Tabs>
    );
  }
  
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about" className="mt-4">
        <ArenaAbout />
      </TabsContent>
      
      <TabsContent value="leaderboard" className="mt-4">
        <ArenaLeaderboard leaderboard={leaderboard} />
      </TabsContent>
      
      <TabsContent value="achievements" className="mt-4">
        <div className="grid gap-4 md:grid-cols-2">
          <ArenaStats stats={arenaStats} />
          <ArenaAchievements achievements={achievements} />
        </div>
      </TabsContent>
    </Tabs>
  );
};
