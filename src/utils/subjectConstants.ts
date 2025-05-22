
export const SUBJECTS = [
  'accounting',
  'business',
  'it',
  'science',
  'medicine',
  'engineering',
  'general'
];

export const DIFFICULTIES = [
  'beginner',
  'intermediate',
  'advanced'
];

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
