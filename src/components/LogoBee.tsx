
import React from 'react';

interface LogoBeeProps {
  className?: string;
}

const LogoBee: React.FC<LogoBeeProps> = ({ className }) => {
  return (
    <div className={className}>
      🐝
    </div>
  );
};

export default LogoBee;
