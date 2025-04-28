import { SubjectArea, QualificationLevel } from '@/types/qualifications';

// Qualification levels
export const qualificationLevels: QualificationLevel[] = [
  {
    id: "certificate",
    name: "Certificate",
    description: "Foundation level qualifications focusing on core knowledge and skills",
    duration: "3-12 months",
    creditValue: "15-30 credits"
  },
  {
    id: "cvq",
    name: "Caribbean Vocational Qualification (CVQ)",
    description: "Competency-based qualifications for vocational skills and workforce preparation",
    duration: "6-18 months",
    creditValue: "30-60 credits"
  },
  {
    id: "diploma",
    name: "Diploma",
    description: "Intermediate qualification demonstrating specialized knowledge in a field",
    duration: "1-2 years",
    creditValue: "60-120 credits"
  },
  {
    id: "bachelors",
    name: "Bachelor's Degree",
    description: "Comprehensive undergraduate qualification covering theoretical and practical aspects",
    duration: "3-4 years",
    creditValue: "180-240 credits"
  },
  {
    id: "masters",
    name: "Master's Degree",
    description: "Advanced postgraduate qualification with specialization and research components",
    duration: "1-2 years",
    creditValue: "60-120 credits"
  }
];

// Subject areas with modules for different qualification levels
export const subjectAreas: SubjectArea[] = [
  {
    id: "accounting",
    name: "Accounting",
    description: "Study of financial information for decision-making, reporting, and compliance",
    icon: "book-text",
    modules: [
      {
        id: "acct-cert",
        name: "Certificate in Accounting",
        level: "certificate",
        courses: [
          { id: "acct101", name: "Bookkeeping Fundamentals", credits: 5 },
          { id: "acct102", name: "Basic Financial Statements", credits: 5 },
          { id: "acct103", name: "Introduction to Taxation", credits: 5 },
          { id: "acct104", name: "Payroll Processing", credits: 5 }
        ]
      },
      {
        id: "acct-cvq",
        name: "CVQ in Accounting",
        level: "cvq",
        courses: [
          { id: "acct201", name: "Financial Accounting Practices", credits: 10 },
          { id: "acct202", name: "Computerized Accounting", credits: 10 },
          { id: "acct203", name: "Business Taxation", credits: 10 },
          { id: "acct204", name: "Cost Accounting Basics", credits: 10 }
        ]
      },
      {
        id: "acct-dip",
        name: "Diploma in Accounting",
        level: "diploma",
        courses: [
          { id: "acct301", name: "Intermediate Financial Accounting", credits: 15 },
          { id: "acct302", name: "Management Accounting", credits: 15 },
          { id: "acct303", name: "Taxation Planning", credits: 15 },
          { id: "acct304", name: "Audit Fundamentals", credits: 15 }
        ]
      },
      {
        id: "acct-bach",
        name: "Bachelor of Accounting",
        level: "bachelors",
        courses: [
          { id: "acct401", name: "Advanced Financial Accounting", credits: 20 },
          { id: "acct402", name: "Corporate Finance", credits: 20 },
          { id: "acct403", name: "Advanced Taxation", credits: 20 },
          { id: "acct404", name: "Audit & Assurance", credits: 20 },
          { id: "acct405", name: "Financial Reporting", credits: 20 },
          { id: "acct406", name: "Strategic Management Accounting", credits: 20 }
        ]
      },
      {
        id: "acct-mast",
        name: "Master of Accounting",
        level: "masters",
        courses: [
          { id: "acct501", name: "Advanced Financial Reporting", credits: 15 },
          { id: "acct502", name: "Strategic Financial Management", credits: 15 },
          { id: "acct503", name: "International Taxation", credits: 15 },
          { id: "acct504", name: "Forensic Accounting", credits: 15 },
          { id: "acct505", name: "Research Methods in Accounting", credits: 15 }
        ]
      },
      {
        id: "acca",
        name: "ACCA Qualification",
        level: "professional",
        courses: [
          { id: "acca-f1", name: "Accountant in Business", credits: 10 },
          { id: "acca-f2", name: "Management Accounting", credits: 10 },
          { id: "acca-f3", name: "Financial Accounting", credits: 10 },
          { id: "acca-f4", name: "Corporate and Business Law", credits: 10 },
          { id: "acca-f5", name: "Performance Management", credits: 10 },
          { id: "acca-f6", name: "Taxation", credits: 10 },
          { id: "acca-f7", name: "Financial Reporting", credits: 10 },
          { id: "acca-f8", name: "Audit and Assurance", credits: 10 },
          { id: "acca-f9", name: "Financial Management", credits: 10 }
        ]
      },
      {
        id: "cpa",
        name: "CPA Certification",
        level: "professional",
        courses: [
          { id: "cpa-aud", name: "Auditing and Attestation", credits: 15 },
          { id: "cpa-bec", name: "Business Environment and Concepts", credits: 15 },
          { id: "cpa-far", name: "Financial Accounting and Reporting", credits: 15 },
          { id: "cpa-reg", name: "Regulation", credits: 15 }
        ]
      }
    ]
  },
  {
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
  },
  {
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
  },
  {
    id: "education",
    name: "Education",
    description: "Study of teaching methodologies, educational psychology, and curriculum development",
    icon: "school",
    modules: [
      {
        id: "edu-cert",
        name: "Certificate in Education",
        level: "certificate",
        courses: [
          { id: "edu101", name: "Introduction to Teaching", credits: 5 },
          { id: "edu102", name: "Child Development", credits: 5 },
          { id: "edu103", name: "Classroom Management", credits: 5 },
          { id: "edu104", name: "Instructional Materials Development", credits: 5 }
        ]
      },
      {
        id: "edu-cvq",
        name: "CVQ in Education Assistant",
        level: "cvq",
        courses: [
          { id: "edu201", name: "Teaching Aids Preparation", credits: 10 },
          { id: "edu202", name: "Special Needs Support", credits: 10 },
          { id: "edu203", name: "Early Childhood Care", credits: 10 },
          { id: "edu204", name: "Basic Assessment Techniques", credits: 10 }
        ]
      },
      {
        id: "edu-dip",
        name: "Diploma in Education",
        level: "diploma",
        courses: [
          { id: "edu301", name: "Educational Psychology", credits: 15 },
          { id: "edu302", name: "Curriculum Development", credits: 15 },
          { id: "edu303", name: "Teaching Methods", credits: 15 },
          { id: "edu304", name: "Assessment & Evaluation", credits: 15 }
        ]
      },
      {
        id: "edu-bach",
        name: "Bachelor of Education",
        level: "bachelors",
        courses: [
          { id: "edu401", name: "Learning Theories", credits: 20 },
          { id: "edu402", name: "Inclusive Education", credits: 20 },
          { id: "edu403", name: "Educational Technology", credits: 20 },
          { id: "edu404", name: "Teaching Practicum", credits: 20 },
          { id: "edu405", name: "Educational Research", credits: 20 },
          { id: "edu406", name: "Classroom Leadership", credits: 20 }
        ]
      },
      {
        id: "edu-mast",
        name: "Master of Education",
        level: "masters",
        courses: [
          { id: "edu501", name: "Advanced Educational Psychology", credits: 15 },
          { id: "edu502", name: "Curriculum Theory & Design", credits: 15 },
          { id: "edu503", name: "Educational Leadership", credits: 15 },
          { id: "edu504", name: "Action Research in Education", credits: 15 },
          { id: "edu505", name: "Contemporary Issues in Education", credits: 15 }
        ]
      }
    ]
  },
  {
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
  },
  {
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
  },
  {
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
  }
];

