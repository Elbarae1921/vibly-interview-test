import { TestBed } from '@angular/core/testing';
import { BookingStateService } from './booking-state.signals';
import { SessionDetails, TimeSlot, AvailabilityCalendar } from '../models/booking.models';
import { LoadingState } from '../../../shared/models/common.models';

describe('BookingStateService', () => {
  let service: BookingStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookingStateService]
    });
    service = TestBed.inject(BookingStateService);
  });

  afterEach(() => {
    service.resetAll();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have null session data initially', () => {
      expect(service.sessionData()).toBeNull();
    });

    it('should have null selected date initially', () => {
      expect(service.selectedDate()).toBeNull();
    });

    it('should have null selected time initially', () => {
      expect(service.selectedTime()).toBeNull();
    });

    it('should have null availabilities initially', () => {
      expect(service.availabilities()).toBeNull();
    });

    it('should have current month set to now', () => {
      const currentMonth = service.currentMonth();
      const now = new Date();
      expect(currentMonth.getMonth()).toBe(now.getMonth());
      expect(currentMonth.getFullYear()).toBe(now.getFullYear());
    });

    it('should have idle loading state initially', () => {
      expect(service.loadingState()).toBe(LoadingState.Idle);
    });

    it('should have null error initially', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('setSessionData', () => {
    it('should update session data', () => {
      const mockSession: SessionDetails = {
        id: '123',
        host: {
          id: '1',
          name: 'John Doe',
          title: 'Developer',
          avatar: 'avatar.jpg'
        },
        user: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          timeZone: 'America/New_York'
        },
        sessionType: '1-1',
        sessionTitle: 'Consultation',
        duration: 30,
        meetingPlatform: 'Google Meet',
        meetingPlatformIcon: 'google-meet'
      };

      service.setSessionData(mockSession);
      expect(service.sessionData()).toEqual(mockSession);
    });
  });

  describe('setSelectedDate', () => {
    it('should update selected date', () => {
      const date = new Date(2025, 7, 8);
      service.setSelectedDate(date);
      expect(service.selectedDate()).toEqual(date);
    });

    it('should clear selected time when date changes', () => {
      const mockTime: TimeSlot = { time: '9:00am', value: '09:00', available: true };
      service.setSelectedTime(mockTime);

      const date = new Date(2025, 7, 8);
      service.setSelectedDate(date);

      expect(service.selectedTime()).toBeNull();
    });

    it('should allow setting date to null', () => {
      const date = new Date(2025, 7, 8);
      service.setSelectedDate(date);
      service.setSelectedDate(null);
      expect(service.selectedDate()).toBeNull();
    });
  });

  describe('setSelectedTime', () => {
    it('should update selected time', () => {
      const mockTime: TimeSlot = { time: '9:00am', value: '09:00', available: true };
      service.setSelectedTime(mockTime);
      expect(service.selectedTime()).toEqual(mockTime);
    });

    it('should allow setting time to null', () => {
      const mockTime: TimeSlot = { time: '9:00am', value: '09:00', available: true };
      service.setSelectedTime(mockTime);
      service.setSelectedTime(null);
      expect(service.selectedTime()).toBeNull();
    });
  });

  describe('setAvailabilities', () => {
    it('should update availabilities', () => {
      const mockCalendar: AvailabilityCalendar = {
        month: 7,
        year: 2025,
        days: [
          {
            date: new Date(2025, 7, 8),
            available: true,
            timeSlots: [{ time: '9:00am', value: '09:00', available: true }]
          }
        ]
      };

      service.setAvailabilities(mockCalendar);
      expect(service.availabilities()).toEqual(mockCalendar);
    });
  });

  describe('setCurrentMonth', () => {
    it('should update current month', () => {
      const newMonth = new Date(2025, 7, 1);
      service.setCurrentMonth(newMonth);
      expect(service.currentMonth()).toEqual(newMonth);
    });
  });

  describe('setLoadingState', () => {
    it('should update loading state', () => {
      service.setLoadingState(LoadingState.Loading);
      expect(service.loadingState()).toBe(LoadingState.Loading);
    });
  });

  describe('setError', () => {
    it('should update error', () => {
      service.setError('Test error');
      expect(service.error()).toBe('Test error');
    });

    it('should allow clearing error', () => {
      service.setError('Test error');
      service.setError(null);
      expect(service.error()).toBeNull();
    });
  });

  describe('timezone computed signal', () => {
    it('should return UTC when no session data', () => {
      expect(service.timezone()).toBe('UTC');
    });

    it('should return user timezone from session data', () => {
      const mockSession: SessionDetails = {
        id: '123',
        host: { id: '1', name: 'John', title: 'Dev', avatar: '' },
        user: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          timeZone: 'America/New_York'
        },
        sessionType: '1-1',
        sessionTitle: 'Test',
        duration: 30,
        meetingPlatform: 'Google Meet',
        meetingPlatformIcon: 'google-meet'
      };

      service.setSessionData(mockSession);
      expect(service.timezone()).toBe('America/New_York');
    });
  });

  describe('formattedSelectedDate computed signal', () => {
    it('should return empty string when no date selected', () => {
      expect(service.formattedSelectedDate()).toBe('');
    });

    it('should return formatted date when date selected', () => {
      const date = new Date(2025, 7, 8);
      service.setSelectedDate(date);
      const formatted = service.formattedSelectedDate();
      expect(formatted).toContain('August');
      expect(formatted).toContain('2025');
    });
  });

  describe('formattedTimeRange computed signal', () => {
    it('should return empty string when no time selected', () => {
      expect(service.formattedTimeRange()).toBe('');
    });

    it('should return empty string when no session data', () => {
      const mockTime: TimeSlot = { time: '9:00am', value: '09:00', available: true };
      service.setSelectedTime(mockTime);
      expect(service.formattedTimeRange()).toBe('');
    });

    it('should return formatted time range when both time and session exist', () => {
      const mockSession: SessionDetails = {
        id: '123',
        host: { id: '1', name: 'John', title: 'Dev', avatar: '' },
        user: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          timeZone: 'Eastern European Time'
        },
        sessionType: '1-1',
        sessionTitle: 'Test',
        duration: 30,
        meetingPlatform: 'Google Meet',
        meetingPlatformIcon: 'google-meet'
      };
      const mockTime: TimeSlot = { time: '9:00am', value: '09:00', available: true };

      service.setSessionData(mockSession);
      service.setSelectedTime(mockTime);

      const formatted = service.formattedTimeRange();
      expect(formatted).toBe('9:00am - 9:30am (EET)');
    });
  });

  describe('availableDates computed signal', () => {
    it('should return empty array when no availabilities', () => {
      expect(service.availableDates()).toEqual([]);
    });

    it('should return only available dates', () => {
      const date1 = new Date(2025, 7, 8);
      const date2 = new Date(2025, 7, 9);
      const date3 = new Date(2025, 7, 10);

      const mockCalendar: AvailabilityCalendar = {
        month: 7,
        year: 2025,
        days: [
          { date: date1, available: true, timeSlots: [] },
          { date: date2, available: false, timeSlots: [] },
          { date: date3, available: true, timeSlots: [] }
        ]
      };

      service.setAvailabilities(mockCalendar);
      const availableDates = service.availableDates();

      expect(availableDates.length).toBe(2);
      expect(availableDates).toContain(date1);
      expect(availableDates).toContain(date3);
      expect(availableDates).not.toContain(date2);
    });
  });

  describe('timeSlotsForSelectedDate computed signal', () => {
    it('should return empty array when no date selected', () => {
      expect(service.timeSlotsForSelectedDate()).toEqual([]);
    });

    it('should return empty array when no availabilities', () => {
      service.setSelectedDate(new Date(2025, 7, 8));
      expect(service.timeSlotsForSelectedDate()).toEqual([]);
    });

    it('should return time slots for selected date', () => {
      const date = new Date(2025, 7, 8);
      const timeSlots: TimeSlot[] = [
        { time: '9:00am', value: '09:00', available: true },
        { time: '9:30am', value: '09:30', available: true }
      ];

      const mockCalendar: AvailabilityCalendar = {
        month: 7,
        year: 2025,
        days: [
          { date: date, available: true, timeSlots: timeSlots }
        ]
      };

      service.setAvailabilities(mockCalendar);
      service.setSelectedDate(date);

      expect(service.timeSlotsForSelectedDate()).toEqual(timeSlots);
    });
  });

  describe('canProceedToTimeSelection computed signal', () => {
    it('should return false when no date selected', () => {
      const mockSession: SessionDetails = {
        id: '123',
        host: { id: '1', name: 'John', title: 'Dev', avatar: '' },
        user: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', timeZone: 'UTC' },
        sessionType: '1-1',
        sessionTitle: 'Test',
        duration: 30,
        meetingPlatform: 'Google Meet',
        meetingPlatformIcon: 'google-meet'
      };

      service.setSessionData(mockSession);
      expect(service.canProceedToTimeSelection()).toBe(false);
    });

    it('should return false when no session data', () => {
      service.setSelectedDate(new Date(2025, 7, 8));
      expect(service.canProceedToTimeSelection()).toBe(false);
    });

    it('should return true when both date and session exist', () => {
      const mockSession: SessionDetails = {
        id: '123',
        host: { id: '1', name: 'John', title: 'Dev', avatar: '' },
        user: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', timeZone: 'UTC' },
        sessionType: '1-1',
        sessionTitle: 'Test',
        duration: 30,
        meetingPlatform: 'Google Meet',
        meetingPlatformIcon: 'google-meet'
      };

      service.setSessionData(mockSession);
      service.setSelectedDate(new Date(2025, 7, 8));
      expect(service.canProceedToTimeSelection()).toBe(true);
    });
  });

  describe('canProceedToConfirmation computed signal', () => {
    it('should return false when missing any required field', () => {
      expect(service.canProceedToConfirmation()).toBe(false);
    });

    it('should return true when all fields are set', () => {
      const mockSession: SessionDetails = {
        id: '123',
        host: { id: '1', name: 'John', title: 'Dev', avatar: '' },
        user: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', timeZone: 'UTC' },
        sessionType: '1-1',
        sessionTitle: 'Test',
        duration: 30,
        meetingPlatform: 'Google Meet',
        meetingPlatformIcon: 'google-meet'
      };
      const mockTime: TimeSlot = { time: '9:00am', value: '09:00', available: true };

      service.setSessionData(mockSession);
      service.setSelectedDate(new Date(2025, 7, 8));
      service.setSelectedTime(mockTime);

      expect(service.canProceedToConfirmation()).toBe(true);
    });
  });

  describe('goToNextMonth', () => {
    it('should navigate to next month', () => {
      const startMonth = new Date(2025, 7, 1); // August 2025
      service.setCurrentMonth(startMonth);

      service.goToNextMonth();

      const currentMonth = service.currentMonth();
      expect(currentMonth.getMonth()).toBe(8); // September
      expect(currentMonth.getFullYear()).toBe(2025);
    });

    it('should handle year boundary', () => {
      const startMonth = new Date(2025, 11, 1); // December 2025
      service.setCurrentMonth(startMonth);

      service.goToNextMonth();

      const currentMonth = service.currentMonth();
      expect(currentMonth.getMonth()).toBe(0); // January
      expect(currentMonth.getFullYear()).toBe(2026);
    });
  });

  describe('goToPreviousMonth', () => {
    it('should navigate to previous month', () => {
      const startMonth = new Date(2025, 7, 1); // August 2025
      service.setCurrentMonth(startMonth);

      service.goToPreviousMonth();

      const currentMonth = service.currentMonth();
      expect(currentMonth.getMonth()).toBe(6); // July
      expect(currentMonth.getFullYear()).toBe(2025);
    });

    it('should handle year boundary', () => {
      const startMonth = new Date(2025, 0, 1); // January 2025
      service.setCurrentMonth(startMonth);

      service.goToPreviousMonth();

      const currentMonth = service.currentMonth();
      expect(currentMonth.getMonth()).toBe(11); // December
      expect(currentMonth.getFullYear()).toBe(2024);
    });
  });

  describe('resetAll', () => {
    it('should reset all state to initial values', () => {
      // Set up some state
      const mockSession: SessionDetails = {
        id: '123',
        host: { id: '1', name: 'John', title: 'Dev', avatar: '' },
        user: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', timeZone: 'UTC' },
        sessionType: '1-1',
        sessionTitle: 'Test',
        duration: 30,
        meetingPlatform: 'Google Meet',
        meetingPlatformIcon: 'google-meet'
      };
      const mockTime: TimeSlot = { time: '9:00am', value: '09:00', available: true };

      service.setSessionData(mockSession);
      service.setSelectedDate(new Date(2025, 7, 8));
      service.setSelectedTime(mockTime);
      service.setLoadingState(LoadingState.Loading);
      service.setError('Test error');

      // Reset
      service.resetAll();

      // Verify all reset
      expect(service.sessionData()).toBeNull();
      expect(service.selectedDate()).toBeNull();
      expect(service.selectedTime()).toBeNull();
      expect(service.availabilities()).toBeNull();
      expect(service.loadingState()).toBe(LoadingState.Idle);
      expect(service.error()).toBeNull();
    });
  });
});

