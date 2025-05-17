
export interface CourseProps {
  id: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  progress?: number;
  lessons?: number;
  students?: number;
  duration?: string;
  image?: string;
}

export interface CourseFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (value: string | null) => void;
  selectedLevel: string | null;
  onLevelChange: (value: string | null) => void;
  onClearFilters: () => void;
  categories: string[];
  levels: string[];
  showBookmarked: boolean;
  onToggleBookmarked: (value: boolean) => void;
}
