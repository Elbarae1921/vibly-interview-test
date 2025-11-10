import { Component, inject, OnInit, computed } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Header } from '../../../../components/header/header.component';
import { Sidebar } from '../../../../components/sidebar/sidebar.component';
import { BookingStateService } from '../../state/booking-state.signals';
import { BookingApiService } from '../../services/booking-api.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CnDirective } from "../../../../shared/directives/cn.directive";

@Component({
  selector: 'app-booking-container',
  imports: [CommonModule, RouterOutlet, Header, Sidebar, CnDirective],
  templateUrl: './booking-container.component.html',
})
export class BookingContainer implements OnInit {
  bookingState = inject(BookingStateService);
  bookingApi = inject(BookingApiService);
  router = inject(Router);

  title = 'Schedule session';

  // Track current URL to conditionally show sidebar
  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ),
    { initialValue: null }
  );

  isSuccessPage = computed(() => this.currentUrl()?.url.includes('success') ?? false);

  // Hide sidebar on mobile when on booking page with date selected
  isBookingWithDateSelected = computed(() =>
    this.router.url.includes('/booking') &&
    !this.router.url.includes('confirm') &&
    !this.router.url.includes('success') &&
    this.bookingState.selectedDate() !== null
  );

  ngOnInit(): void {
    // Load session data on initialization
    this.loadSessionData();

    // Update title based on route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateTitle();
      });

    this.updateTitle();
  }

  private updateTitle(): void {
    const url = this.router.url;
    if (url.includes('success')) {
      this.title = 'Session scheduled';
    } else {
      this.title = 'Schedule session';
    }
  }

  private loadSessionData(): void {
    this.bookingApi.getSessionDetails().subscribe({
      next: (response) => {
        this.bookingState.setSessionData(response.data);
      },
      error: (error) => {
        console.error('Error loading session data:', error);
        this.bookingState.setError('Failed to load session details');
      }
    });
  }
}
