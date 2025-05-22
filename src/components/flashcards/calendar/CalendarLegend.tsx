
import React from 'react';

const CalendarLegend = () => {
  return (
    <div className="flex items-center justify-end space-x-2 mt-4">
      <span className="text-xs text-muted-foreground">Less</span>
      <div className="flex space-x-1">
        <div className="w-3 h-3 rounded-sm bg-muted/40"></div>
        <div className="w-3 h-3 rounded-sm bg-green-100 dark:bg-green-900/30"></div>
        <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-800/40"></div>
        <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700/50"></div>
        <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600/60"></div>
        <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-500/70"></div>
      </div>
      <span className="text-xs text-muted-foreground">More</span>
    </div>
  );
};

export default CalendarLegend;
