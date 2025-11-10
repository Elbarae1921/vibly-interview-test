import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnDirective } from "../../../shared/directives/cn.directive";

export type ButtonVariant = 'primary' | 'outlined';

@Component({
  selector: 'app-button',
  imports: [CommonModule, CnDirective],
  templateUrl: './button.component.html',
})
export class Button {
  variant = input<ButtonVariant>('primary');
  disabled = input(false);
  type = input<'button' | 'submit' | 'reset'>('button');
}

