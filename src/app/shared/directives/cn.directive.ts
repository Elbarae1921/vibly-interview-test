import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { type ClassValue } from 'clsx';
import { cn } from '../utils/class.utils';

/**
 * Directive to merge Tailwind CSS classes using the cn utility
 *
 * @example
 * <div [cn]="['base-class', 'p-4', isActive && 'active']">Content</div>
 *
 * @example
 * <button [cn]="['btn', variant === 'primary' && 'btn-primary']">Click</button>
 */
@Directive({
  selector: '[cn]',
})
export class CnDirective implements OnChanges {
  @Input() cn: ClassValue | ClassValue[] = [];

  private previousClasses = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(): void {
    this.updateClasses();
  }

  private updateClasses(): void {
    // Remove previous classes
    if (this.previousClasses) {
      this.previousClasses.split(' ').forEach((cls) => {
        if (cls.trim()) {
          this.renderer.removeClass(this.el.nativeElement, cls);
        }
      });
    }

    // Apply new classes
    const classes = Array.isArray(this.cn) ? cn(...this.cn) : cn(this.cn);
    this.previousClasses = classes;

    if (classes) {
      classes.split(' ').forEach((cls) => {
        if (cls.trim()) {
          this.renderer.addClass(this.el.nativeElement, cls);
        }
      });
    }
  }
}

