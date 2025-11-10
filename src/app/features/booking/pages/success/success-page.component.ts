import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../../../components/ui/button/button.component';
import { BookingStateService } from '../../state/booking-state.signals';

@Component({
  selector: 'app-success',
  imports: [CommonModule, Button],
  templateUrl: './success-page.component.html',
  host: {
    class: 'contents'
  }
})
export class Success {
  bookingState = inject(BookingStateService);
  // Signal properties
  sessionData = this.bookingState.sessionData;
}
