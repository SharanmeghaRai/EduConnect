import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = false,
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-lg border transition-all';
  const surfaceStyles = glass
    ? 'glass-panel shadow-soft-sm'
    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-soft-sm';
  const hoverStyles = hoverEffect
    ? 'hover:shadow-soft-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5'
    : '';

  return (
    <div className={`${baseStyles} ${surfaceStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
