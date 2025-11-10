import {
  Component,
  SimpleChanges,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateUtils } from '../../shared/utils/date.utils';
import { CnDirective } from "../../shared/directives/cn.directive";

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, CnDirective],
  templateUrl: './calendar.component.html',
})
export class Calendar {
  availableDates = input<Date[]>([]);
  selectedDate= input<Date | null>(null);
  currentMonth= input<Date>(new Date());
  interactive= input<boolean>(true);
  dateSelected = output<Date>();
  monthChanged = output<Date>();

  calendarDates: Date[] = [];
  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentMonth']) {
      this.generateCalendar();
    }
  }

  generateCalendar(): void {
    this.calendarDates = DateUtils.getCalendarDates(
      this.currentMonth().getFullYear(),
      this.currentMonth().getMonth()
    );
  }

  get formattedMonthYear(): string {
    return DateUtils.formatMonthYear(this.currentMonth());
  }

  previousMonth(): void {
    const newMonth = new Date(this.currentMonth().getFullYear(), this.currentMonth().getMonth() - 1, 1);
    this.monthChanged.emit(newMonth);
  }

  nextMonth(): void {
    const newMonth = new Date(this.currentMonth().getFullYear(), this.currentMonth().getMonth() + 1, 1);
    this.monthChanged.emit(newMonth);
  }

  onDateClick(date: Date): void {
    if (this.interactive() && this.isAvailable(date)) {
      this.dateSelected.emit(date);
    }
  }

  isSelected(date: Date): boolean {
    const selectedDate = this.selectedDate();
    if (!selectedDate) return false;
    return DateUtils.isSameDay(date, selectedDate);
  }

  isAvailable(date: Date): boolean {
    if (DateUtils.isPast(date)) return false;
    if (!DateUtils.isInMonth(date, this.currentMonth().getMonth(), this.currentMonth().getFullYear())) {
      return false;
    }
    return this.availableDates().some((availDate) => DateUtils.isSameDay(availDate, date));
  }

  isPast(date: Date): boolean {
    return (
      DateUtils.isPast(date) ||
      !DateUtils.isInMonth(date, this.currentMonth().getMonth(), this.currentMonth().getFullYear())
    );
  }

  isDisabled(date: Date): boolean {
    if (!DateUtils.isInMonth(date, this.currentMonth().getMonth(), this.currentMonth().getFullYear())) {
      return true;
    }
    return !this.isPast(date) && !this.isAvailable(date);
  }

  getDateRows(): Date[][] {
    const rows: Date[][] = [];
    for (let i = 0; i < this.calendarDates.length; i += 7) {
      rows.push(this.calendarDates.slice(i, i + 7));
    }
    return rows;
  }

  isInCurrentMonth(date: Date): boolean {
    return DateUtils.isInMonth(date, this.currentMonth().getMonth(), this.currentMonth().getFullYear());
  }
}
