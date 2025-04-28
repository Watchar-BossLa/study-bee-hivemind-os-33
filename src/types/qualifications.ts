
export interface Course {
  id: string;
  name: string;
  credits: number;
  description?: string;
}

export interface Module {
  id: string;
  name: string;
  level: QualificationLevel;
  description?: string;
  learning_outcomes?: string[];
  duration?: string;
  credits_required?: number;
  courses: Course[];
}

export type QualificationLevel = 
  | "certificate"
  | "cvq"
  | "diploma"
  | "bachelors" 
  | "masters"
  | "professional";

export interface QualificationLevel {
  id: string;
  name: string;
  description: string;
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
