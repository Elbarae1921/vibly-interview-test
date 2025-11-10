import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconName = 'clock' | 'google-meet' | 'check-circle' | 'arrow-back' | 'arrow-left' | 'arrow-right';

@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  templateUrl: './icon.component.html',
})
export class Icon {
  name = input<IconName>();
  size = input(24);
  color = input('currentColor');

  get iconPath(): string {
    return `/assets/icons/${this.name()}.svg`;
  }
}
