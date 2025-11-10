import { Routes } from '@angular/router';
import { BookingContainer } from '../components/container/booking-container.component';
import { Confirmation } from './confirmation/confirmation-page.component';
import { Success } from './success/success-page.component';
import { Booking } from './booking/booking-page.component';

export const BOOKING_ROUTES: Routes = [
  {
    path: '',
    component: BookingContainer,
    children: [
      {
        path: '',
        component: Booking
      },
      {
        path: 'confirm',
        component: Confirmation
      },
      {
        path: 'success',
        component: Success
      }
    ]
  }
];

