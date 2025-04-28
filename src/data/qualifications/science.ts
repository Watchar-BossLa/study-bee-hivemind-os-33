import { SubjectArea } from '@/types/qualifications';

export const scienceSubjectArea: SubjectArea = {
  id: "science",
  name: "Natural Sciences",
  description: "Comprehensive study of physical and life sciences including biology, chemistry, physics, and environmental science",
  icon: "book",
  modules: [
    {
      id: "sci-cert",
      name: "Certificate in Science",
      level: "certificate",
      courses: [
        { id: "sci101", name: "Introduction to Biology", credits: 5 },
        { id: "sci102", name: "Basic Chemistry", credits: 5 },
        { id: "sci103", name: "Physics Fundamentals", credits: 5 },
        { id: "sci104", name: "Environmental Science Basics", credits: 5 }
      ]
    },
    {
      id: "sci-cvq",
      name: "CVQ in Laboratory Science",
      level: "cvq",
      courses: [
        { id: "sci201", name: "Laboratory Techniques", credits: 10 },
        { id: "sci202", name: "Chemical Analysis", credits: 10 },
        { id: "sci203", name: "Biological Sampling", credits: 10 },
        { id: "sci204", name: "Lab Safety Protocols", credits: 10 }
      ]
    },
    {
      id: "sci-dip",
      name: "Diploma in Applied Sciences",
      level: "diploma",
      courses: [
        { id: "sci301", name: "Cell Biology", credits: 15 },
        { id: "sci302", name: "Organic Chemistry", credits: 15 },
        { id: "sci303", name: "Classical Mechanics", credits: 15 },
        { id: "sci304", name: "Ecology", credits: 15 }
      ]
    },
    {
      id: "sci-bach",
      name: "Bachelor of Science",
      level: "bachelors",
      courses: [
        { id: "sci401", name: "Molecular Biology", credits: 20 },
        { id: "sci402", name: "Physical Chemistry", credits: 20 },
        { id: "sci403", name: "Quantum Physics", credits: 20 },
        { id: "sci404", name: "Genetics", credits: 20 },
        { id: "sci405", name: "Biochemistry", credits: 20 },
        { id: "sci406", name: "Research Methods in Science", credits: 20 }
      ]
    },
    {
      id: "sci-mast",
      name: "Master of Science",
      level: "masters",
      courses: [
        { id: "sci501", name: "Advanced Research Methods", credits: 15 },
        { id: "sci502", name: "Bioinformatics", credits: 15 },
        { id: "sci503", name: "Environmental Analysis", credits: 15 },
        { id: "sci504", name: "Scientific Computing", credits: 15 },
        { id: "sci505", name: "Thesis Research", credits: 15 }
      ]
    }
  ]
};
