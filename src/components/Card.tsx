import React from 'react';
import { cn } from '../utils/cn';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerActions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className,
  headerActions,
}) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10',
        className
      )}
    >
      {(title || subtitle || headerActions) && (
        <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-1">
            {title && (
              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      <div className="p-8">{children}</div>
    </div>
  );
};

export default Card;
