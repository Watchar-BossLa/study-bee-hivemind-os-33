
import React from 'react';
import LearningProgress from '@/components/dashboard/LearningProgress';

const LearningProgressSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container">
        <LearningProgress />
      </div>
    </section>
  );
};

export default LearningProgressSection;
