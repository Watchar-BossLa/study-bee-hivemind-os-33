
export interface Course {
  id: string;
  name: string;
  credits: number;
  description?: string;
}

export interface Module {
  id: string;
  name: string;
  level: QualificationLevelType;
  description?: string;
  learning_outcomes?: string[];
  duration?: string;
  credits_required?: number;
  courses: Course[];
}

// Define as a type alias for string literals
export type QualificationLevelType = 
  | "certificate"
  | "cvq"
  | "diploma"
  | "bachelors" 
  | "masters"
  | "professional";

// Define as an interface for the full qualification level object
export interface QualificationLevel {
  id: QualificationLevelType;
  name: string;
  description: string;
  duration?: string;
  creditValue?: string;
}

export interface SubjectArea {
  id: string;
  name: string;
  description: string;
  icon: string;
  modules: Module[];
}

export interface ProfessionalQualification {
  id: string;
  name: string;
  description: string;
  organization: string;
  modules: {
    name: string;
    courses: string[];
  }[];
}

// Add AccountingQualification type which was missing
export type AccountingQualification = ProfessionalQualification;
