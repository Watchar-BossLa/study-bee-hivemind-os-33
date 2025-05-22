
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Users, Trophy, Medal, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ArenaSubjectSelect } from '@/components/arena/ArenaSubjectSelect';
import { ArenaTabs } from '@/components/arena/ArenaTabs';
import { ArenaHeader } from '@/components/arena/ArenaHeader';
import { useArena } from '@/hooks/useArena';

const ArenaLobby = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>("random");
  const [activeTab, setActiveTab] = useState("about");
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleJoinMatch = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to join a match",
          variant: "destructive",
        });
        return;
      }

      await joinMatch(selectedSubject === "random" ? null : selectedSubject);
      setActiveTab("match");
      
      toast({
        title: "Joining Match",
        description: "Looking for players...",
      });
    } catch (error) {
      console.error("Error joining match:", error);
      toast({
        title: "Error",
        description: "Failed to join match. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
  };

  const handleLeaveMatch = () => {
    leaveMatch();
    setActiveTab("about");
    
    toast({
      title: "Left Match",
      description: "You have left the match",
    });
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container flex-grow py-8">
        <div className="space-y-6">
          <ArenaHeader 
            isLoading={isLoading}
            currentMatch={currentMatch}
            selectedSubject={selectedSubject}
            onSelectSubject={handleSubjectChange}
            onJoinMatch={handleJoinMatch}
            onLeaveMatch={handleLeaveMatch}
          />
          
          <div className="mt-8">
            <ArenaTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              currentMatch={currentMatch}
              players={players}
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              selectedAnswer={selectedAnswer}
              timeLeft={timeLeft}
              matchComplete={matchComplete}
              leaderboard={leaderboard}
              arenaStats={arenaStats}
              achievements={achievements}
              onAnswer={answerQuestion}
              onJoinMatch={handleJoinMatch}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArenaLobby;
