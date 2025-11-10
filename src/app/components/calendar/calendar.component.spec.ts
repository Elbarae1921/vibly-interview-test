import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Calendar } from './calendar.component';
import { SimpleChange } from '@angular/core';

describe('Calendar', () => {
  let component: Calendar;
  let fixture: ComponentFixture<Calendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calendar]
    }).compileComponents();

    fixture = TestBed.createComponent(Calendar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should have default values', () => {
      expect(component.weekDays).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
      expect(component.calendarDates).toEqual([]);
    });
  });

  describe('ngOnChanges', () => {
    it('should generate calendar when currentMonth changes', () => {
      spyOn(component, 'generateCalendar');

      const changes = {
        currentMonth: new SimpleChange(null, new Date(2025, 7, 1), true)
      };

      component.ngOnChanges(changes);
      expect(component.generateCalendar).toHaveBeenCalled();
    });

    it('should not generate calendar when other properties change', () => {
      spyOn(component, 'generateCalendar');

      const changes = {
        selectedDate: new SimpleChange(null, new Date(), true)
      };

      component.ngOnChanges(changes);
      expect(component.generateCalendar).not.toHaveBeenCalled();
    });
  });

  describe('generateCalendar', () => {
    it('should generate calendar dates', () => {
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1));
      component.generateCalendar();

      expect(component.calendarDates.length).toBeGreaterThan(0);
    });

    it('should generate calendar for different months', () => {
      fixture.componentRef.setInput('currentMonth', new Date(2025, 1, 1)); // February
      component.generateCalendar();

      expect(component.calendarDates.length).toBeGreaterThan(0);
    });
  });

  describe('formattedMonthYear', () => {
    it('should return formatted month and year', () => {
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1));
      expect(component.formattedMonthYear).toBe('August 2025');
    });

    it('should handle different months', () => {
      fixture.componentRef.setInput('currentMonth', new Date(2025, 0, 1));
      expect(component.formattedMonthYear).toBe('January 2025');
    });
  });

  describe('previousMonth', () => {
    it('should emit previous month', () => {
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1));
      spyOn(component.monthChanged, 'emit');

      component.previousMonth();

      expect(component.monthChanged.emit).toHaveBeenCalledWith(
        new Date(2025, 6, 1)
      );
    });

    it('should handle year boundary', () => {
      fixture.componentRef.setInput('currentMonth', new Date(2025, 0, 1));
      spyOn(component.monthChanged, 'emit');

      component.previousMonth();

      const emittedDate = (component.monthChanged.emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emittedDate.getMonth()).toBe(11); // December
      expect(emittedDate.getFullYear()).toBe(2024);
    });
  });

  describe('nextMonth', () => {
    it('should emit next month', () => {
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1));
      spyOn(component.monthChanged, 'emit');

      component.nextMonth();

      expect(component.monthChanged.emit).toHaveBeenCalledWith(
        new Date(2025, 8, 1)
      );
    });

    it('should handle year boundary', () => {
      fixture.componentRef.setInput('currentMonth', new Date(2025, 11, 1));
      spyOn(component.monthChanged, 'emit');

      component.nextMonth();

      const emittedDate = (component.monthChanged.emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emittedDate.getMonth()).toBe(0); // January
      expect(emittedDate.getFullYear()).toBe(2026);
    });
  });

  describe('onDateClick', () => {
    it('should emit date when clicked and interactive', () => {
      const today = new Date();
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('currentMonth', date);
      fixture.componentRef.setInput('availableDates', [date]);

      spyOn(component.dateSelected, 'emit');

      component.onDateClick(date);

      expect(component.dateSelected.emit).toHaveBeenCalledWith(date);
    });

    it('should not emit date when not interactive', () => {
      const date = new Date(2025, 7, 15);
      fixture.componentRef.setInput('interactive', false);
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1));
      fixture.componentRef.setInput('availableDates', [date]);

      spyOn(component.dateSelected, 'emit');

      component.onDateClick(date);

      expect(component.dateSelected.emit).not.toHaveBeenCalled();
    });

    it('should not emit date when date is not available', () => {
      const date = new Date(2025, 7, 15);
      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1));
      fixture.componentRef.setInput('availableDates', []);

      spyOn(component.dateSelected, 'emit');

      component.onDateClick(date);

      expect(component.dateSelected.emit).not.toHaveBeenCalled();
    });
  });

  describe('isSelected', () => {
    it('should return true for selected date', () => {
      const date = new Date(2025, 7, 15);
      fixture.componentRef.setInput('selectedDate', date);

      expect(component.isSelected(date)).toBe(true);
    });

    it('should return false for non-selected date', () => {
      const selectedDate = new Date(2025, 7, 15);
      const otherDate = new Date(2025, 7, 16);
      fixture.componentRef.setInput('selectedDate', selectedDate);

      expect(component.isSelected(otherDate)).toBe(false);
    });

    it('should return false when no date is selected', () => {
      fixture.componentRef.setInput('selectedDate', null);

      expect(component.isSelected(new Date(2025, 7, 15))).toBe(false);
    });
  });

  describe('isAvailable', () => {
    it('should return true for available date in current month', () => {
      const today = new Date();
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      fixture.componentRef.setInput('currentMonth', today);
      fixture.componentRef.setInput('availableDates', [date]);

      expect(component.isAvailable(date)).toBe(true);
    });

    it('should return false for past date', () => {
      const pastDate = new Date(2020, 0, 1);
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1));
      fixture.componentRef.setInput('availableDates', [pastDate]);

      expect(component.isAvailable(pastDate)).toBe(false);
    });

    it('should return false for date not in current month', () => {
      const date = new Date(2025, 8, 15); // September
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1)); // August
      fixture.componentRef.setInput('availableDates', [date]);

      expect(component.isAvailable(date)).toBe(false);
    });

    it('should return false for date not in available dates', () => {
      const date = new Date(2025, 7, 15);
      const availableDate = new Date(2025, 7, 16);
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1));
      fixture.componentRef.setInput('availableDates', [availableDate]);

      expect(component.isAvailable(date)).toBe(false);
    });
  });

  describe('isPast', () => {
    it('should return true for past date', () => {
      const pastDate = new Date(2020, 0, 1);
      expect(component.isPast(pastDate)).toBe(true);
    });

    it('should return true for date not in current month', () => {
      const date = new Date(2025, 8, 15);
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1));

      expect(component.isPast(date)).toBe(true);
    });

    it('should return false for future date in current month', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      fixture.componentRef.setInput('currentMonth', futureDate);

      expect(component.isPast(futureDate)).toBe(false);
    });
  });

  describe('isDisabled', () => {
    it('should return true for date not in current month', () => {
      const date = new Date(2025, 8, 15); // September
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1)); // August

      expect(component.isDisabled(date)).toBe(true);
    });

    it('should return true for future date not in available dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      futureDate.setMonth(7);
      futureDate.setDate(15);

      fixture.componentRef.setInput('currentMonth', futureDate);
      fixture.componentRef.setInput('availableDates', []);

      expect(component.isDisabled(futureDate)).toBe(true);
    });

    it('should return false for available date', () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      date.setMonth(7);
      date.setDate(15);

      fixture.componentRef.setInput('currentMonth', date);
      fixture.componentRef.setInput('availableDates', [date]);

      expect(component.isDisabled(date)).toBe(false);
    });
  });

  describe('isInCurrentMonth', () => {
    it('should return true for date in current month', () => {
      const date = new Date(2025, 7, 15);
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1));

      expect(component.isInCurrentMonth(date)).toBe(true);
    });

    it('should return false for date in different month', () => {
      const date = new Date(2025, 8, 15);
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1));

      expect(component.isInCurrentMonth(date)).toBe(false);
    });

    it('should return false for date in same month but different year', () => {
      const date = new Date(2024, 7, 15);
      fixture.componentRef.setInput('currentMonth', new Date(2025, 7, 1));

      expect(component.isInCurrentMonth(date)).toBe(false);
    });
  });
});

