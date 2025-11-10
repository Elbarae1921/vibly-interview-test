import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Confirmation } from './confirmation-page.component';
import { BookingStateService } from '../../state/booking-state.signals';
import { BookingApiService } from '../../services/booking-api.service';
import { Router } from '@angular/router';
import { delay, of, throwError } from 'rxjs';
import { BookingResponse, SessionDetails, TimeSlot } from '../../models/booking.models';
import { ApiResponse } from '../../../../shared/models/common.models';

describe('Confirmation', () => {
  let component: Confirmation;
  let fixture: ComponentFixture<Confirmation>;
  let mockBookingState: jasmine.SpyObj<BookingStateService>;
  let mockBookingApi: jasmine.SpyObj<BookingApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockSession: SessionDetails = {
    id: '123',
    host: {
      id: '1',
      name: 'John Doe',
      title: 'Software Engineer',
      avatar: 'avatar.jpg',
    },
    user: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      timeZone: 'America/New_York',
    },
    sessionType: '1-1',
    sessionTitle: 'Consultation',
    duration: 30,
    meetingPlatform: 'Google Meet',
    meetingPlatformIcon: 'google-meet',
  };

  const mockTimeSlot: TimeSlot = {
    time: '9:00am',
    value: '09:00',
    available: true,
  };

  beforeEach(async () => {
    mockBookingState = jasmine.createSpyObj(
      'BookingStateService',
      ['setError', 'selectedDate', 'selectedTime'],
      {
        sessionData: jasmine.createSpy().and.returnValue(mockSession),
        formattedSelectedDate: jasmine.createSpy().and.returnValue('Friday, August 8, 2025'),
        formattedTimeRange: jasmine.createSpy().and.returnValue('9:00am - 9:30am (EST)'),
        timezone: jasmine.createSpy().and.returnValue('America/New_York'),
      }
    );

    // Set up spy methods to return values
    (mockBookingState.selectedDate as jasmine.Spy).and.returnValue(new Date(2025, 7, 8));
    (mockBookingState.selectedTime as jasmine.Spy).and.returnValue(mockTimeSlot);

    mockBookingApi = jasmine.createSpyObj('BookingApiService', ['submitBooking']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Confirmation],
      providers: [
        { provide: BookingStateService, useValue: mockBookingState },
        { provide: BookingApiService, useValue: mockBookingApi },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Confirmation);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should redirect to booking page if date is not selected', () => {
      (mockBookingState.selectedDate as jasmine.Spy).and.returnValue(null);

      component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/booking']);
    });

    it('should redirect to booking page if time is not selected', () => {
      (mockBookingState.selectedTime as jasmine.Spy).and.returnValue(null);

      component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/booking']);
    });

    it('should redirect to booking page if session data is not available', () => {
      (mockBookingState.sessionData as jasmine.Spy).and.returnValue(null);

      component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/booking']);
    });

    it('should not redirect when all required data is present', () => {
      component.ngOnInit();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('computed properties', () => {
    it('should compute userName from session data', () => {
      expect(component.userName()).toBe('Jane Smith');
    });

    it('should handle empty names gracefully', () => {
      const sessionWithEmptyName = {
        ...mockSession,
        user: {
          ...mockSession.user,
          firstName: '',
          lastName: '',
        },
      };
      (mockBookingState.sessionData as jasmine.Spy).and.returnValue(sessionWithEmptyName);

      expect(component.userName()).toBe('');
    });

    it('should compute userEmail from session data', () => {
      expect(component.userEmail()).toBe('jane@example.com');
    });

    it('should return empty string for email when no session', () => {
      (mockBookingState.sessionData as jasmine.Spy).and.returnValue(null);

      expect(component.userEmail()).toBe('');
    });
  });

  describe('onBack', () => {
    it('should navigate back to booking page', () => {
      component.onBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/booking']);
    });
  });

  describe('onConfirm', () => {
    it('should submit booking with correct data', () => {
      const mockResponse = {
        data: {
          id: 'booking-123',
          sessionId: '123',
          hostId: '1',
          date: new Date(2025, 7, 8).toISOString(),
          time: '9:00am',
          timezone: 'America/New_York',
          status: 'confirmed' as const,
          meetingLink: 'https://meet.google.com/test',
        },
      };
      mockBookingApi.submitBooking.and.returnValue(of(mockResponse));

      component.onConfirm();

      expect(mockBookingApi.submitBooking).toHaveBeenCalledWith(
        jasmine.objectContaining({
          sessionId: '123',
          hostId: '1',
          time: '9:00am',
          timezone: 'America/New_York',
          userName: 'Jane Smith',
          userEmail: 'jane@example.com',
        })
      );
    });

    it('should set submitting state and navigate to success on successful submission', fakeAsync(() => {
      const mockResponse = {
        data: {
          id: 'booking-123',
          sessionId: '123',
          hostId: '1',
          date: new Date(2025, 7, 8).toISOString(),
          time: '9:00am',
          timezone: 'America/New_York',
          status: 'confirmed' as const,
          meetingLink: 'https://meet.google.com/test',
        },
      };
      mockBookingApi.submitBooking.and.returnValue(of(mockResponse).pipe(delay(50)));

      component.onConfirm();

      expect(component.isSubmitting()).toBe(true);

      tick(50);

      expect(component.isSubmitting()).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/booking/success']);
    }));

    it('should handle submission error', (done) => {
      spyOn(console, 'error');
      mockBookingApi.submitBooking.and.returnValue(
        throwError(() => new Error('Submission failed'))
      );

      component.onConfirm();

      setTimeout(() => {
        expect(console.error).toHaveBeenCalled();
        expect(component.isSubmitting()).toBe(false);
        expect(mockBookingState.setError).toHaveBeenCalledWith('Failed to confirm booking');
        done();
      }, 100);
    });

    it('should not submit if already submitting', () => {
      component.isSubmitting.set(true);
      component.onConfirm();

      expect(mockBookingApi.submitBooking).not.toHaveBeenCalled();
    });

    it('should not submit if date is missing', () => {
      (mockBookingState.selectedDate as jasmine.Spy).and.returnValue(null);
      component.onConfirm();

      expect(mockBookingApi.submitBooking).not.toHaveBeenCalled();
    });

    it('should not submit if time is missing', () => {
      (mockBookingState.selectedTime as jasmine.Spy).and.returnValue(null);
      component.onConfirm();

      expect(mockBookingApi.submitBooking).not.toHaveBeenCalled();
    });

    it('should not submit if session data is missing', () => {
      (mockBookingState.sessionData as jasmine.Spy).and.returnValue(null);
      component.onConfirm();

      expect(mockBookingApi.submitBooking).not.toHaveBeenCalled();
    });
  });
});
