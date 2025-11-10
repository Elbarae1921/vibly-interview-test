import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge to handle conflicts
 *
 * @param classes - Array of class values (strings, objects, arrays)
 * @returns Merged class string with Tailwind conflicts resolved
 *
 * @example
 * cn('px-2 py-1', 'px-4') // returns 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500') // conditional classes
 */
export const cn = (...classes: ClassValue[]): string => {
  return twMerge(clsx(...classes));
};

