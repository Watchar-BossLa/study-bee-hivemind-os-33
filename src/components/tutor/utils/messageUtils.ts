
export const assessComplexity = (message: string): 'low' | 'medium' | 'high' => {
  const wordCount = message.split(/\s+/).length;
  const complexTerms = ['explain', 'compare', 'analyze', 'evaluate', 'synthesize', 'why', 'how'];
  const hasComplexTerms = complexTerms.some(term => message.toLowerCase().includes(term));
  const complexSubjects = ['quantum', 'calculus', 'algorithm', 'theorem', 'philosophy', 'genetics'];
  const hasComplexSubject = complexSubjects.some(subject => message.toLowerCase().includes(subject));
  
  if (wordCount > 25 || hasComplexSubject) {
    return 'high';
  } else if (wordCount > 10 || hasComplexTerms) {
    return 'medium';
  } else {
    return 'low';
  }
};
