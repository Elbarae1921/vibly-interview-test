import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Success } from './success-page.component';
import { BookingStateService } from '../../state/booking-state.signals';
import { SessionDetails } from '../../models/booking.models';

describe('Success', () => {
  let component: Success;
  let fixture: ComponentFixture<Success>;
  let mockBookingState: jasmine.SpyObj<BookingStateService>;

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
    mockBookingState = jasmine.createSpyObj('BookingStateService', [], {
      sessionData: jasmine.createSpy().and.returnValue(mockSession)
    });

    await TestBed.configureTestingModule({
      imports: [Success],
      providers: [
        { provide: BookingStateService, useValue: mockBookingState }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Success);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should have bookingState injected', () => {
      expect(component.bookingState).toBe(mockBookingState);
    });

    it('should expose sessionData from state', () => {
      expect(component.sessionData).toBeDefined();
      expect(component.sessionData()).toEqual(mockSession);
    });

    it('should handle null session data', () => {
      (mockBookingState.sessionData as jasmine.Spy).and.returnValue(null);
      expect(component.sessionData()).toBeNull();
    });

    it('should handle session data updates', () => {
      expect(component.sessionData()).toEqual(mockSession);

      const updatedSession = {
        ...mockSession,
        host: {
          ...mockSession.host,
          name: 'Updated Name'
        }
      };
      (mockBookingState.sessionData as jasmine.Spy).and.returnValue(updatedSession);

      expect(component.sessionData()?.host.name).toBe('Updated Name');
    });
  });

  describe('sessionData property', () => {
    it('should reflect the session data from booking state', () => {
      const sessionData = component.sessionData();
      expect(sessionData).toEqual(mockSession);
      expect(sessionData?.host.name).toBe('John Doe');
      expect(sessionData?.user.email).toBe('jane@example.com');
    });

    it('should handle different session data structures', () => {
      const differentSession: SessionDetails = {
        id: '456',
        host: {
          id: '2',
          name: 'Alice Johnson',
          title: 'Product Manager',
          avatar: 'alice.jpg'
        },
        user: {
          firstName: 'Bob',
          lastName: 'Wilson',
          email: 'bob@example.com',
          timeZone: 'UTC'
        },
        sessionType: 'Group',
        sessionTitle: 'Team Meeting',
        duration: 60,
        meetingPlatform: 'Zoom',
        meetingPlatformIcon: 'zoom'
      };

      (mockBookingState.sessionData as jasmine.Spy).and.returnValue(differentSession);

      const sessionData = component.sessionData();
      expect(sessionData).toEqual(differentSession);
      expect(sessionData?.host.name).toBe('Alice Johnson');
      expect(sessionData?.user.email).toBe('bob@example.com');
      expect(sessionData?.duration).toBe(60);
    });
  });
});

