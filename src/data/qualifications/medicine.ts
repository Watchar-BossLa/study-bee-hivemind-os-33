import { SubjectArea } from '@/types/qualifications';

export const medicineSubjectArea: SubjectArea = {
  id: "medicine",
  name: "Medicine & Healthcare",
  description: "Study of medical sciences, healthcare management, and clinical practice",
  icon: "graduation-cap",
  modules: [
    {
      id: "med-cert",
      name: "Certificate in Healthcare",
      level: "certificate",
      courses: [
        { id: "med101", name: "Medical Terminology", credits: 5 },
        { id: "med102", name: "Basic Anatomy", credits: 5 },
        { id: "med103", name: "First Aid", credits: 5 },
        { id: "med104", name: "Healthcare Ethics", credits: 5 }
      ]
    },
    {
      id: "med-cvq",
      name: "CVQ in Healthcare Services",
      level: "cvq",
      courses: [
        { id: "med201", name: "Patient Care", credits: 10 },
        { id: "med202", name: "Medical Records", credits: 10 },
        { id: "med203", name: "Clinical Procedures", credits: 10 },
        { id: "med204", name: "Healthcare Safety", credits: 10 }
      ]
    },
    {
      id: "med-dip",
      name: "Diploma in Health Sciences",
      level: "diploma",
      courses: [
        { id: "med301", name: "Human Anatomy", credits: 15 },
        { id: "med302", name: "Physiology", credits: 15 },
        { id: "med303", name: "Pharmacology", credits: 15 },
        { id: "med304", name: "Clinical Practice", credits: 15 }
      ]
    },
    {
      id: "med-bach",
      name: "Bachelor of Medicine",
      level: "bachelors",
      courses: [
        { id: "med401", name: "Clinical Medicine", credits: 20 },
        { id: "med402", name: "Surgery", credits: 20 },
        { id: "med403", name: "Pathology", credits: 20 },
        { id: "med404", name: "Internal Medicine", credits: 20 },
        { id: "med405", name: "Pediatrics", credits: 20 },
        { id: "med406", name: "Medical Research", credits: 20 }
      ]
    },
    {
      id: "med-mast",
      name: "Master of Public Health",
      level: "masters",
      courses: [
        { id: "med501", name: "Epidemiology", credits: 15 },
        { id: "med502", name: "Healthcare Management", credits: 15 },
        { id: "med503", name: "Global Health", credits: 15 },
        { id: "med504", name: "Health Policy", credits: 15 },
        { id: "med505", name: "Research Methods", credits: 15 }
      ]
    }
  ]
};
