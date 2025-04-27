
export interface Course {
  id: string;
  name: string;
  credits: number;
  description?: string;
}

export interface Module {
  id: string;
  name: string;
  level: string;
  courses: Course[];
  description?: string;
}

export interface SubjectArea {
  id: string;
  name: string;
  description: string;
  icon: string;
  modules: Module[];
}

export interface QualificationLevel {
  id: string;
  name: string;
  description: string;
  duration: string;
  creditValue: string;
}

export interface AccountingModule {
  name: string;
  courses: string[];
}

export interface AccountingQualification {
  id: string;
  name: string;
  description: string;
  modules: AccountingModule[];
}
