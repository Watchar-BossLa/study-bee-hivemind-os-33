
import React from 'react';
import { BookmarkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CourseHeaderProps {
  bookmarkCount?: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ bookmarkCount = 0 }) => {
  return (
    <div className="bg-gradient-to-r from-bee-amber/20 to-bee-honey/10 py-12 border-b">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Courses</h1>
            <p className="text-muted-foreground mt-2">
              Browse our extensive collection of courses designed to help you master any subject
            </p>
          </div>
          
          {bookmarkCount > 0 && (
            <div className="mt-4 md:mt-0">
              <Badge variant="outline" className="flex items-center gap-1.5 py-1.5 px-3 bg-background">
                <BookmarkIcon className="h-3.5 w-3.5" />
                <span>{bookmarkCount} Saved {bookmarkCount === 1 ? 'Course' : 'Courses'}</span>
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
