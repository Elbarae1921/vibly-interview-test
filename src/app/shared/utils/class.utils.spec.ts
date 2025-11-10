import { cn } from './class.utils';

describe('ClassUtils', () => {
  describe('cn', () => {
    it('should merge multiple class strings', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
      expect(result).toBe('base-class conditional-class');
    });

    it('should merge Tailwind classes and resolve conflicts', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });

    it('should handle objects with boolean values', () => {
      const result = cn('base', {
        active: true,
        disabled: false,
        'hover-effect': true,
      });
      expect(result).toBe('base active hover-effect');
    });

    it('should handle arrays', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle undefined and null values', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should merge conflicting Tailwind utilities correctly', () => {
      const result = cn('text-red-500 bg-blue-500', 'text-green-500');
      expect(result).toBe('bg-blue-500 text-green-500');
    });

    it('should handle empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });
  });
});

