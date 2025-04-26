
import React from 'react';

const LogoBee = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <div className="hex w-8 h-5 bg-bee-amber">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-bold text-bee-dark">B</span>
          </div>
        </div>
      </div>
      <span className="ml-3 font-bold text-xl">Study Bee</span>
    </div>
  );
};

export default LogoBee;
