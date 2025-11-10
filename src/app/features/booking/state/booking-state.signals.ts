import { Injectable, signal, computed } from '@angular/core';
import {
  SessionDetails,
  TimeSlot,
  AvailabilityCalendar,
  DayAvailability
} from '../models/booking.models';
import { LoadingState } from '../../../shared/models/common.models';
import { DateUtils } from '../../../shared/utils/date.utils';

@Injectable({
  providedIn: 'root'
})
export class BookingStateService {
  // Signals for reactive state management
  sessionData = signal<SessionDetails | null>(null);
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<TimeSlot | null>(null);
  availabilities = signal<AvailabilityCalendar | null>(null);
  currentMonth = signal<Date>(new Date());
  loadingState = signal<LoadingState>(LoadingState.Idle);
  error = signal<string | null>(null);

  // Computed timezone from session user data
  timezone = computed(() => {
    const session = this.sessionData();
    return session?.user.timeZone || 'UTC';
  });

  // Computed signals for derived state
  formattedSelectedDate = computed(() => {
    const date = this.selectedDate();
    return date ? DateUtils.formatLongDate(date) : '';
  });

  formattedTimeRange = computed(() => {
    const time = this.selectedTime();
    const session = this.sessionData();
    const tz = this.timezone();

    if (!time || !session) return '';

    return DateUtils.formatTimeRange(time.time, session.duration, tz);
  });

  availableDates = computed(() => {
    const calendar = this.availabilities();
    if (!calendar) return [];

    return calendar.days
      .filter(day => day.available)
      .map(day => day.date);
  });

  timeSlotsForSelectedDate = computed(() => {
    const date = this.selectedDate();
    const calendar = this.availabilities();

    if (!date || !calendar) return [];

    const dayData = calendar.days.find(day =>
      DateUtils.isSameDay(day.date, date)
    );

    return dayData?.timeSlots || [];
  });

  isDateAvailable = computed(() => {
    return (date: Date): boolean => {
      const calendar = this.availabilities();
      if (!calendar) return false;

      const dayData = calendar.days.find(day =>
        DateUtils.isSameDay(day.date, date)
      );

      return dayData?.available || false;
    };
  });

  canProceedToTimeSelection = computed(() => {
    return this.selectedDate() !== null && this.sessionData() !== null;
  });

  canProceedToConfirmation = computed(() => {
    return this.selectedDate() !== null &&
           this.selectedTime() !== null &&
           this.sessionData() !== null;
  });

  // Methods to update state
  setSessionData(data: SessionDetails): void {
    this.sessionData.set(data);
  }

  setSelectedDate(date: Date | null): void {
    this.selectedDate.set(date);
    // Clear selected time when date changes
    if (date) {
      this.selectedTime.set(null);
    }
  }

  setSelectedTime(time: TimeSlot | null): void {
    this.selectedTime.set(time);
  }

  setAvailabilities(calendar: AvailabilityCalendar): void {
    this.availabilities.set(calendar);
  }

  setCurrentMonth(date: Date): void {
    this.currentMonth.set(date);
  }

  setLoadingState(state: LoadingState): void {
    this.loadingState.set(state);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  /**
   * Navigate to next/previous month
   */
  goToNextMonth(): void {
    const current = this.currentMonth();
    const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    this.setCurrentMonth(next);
  }

  goToPreviousMonth(): void {
    const current = this.currentMonth();
    const prev = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    this.setCurrentMonth(prev);
  }

  resetAll(): void {
    this.sessionData.set(null);
    this.selectedDate.set(null);
    this.selectedTime.set(null);
    this.availabilities.set(null);
    this.currentMonth.set(new Date());
    this.loadingState.set(LoadingState.Idle);
    this.error.set(null);
  }
}

