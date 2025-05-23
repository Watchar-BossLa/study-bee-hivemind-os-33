import { 
  AdaptiveQuizConfig, 
  AdaptiveQuizQuestion, 
  AdaptiveQuizSession, 
  QuizDifficulty, 
  AdaptiveQuizResult,
  AdaptiveQuizAnswer, 
  AdaptiveSequenceItem 
} from '@/types/adaptive-quiz';
import { captureException } from '@/services/monitoring/sentry';

/**
 * Service for managing adaptive quizzes
 */
export class AdaptiveQuizService {
  private quizConfigs: Map<string, AdaptiveQuizConfig>;
  private questions: Map<string, AdaptiveQuizQuestion[]>;
  private sessions: Map<string, AdaptiveQuizSession>;
  
  constructor() {
    this.quizConfigs = new Map();
    this.questions = new Map();
    this.sessions = new Map();
    this.initializeSampleData();
  }
  
  /**
   * Create a new adaptive quiz session
   */
  public createSession(userId: string, quizConfigId: string): AdaptiveQuizSession | null {
    try {
      const quizConfig = this.quizConfigs.get(quizConfigId);
      if (!quizConfig) {
        throw new Error(`Quiz config not found: ${quizConfigId}`);
      }
      
      // Check if we have questions for this quiz
      const quizQuestions = this.questions.get(quizConfigId);
      if (!quizQuestions || quizQuestions.length === 0) {
        throw new Error(`No questions found for quiz: ${quizConfigId}`);
      }
      
      // Create a new session
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const initialDifficulty = quizConfig.initialDifficulty;
      
      // Select the first question based on initial difficulty
      const initialQuestion = this.selectNextQuestion(quizConfigId, initialDifficulty, []);
      if (!initialQuestion) {
        throw new Error(`No questions available for difficulty: ${initialDifficulty}`);
      }
      
      const session: AdaptiveQuizSession = {
        id: sessionId,
        userId,
        quizConfigId,
        startTime: new Date(),
        currentQuestionIndex: 0,
        currentDifficulty: initialDifficulty,
        questionsAnswered: [],
        status: 'in-progress',
        score: 0,
        maxScore: quizConfig.maxQuestions,
        adaptiveSequence: [
          {
            questionId: initialQuestion.id,
            difficulty: initialDifficulty,
            reason: 'Initial question based on configured starting difficulty'
          }
        ],
        timeRemaining: quizConfig.timeLimit
      };
      
      this.sessions.set(sessionId, session);
      return session;
    } catch (error) {
      captureException(error as Error);
      return null;
    }
  }
  
  /**
   * Get the current question for a session
   */
  public getCurrentQuestion(sessionId: string): AdaptiveQuizQuestion | null {
    try {
      const session = this.sessions.get(sessionId);
      if (!session || session.status !== 'in-progress') {
        return null;
      }
      
      // Get the current question ID from the adaptive sequence
      const currentSequenceItem = session.adaptiveSequence[session.currentQuestionIndex];
      if (!currentSequenceItem) {
        return null;
      }
      
      // Find the question in our questions set
      const quizQuestions = this.questions.get(session.quizConfigId);
      if (!quizQuestions) {
        return null;
      }
      
      return quizQuestions.find(q => q.id === currentSequenceItem.questionId) || null;
    } catch (error) {
      captureException(error as Error);
      return null;
    }
  }
  
