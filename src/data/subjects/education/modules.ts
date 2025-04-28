
import { Module } from '@/types/qualifications';
import { 
  certificateCourses, 
  cvqCourses, 
  diplomaCourses, 
  bachelorsCourses, 
  mastersCourses 
} from './courses';

export const educationModules: Module[] = [
  {
    id: "edu-cert",
    name: "Certificate in Education",
    level: "certificate",
    description: "Foundation program introducing key concepts in teaching and classroom management",
    learning_outcomes: [
      "Understand basic educational theories and their classroom applications",
      "Develop fundamental classroom management skills",
      "Create simple instructional materials and lesson plans",
      "Apply basic assessment techniques in educational settings"
    ],
    duration: "6 months",
    credits_required: 20,
    courses: certificateCourses
  },
  {
    id: "edu-cvq",
    name: "CVQ in Education Assistant",
    level: "cvq",
    description: "Vocational qualification focused on practical classroom support and educational assistance",
    learning_outcomes: [
      "Support lead teachers in classroom activities and management",
      "Prepare effective teaching materials and resources",
      "Assist students with special educational needs",
      "Implement basic assessment and evaluation tasks"
    ],
    duration: "9 months",
    credits_required: 40,
    courses: cvqCourses
  },
  {
    id: "edu-dip",
    name: "Diploma in Education",
    level: "diploma",
    description: "Comprehensive program covering core teaching methodologies and educational psychology",
    learning_outcomes: [
      "Apply educational psychology principles in diverse learning environments",
      "Design and develop curriculum materials for different educational levels",
      "Implement various teaching methods to address diverse learning styles",
      "Conduct formal and informal assessments to evaluate student learning"
    ],
    duration: "1 year",
    credits_required: 60,
    courses: diplomaCourses
  },
  {
    id: "edu-bach",
    name: "Bachelor of Education",
    level: "bachelors",
    description: "Comprehensive degree program preparing professional educators with advanced knowledge and practical skills",
    learning_outcomes: [
      "Critically evaluate learning theories and apply them in educational practice",
      "Design inclusive educational experiences for diverse learner populations",
      "Integrate educational technology to enhance teaching and learning",
      "Conduct educational research to improve classroom practices",
      "Demonstrate leadership skills in educational settings"
    ],
    duration: "4 years",
    credits_required: 120,
    courses: bachelorsCourses
  },
  {
    id: "edu-mast",
    name: "Master of Education",
    level: "masters",
    description: "Advanced graduate program focusing on specialized areas of educational leadership and research",
    learning_outcomes: [
      "Critically analyze advanced educational psychology concepts",
      "Design and implement curriculum innovations based on research",
      "Lead educational institutions through change and improvement processes",
      "Conduct original research addressing significant educational challenges",
      "Develop policies that address contemporary educational issues"
    ],
    duration: "2 years",
    credits_required: 60,
    courses: mastersCourses
  }
];
