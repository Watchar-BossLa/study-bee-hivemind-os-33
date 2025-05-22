
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject_area?: string;
  difficulty?: string;
  is_preloaded?: boolean;
}

export interface EditFormData {
  question: string;
  answer: string;
}

export interface FlashcardFilter {
  subject?: string;
  difficulty?: string;
  showPreloaded?: boolean;
}
