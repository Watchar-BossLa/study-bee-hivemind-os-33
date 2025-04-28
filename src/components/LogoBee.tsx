
import React from 'react';

const LogoBee = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="relative">
        <div className="hex w-9 h-6 bg-gradient-to-br from-bee-amber to-bee-honey">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-bold text-white text-lg tracking-wide">B</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-xl tracking-tight">Study Bee</span>
        <div className="h-[2px] w-full bg-gradient-to-r from-bee-amber to-transparent rounded-full"></div>
      </div>
    </div>
  );
};

export default LogoBee;
