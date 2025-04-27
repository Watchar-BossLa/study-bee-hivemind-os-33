
import React, { useState } from 'react';
import { useArena } from '@/hooks/useArena';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Trophy, Award, Star, Clock, Flag, Medal } from 'lucide-react';
import { ArenaQuiz } from '@/components/arena/ArenaQuiz';
import { ArenaLeaderboard } from '@/components/arena/ArenaLeaderboard';
import { ArenaAchievements } from '@/components/arena/ArenaAchievements';
import { ArenaStats } from '@/components/arena/ArenaStats';
import { ArenaPlayers } from '@/components/arena/ArenaPlayers';

const Arena = () => {
  const { 
    isLoading, 
    currentMatch, 
    players, 
    questions,
    currentQuestionIndex,
    selectedAnswer,
    timeLeft,
    matchComplete,
    arenaStats,
    leaderboard,
    achievements,
    joinMatch,
    answerQuestion,
    leaveMatch
  } = useArena();
  const [activeTab, setActiveTab] = useState('match');

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Quiz Arena</h1>
          {!currentMatch && (
            <Button onClick={joinMatch} disabled={isLoading}>
              <Users className="mr-2 h-4 w-4" />
              Join Match
            </Button>
          )}
          {currentMatch && (
            <Button onClick={leaveMatch} variant="outline">
              <Flag className="mr-2 h-4 w-4" />
              Leave Match
            </Button>
          )}
        </div>

        {currentMatch ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="match">Current Match</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="match" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                {currentMatch.status === 'waiting' ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Waiting for Players</CardTitle>
                        <CardDescription>
                          {players.length} / 4 players have joined
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center py-6">
                        <div className="text-center">
                          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            The match will start automatically when enough players join
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <ArenaPlayers players={players} />
                  </>
                ) : currentMatch.status === 'active' && questions.length > 0 ? (
                  <ArenaQuiz 
                    question={questions[currentQuestionIndex]} 
                    timeLeft={timeLeft}
                    selectedAnswer={selectedAnswer}
                    onAnswer={answerQuestion}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                    matchComplete={matchComplete}
                    players={players}
                  />
                ) : (
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>Match Complete</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ArenaPlayers players={players} showResults />
                      <div className="mt-4 flex justify-center">
                        <Button onClick={joinMatch}>Play Again</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
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
        ) : (
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Welcome to Quiz Arena
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Join a match to compete with other players in real-time quiz battles! Answer questions quickly to earn points and climb the leaderboard.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">How to Play</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Join a match and compete with other players by answering questions quickly.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Scoring</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Easy: 10pts, Medium: 20pts, Hard: 30pts. Answer faster for better scores!</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Achievements</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Earn achievements by winning matches, getting perfect scores, and more!</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
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
        )}
      </div>
    </div>
  );
};

export default Arena;
