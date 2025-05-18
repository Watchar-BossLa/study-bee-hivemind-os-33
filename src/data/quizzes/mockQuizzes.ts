
import { QuizQuestion } from '@/types/arena';
import { CurriculumQuiz, QuizAttempt } from '@/types/quiz';
import { v4 } from '@/lib/uuid';

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is the chemical symbol for gold?',
    option_a: 'Au',
    option_b: 'Ag',
    option_c: 'Fe',
    option_d: 'Cu',
    correct_answer: 'a',
    difficulty: 'easy',
    category: 'Chemistry'
  },
  {
    id: '2',
    question: 'What is the capital of France?',
    option_a: 'Berlin',
    option_b: 'London',
    option_c: 'Paris',
    option_d: 'Madrid',
    correct_answer: 'c',
    difficulty: 'easy',
    category: 'Geography'
  },
  {
    id: '3',
    question: 'Which planet is closest to the Sun?',
    option_a: 'Venus',
    option_b: 'Mercury',
    option_c: 'Earth',
    option_d: 'Mars',
    correct_answer: 'b',
    difficulty: 'easy',
    category: 'Astronomy'
  },
  {
    id: '4',
    question: 'What is the square root of 144?',
    option_a: '12',
    option_b: '14',
    option_c: '10',
    option_d: '16',
    correct_answer: 'a',
    difficulty: 'medium',
    category: 'Mathematics'
  },
  {
    id: '5',
    question: 'Which of these is NOT a programming language?',
    option_a: 'Java',
    option_b: 'Python',
    option_c: 'Leopard',
    option_d: 'Ruby',
    correct_answer: 'c',
    difficulty: 'medium',
    category: 'Computer Science'
  },
  {
    id: '6',
    question: 'What year did World War II end?',
    option_a: '1943',
    option_b: '1944',
    option_c: '1945',
    option_d: '1946',
    correct_answer: 'c',
    difficulty: 'medium',
    category: 'History'
  },
  {
    id: '7',
    question: 'What is the formula for the area of a circle?',
    option_a: 'A = πr²',
    option_b: 'A = 2πr',
    option_c: 'A = πd',
    option_d: 'A = r²',
    correct_answer: 'a',
    difficulty: 'medium',
    category: 'Mathematics'
  },
  {
    id: '8',
    question: 'What is the powerhouse of the cell?',
    option_a: 'Nucleus',
    option_b: 'Mitochondria',
    option_c: 'Endoplasmic Reticulum',
    option_d: 'Golgi Apparatus',
    correct_answer: 'b',
    difficulty: 'easy',
    category: 'Biology'
  },
  {
    id: '9',
    question: 'Which famous physicist developed the theory of general relativity?',
    option_a: 'Isaac Newton',
    option_b: 'Niels Bohr',
    option_c: 'Albert Einstein',
    option_d: 'Stephen Hawking',
    correct_answer: 'c',
    difficulty: 'medium',
    category: 'Physics'
  },
  {
    id: '10',
    question: 'What is the Pythagorean theorem?',
    option_a: 'a² + b² = c²',
    option_b: 'E = mc²',
    option_c: 'F = ma',
    option_d: 'PV = nRT',
    correct_answer: 'a',
    difficulty: 'hard',
    category: 'Mathematics'
  },
  {
    id: '11',
    question: 'Which element has the chemical symbol Pb?',
    option_a: 'Phosphorus',
    option_b: 'Lead',
    option_c: 'Potassium',
    option_d: 'Plutonium',
    correct_answer: 'b',
    difficulty: 'hard',
    category: 'Chemistry'
  },
  {
    id: '12',
    question: 'What is the largest organ in the human body?',
    option_a: 'Liver',
    option_b: 'Brain',
    option_c: 'Skin',
    option_d: 'Heart',
    correct_answer: 'c',
    difficulty: 'easy',
    category: 'Biology'
  }
];

// Mock curriculum quizzes for the quiz service
export const mockCurriculumQuizzes: CurriculumQuiz[] = [
  {
    id: '1',
    title: 'Chemistry Basics Quiz',
    description: 'Test your understanding of basic chemistry concepts',
    moduleId: 'mod1',
    courseId: 'chem101',
    subjectId: 'science',
    questions: mockQuizQuestions.filter(q => q.category === 'Chemistry'),
    difficulty: 'beginner',
    passingScore: 70,
    timeLimit: 15
  },
  {
    id: '2',
    title: 'Geography Quiz',
    description: 'Test your knowledge of world geography',
    moduleId: 'mod2',
    courseId: 'geo101',
    subjectId: 'humanities',
    questions: mockQuizQuestions.filter(q => q.category === 'Geography'),
    difficulty: 'beginner',
    passingScore: 60
  },
  {
    id: '3',
    title: 'Mathematics Quiz',
    description: 'Test your math problem-solving skills',
    moduleId: 'mod3',
    courseId: 'math101',
    subjectId: 'science',
    questions: mockQuizQuestions.filter(q => q.category === 'Mathematics'),
    difficulty: 'intermediate',
    passingScore: 75
  }
];

// Mock quiz attempts for the quiz service
export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: v4(),
    quizId: '1',
    userId: 'user-123',
    score: 80,
    maxScore: 100,
    answers: [
      {
        questionId: '1',
        selectedAnswer: 'a',
        isCorrect: true,
        timeSpent: 8
      },
      {
        questionId: '4',
        selectedAnswer: 'a',
        isCorrect: true,
        timeSpent: 12
      }
    ],
    startedAt: new Date(Date.now() - 600000).toISOString(),
    completedAt: new Date(Date.now() - 300000).toISOString(),
    passed: true
  },
  {
    id: v4(),
    quizId: '2',
    userId: 'user-123',
    score: 50,
    maxScore: 100,
    answers: [
      {
        questionId: '2',
        selectedAnswer: 'c',
        isCorrect: true,
        timeSpent: 7
      },
      {
        questionId: '6',
        selectedAnswer: 'd',
        isCorrect: false,
        timeSpent: 15
      }
    ],
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 85800000).toISOString(),
    passed: false
  }
];

// Mock quiz progress for the quiz service
export const mockQuizProgress: Record<string, number> = {
  'chem101': 80,
  'geo101': 50,
  'math101': 0
};
