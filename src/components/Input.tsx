import React from 'react';
import { cn } from '../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  className,
  label,
  error,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 ml-1">
          {label}
        </label>
      )}
      <input
        className={cn(
          'block w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all sm:text-sm',
          error ? 'border-red-500' : 'border-gray-100 dark:border-slate-700',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-red-500 ml-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