  /**
   * Submit an answer for the current question in a session
   */
  public submitAnswer(
    sessionId: string, 
    questionId: string, 
    optionId: string, 
    timeSpent: number,
    confidence?: 'low' | 'medium' | 'high'
  ): { 
    correct: boolean; 
    nextQuestion: AdaptiveQuizQuestion | null; 
    sessionComplete: boolean;
    result?: AdaptiveQuizResult;
  } | null {
    try {
      const session = this.sessions.get(sessionId);
      if (!session || session.status !== 'in-progress') {
        return null;
      }
      
      const quizConfig = this.quizConfigs.get(session.quizConfigId);
      if (!quizConfig) {
        return null;
      }
      
      const quizQuestions = this.questions.get(session.quizConfigId);
      if (!quizQuestions) {
        return null;
      }
      
      // Find the current question
      const currentQuestion = quizQuestions.find(q => q.id === questionId);
      if (!currentQuestion) {
        return null;
      }
      
      // Check if the answer is correct
      const isCorrect = currentQuestion.correctOptionId === optionId;
      
      // Record the answer
      const answer: AdaptiveQuizAnswer = {
        questionId,
        selectedOptionId: optionId,
        isCorrect,
        difficulty: currentQuestion.difficulty,
        timeSpent,
        confidence
      };
      
      session.questionsAnswered.push(answer);
      
      // Update score
      if (isCorrect) {
        session.score += 1;
      }
      
      // Check if the quiz is complete
      const isLastQuestion = session.questionsAnswered.length >= quizConfig.maxQuestions;
      
      if (isLastQuestion) {
        // Complete the session
        session.status = 'completed';
        session.endTime = new Date();
        
        // Generate results
        const result = this.generateQuizResult(session);
        return {
          correct: isCorrect,
          nextQuestion: null,
          sessionComplete: true,
          result
        };
      } else {
        // Determine the next question difficulty based on the adaptation strategy
        const nextDifficulty = this.determineNextDifficulty(session, quizConfig.adaptationStrategy);
        
        // Select the next question
        const answeredQuestionIds = session.questionsAnswered.map(a => a.questionId);
        const nextQuestion = this.selectNextQuestion(session.quizConfigId, nextDifficulty, answeredQuestionIds);
        
        if (!nextQuestion) {
          // If we can't find a question at the ideal difficulty, try a different difficulty
          const fallbackDifficulties: QuizDifficulty[] = ['intermediate', 'beginner', 'advanced', 'expert'];
          for (const difficulty of fallbackDifficulties) {
            if (difficulty !== nextDifficulty) {
              const fallbackQuestion = this.selectNextQuestion(
                session.quizConfigId, 
                difficulty, 
                answeredQuestionIds
              );
              if (fallbackQuestion) {
                // Update session and return the fallback question
                session.currentDifficulty = difficulty;
                session.currentQuestionIndex += 1;
                session.adaptiveSequence.push({
                  questionId: fallbackQuestion.id,
                  difficulty,
                  reason: `Fallback due to no available questions at ${nextDifficulty} difficulty`
                });
                return {
                  correct: isCorrect,
                  nextQuestion: fallbackQuestion,
                  sessionComplete: false
                };
              }
            }
          }
          
          // If we still can't find a question, complete the session early
          session.status = 'completed';
          session.endTime = new Date();
          const result = this.generateQuizResult(session);
          return {
            correct: isCorrect,
            nextQuestion: null,
            sessionComplete: true,
            result
          };
        }
        
        // Update session with the next question
        session.currentDifficulty = nextDifficulty;
        session.currentQuestionIndex += 1;
        session.adaptiveSequence.push({
          questionId: nextQuestion.id,
          difficulty: nextDifficulty,
          reason: `Adapted based on ${quizConfig.adaptationStrategy} strategy`
        });
        
        return {
          correct: isCorrect,
          nextQuestion,
          sessionComplete: false
        };
      }
    } catch (error) {
      captureException(error as Error);
      return null;
    }
  }
  
  /**
   * Get a quiz session by ID
   */
  public getSession(sessionId: string): AdaptiveQuizSession | null {
    return this.sessions.get(sessionId) || null;
  }
  
  /**
   * Get all quizzes
   */
  public getQuizzes(): AdaptiveQuizConfig[] {
    return Array.from(this.quizConfigs.values());
  }
  
  /**
   * Get a quiz configuration by ID
   */
  public getQuizConfig(quizId: string): AdaptiveQuizConfig | null {
    return this.quizConfigs.get(quizId) || null;
  }
  
  /**
   * Get questions for a specific quiz
   */
  public getQuestions(quizId: string): AdaptiveQuizQuestion[] {
    return this.questions.get(quizId) || [];
  }
  
  /**
   * Generate a result for a completed quiz session
   */
  private generateQuizResult(session: AdaptiveQuizSession): AdaptiveQuizResult {
    const quizConfig = this.quizConfigs.get(session.quizConfigId)!;
    
    // Calculate performance metrics
    const totalQuestions = session.questionsAnswered.length;
    const correctAnswers = session.questionsAnswered.filter(a => a.isCorrect).length;
    const completionTime = session.endTime ? 
      (session.endTime.getTime() - session.startTime.getTime()) / 1000 : 
      0;
    
    // Count questions by difficulty
    const difficultyLevels: Record<QuizDifficulty, number> = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
      expert: 0
    };
    
