
import React from 'react';
import { GraduationCap } from 'lucide-react';

const LogoBee = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="relative">
        <GraduationCap className="h-7 w-7 text-bee-amber" />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-xl tracking-tight">Study Bee</span>
        <div className="h-[2px] w-full bg-gradient-to-r from-bee-amber to-transparent rounded-full"></div>
      </div>
    </div>
  );
};

export default LogoBee;
