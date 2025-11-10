export class DateUtils {
  /**
   * Format a date to "Thursday, 8 August 2025" format
   */
  static formatLongDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Format a date to "August 2025" format
   */
  static formatMonthYear(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Get the start of the month for a given date
   */
  static getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  /**
   * Get the end of the month for a given date
   */
  static getEndOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  /**
   * Get an array of dates for the calendar grid (including padding days)
   */
  static getCalendarDates(year: number, month: number): Date[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay(); // 0 = Sunday
    const dates: Date[] = [];

    // Add padding days from previous month
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      dates.push(date);
    }

    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      dates.push(new Date(year, month, day));
    }

    let grid = 35; // 6 rows * 7 days

    // accommodate months starting on Friday or Saturday (extra row)
    if ((startPadding === 5 && lastDay.getDate() === 31) || (startPadding === 6 && lastDay.getDate() >= 30)) {
      grid = 42;
    }


    // Add padding days from next month to complete the grid
    const remainingCells = grid - dates.length;
    for (let i = 1; i <= remainingCells; i++) {
      dates.push(new Date(year, month + 1, i));
    }

    return dates;
  }

  /**
   * Check if two dates are the same day
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Check if date is in the past
   */
  static isPast(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  }

  /**
   * Check if date is in a specific month
   */
  static isInMonth(date: Date, month: number, year: number): boolean {
    return date.getMonth() === month && date.getFullYear() === year;
  }

  /**
   * Format time range like "8:00am - 8:30am (EET)"
   */
  static formatTimeRange(startTime: string, duration: number, timezone: string): string {
    // Parse start time
    const endTime = this.addMinutesToTime(startTime, duration);
    return `${startTime} - ${endTime} (${this.getTimezoneAbbreviation(timezone)})`;
  }

  /**
   * Add minutes to a time string
   */
  private static addMinutesToTime(time: string, minutes: number): string {
    const match = time.match(/(\d+):(\d+)(am|pm)/i);
    if (!match) return time;

    let hours = parseInt(match[1]);
    const mins = parseInt(match[2]);
    const period = match[3].toLowerCase();

    // Convert to 24-hour format
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;

    // Add minutes
    let totalMinutes = hours * 60 + mins + minutes;
    hours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;

    // Convert back to 12-hour format
    const newPeriod = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${newMins.toString().padStart(2, '0')}${newPeriod}`;
  }

  /**
   * Get timezone abbreviation
   */
  private static getTimezoneAbbreviation(timezone: string): string {
    const abbreviations: { [key: string]: string } = {
      'Eastern European Time': 'EET',
      'Central European Time': 'CET',
      'Pacific Standard Time': 'PST',
      'Eastern Standard Time': 'EST',
      'America/New_York': 'EST',
    };
    return abbreviations[timezone] || timezone;
  }
}

