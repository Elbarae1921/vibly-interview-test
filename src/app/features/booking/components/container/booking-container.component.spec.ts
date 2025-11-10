import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingContainer } from './booking-container.component';
import { BookingStateService } from '../../state/booking-state.signals';
import { BookingApiService } from '../../services/booking-api.service';
import { Router, NavigationEnd } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { SessionDetails } from '../../models/booking.models';

describe('BookingContainer', () => {
  let component: BookingContainer;
  let fixture: ComponentFixture<BookingContainer>;
  let mockBookingState: jasmine.SpyObj<BookingStateService>;
  let mockBookingApi: jasmine.SpyObj<BookingApiService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let routerEventsSubject: Subject<any>;

  const mockSession: SessionDetails = {
    id: '123',
    host: {
      id: '1',
      name: 'John Doe',
      title: 'Software Engineer',
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

  beforeEach(async () => {
    routerEventsSubject = new Subject();

    mockBookingState = jasmine.createSpyObj('BookingStateService', [
      'setSessionData',
      'setError',
      'selectedDate'
    ]);
    (mockBookingState.selectedDate as jasmine.Spy).and.returnValue(null);

    mockBookingApi = jasmine.createSpyObj('BookingApiService', ['getSessionDetails']);

    mockRouter = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEventsSubject.asObservable(),
      url: '/booking'
    });

    await TestBed.configureTestingModule({
      imports: [BookingContainer],
      providers: [
        { provide: BookingStateService, useValue: mockBookingState },
        { provide: BookingApiService, useValue: mockBookingApi },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingContainer);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load session data on init', () => {
      mockBookingApi.getSessionDetails.and.returnValue(of({ data: mockSession }));

      component.ngOnInit();

      expect(mockBookingApi.getSessionDetails).toHaveBeenCalled();
      expect(mockBookingState.setSessionData).toHaveBeenCalledWith(mockSession);
    });

    it('should handle error when loading session data', () => {
      spyOn(console, 'error');
      mockBookingApi.getSessionDetails.and.returnValue(
        throwError(() => new Error('Failed to load'))
      );

      component.ngOnInit();

      expect(console.error).toHaveBeenCalled();
      expect(mockBookingState.setError).toHaveBeenCalledWith('Failed to load session details');
    });

    it('should set initial title', () => {
      mockBookingApi.getSessionDetails.and.returnValue(of({ data: mockSession }));

      component.ngOnInit();

      expect(component.title).toBe('Schedule session');
    });

    it('should update title when navigating to success page', (done) => {
      mockBookingApi.getSessionDetails.and.returnValue(of({ data: mockSession }));
      Object.defineProperty(mockRouter, 'url', { value: '/booking/success', writable: true });

      component.ngOnInit();

      routerEventsSubject.next(new NavigationEnd(1, '/booking/success', '/booking/success'));

      setTimeout(() => {
        expect(component.title).toBe('Session scheduled');
        done();
      }, 50);
    });
  });

  describe('title updates', () => {
    beforeEach(() => {
      mockBookingApi.getSessionDetails.and.returnValue(of({ data: mockSession }));
    });

    it('should set title to "Session scheduled" for success page', (done) => {
      Object.defineProperty(mockRouter, 'url', { value: '/booking/success', writable: true });
      component.ngOnInit();

      routerEventsSubject.next(new NavigationEnd(1, '/booking/success', '/booking/success'));

      setTimeout(() => {
        expect(component.title).toBe('Session scheduled');
        done();
      }, 50);
    });

    it('should set title to "Schedule session" for booking page', (done) => {
      Object.defineProperty(mockRouter, 'url', { value: '/booking', writable: true });
      component.ngOnInit();

      routerEventsSubject.next(new NavigationEnd(1, '/booking', '/booking'));

      setTimeout(() => {
        expect(component.title).toBe('Schedule session');
        done();
      }, 50);
    });

    it('should set title to "Schedule session" for confirm page', (done) => {
      Object.defineProperty(mockRouter, 'url', { value: '/booking/confirm', writable: true });
      component.ngOnInit();

      routerEventsSubject.next(new NavigationEnd(1, '/booking/confirm', '/booking/confirm'));

      setTimeout(() => {
        expect(component.title).toBe('Schedule session');
        done();
      }, 50);
    });
  });

  describe('isSuccessPage computed', () => {
    it('should return false initially', () => {
      mockBookingApi.getSessionDetails.and.returnValue(of({ data: mockSession }));
      component.ngOnInit();

      expect(component.isSuccessPage()).toBe(false);
    });

    it('should return true when on success page', (done) => {
      mockBookingApi.getSessionDetails.and.returnValue(of({ data: mockSession }));
      Object.defineProperty(mockRouter, 'url', { value: '/booking/success', writable: true });

      component.ngOnInit();
      routerEventsSubject.next(new NavigationEnd(1, '/booking/success', '/booking/success'));

      setTimeout(() => {
        expect(component.isSuccessPage()).toBe(true);
        done();
      }, 50);
    });
  });

  describe('isBookingWithDateSelected computed', () => {
    beforeEach(() => {
      mockBookingApi.getSessionDetails.and.returnValue(of({ data: mockSession }));
    });

    it('should return false when no date is selected', () => {
      (mockBookingState.selectedDate as jasmine.Spy).and.returnValue(null);
      Object.defineProperty(mockRouter, 'url', { value: '/booking', writable: true });

      component.ngOnInit();

      expect(component.isBookingWithDateSelected()).toBe(false);
    });

    it('should return true when on booking page with date selected', () => {
      (mockBookingState.selectedDate as jasmine.Spy).and.returnValue(new Date(2025, 7, 8));
      Object.defineProperty(mockRouter, 'url', { value: '/booking', writable: true });

      component.ngOnInit();

      expect(component.isBookingWithDateSelected()).toBe(true);
    });

    it('should return false when on confirm page even with date selected', () => {
      (mockBookingState.selectedDate as jasmine.Spy).and.returnValue(new Date(2025, 7, 8));
      Object.defineProperty(mockRouter, 'url', { value: '/booking/confirm', writable: true });

      component.ngOnInit();

      expect(component.isBookingWithDateSelected()).toBe(false);
    });

    it('should return false when on success page even with date selected', () => {
      (mockBookingState.selectedDate as jasmine.Spy).and.returnValue(new Date(2025, 7, 8));
      Object.defineProperty(mockRouter, 'url', { value: '/booking/success', writable: true });

      component.ngOnInit();

      expect(component.isBookingWithDateSelected()).toBe(false);
    });
  });

  describe('integration', () => {
    it('should have all required dependencies injected', () => {
      expect(component.bookingState).toBe(mockBookingState);
      expect(component.bookingApi).toBe(mockBookingApi);
      expect(component.router).toBe(mockRouter);
    });

    it('should initialize with default title', () => {
      expect(component.title).toBe('Schedule session');
    });
  });
});

