import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Booking } from './booking-page.component';
import { BookingStateService } from '../../state/booking-state.signals';
import { BookingApiService } from '../../services/booking-api.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TimeSlot, AvailabilityCalendar } from '../../models/booking.models';

describe('Booking', () => {
  let component: Booking;
  let fixture: ComponentFixture<Booking>;
  let mockBookingState: jasmine.SpyObj<BookingStateService>;
  let mockBookingApi: jasmine.SpyObj<BookingApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockBookingState = jasmine.createSpyObj('BookingStateService', [
      'setAvailabilities',
      'setSelectedDate',
      'setCurrentMonth',
      'setSelectedTime',
      'setError'
    ], {
      availableDates: jasmine.createSpy().and.returnValue([]),
      selectedDate: jasmine.createSpy().and.returnValue(null),
      currentMonth: jasmine.createSpy().and.returnValue(new Date(2025, 7, 1)),
      timezone: jasmine.createSpy().and.returnValue('UTC'),
      formattedSelectedDate: jasmine.createSpy().and.returnValue(''),
      timeSlotsForSelectedDate: jasmine.createSpy().and.returnValue([]),
      selectedTime: jasmine.createSpy().and.returnValue(null)
    });

    mockBookingApi = jasmine.createSpyObj('BookingApiService', ['getAvailabilities']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Booking],
      providers: [
        { provide: BookingStateService, useValue: mockBookingState },
        { provide: BookingApiService, useValue: mockBookingApi },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Booking);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load availabilities on init', () => {
      const mockCalendar: AvailabilityCalendar = {
        month: 7,
        year: 2025,
        days: []
      };
      mockBookingApi.getAvailabilities.and.returnValue(of({ data: mockCalendar }));

      component.ngOnInit();

      expect(mockBookingApi.getAvailabilities).toHaveBeenCalledWith(7, 2025);
      expect(mockBookingState.setAvailabilities).toHaveBeenCalledWith(mockCalendar);
    });

    it('should handle error when loading availabilities', () => {
      spyOn(console, 'error');
      mockBookingApi.getAvailabilities.and.returnValue(
        throwError(() => new Error('Failed to load'))
      );

      component.ngOnInit();

      expect(console.error).toHaveBeenCalled();
      expect(mockBookingState.setError).toHaveBeenCalledWith('Failed to load available dates');
    });
  });

  describe('onDateSelected', () => {
    it('should update selected date in state', () => {
      const date = new Date(2025, 7, 15);
      component.onDateSelected(date);

      expect(mockBookingState.setSelectedDate).toHaveBeenCalledWith(date);
    });
  });

  describe('onMonthChanged', () => {
    it('should update current month and reload availabilities', () => {
      const newMonth = new Date(2025, 8, 1);
      const mockCalendar: AvailabilityCalendar = {
        month: 8,
        year: 2025,
        days: []
      };
      mockBookingApi.getAvailabilities.and.returnValue(of({ data: mockCalendar }));

      component.onMonthChanged(newMonth);

      expect(mockBookingState.setCurrentMonth).toHaveBeenCalledWith(newMonth);
      // 7 because Date.getMonth() is 0-indexed
      expect(mockBookingApi.getAvailabilities).toHaveBeenCalledWith(7, 2025);
    });
  });

  describe('onTimeSelected', () => {
    it('should update selected time and navigate to confirmation', () => {
      const mockSlot: TimeSlot = {
        time: '9:00am',
        value: '09:00',
        available: true
      };

      component.onTimeSelected(mockSlot);

      expect(mockBookingState.setSelectedTime).toHaveBeenCalledWith(mockSlot);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/booking/confirm']);
    });
  });

  describe('onClearSelectedDate', () => {
    it('should clear both selected time and date', () => {
      component.onClearSelectedDate();

      expect(mockBookingState.setSelectedTime).toHaveBeenCalledWith(null);
      expect(mockBookingState.setSelectedDate).toHaveBeenCalledWith(null);
    });
  });

  describe('signal properties', () => {
    it('should expose availableDates from state', () => {
      expect(component.availableDates).toBeDefined();
    });

    it('should expose selectedDate from state', () => {
      expect(component.selectedDate).toBeDefined();
    });

    it('should expose currentMonth from state', () => {
      expect(component.currentMonth).toBeDefined();
    });

    it('should expose timezone from state', () => {
      expect(component.timezone).toBeDefined();
    });

    it('should expose formattedSelectedDate from state', () => {
      expect(component.formattedSelectedDate).toBeDefined();
    });

    it('should expose timeSlots from state', () => {
      expect(component.timeSlots).toBeDefined();
    });

    it('should expose selectedTime from state', () => {
      expect(component.selectedTime).toBeDefined();
    });
  });
});

