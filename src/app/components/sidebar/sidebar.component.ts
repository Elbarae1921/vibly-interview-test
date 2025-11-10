import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionDetails } from '../../features/booking/models/booking.models';
import { Icon } from '../ui/icon/icon.component';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, Icon],
  templateUrl: './sidebar.component.html',
})
export class Sidebar {
  session = input.required<SessionDetails>();
}
