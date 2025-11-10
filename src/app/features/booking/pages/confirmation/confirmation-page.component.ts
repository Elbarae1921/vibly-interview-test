import { Component, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Button } from '../../../../components/ui/button/button.component';
import { BookingStateService } from '../../state/booking-state.signals';
import { BookingApiService } from '../../services/booking-api.service';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule, Button],
  templateUrl: './confirmation-page.component.html',
  host: {
    class: 'contents',
  },
})
export class Confirmation {
  bookingState = inject(BookingStateService);
  bookingApi = inject(BookingApiService);
  router = inject(Router);

  // Signal properties
  sessionData = this.bookingState.sessionData;
  formattedSelectedDate = this.bookingState.formattedSelectedDate;
  formattedTimeRange = this.bookingState.formattedTimeRange;
  timezone = this.bookingState.timezone;

  // Loading state
  isSubmitting = signal(false);

  // Computed user properties from session data
  userName = computed(() => {
    const session = this.sessionData();
    if (!session) return '';
    return `${session.user.firstName} ${session.user.lastName}`.trim();
  });

  userEmail = computed(() => {
    const session = this.sessionData();
    return session?.user.email || '';
  });

  ngOnInit(): void {
    if (
      !this.bookingState.selectedDate() ||
      !this.bookingState.selectedTime() ||
      !this.sessionData()
    ) {
      this.router.navigate(['/booking']);
    }
  }

  onBack(): void {
    this.router.navigate(['/booking']);
  }

  onConfirm(): void {
    const selectedDate = this.bookingState.selectedDate();
    const selectedTime = this.bookingState.selectedTime();
    const session = this.sessionData();

    if (!selectedDate || !selectedTime || !session || this.isSubmitting()) return;

    const bookingRequest = {
      sessionId: session.id,
      hostId: session.host.id,
      date: selectedDate.toISOString(),
      time: selectedTime.time,
      timezone: this.bookingState.timezone(),
      userName: this.userName(),
      userEmail: this.userEmail(),
    };

    this.isSubmitting.set(true);

    this.bookingApi.submitBooking(bookingRequest).subscribe({
      next: (response) => {
        console.log('Booking confirmed:', response);
        this.isSubmitting.set(false);
        this.router.navigate(['/booking/success']);
      },
      error: (error) => {
        console.error('Error confirming booking:', error);
        this.isSubmitting.set(false);
        this.bookingState.setError('Failed to confirm booking');
      },
    });
  }
}
