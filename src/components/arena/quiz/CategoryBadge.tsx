
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CategoryBadgeProps {
  category: string;
}

export const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  return (
    <Badge variant="info" className="text-xs">
      {category}
    </Badge>
  );
};
