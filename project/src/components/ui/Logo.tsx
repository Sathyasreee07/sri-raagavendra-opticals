import React from 'react';
import { Glasses } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-8' }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <div className="absolute inset-0 bg-primary-800 rounded-full"></div>
      <Glasses className="relative z-10 text-white w-3/4 h-3/4" />
      <div className="absolute -bottom-1 -right-1 w-1/3 h-1/3 bg-secondary-500 rounded-full"></div>
    </div>
  );
};

export default Logo;