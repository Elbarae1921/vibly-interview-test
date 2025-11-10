import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from '../../features/booking/models/booking.models';
import { CnDirective } from "../../shared/directives/cn.directive";

@Component({
  selector: 'app-time-slot-picker',
  imports: [CommonModule, CnDirective],
  templateUrl: './time-slot-picker.component.html'
})
export class TimeSlotPicker {
  timeSlots = input<TimeSlot[]>([]);
  selectedTime = input<TimeSlot | null>(null);
  timeSelected = output<TimeSlot>();

  onTimeClick(slot: TimeSlot): void {
    if (slot.available) {
      this.timeSelected.emit(slot);
    }
  }

  isSelected(slot: TimeSlot): boolean {
    const selectedTime = this.selectedTime();
    if (!selectedTime) return false;
    return slot.time === selectedTime.time;
  }

  getSlotClasses(slot: TimeSlot): string {
    const baseClasses = 'flex items-center justify-center px-3 py-2 rounded-xs w-full border transition-colors';

    if (this.isSelected(slot)) {
      return `${baseClasses} bg-black text-white border-black`;
    }

    if (!slot.available) {
      return `${baseClasses} bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed`;
    }

    return `${baseClasses} bg-white text-vibly-black border-vibly-gray-500 cursor-pointer hover:bg-gray-50`;
  }
}
