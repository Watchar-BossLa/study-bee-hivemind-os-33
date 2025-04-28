import { SubjectArea } from '@/types/qualifications';

export const itSubjectArea: SubjectArea = {
  id: "it",
  name: "Information Technology",
  description: "Study of computing systems, software development, and digital technologies",
  icon: "graduation-cap",
  modules: [
    {
      id: "it-cert",
      name: "Certificate in IT",
      level: "certificate",
      courses: [
        { id: "it101", name: "Computer Fundamentals", credits: 5 },
        { id: "it102", name: "Introduction to Programming", credits: 5 },
        { id: "it103", name: "Web Design Basics", credits: 5 },
        { id: "it104", name: "IT Support Essentials", credits: 5 }
      ]
    },
    {
      id: "it-cvq",
      name: "CVQ in Information Technology",
      level: "cvq",
      courses: [
        { id: "it201", name: "Network Fundamentals", credits: 10 },
        { id: "it202", name: "Database Essentials", credits: 10 },
        { id: "it203", name: "Computer Maintenance", credits: 10 },
        { id: "it204", name: "Web Development", credits: 10 }
      ]
    },
    {
      id: "it-dip",
      name: "Diploma in Information Technology",
      level: "diploma",
      courses: [
        { id: "it301", name: "Programming Concepts", credits: 15 },
        { id: "it302", name: "Systems Analysis & Design", credits: 15 },
        { id: "it303", name: "Database Management", credits: 15 },
        { id: "it304", name: "Network Administration", credits: 15 }
      ]
    },
    {
      id: "it-bach",
      name: "Bachelor of Science in Information Technology",
      level: "bachelors",
      courses: [
        { id: "it401", name: "Software Engineering", credits: 20 },
        { id: "it402", name: "Data Structures & Algorithms", credits: 20 },
        { id: "it403", name: "Web Application Development", credits: 20 },
        { id: "it404", name: "Cybersecurity", credits: 20 },
        { id: "it405", name: "Mobile Development", credits: 20 },
        { id: "it406", name: "IT Project Management", credits: 20 }
      ]
    },
    {
      id: "it-mast",
      name: "Master of Science in Information Technology",
      level: "masters",
      courses: [
        { id: "it501", name: "Advanced Software Architecture", credits: 15 },
        { id: "it502", name: "Big Data Analytics", credits: 15 },
        { id: "it503", name: "Cloud Computing", credits: 15 },
        { id: "it504", name: "AI and Machine Learning", credits: 15 },
        { id: "it505", name: "Research Methods in IT", credits: 15 }
      ]
    }
  ]
};
