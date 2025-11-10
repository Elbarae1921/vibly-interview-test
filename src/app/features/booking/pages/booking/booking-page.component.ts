import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Calendar } from '../../../../components/calendar/calendar.component';
import { BookingStateService } from '../../state/booking-state.signals';
import { BookingApiService } from '../../services/booking-api.service';
import { TimeSlot } from '../../models/booking.models';
import { TimeSlotPicker } from '../../../../components/time-slot-picker/time-slot-picker.component';
import { Icon } from '../../../../components/ui/icon/icon.component';
import { CnDirective } from "../../../../shared/directives/cn.directive";

@Component({
  selector: 'app-booking',
  imports: [CommonModule, Calendar, TimeSlotPicker, Icon, CnDirective],
  templateUrl: './booking-page.component.html',
  host: {
    class: 'contents'
  }
})
export class Booking implements OnInit {
  router = inject(Router);
  bookingState = inject(BookingStateService);
  bookingApi = inject(BookingApiService);

  availableDates = this.bookingState.availableDates;
  selectedDate = this.bookingState.selectedDate;
  currentMonth = this.bookingState.currentMonth;
  timezone = this.bookingState.timezone;
  formattedSelectedDate = this.bookingState.formattedSelectedDate
  timeSlots = this.bookingState.timeSlotsForSelectedDate;
  selectedTime = this.bookingState.selectedTime;

  ngOnInit(): void {
    this.loadAvailabilities();
  }

  private loadAvailabilities(): void {
    const month = this.currentMonth().getMonth();
    const year = this.currentMonth().getFullYear();

    this.bookingApi.getAvailabilities(month, year).subscribe({
      next: (response) => {
        this.bookingState.setAvailabilities(response.data);
      },
      error: (error) => {
        console.error('Error loading availabilities:', error);
        this.bookingState.setError('Failed to load available dates');
      }
    });
  }

  onDateSelected(date: Date): void {
    this.bookingState.setSelectedDate(date);
  }

  onMonthChanged(date: Date): void {
    this.bookingState.setCurrentMonth(date);
    this.loadAvailabilities();
  }

  onTimeSelected(slot: TimeSlot): void {
    this.bookingState.setSelectedTime(slot);
    this.router.navigate(['/booking/confirm']);
  }

  onClearSelectedDate(): void {
    this.bookingState.setSelectedTime(null);
    this.bookingState.setSelectedDate(null);
  }
}
