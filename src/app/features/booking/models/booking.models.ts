// Re-export GraphQL types for consistency
export type {
  SessionHost,
  SessionUser,
  SessionService,
  SessionPage,
  DateAvailability,
  TimeRange
} from '../../../graphql/generated/graphql';

// Legacy interface for backwards compatibility - will be populated from SessionPage
export interface SessionDetails {
  id: string;
  host: {
    id: string;
    name: string;
    title: string;
    avatar: string;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    timeZone: string;
  };
  sessionType: string;
  sessionTitle: string;
  duration: number;
  meetingPlatform: string;
  meetingPlatformIcon?: string;
}

export interface TimeSlot {
  time: string; // "8:00am", "8:30am", etc.
  value: string; // ISO time string or formatted time
  available: boolean;
}

export interface DayAvailability {
  date: Date;
  available: boolean;
  timeSlots: TimeSlot[];
}

export interface AvailabilityCalendar {
  month: number;
  year: number;
  days: DayAvailability[];
}

export interface BookingState {
  sessionData: SessionDetails | null;
  selectedDate: Date | null;
  selectedTime: TimeSlot | null;
  timezone: string;
}

export interface BookingRequest {
  sessionId: string;
  hostId: string;
  date: string; // ISO date string
  time: string;
  timezone: string;
  userEmail?: string;
  userName?: string;
}

export interface BookingResponse {
  id: string;
  sessionId: string;
  hostId: string;
  date: string;
  time: string;
  timezone: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  meetingLink?: string;
}

