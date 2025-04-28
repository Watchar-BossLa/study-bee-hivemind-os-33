import { SubjectArea } from '@/types/qualifications';

export const businessSubjectArea: SubjectArea = {
  id: "business",
  name: "Business Administration",
  description: "Study of management principles, organizational behavior, and business operations",
  icon: "briefcase",
  modules: [
    {
      id: "bus-cert",
      name: "Certificate in Business Administration",
      level: "certificate",
      courses: [
        { id: "bus101", name: "Introduction to Business", credits: 5 },
        { id: "bus102", name: "Business Communication", credits: 5 },
        { id: "bus103", name: "Customer Service Fundamentals", credits: 5 },
        { id: "bus104", name: "Office Administration", credits: 5 }
      ]
    },
    {
      id: "bus-cvq",
      name: "CVQ in Business Management",
      level: "cvq",
      courses: [
        { id: "bus201", name: "Small Business Management", credits: 10 },
        { id: "bus202", name: "Human Resource Practices", credits: 10 },
        { id: "bus203", name: "Marketing Basics", credits: 10 },
        { id: "bus204", name: "Business Ethics", credits: 10 }
      ]
    },
    {
      id: "bus-dip",
      name: "Diploma in Business Management",
      level: "diploma",
      courses: [
        { id: "bus301", name: "Principles of Management", credits: 15 },
        { id: "bus302", name: "Organizational Behavior", credits: 15 },
        { id: "bus303", name: "Marketing Management", credits: 15 },
        { id: "bus304", name: "Business Finance", credits: 15 }
      ]
    },
    {
      id: "bus-bach",
      name: "Bachelor of Business Administration",
      level: "bachelors",
      courses: [
        { id: "bus401", name: "Strategic Management", credits: 20 },
        { id: "bus402", name: "International Business", credits: 20 },
        { id: "bus403", name: "Corporate Finance", credits: 20 },
        { id: "bus404", name: "Business Law", credits: 20 },
        { id: "bus405", name: "Operations Management", credits: 20 },
        { id: "bus406", name: "Business Research Methods", credits: 20 }
      ]
    },
    {
      id: "bus-mast",
      name: "Master of Business Administration (MBA)",
      level: "masters",
      courses: [
        { id: "bus501", name: "Advanced Strategic Management", credits: 15 },
        { id: "bus502", name: "Leadership and Change Management", credits: 15 },
        { id: "bus503", name: "Corporate Governance", credits: 15 },
        { id: "bus504", name: "Business Analytics", credits: 15 },
        { id: "bus505", name: "Global Business Strategy", credits: 15 }
      ]
    }
  ]
};
