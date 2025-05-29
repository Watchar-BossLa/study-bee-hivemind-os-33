
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewSession from '@/components/flashcards/ReviewSession';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useFlashcardAnalyticsSummary } from '@/hooks/flashcards/useFlashcardAnalyticsSummary';
import { Skeleton } from '@/components/ui/skeleton';

const FlashcardReviewPage = () => {
  const { data: summary, isLoading } = useFlashcardAnalyticsSummary();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container flex-grow py-8">
        <div className="flex items-center mb-8">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-grow">
            <h1 className="text-3xl font-bold flex items-center">
              <Book className="mr-2 h-6 w-6" /> Flashcard Review
            </h1>
            <p className="text-muted-foreground">
              Boost your memorization with spaced repetition
            </p>
          </div>
          <div className="flex space-x-2">
            <Link to="/ocr">
              <Button variant="outline">
                Create Flashcards
              </Button>
            </Link>
            <Link to="/flashcards/analytics">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="mb-6">
              <Badge variant="outline" className="mb-2">Spaced Repetition</Badge>
              <h2 className="text-2xl font-semibold mb-2">Due for Review</h2>
              <p className="text-muted-foreground mb-6">
                These flashcards are scheduled for review today based on the SM-2 algorithm.
              </p>
            </div>
            
            <ReviewSession />
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>About Spaced Repetition</CardTitle>
                <CardDescription>How the system works</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  Spaced repetition is a learning technique that incorporates increasing intervals of 
                  time between subsequent reviews of previously learned material.
                </p>
                
                <div>
                  <h4 className="font-medium mb-1">How It Works:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Cards you find difficult appear more frequently</li>
                    <li>Cards you know well appear less frequently</li>
                    <li>The system adapts to your performance</li>
                    <li>Review only what you need, when you need it</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Benefits:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Improved long-term retention</li>
                    <li>More efficient study sessions</li>
                    <li>Better recall during exams</li>
                    <li>Less time wasted reviewing known material</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Progress Stats</CardTitle>
                <CardDescription>Your flashcard learning stats</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-3 rounded-md text-center">
                      <div className="text-2xl font-bold">{summary?.cardsDue || 0}</div>
                      <div className="text-xs text-muted-foreground">Due Today</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md text-center">
                      <div className="text-2xl font-bold">{summary?.reviewsToday || 0}</div>
                      <div className="text-xs text-muted-foreground">Reviewed</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md text-center">
                      <div className="text-2xl font-bold">{summary?.cardsMastered || 0}</div>
                      <div className="text-xs text-muted-foreground">Mastered</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md text-center">
                      <div className="text-2xl font-bold">{summary?.totalCards || 0}</div>
                      <div className="text-xs text-muted-foreground">Total Cards</div>
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <Link to="/flashcards/analytics">
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      <span>View Detailed Analytics</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FlashcardReviewPage;