// Additional international accounting qualifications
export const accountingQualifications = [
  {
    id: "acca",
    name: "Association of Chartered Certified Accountants (ACCA)",
    description: "Globally recognized professional accounting qualification",
    modules: [
      { name: "Applied Knowledge", courses: ["Business and Technology", "Management Accounting", "Financial Accounting"] },
      { name: "Applied Skills", courses: ["Corporate and Business Law", "Performance Management", "Taxation", "Financial Reporting", "Audit and Assurance", "Financial Management"] },
      { name: "Strategic Professional", courses: ["Strategic Business Leader", "Strategic Business Reporting", "Advanced Financial Management", "Advanced Performance Management", "Advanced Taxation", "Advanced Audit and Assurance"] }
    ]
  },
  {
    id: "cima",
    name: "Chartered Institute of Management Accountants (CIMA)",
    description: "Leading professional body for management accountants",
    modules: [
      { name: "Certificate Level", courses: ["BA1: Fundamentals of Business Economics", "BA2: Fundamentals of Management Accounting", "BA3: Fundamentals of Financial Accounting", "BA4: Fundamentals of Ethics, Corporate Governance and Business Law"] },
      { name: "Operational Level", courses: ["E1: Organizational Management", "P1: Management Accounting", "F1: Financial Reporting and Taxation"] },
      { name: "Management Level", courses: ["E2: Project and Relationship Management", "P2: Advanced Management Accounting", "F2: Advanced Financial Reporting"] },
      { name: "Strategic Level", courses: ["E3: Strategic Management", "P3: Risk Management", "F3: Financial Strategy"] }
    ]
  },
  {
    id: "cpa",
    name: "Certified Public Accountant (CPA)",
    description: "US-based professional accounting designation",
    modules: [
      { name: "Core Exam Sections", courses: ["Auditing and Attestation (AUD)", "Business Environment and Concepts (BEC)", "Financial Accounting and Reporting (FAR)", "Regulation (REG)"] }
    ]
  },
  {
    id: "cga",
    name: "Chartered Professional Accountant (CPA Canada)",
    description: "Canadian professional accounting designation",
    modules: [
      { name: "PEP Core Modules", courses: ["Core 1", "Core 2"] },
      { name: "PEP Elective Modules", courses: ["Assurance", "Finance", "Information Technology", "Performance Management", "Taxation"] },
      { name: "Capstone Modules", courses: ["Capstone 1: Integrative Analysis", "Capstone 2: Examination Preparation"] }
    ]
  }
];
