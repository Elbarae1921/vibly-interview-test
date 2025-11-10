import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSlotPicker } from './time-slot-picker.component';
import { TimeSlot } from '../../features/booking/models/booking.models';

describe('TimeSlotPicker', () => {
  let component: TimeSlotPicker;
  let fixture: ComponentFixture<TimeSlotPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSlotPicker]
    }).compileComponents();

    fixture = TestBed.createComponent(TimeSlotPicker);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onTimeClick', () => {
    it('should emit time when available slot is clicked', () => {
      const mockSlot: TimeSlot = {
        time: '9:00am',
        value: '09:00',
        available: true
      };

      spyOn(component.timeSelected, 'emit');
      component.onTimeClick(mockSlot);

      expect(component.timeSelected.emit).toHaveBeenCalledWith(mockSlot);
    });

    it('should not emit time when unavailable slot is clicked', () => {
      const mockSlot: TimeSlot = {
        time: '9:00am',
        value: '09:00',
        available: false
      };

      spyOn(component.timeSelected, 'emit');
      component.onTimeClick(mockSlot);

      expect(component.timeSelected.emit).not.toHaveBeenCalled();
    });
  });

  describe('isSelected', () => {
    it('should return true for selected time slot', () => {
      const mockSlot: TimeSlot = {
        time: '9:00am',
        value: '09:00',
        available: true
      };

      fixture.componentRef.setInput('selectedTime', mockSlot);
      expect(component.isSelected(mockSlot)).toBe(true);
    });

    it('should return false for non-selected time slot', () => {
      const selectedSlot: TimeSlot = {
        time: '9:00am',
        value: '09:00',
        available: true
      };
      const otherSlot: TimeSlot = {
        time: '9:30am',
        value: '09:30',
        available: true
      };

      fixture.componentRef.setInput('selectedTime', selectedSlot);
      expect(component.isSelected(otherSlot)).toBe(false);
    });

    it('should return false when no time is selected', () => {
      const mockSlot: TimeSlot = {
        time: '9:00am',
        value: '09:00',
        available: true
      };

      fixture.componentRef.setInput('selectedTime', null);
      expect(component.isSelected(mockSlot)).toBe(false);
    });

    it('should match slots by time property', () => {
      const selectedSlot: TimeSlot = {
        time: '9:00am',
        value: '09:00',
        available: true
      };
      const sameTimeSlot: TimeSlot = {
        time: '9:00am',
        value: '09:00',
        available: true
      };

      fixture.componentRef.setInput('selectedTime', selectedSlot);
      expect(component.isSelected(sameTimeSlot)).toBe(true);
    });
  });

  describe('time slot input', () => {
    it('should handle empty time slots array', () => {
      fixture.componentRef.setInput('timeSlots', []);
      expect(component.timeSlots()).toEqual([]);
    });

    it('should handle multiple time slots', () => {
      const mockSlots: TimeSlot[] = [
        { time: '9:00am', value: '09:00', available: true },
        { time: '9:30am', value: '09:30', available: true },
        { time: '10:00am', value: '10:00', available: false }
      ];

      fixture.componentRef.setInput('timeSlots', mockSlots);
      expect(component.timeSlots().length).toBe(3);
    });
  });
});

