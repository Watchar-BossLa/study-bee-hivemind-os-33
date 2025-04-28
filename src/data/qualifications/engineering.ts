import { SubjectArea } from '@/types/qualifications';

export const engineeringSubjectArea: SubjectArea = {
  id: "engineering",
  name: "Engineering",
  description: "Study of various engineering disciplines including mechanical, electrical, civil, and chemical engineering",
  icon: "book",
  modules: [
    {
      id: "eng-cert",
      name: "Certificate in Engineering",
      level: "certificate",
      courses: [
        { id: "eng101", name: "Engineering Mathematics", credits: 5 },
        { id: "eng102", name: "Technical Drawing", credits: 5 },
        { id: "eng103", name: "Workshop Practice", credits: 5 },
        { id: "eng104", name: "Materials Science", credits: 5 }
      ]
    },
    {
      id: "eng-cvq",
      name: "CVQ in Engineering Technology",
      level: "cvq",
      courses: [
        { id: "eng201", name: "CAD Fundamentals", credits: 10 },
        { id: "eng202", name: "Electronics Basics", credits: 10 },
        { id: "eng203", name: "Mechanical Systems", credits: 10 },
        { id: "eng204", name: "Engineering Safety", credits: 10 }
      ]
    },
    {
      id: "eng-dip",
      name: "Diploma in Engineering",
      level: "diploma",
      courses: [
        { id: "eng301", name: "Structural Analysis", credits: 15 },
        { id: "eng302", name: "Circuit Theory", credits: 15 },
        { id: "eng303", name: "Thermodynamics", credits: 15 },
        { id: "eng304", name: "Control Systems", credits: 15 }
      ]
    },
    {
      id: "eng-bach",
      name: "Bachelor of Engineering",
      level: "bachelors",
      courses: [
        { id: "eng401", name: "Advanced Mechanics", credits: 20 },
        { id: "eng402", name: "Power Systems", credits: 20 },
        { id: "eng403", name: "Manufacturing Processes", credits: 20 },
        { id: "eng404", name: "Design Engineering", credits: 20 },
        { id: "eng405", name: "Industrial Automation", credits: 20 },
        { id: "eng406", name: "Engineering Project", credits: 20 }
      ]
    },
    {
      id: "eng-mast",
      name: "Master of Engineering",
      level: "masters",
      courses: [
        { id: "eng501", name: "Advanced Engineering Mathematics", credits: 15 },
        { id: "eng502", name: "Robotics and AI", credits: 15 },
        { id: "eng503", name: "Sustainable Engineering", credits: 15 },
        { id: "eng504", name: "Engineering Research", credits: 15 },
        { id: "eng505", name: "Project Management", credits: 15 }
      ]
    }
  ]
};