    session.questionsAnswered.forEach(answer => {
      difficultyLevels[answer.difficulty]++;
    });
    
    // Calculate mastery level based on performance
    let masteryLevel: QuizDifficulty = 'beginner';
    const scorePercentage = (correctAnswers / totalQuestions) * 100;
    
    if (scorePercentage >= 90 && difficultyLevels.expert > 0) {
      masteryLevel = 'expert';
    } else if (scorePercentage >= 80 && difficultyLevels.advanced > 0) {
      masteryLevel = 'advanced';
    } else if (scorePercentage >= 70) {
      masteryLevel = 'intermediate';
    }
    
    // Calculate confidence metrics if available
    let confidenceMetrics = undefined;
    const confidenceData = session.questionsAnswered.filter(a => a.confidence);
    
    if (confidenceData.length > 0) {
      // Count instances of over/under confidence
      let overconfidenceCount = 0;
      let underconfidenceCount = 0;
      let accurateCount = 0;
      
      confidenceData.forEach(answer => {
        const confidenceLevel = answer.confidence === 'high' ? 2 : (answer.confidence === 'medium' ? 1 : 0);
        
        if (answer.isCorrect && confidenceLevel < 1) {
          underconfidenceCount++;
        } else if (!answer.isCorrect && confidenceLevel > 1) {
          overconfidenceCount++;
        } else {
          accurateCount++;
        }
      });
      
      confidenceMetrics = {
        overconfidenceScore: overconfidenceCount / confidenceData.length,
        underconfidenceScore: underconfidenceCount / confidenceData.length,
        accurateAssessmentScore: accurateCount / confidenceData.length,
        confidenceToPerformanceCorrelation: 0.5 // Simplified calculation
      };
    }
    
    // Calculate topic performance
    const topicPerformance: Record<string, number> = {};
    
    // For simplicity, we'll just use a dummy value here
    // In a real implementation, we'd calculate this based on questions' topics
    topicPerformance['topic1'] = scorePercentage;
    
    // Generate recommendations based on performance
    const recommendations: string[] = [];
    const nextStepsTopics: string[] = [];
    
    if (scorePercentage < 70) {
      recommendations.push('Review the fundamental concepts in this subject');
      nextStepsTopics.push('Fundamentals');
    } else if (scorePercentage < 85) {
      recommendations.push('Practice with more intermediate-level problems');
      nextStepsTopics.push('Intermediate Practice');
    } else {
      recommendations.push('Challenge yourself with advanced topics');
      nextStepsTopics.push('Advanced Concepts');
    }
    
    // Check if the user passed the quiz
    const passed = scorePercentage >= quizConfig.passingThreshold;
    
