import React from 'react';
import { cn } from '../Utils/cn';
import type { AvatarProps } from '../Types';

const getInitials = (firstName?: string, lastName?: string, name?: string) => {
  const safeFirst = (firstName || '').trim();
  const safeLast = (lastName || '').trim();

  if (safeFirst || safeLast) {
    const firstChar = safeFirst ? safeFirst[0] : '';
    const lastChar = safeLast ? safeLast[0] : '';
    return `${firstChar}${lastChar}`.toUpperCase() || 'A';
  }

  const safeName = (name || '').trim();
  if (safeName) {
    const parts = safeName.split(/\s+/).filter(Boolean);
    const firstChar = parts[0]?.[0] || '';
    const lastChar = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return `${firstChar}${lastChar}`.toUpperCase() || 'A';
  }

  return 'A';
};

const Avatar: React.FC<AvatarProps> = ({ firstName, lastName, name, imageUrl, className, textClassName, }) => {
  const initials = getInitials(firstName, lastName, name);

  return (
    <div className={cn('flex items-center justify-center overflow-hidden', className)}>
      {imageUrl ? (
        <img src={imageUrl} alt="User avatar" className="h-full w-full object-cover" />
      ) : (
        <span className={cn('font-black text-white', textClassName)}>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
