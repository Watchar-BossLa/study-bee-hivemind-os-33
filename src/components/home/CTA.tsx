
import React from 'react';
import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="py-20 bg-bee-dark text-white">
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of students using Study Bee to master new subjects faster than ever before.
        </p>
        <Button size="lg" className="bg-bee-amber hover:bg-bee-honey text-bee-dark">
          Get Started Free
        </Button>
      </div>
    </section>
  );
};

export default CTA;
