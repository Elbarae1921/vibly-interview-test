import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/models/common.models';
import {
  SessionDetails,
  AvailabilityCalendar,
  BookingRequest,
  BookingResponse,
} from '../models/booking.models';

/**
 * Interface for the Booking API Service
 * Defines the contract for booking-related API operations
 */
export interface IBookingApiService {
  /**
   * Get session and host details from GraphQL API
   * @returns Observable containing session details
   */
  getSessionDetails(): Observable<ApiResponse<SessionDetails>>;

  /**
   * Get available dates and time slots for a given month
   * @param month - Month number (0-11)
   * @param year - Full year number
   * @returns Observable containing availability calendar
   */
  getAvailabilities(month: number, year: number): Observable<ApiResponse<AvailabilityCalendar>>;

  /**
   * Submit a booking request
   * @param request - Booking request details
   * @returns Observable containing booking response
   */
  submitBooking(request: BookingRequest): Observable<ApiResponse<BookingResponse>>;
}

