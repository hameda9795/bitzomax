import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const ProgressBar = ({ 
  progress, 
  label, 
  showValue = false, 
  className = ''
}: ProgressBarProps) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <p className="text-sm font-medium">{label}</p>}
      
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      
      {showValue && (
        <p className="text-xs text-right text-gray-500">{Math.round(clampedProgress)}%</p>
      )}
    </div>
  );
};