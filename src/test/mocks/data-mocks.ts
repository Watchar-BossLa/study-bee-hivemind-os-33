
// Mock data for testing

export const mockCourses = [
  {
    id: "c1",
    title: "Introduction to Biology",
    category: "Science",
    level: "Beginner",
    description: "Learn the fundamentals of biology with interactive lessons.",
    lessons: 12,
    students: 1024,
    duration: "6 hours",
  },
  {
    id: "c2",
    title: "Advanced Mathematics",
    category: "Mathematics",
    level: "Advanced",
    description: "Dive deep into complex mathematical concepts.",
    lessons: 18,
    students: 768,
    duration: "10 hours",
  },
];

export const mockModules = [
  {
    id: "m1",
    title: "Cell Biology",
    courseId: "c1",
    sections: [
      {
        id: "s1",
        title: "Cell Structure",
        lessons: [
          {
            id: "l1",
            title: "Introduction to Cells",
            type: "video",
            duration: "10 minutes",
            content: "This lesson covers the basic structure of cells.",
            completed: false,
          },
          {
            id: "l2",
            title: "Cell Organelles",
            type: "reading",
            duration: "15 minutes",
            content: "Learn about different cell organelles and their functions.",
            completed: false,
          },
        ],
      },
    ],
  },
];

export const mockThemeSettings = {
  fontFamily: "system-ui, sans-serif",
  fontScale: 1,
  animationSpeed: 1,
  contrastLevel: 1,
  colorPalette: "Default",
  reduceMotion: "off" as const,
};

export const mockThemePresets = [
  {
    id: "preset_1",
    name: "Dark Mode Pro",
    baseTheme: "dark" as const,
    colors: {
      primary: "#7c3aed",
      background: "#121212",
    },
    createdAt: 1683123456789,
  },
];

export const mockUserSession = {
  userId: "user123",
  name: "Test User",
  email: "test@example.com",
  isAuthenticated: true,
};
