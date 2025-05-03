
import React, { useState } from 'react';
import { useArena } from '@/hooks/useArena';
import { SectionErrorBoundary } from '@/components/error/SectionErrorBoundary';
import { ArenaHeader } from '@/components/arena/ArenaHeader';
import { ArenaTabs } from '@/components/arena/ArenaTabs';

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
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Custom join match function that includes the subject focus
  const handleJoinMatch = () => {
    joinMatch(selectedSubject);
  };

  return (
    <SectionErrorBoundary sectionName="Arena">
      <div className="container mx-auto py-8">
        <div className="grid gap-6">
          <ArenaHeader
            isLoading={isLoading}
            currentMatch={currentMatch}
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
            onJoinMatch={handleJoinMatch}
            onLeaveMatch={leaveMatch}
          />

          <ArenaTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
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
    </SectionErrorBoundary>
  );
};

export default Arena;
