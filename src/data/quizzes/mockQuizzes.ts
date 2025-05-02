
import { CurriculumQuiz, QuizAttempt } from '@/types/quiz';
import { QuizQuestion } from '@/types/arena';

// Mock quiz questions
export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the main principle of Study Bee?',
    option_a: 'Memorization through repetition',
    option_b: 'Adaptive learning based on performance',
    option_c: 'Fixed curriculum for all students',
    option_d: 'Learning without assessment',
    correct_answer: 'b',
    difficulty: 'beginner',
    category: 'Education'
  },
  {
    id: 'q2',
    question: 'Which component powers the Study Bee recommendation engine?',
    option_a: 'Neural networks',
    option_b: 'Blockchain',
    option_c: 'QuorumForge agent fabric',
    option_d: 'Simple rule-based system',
    correct_answer: 'c',
    difficulty: 'intermediate',
    category: 'Technology'
  },
  {
    id: 'q3',
    question: 'How many subjects does Study Bee support?',
    option_a: 'Around 50',
    option_b: 'Around 200',
    option_c: 'Around 400',
    option_d: 'Around 1000',
    correct_answer: 'c',
    difficulty: 'beginner',
    category: 'Education'
  },
  {
    id: 'q4',
    question: 'Which algorithm is used for spaced repetition in Study Bee?',
    option_a: 'SM-1',
    option_b: 'SM-2⁺',
    option_c: 'Leitner System',
    option_d: 'SuperMemo 18',
    correct_answer: 'b',
    difficulty: 'intermediate',
    category: 'Education'
  },
  {
    id: 'q5',
    question: 'What type of architecture does Study Bee use?',
    option_a: 'Monolithic',
    option_b: 'Serverless only',
    option_c: 'Python-first micro-service',
    option_d: 'JavaScript-based full stack',
    correct_answer: 'c',
    difficulty: 'advanced',
    category: 'Technology'
  }
];

// Mock curriculum quizzes
export const mockCurriculumQuizzes: CurriculumQuiz[] = [
  {
    id: 'cq1',
    title: 'Introduction to Study Bee',
    description: 'Test your knowledge about Study Bee fundamentals',
    moduleId: 'm1',
    courseId: 'c1',
    subjectId: 's1',
    questions: mockQuizQuestions.slice(0, 3),
    difficulty: 'beginner',
    passingScore: 2,
    timeLimit: 5
  },
  {
    id: 'cq2',
    title: 'Advanced Study Bee Features',
    description: 'Test your knowledge of advanced Study Bee features',
    moduleId: 'm1',
    courseId: 'c1',
    subjectId: 's1',
    questions: mockQuizQuestions.slice(2, 5),
    difficulty: 'intermediate',
    passingScore: 2,
    timeLimit: 10
  },
  {
    id: 'cq3',
    title: 'Study Bee Architecture',
    description: 'Test your understanding of Study Bee technical architecture',
    moduleId: 'm2',
    courseId: 'c2',
    subjectId: 's2',
    questions: [mockQuizQuestions[4], mockQuizQuestions[1]],
    difficulty: 'advanced',
    passingScore: 1,
    attempts: 3
  }
];

// Mock quiz attempts
export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: 'a1',
    quizId: 'cq1',
    userId: 'u1',
    score: 2,
    maxScore: 3,
    answers: [
      {
        questionId: 'q1',
        selectedAnswer: 'b',
        isCorrect: true,
        timeSpent: 20
      },
      {
        questionId: 'q2',
        selectedAnswer: 'c',
        isCorrect: true,
        timeSpent: 25
      },
      {
        questionId: 'q3',
        selectedAnswer: 'b',
        isCorrect: false,
        timeSpent: 15
      }
    ],
    startedAt: '2025-04-20T14:30:00.000Z',
    completedAt: '2025-04-20T14:34:00.000Z',
    passed: true
  }
];

// Mock quiz progress
export const mockQuizProgress: Record<string, number> = {
  'cq1': 2,
  'cq3': 1
};