    return {
      sessionId: session.id,
      quizId: session.quizConfigId,
      userId: session.userId,
      finalScore: session.score,
      maxScore: session.maxScore,
      performance: {
        userId: session.userId,
        quizId: session.quizConfigId,
        averageScore: scorePercentage,
        completionTime,
        correctAnswers,
        totalQuestions,
        difficultyLevels,
        topicPerformance,
        challengeAreas: ['topic1'], // Simplified
        strengths: ['topic2'], // Simplified
        date: new Date()
      },
      confidenceMetrics,
      masteryLevel,
      recommendations,
      nextStepsTopics,
      completedAt: new Date(),
      passed
    };
  }
  
  /**
   * Determine the difficulty level for the next question
   */
  private determineNextDifficulty(
    session: AdaptiveQuizSession, 
    strategy: 'performance' | 'confidence' | 'combined'
  ): QuizDifficulty {
    const currentDifficulty = session.currentDifficulty;
    
    // If we don't have enough answers yet, keep the same difficulty
    if (session.questionsAnswered.length < 2) {
      return currentDifficulty;
    }
    
    // Get the last few answers to determine the trend
    const recentAnswers = session.questionsAnswered.slice(-3);
    const recentCorrect = recentAnswers.filter(a => a.isCorrect).length;
    const recentTotal = recentAnswers.length;
    const recentPerformance = recentCorrect / recentTotal;
    
    // Strategy based on performance only
    if (strategy === 'performance' || strategy === 'combined') {
      // If performing very well, increase difficulty
      if (recentPerformance >= 0.8) {
        return this.increaseDifficulty(currentDifficulty);
      }
      // If performing poorly, decrease difficulty
      else if (recentPerformance <= 0.3) {
        return this.decreaseDifficulty(currentDifficulty);
      }
    }
    
    // Strategy based on confidence
    if (strategy === 'confidence' || strategy === 'combined') {
      const confidenceData = recentAnswers.filter(a => a.confidence);
      
      if (confidenceData.length > 0) {
        const highConfidenceCount = confidenceData.filter(a => a.confidence === 'high').length;
        const lowConfidenceCount = confidenceData.filter(a => a.confidence === 'low').length;
        
        // If mostly high confidence, increase difficulty
        if (highConfidenceCount >= confidenceData.length * 0.7) {
          return this.increaseDifficulty(currentDifficulty);
        }
        // If mostly low confidence, decrease difficulty
        else if (lowConfidenceCount >= confidenceData.length * 0.7) {
          return this.decreaseDifficulty(currentDifficulty);
        }
      }
    }
    
    // Default: keep the same difficulty
    return currentDifficulty;
  }
  
  /**
   * Increase the difficulty level by one step
   */
  private increaseDifficulty(currentDifficulty: QuizDifficulty): QuizDifficulty {
    switch (currentDifficulty) {
      case 'beginner':
        return 'intermediate';
      case 'intermediate':
        return 'advanced';
      case 'advanced':
        return 'expert';
      default:
        return currentDifficulty;
    }
  }
  
  /**
   * Decrease the difficulty level by one step
   */
  private decreaseDifficulty(currentDifficulty: QuizDifficulty): QuizDifficulty {
    switch (currentDifficulty) {
      case 'expert':
        return 'advanced';
      case 'advanced':
        return 'intermediate';
      case 'intermediate':
        return 'beginner';
      default:
        return currentDifficulty;
    }
  }
  
  /**
   * Select the next question for a quiz, based on difficulty and previous answers
   */
  private selectNextQuestion(
    quizConfigId: string, 
    difficulty: QuizDifficulty, 
    answeredQuestionIds: string[]
  ): AdaptiveQuizQuestion | null {
    const quizQuestions = this.questions.get(quizConfigId);
    if (!quizQuestions) {
      return null;
    }
    
    // Filter questions by difficulty and not already answered
    const eligibleQuestions = quizQuestions.filter(q => 
      q.difficulty === difficulty && !answeredQuestionIds.includes(q.id)
    );
    
    if (eligibleQuestions.length === 0) {
      return null;
    }
    
    // Select a random question from the eligible ones
    const randomIndex = Math.floor(Math.random() * eligibleQuestions.length);
    return eligibleQuestions[randomIndex];
  }
  
  /**
   * Initialize sample data for the service
   */
  private initializeSampleData(): void {
    // Create a sample quiz config
    const mathQuizConfig: AdaptiveQuizConfig = {
      id: 'math-quiz',
      title: 'Adaptive Mathematics Quiz',
      description: 'Test your math skills with questions that adapt to your performance',
      initialDifficulty: 'intermediate',
      adaptationStrategy: 'performance',
      passingThreshold: 70,
      timeLimit: 1200, // 20 minutes
      showFeedback: true,
      showCorrectAnswers: true,
      maxQuestions: 10,
      topicId: 'mathematics',
      subjectId: 'math-101'
    };
    
    const codingQuizConfig: AdaptiveQuizConfig = {
      id: 'coding-quiz',
      title: 'Adaptive Coding Challenge',
      description: 'Test your programming skills with increasingly difficult challenges',
      initialDifficulty: 'beginner',
      adaptationStrategy: 'combined',
      passingThreshold: 60,
      showFeedback: true,
      showCorrectAnswers: false,
      maxQuestions: 8,
      topicId: 'programming',
      subjectId: 'cs-101'
    };
    
    this.quizConfigs.set(mathQuizConfig.id, mathQuizConfig);
    this.quizConfigs.set(codingQuizConfig.id, codingQuizConfig);
    
    // Create sample math questions
    const mathQuestions: AdaptiveQuizQuestion[] = [
      // Beginner questions
      {
        id: 'math-q1',
        question: 'What is 5 + 7?',
        options: [
          { id: 'opt1', text: '10', isCorrect: false },
          { id: 'opt2', text: '12', isCorrect: true },
          { id: 'opt3', text: '13', isCorrect: false },
          { id: 'opt4', text: '11', isCorrect: false }
        ],
        difficulty: 'beginner',
        correctOptionId: 'opt2',
        explanation: '5 + 7 = 12',
        topicId: 'addition',
        tags: ['addition', 'arithmetic', 'basics']
      },
      {
        id: 'math-q2',
        question: 'What is 8 × 4?',
        options: [
          { id: 'opt1', text: '24', isCorrect: false },
          { id: 'opt2', text: '32', isCorrect: true },
          { id: 'opt3', text: '36', isCorrect: false },
          { id: 'opt4', text: '28', isCorrect: false }
        ],
        difficulty: 'beginner',
        correctOptionId: 'opt2',
        explanation: '8 × 4 = 32',
        topicId: 'multiplication',
        tags: ['multiplication', 'arithmetic', 'basics']
      },
      
      // Intermediate questions
      {
        id: 'math-q3',
        question: 'Solve for x: 3x - 7 = 14',
        options: [
          { id: 'opt1', text: 'x = 7', isCorrect: true },
          { id: 'opt2', text: 'x = 5', isCorrect: false },
          { id: 'opt3', text: 'x = 8', isCorrect: false },
          { id: 'opt4', text: 'x = 21', isCorrect: false }
        ],
        difficulty: 'intermediate',
        correctOptionId: 'opt1',
        explanation: '3x - 7 = 14, 3x = 21, x = 7',
        topicId: 'algebra',
        tags: ['algebra', 'equation', 'linear']
      },
      {
        id: 'math-q4',
        question: 'What is the area of a circle with radius 5 units?',
        options: [
          { id: 'opt1', text: '25π square units', isCorrect: true },
          { id: 'opt2', text: '10π square units', isCorrect: false },
          { id: 'opt3', text: '5π square units', isCorrect: false },
          { id: 'opt4', text: '2π square units', isCorrect: false }
        ],
        difficulty: 'intermediate',
        correctOptionId: 'opt1',
        explanation: 'Area of a circle = πr², where r is the radius. So area = π×5² = 25π square units',
        topicId: 'geometry',
        tags: ['geometry', 'circle', 'area']
      },
      
      // Advanced questions
      {
        id: 'math-q5',
        question: 'What is the derivative of f(x) = x³ - 4x² + 2x - 7?',
        options: [
          { id: 'opt1', text: 'f\'(x) = 3x² - 8x + 2', isCorrect: true },
          { id: 'opt2', text: 'f\'(x) = 3x² - 4x + 2', isCorrect: false },
          { id: 'opt3', text: 'f\'(x) = 3x² - 8x - 7', isCorrect: false },
          { id: 'opt4', text: 'f\'(x) = x² - 8x + 2', isCorrect: false }
        ],
        difficulty: 'advanced',
        correctOptionId: 'opt1',
        explanation: 'The derivative of x³ is 3x², the derivative of -4x² is -8x, the derivative of 2x is 2, and the derivative of -7 is 0. So f\'(x) = 3x² - 8x + 2',
        topicId: 'calculus',
        tags: ['calculus', 'derivative', 'polynomial']
      },
      {
        id: 'math-q6',
        question: 'If sin(θ) = 0.6, what is cos(θ)?',
        options: [
          { id: 'opt1', text: '0.8', isCorrect: true },
          { id: 'opt2', text: '0.6', isCorrect: false },
          { id: 'opt3', text: '0.64', isCorrect: false },
          { id: 'opt4', text: '0.36', isCorrect: false }
        ],
        difficulty: 'advanced',
        correctOptionId: 'opt1',
        explanation: 'Using the Pythagorean identity sin²(θ) + cos²(θ) = 1, we get cos²(θ) = 1 - sin²(θ) = 1 - 0.6² = 1 - 0.36 = 0.64, so cos(θ) = 0.8 (assuming θ is in the first quadrant)',
        topicId: 'trigonometry',
        tags: ['trigonometry', 'pythagorean-identity', 'sine', 'cosine']
      },
      
      // Expert questions
      {
        id: 'math-q7',
        question: 'Find the value of the improper integral ∫(0 to ∞) x²e^(-x) dx',
        options: [
          { id: 'opt1', text: '2', isCorrect: true },
          { id: 'opt2', text: '1', isCorrect: false },
          { id: 'opt3', text: 'e', isCorrect: false },
          { id: 'opt4', text: 'π', isCorrect: false }
        ],
        difficulty: 'expert',
        correctOptionId: 'opt1',
        explanation: 'This is a gamma function where Γ(3) = 2! = 2',
        topicId: 'calculus',
        conceptId: 'improper-integrals',
        tags: ['calculus', 'improper-integral', 'gamma-function']
      },
      {
        id: 'math-q8',
        question: 'What is the inverse Laplace transform of F(s) = 1/(s² + 4)?',
        options: [
          { id: 'opt1', text: '(1/2)sin(2t)', isCorrect: true },
          { id: 'opt2', text: 'cos(2t)', isCorrect: false },
          { id: 'opt3', text: 'sin(2t)', isCorrect: false },
          { id: 'opt4', text: 'e^(-2t)', isCorrect: false }
        ],
        difficulty: 'expert',
        correctOptionId: 'opt1',
        explanation: 'The inverse Laplace transform of 1/(s² + a²) is (1/a)sin(at), so for a=2, we get (1/2)sin(2t)',
        topicId: 'differential-equations',
        conceptId: 'laplace-transform',
        tags: ['laplace-transform', 'differential-equations', 'advanced-calculus']
      }
    ];
    
    // Create sample coding questions
    const codingQuestions: AdaptiveQuizQuestion[] = [
      // Beginner questions
      {
        id: 'code-q1',
        question: 'What will the following JavaScript code output?\n\nconsole.log(2 + "2");',
        options: [
          { id: 'opt1', text: '4', isCorrect: false },
          { id: 'opt2', text: '"22"', isCorrect: true },
          { id: 'opt3', text: '22', isCorrect: false },
          { id: 'opt4', text: 'TypeError', isCorrect: false }
        ],
        difficulty: 'beginner',
        correctOptionId: 'opt2',
        explanation: 'In JavaScript, when you use the + operator with a string and a number, the number is converted to a string and concatenated.',
        topicId: 'javascript',
        tags: ['javascript', 'type-coercion', 'basics']
      },
      {
        id: 'code-q2',
        question: 'Which of the following is a valid way to declare a variable in Python?',
        options: [
          { id: 'opt1', text: 'var x = 10;', isCorrect: false },
          { id: 'opt2', text: 'let x = 10;', isCorrect: false },
          { id: 'opt3', text: 'x = 10', isCorrect: true },
          { id: 'opt4', text: 'dim x as integer = 10', isCorrect: false }
        ],
        difficulty: 'beginner',
        correctOptionId: 'opt3',
        explanation: 'In Python, you can declare a variable by simply assigning a value to it using the equals sign.',
        topicId: 'python',
        tags: ['python', 'variables', 'basics']
      },
      
      // Intermediate questions
      {
        id: 'code-q3',
        question: 'What is the time complexity of the following function?\n\nfunction search(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}',
        options: [
          { id: 'opt1', text: 'O(1)', isCorrect: false },
          { id: 'opt2', text: 'O(log n)', isCorrect: false },
          { id: 'opt3', text: 'O(n)', isCorrect: true },
          { id: 'opt4', text: 'O(n²)', isCorrect: false }
        ],
        difficulty: 'intermediate',
        correctOptionId: 'opt3',
        explanation: 'This is a linear search algorithm that checks each element once, so it has O(n) time complexity.',
        topicId: 'algorithms',
        tags: ['algorithms', 'time-complexity', 'linear-search']
      },
      {
        id: 'code-q4',
        question: 'Which design pattern is being implemented in this code?\n\nclass Singleton {\n  private static instance: Singleton;\n  private constructor() {}\n  \n  public static getInstance(): Singleton {\n    if (!Singleton.instance) {\n      Singleton.instance = new Singleton();\n    }\n    return Singleton.instance;\n  }\n}',
        options: [
          { id: 'opt1', text: 'Factory Pattern', isCorrect: false },
          { id: 'opt2', text: 'Singleton Pattern', isCorrect: true },
          { id: 'opt3', text: 'Observer Pattern', isCorrect: false },
          { id: 'opt4', text: 'Decorator Pattern', isCorrect: false }
        ],
        difficulty: 'intermediate',
        correctOptionId: 'opt2',
        explanation: 'This is the Singleton Pattern, which ensures a class has only one instance and provides a global point of access to it.',
        topicId: 'design-patterns',
        tags: ['design-patterns', 'singleton', 'typescript']
      },
      
      // Advanced questions
      {
        id: 'code-q5',
        question: 'What will be the output of the following code?\n\nfunction foo() {\n  console.log(this.a);\n}\nconst obj1 = { a: 2, foo: foo };\nconst obj2 = { a: 3 };\nobj1.foo();\nconst bar = obj1.foo;\nbar();\nfoo.call(obj2);',
        options: [
          { id: 'opt1', text: '2, undefined, 3', isCorrect: true },
          { id: 'opt2', text: '2, 2, 3', isCorrect: false },
          { id: 'opt3', text: '2, 2, 2', isCorrect: false },
          { id: 'opt4', text: '2, undefined, undefined', isCorrect: false }
        ],
        difficulty: 'advanced',
        correctOptionId: 'opt1',
        explanation: 'First, obj1.foo() outputs 2 because this refers to obj1. Then, bar() is a function call without context, so this refers to the global object or undefined in strict mode. Finally, foo.call(obj2) explicitly sets this to obj2, so it outputs 3.',
        topicId: 'javascript',
        tags: ['javascript', 'this-context', 'function-binding']
      },
      {
        id: 'code-q6',
        question: 'Which statement about closures in JavaScript is NOT true?',
        options: [
          { id: 'opt1', text: 'Closures can be used to create private variables', isCorrect: false },
          { id: 'opt2', text: 'Closures always cause memory leaks', isCorrect: true },
          { id: 'opt3', text: 'A closure gives you access to an outer function\'s scope from an inner function', isCorrect: false },
          { id: 'opt4', text: 'Closures are commonly used in event handlers', isCorrect: false }
        ],
        difficulty: 'advanced',
        correctOptionId: 'opt2',
        explanation: 'Closures do not always cause memory leaks. While they can potentially lead to memory leaks if not handled properly, they are an essential and useful feature of JavaScript.',
        topicId: 'javascript',
        tags: ['javascript', 'closures', 'memory-management']
      },
      
      // Expert questions
      {
        id: 'code-q7',
        question: 'Consider the following problem: Given an array of non-negative integers representing an elevation map where the width of each bar is 1, compute how much water can be trapped after raining. What is the time complexity of the most efficient solution?',
        options: [
          { id: 'opt1', text: 'O(n²)', isCorrect: false },
          { id: 'opt2', text: 'O(n log n)', isCorrect: false },
          { id: 'opt3', text: 'O(n)', isCorrect: true },
          { id: 'opt4', text: 'O(log n)', isCorrect: false }
        ],
        difficulty: 'expert',
        correctOptionId: 'opt3',
        explanation: 'The most efficient solution uses a two-pointer approach that scans the array once, resulting in O(n) time complexity.',
        topicId: 'algorithms',
        tags: ['algorithms', 'two-pointer', 'dynamic-programming']
      },
      {
        id: 'code-q8',
        question: 'What is the output of this C++ code?\n\n#include <iostream>\n\nint main() {\n  int x = 5;\n  int y = x++;\n  int z = ++x;\n  std::cout << x << " " << y << " " << z;\n  return 0;\n}',
        options: [
          { id: 'opt1', text: '7 5 7', isCorrect: true },
          { id: 'opt2', text: '7 6 7', isCorrect: false },
          { id: 'opt3', text: '6 5 7', isCorrect: false },
          { id: 'opt4', text: '6 5 6', isCorrect: false }
        ],
        difficulty: 'expert',
        correctOptionId: 'opt1',
        explanation: 'First, y = x++ assigns the current value of x (5) to y, then increments x to 6. Then, z = ++x first increments x to 7, then assigns 7 to z. So x=7, y=5, z=7.',
        topicId: 'cpp',
        tags: ['cpp', 'increment-operators', 'operator-precedence']
      }
    ];
    
    this.questions.set(mathQuizConfig.id, mathQuestions);
    this.questions.set(codingQuizConfig.id, codingQuestions);
  }
}

// Create a singleton instance
export const adaptiveQuizService = new AdaptiveQuizService();
