import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'booking',
    pathMatch: 'full'
  },
  {
    path: 'booking',
    loadChildren: () => import('./features/booking/pages/booking.routes').then(m => m.BOOKING_ROUTES)
  }
];
