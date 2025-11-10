import { DateUtils } from './date.utils';

describe('DateUtils', () => {
  describe('formatLongDate', () => {
    it('should format date to long format', () => {
      const date = new Date(2025, 7, 8); // August 8, 2025
      const formatted = DateUtils.formatLongDate(date);
      expect(formatted).toBe('Friday, August 8, 2025');
    });

    it('should handle different months correctly', () => {
      const date = new Date(2025, 0, 15); // January 15, 2025
      const formatted = DateUtils.formatLongDate(date);
      expect(formatted).toContain('January');
      expect(formatted).toContain('2025');
    });
  });

  describe('formatMonthYear', () => {
    it('should format date to month and year', () => {
      const date = new Date(2025, 7, 8); // August 2025
      const formatted = DateUtils.formatMonthYear(date);
      expect(formatted).toBe('August 2025');
    });

    it('should handle December correctly', () => {
      const date = new Date(2025, 11, 1); // December 2025
      const formatted = DateUtils.formatMonthYear(date);
      expect(formatted).toBe('December 2025');
    });
  });

  describe('getStartOfMonth', () => {
    it('should return first day of month', () => {
      const date = new Date(2025, 7, 15); // August 15, 2025
      const startOfMonth = DateUtils.getStartOfMonth(date);
      expect(startOfMonth.getDate()).toBe(1);
      expect(startOfMonth.getMonth()).toBe(7);
      expect(startOfMonth.getFullYear()).toBe(2025);
    });

    it('should handle year boundaries', () => {
      const date = new Date(2025, 0, 15); // January 15, 2025
      const startOfMonth = DateUtils.getStartOfMonth(date);
      expect(startOfMonth.getDate()).toBe(1);
      expect(startOfMonth.getMonth()).toBe(0);
    });
  });

  describe('getEndOfMonth', () => {
    it('should return last day of month for 31-day month', () => {
      const date = new Date(2025, 7, 15); // August 2025 (31 days)
      const endOfMonth = DateUtils.getEndOfMonth(date);
      expect(endOfMonth.getDate()).toBe(31);
      expect(endOfMonth.getMonth()).toBe(7);
    });

    it('should return last day of month for 30-day month', () => {
      const date = new Date(2025, 8, 15); // September 2025 (30 days)
      const endOfMonth = DateUtils.getEndOfMonth(date);
      expect(endOfMonth.getDate()).toBe(30);
      expect(endOfMonth.getMonth()).toBe(8);
    });

    it('should handle February in non-leap year', () => {
      const date = new Date(2025, 1, 15); // February 2025
      const endOfMonth = DateUtils.getEndOfMonth(date);
      expect(endOfMonth.getDate()).toBe(28);
    });

    it('should handle February in leap year', () => {
      const date = new Date(2024, 1, 15); // February 2024 (leap year)
      const endOfMonth = DateUtils.getEndOfMonth(date);
      expect(endOfMonth.getDate()).toBe(29);
    });
  });

  describe('getCalendarDates', () => {
    it('should return 35 dates for standard month', () => {
      const dates = DateUtils.getCalendarDates(2025, 8); // September 2025
      expect(dates.length).toBe(35);
    });

    it('should return 42 dates for month starting on Friday with 31 days', () => {
      // August 2025 starts on Friday
      const dates = DateUtils.getCalendarDates(2025, 7);
      expect(dates.length).toBe(42);
    });

    it('should include padding days from previous month', () => {
      const dates = DateUtils.getCalendarDates(2025, 7); // August 2025 starts on Friday
      // First date should be from July (padding)
      expect(dates[0].getMonth()).toBe(6); // July
    });

    it('should include all days of current month', () => {
      const dates = DateUtils.getCalendarDates(2025, 7); // August 2025
      const augustDates = dates.filter(d => d.getMonth() === 7);
      expect(augustDates.length).toBe(31);
    });

    it('should include padding days from next month', () => {
      const dates = DateUtils.getCalendarDates(2025, 7); // August 2025
      const septemberDates = dates.filter(d => d.getMonth() === 8);
      expect(septemberDates.length).toBeGreaterThan(0);
    });

    it('should handle month starting on Sunday', () => {
      // November 2020 starts on Sunday (no padding needed at start)
      const dates = DateUtils.getCalendarDates(2020, 10);
      expect(dates[0].getDate()).toBe(1);
      expect(dates[0].getMonth()).toBe(10);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same date', () => {
      const date1 = new Date(2025, 7, 8, 10, 30);
      const date2 = new Date(2025, 7, 8, 15, 45);
      expect(DateUtils.isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date(2025, 7, 8);
      const date2 = new Date(2025, 7, 9);
      expect(DateUtils.isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for same day but different month', () => {
      const date1 = new Date(2025, 7, 8);
      const date2 = new Date(2025, 8, 8);
      expect(DateUtils.isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for same day but different year', () => {
      const date1 = new Date(2025, 7, 8);
      const date2 = new Date(2024, 7, 8);
      expect(DateUtils.isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('isPast', () => {
    it('should return true for past date', () => {
      const pastDate = new Date(2020, 0, 1);
      expect(DateUtils.isPast(pastDate)).toBe(true);
    });

    it('should return false for future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(DateUtils.isPast(futureDate)).toBe(false);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(DateUtils.isPast(today)).toBe(false);
    });
  });

  describe('isInMonth', () => {
    it('should return true for date in specified month', () => {
      const date = new Date(2025, 7, 15); // August 15, 2025
      expect(DateUtils.isInMonth(date, 7, 2025)).toBe(true);
    });

    it('should return false for date in different month', () => {
      const date = new Date(2025, 7, 15); // August 15, 2025
      expect(DateUtils.isInMonth(date, 8, 2025)).toBe(false);
    });

    it('should return false for same month but different year', () => {
      const date = new Date(2025, 7, 15); // August 15, 2025
      expect(DateUtils.isInMonth(date, 7, 2024)).toBe(false);
    });

    it('should handle year boundary correctly', () => {
      const date = new Date(2025, 0, 1); // January 1, 2025
      expect(DateUtils.isInMonth(date, 0, 2025)).toBe(true);
      expect(DateUtils.isInMonth(date, 11, 2024)).toBe(false);
    });
  });

  describe('formatTimeRange', () => {
    it('should format time range with correct duration', () => {
      const result = DateUtils.formatTimeRange('8:00am', 30, 'Eastern European Time');
      expect(result).toBe('8:00am - 8:30am (EET)');
    });

    it('should handle hour boundary crossing', () => {
      const result = DateUtils.formatTimeRange('8:45am', 30, 'Eastern European Time');
      expect(result).toBe('8:45am - 9:15am (EET)');
    });

    it('should handle AM to PM transition', () => {
      const result = DateUtils.formatTimeRange('11:45am', 30, 'Eastern European Time');
      expect(result).toBe('11:45am - 12:15pm (EET)');
    });

    it('should handle PM times', () => {
      const result = DateUtils.formatTimeRange('2:30pm', 60, 'Eastern European Time');
      expect(result).toBe('2:30pm - 3:30pm (EET)');
    });

    it('should handle 12:00pm correctly', () => {
      const result = DateUtils.formatTimeRange('12:00pm', 30, 'Eastern European Time');
      expect(result).toBe('12:00pm - 12:30pm (EET)');
    });

    it('should use timezone abbreviation', () => {
      const result = DateUtils.formatTimeRange('8:00am', 30, 'Central European Time');
      expect(result).toContain('CET');
    });

    it('should use full timezone name if no abbreviation found', () => {
      const result = DateUtils.formatTimeRange('8:00am', 30, 'Unknown/Timezone');
      expect(result).toContain('Unknown/Timezone');
    });
  });
});

