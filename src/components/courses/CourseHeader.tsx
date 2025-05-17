
import React from 'react';
import { Bookmark } from 'lucide-react';

interface CourseHeaderProps {
  isBookmarkMode?: boolean;
  bookmarkCount?: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ isBookmarkMode = false, bookmarkCount = 0 }) => {
  return (
    <section className="bg-bee-light py-12">
      <div className="container">
        {isBookmarkMode ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Bookmark className="h-5 w-5 fill-bee-amber stroke-bee-amber" />
              <h1 className="text-3xl font-bold">Saved Courses</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              You have bookmarked {bookmarkCount} {bookmarkCount === 1 ? 'course' : 'courses'}.
              These are courses you've saved for later.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">Course Catalog</h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse our extensive library of courses across 400+ subjects from IGCSE through MBA level. 
              Use AI-powered learning to master any topic at your own pace.
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default CourseHeader;
