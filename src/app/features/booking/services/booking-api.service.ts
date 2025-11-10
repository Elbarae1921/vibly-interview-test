import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map } from 'rxjs';
import {
  SessionDetails,
  AvailabilityCalendar,
  BookingRequest,
  BookingResponse,
  TimeSlot,
  DayAvailability,
  DateAvailability,
} from '../models/booking.models';
import { ApiResponse } from '../../../shared/models/common.models';
import { Apollo } from 'apollo-angular';
import {
  GetSessionPageDocument,
  GetAvailableDateTimesDocument,
  GetSessionPageQuery,
  GetAvailableDateTimesQuery
} from '../../../graphql/generated/graphql';
import { IBookingApiService } from './booking-api.service.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingApiService implements IBookingApiService {
  http = inject(HttpClient);
  apollo = inject(Apollo);

  // Hardcoded IDs for initial implementation
  private readonly HARDCODED_SESSION_ID = '123e4567-e89b-12d3-a456-426614174000';
  private readonly HARDCODED_USER_ID = '987fcdeb-51a2-43f1-b789-123456789abc';

  /**
   * Get session and host details from GraphQL API
   */
  getSessionDetails(): Observable<ApiResponse<SessionDetails>> {
    return this.apollo
      .query<GetSessionPageQuery>({
        query: GetSessionPageDocument,
        variables: { id: this.HARDCODED_SESSION_ID }
      })
      .pipe(
        map((result) => {
          if (!result.data) {
            throw new Error('No data returned from GraphQL');
          }

          const sessionPage = result.data.getSessionPage;

          // Map GraphQL SessionPage to legacy SessionDetails for backwards compatibility
          const sessionDetails: SessionDetails = {
            id: this.HARDCODED_SESSION_ID,
            host: {
              id: '1', // Not provided by GraphQL
              name: `${sessionPage.host.firstName || ''} ${sessionPage.host.lastName || ''}`.trim(),
              title: sessionPage.host.profession || '',
              avatar: sessionPage.host.photo || ''
            },
            user: {
              firstName: sessionPage.user.firstName || '',
              lastName: sessionPage.user.lastName || '',
              email: sessionPage.user.email || '',
              timeZone: sessionPage.user.timeZone || ''
            },
            sessionType: '1-1 session', // Not provided by GraphQL
            sessionTitle: sessionPage.service.title,
            duration: sessionPage.duration,
            meetingPlatform: 'Google meets', // Not provided by GraphQL
            meetingPlatformIcon: 'google-meet' // Not provided by GraphQL
          };

          return { data: sessionDetails };
        })
      );
  }

  /**
   * Get available dates and time slots for a given month from GraphQL API
   * @param month - Month number (0-11)
   * @param year - Full year number
   */
  getAvailabilities(month: number, year: number): Observable<ApiResponse<AvailabilityCalendar>> {
    return this.apollo
      .query<GetAvailableDateTimesQuery>({
        query: GetAvailableDateTimesDocument,
        variables: { userId: this.HARDCODED_USER_ID }
      })
      .pipe(
        map((result) => {
          if (!result.data) {
            throw new Error('No data returned from GraphQL');
          }

          const availabilities = result.data.getAvailableDateTimes;

          // Create a map of date strings to their availabilities
          const availabilityMap = new Map<string, DateAvailability>();
          availabilities.forEach(avail => {
            availabilityMap.set(avail.date, avail);
          });

          // Generate all days in the month
          const days: DayAvailability[] = [];
          const daysInMonth = new Date(year, month + 1, 0).getDate();

          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = this.formatDateToYYYYMMDD(date);

            const availability = availabilityMap.get(dateString);
            const hasAvailability = !!availability && !!availability.times && availability.times.length > 0;

            days.push({
              date,
              available: hasAvailability,
              timeSlots: hasAvailability ? this.convertTimeRangesToSlots(availability.times!) : []
            });
          }

          const calendar: AvailabilityCalendar = {
            month,
            year,
            days
          };

          return { data: calendar };
        })
      );
  }

  /**
   * Format a Date object to YYYY-MM-DD string
   */
  private formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Convert GraphQL TimeRange array to TimeSlot array for UI
   */
  private convertTimeRangesToSlots(timeRanges: Array<{ start?: string | null; end?: string | null }>): TimeSlot[] {
    const slots: TimeSlot[] = [];

    timeRanges.forEach(range => {
      if (!range.start || !range.end) return;

      // Generate 30-minute time slots within each range
      const startTime = this.parseTime(range.start);
      const endTime = this.parseTime(range.end);

      let currentTime = startTime;
      while (currentTime < endTime) {
        const timeString = this.formatTimeToAMPM(currentTime);
        slots.push({
          time: timeString,
          value: this.formatTimeToHHMM(currentTime),
          available: true
        });
        currentTime += 30; // 30 minutes in minutes
      }
    });

    return slots;
  }

  /**
   * Parse HH:MM:SS time string to minutes since midnight
   */
  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Format minutes since midnight to AM/PM format (e.g., "8:00am")
   */
  private formatTimeToAMPM(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    const displayMins = `:${String(mins).padStart(2, '0')}`;
    return `${displayHours}${displayMins}${period}`;
  }

  /**
   * Format minutes since midnight to HH:MM format
   */
  private formatTimeToHHMM(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  /**
   * Submit a booking request
   */
  submitBooking(request: BookingRequest): Observable<ApiResponse<BookingResponse>> {
    // Mock response
    const mockResponse: BookingResponse = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      sessionId: request.sessionId,
      hostId: request.hostId,
      date: request.date,
      time: request.time,
      timezone: request.timezone,
      status: 'confirmed',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    };

    return of({ data: mockResponse, message: 'Booking confirmed successfully' }).pipe(delay(800));
  }
}

