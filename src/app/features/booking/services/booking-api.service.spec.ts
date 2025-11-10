import { TestBed } from '@angular/core/testing';
import { BookingApiService } from './booking-api.service';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { GetSessionPageDocument } from '../../../graphql/generated/graphql';
import { HttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BookingApiService', () => {
  let service: BookingApiService;
  let apolloSpy: jasmine.SpyObj<Apollo>;

  beforeEach(() => {
    const apolloMock = jasmine.createSpyObj('Apollo', ['query']);

    TestBed.configureTestingModule({
      providers: [
        BookingApiService,
        { provide: Apollo, useValue: apolloMock },
        { provide: HttpClient, useValue: provideHttpClientTesting },
      ],
    });

    service = TestBed.inject(BookingApiService);
    apolloSpy = TestBed.inject(Apollo) as jasmine.SpyObj<Apollo>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSessionDetails', () => {
    it('should fetch and map session details from GraphQL', (done) => {
      const mockGraphQLResponse = {
        data: {
          getSessionPage: {
            host: {
              firstName: 'John',
              lastName: 'Doe',
              profession: 'Software Engineer',
              photo: 'https://example.com/photo.jpg',
            },
            user: {
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane@example.com',
              timeZone: 'America/New_York',
            },
            service: {
              title: 'Consultation Session',
            },
            duration: 30,
          },
        },
        loading: false,
        networkStatus: 7,
      };

      apolloSpy.query.and.returnValue(of(mockGraphQLResponse as any));

      service.getSessionDetails().subscribe({
        next: (response) => {
          expect(response.data).toBeTruthy();
          expect(response.data.host.name).toBe('John Doe');
          expect(response.data.host.title).toBe('Software Engineer');
          expect(response.data.user.firstName).toBe('Jane');
          expect(response.data.user.email).toBe('jane@example.com');
          expect(response.data.sessionTitle).toBe('Consultation Session');
          expect(response.data.duration).toBe(30);
          done();
        },
        error: done.fail,
      });

      expect(apolloSpy.query).toHaveBeenCalledWith({
        query: GetSessionPageDocument,
        variables: { id: '123e4567-e89b-12d3-a456-426614174000' },
      });
    });

    it('should handle empty names gracefully', (done) => {
      const mockGraphQLResponse = {
        data: {
          getSessionPage: {
            host: {
              firstName: null,
              lastName: null,
              profession: null,
              photo: null,
            },
            user: {
              firstName: '',
              lastName: '',
              email: 'test@example.com',
              timeZone: 'UTC',
            },
            service: {
              title: 'Test Session',
            },
            duration: 60,
          },
        },
        loading: false,
        networkStatus: 7,
      };

      apolloSpy.query.and.returnValue(of(mockGraphQLResponse as any));

      service.getSessionDetails().subscribe({
        next: (response) => {
          expect(response.data.host.name).toBe('');
          expect(response.data.host.title).toBe('');
          done();
        },
        error: done.fail,
      });
    });

    it('should throw error when no data returned', (done) => {
      const mockGraphQLResponse = {
        data: null,
        loading: false,
        networkStatus: 7,
      };

      apolloSpy.query.and.returnValue(of(mockGraphQLResponse as any));

      service.getSessionDetails().subscribe({
        next: () => done.fail('Should have thrown error'),
        error: (error) => {
          expect(error.message).toBe('No data returned from GraphQL');
          done();
        },
      });
    });
  });

  describe('getAvailabilities', () => {
    it('should fetch and map availabilities from GraphQL', (done) => {
      const mockGraphQLResponse = {
        data: {
          getAvailableDateTimes: [
            {
              date: '2025-08-08',
              times: [
                { start: '09:00:00', end: '12:00:00' },
                { start: '14:00:00', end: '17:00:00' },
              ],
            },
            {
              date: '2025-08-09',
              times: [{ start: '10:00:00', end: '11:00:00' }],
            },
          ],
        },
        loading: false,
        networkStatus: 7,
      };

      apolloSpy.query.and.returnValue(of(mockGraphQLResponse as any));

      service.getAvailabilities(7, 2025).subscribe({
        next: (response) => {
          expect(response.data).toBeTruthy();
          expect(response.data.month).toBe(7);
          expect(response.data.year).toBe(2025);
          expect(response.data.days.length).toBe(31); // August has 31 days

          // Check that Aug 8 has availability
          const aug8 = response.data.days.find((d) => d.date.getDate() === 8);
          expect(aug8?.available).toBe(true);
          expect(aug8?.timeSlots.length).toBeGreaterThan(0);

          // Check that a day without availability is marked as unavailable
          const aug1 = response.data.days.find((d) => d.date.getDate() === 1);
          expect(aug1?.available).toBe(false);
          expect(aug1?.timeSlots.length).toBe(0);

          done();
        },
        error: done.fail,
      });
    });

    it('should generate time slots from time ranges', (done) => {
      const mockGraphQLResponse = {
        data: {
          getAvailableDateTimes: [
            {
              date: '2025-08-08',
              times: [{ start: '09:00:00', end: '10:00:00' }],
            },
          ],
        },
        loading: false,
        networkStatus: 7,
      };

      apolloSpy.query.and.returnValue(of(mockGraphQLResponse as any));

      service.getAvailabilities(7, 2025).subscribe({
        next: (response) => {
          const aug8 = response.data.days.find((d) => d.date.getDate() === 8);
          expect(aug8?.timeSlots.length).toBe(2); // 9:00am and 9:30am
          expect(aug8?.timeSlots[0].time).toBe('9:00am');
          expect(aug8?.timeSlots[1].time).toBe('9:30am');
          done();
        },
        error: done.fail,
      });
    });

    it('should handle months with different day counts', (done) => {
      const mockGraphQLResponse = {
        data: {
          getAvailableDateTimes: [],
        },
        loading: false,
        networkStatus: 7,
      };

      apolloSpy.query.and.returnValue(of(mockGraphQLResponse as any));

      // Test February (28 days in 2025)
      service.getAvailabilities(1, 2025).subscribe({
        next: (response) => {
          expect(response.data.days.length).toBe(28);
          done();
        },
        error: done.fail,
      });
    });

    it('should handle empty time ranges', (done) => {
      const mockGraphQLResponse = {
        data: {
          getAvailableDateTimes: [
            {
              date: '2025-08-08',
              times: [],
            },
          ],
        },
        loading: false,
        networkStatus: 7,
      };

      apolloSpy.query.and.returnValue(of(mockGraphQLResponse as any));

      service.getAvailabilities(7, 2025).subscribe({
        next: (response) => {
          const aug8 = response.data.days.find((d) => d.date.getDate() === 8);
          expect(aug8?.available).toBe(false);
          expect(aug8?.timeSlots.length).toBe(0);
          done();
        },
        error: done.fail,
      });
    });

    it('should handle null start or end times', (done) => {
      const mockGraphQLResponse = {
        data: {
          getAvailableDateTimes: [
            {
              date: '2025-08-08',
              times: [
                { start: null, end: '10:00:00' },
                { start: '14:00:00', end: null },
                { start: '16:00:00', end: '17:00:00' },
              ],
            },
          ],
        },
        loading: false,
        networkStatus: 7,
      };

      apolloSpy.query.and.returnValue(of(mockGraphQLResponse as any));

      service.getAvailabilities(7, 2025).subscribe({
        next: (response) => {
          const aug8 = response.data.days.find((d) => d.date.getDate() === 8);
          // Should only have slots from the valid time range
          expect(aug8?.timeSlots.length).toBe(2); // 4:00pm and 4:30pm
          done();
        },
        error: done.fail,
      });
    });

    it('should throw error when no data returned', (done) => {
      const mockGraphQLResponse = {
        data: null,
        loading: false,
        networkStatus: 7,
      };

      apolloSpy.query.and.returnValue(of(mockGraphQLResponse as any));

      service.getAvailabilities(7, 2025).subscribe({
        next: () => done.fail('Should have thrown error'),
        error: (error) => {
          expect(error.message).toBe('No data returned from GraphQL');
          done();
        },
      });
    });
  });

  describe('submitBooking', () => {
    it('should return mock booking response', (done) => {
      const mockRequest = {
        sessionId: '123',
        hostId: '456',
        date: '2025-08-08',
        time: '9:00am',
        timezone: 'America/New_York',
      };

      service.submitBooking(mockRequest).subscribe({
        next: (response) => {
          expect(response.data).toBeTruthy();
          expect(response.data.sessionId).toBe('123');
          expect(response.data.hostId).toBe('456');
          expect(response.data.date).toBe('2025-08-08');
          expect(response.data.time).toBe('9:00am');
          expect(response.data.status).toBe('confirmed');
          expect(response.data.meetingLink).toBeTruthy();
          expect(response.message).toBe('Booking confirmed successfully');
          done();
        },
        error: done.fail,
      });
    });

    it('should include delay in response', (done) => {
      const mockRequest = {
        sessionId: '123',
        hostId: '456',
        date: '2025-08-08',
        time: '9:00am',
        timezone: 'UTC',
      };

      const startTime = Date.now();
      service.submitBooking(mockRequest).subscribe({
        next: () => {
          const elapsed = Date.now() - startTime;
          expect(elapsed).toBeGreaterThanOrEqual(700); // Should have some delay
          done();
        },
        error: done.fail,
      });
    });
  });
});
