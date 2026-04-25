import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface ServiceRequest {
  id: number;
  categoryName: string;
  description: string;
  status: string;
  scheduledDate: string;
  providerName?: string;
  agreedPrice?: number;
  providerId: number;
}

@Component({
  selector: 'app-homeowner-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './homeowner-dashboard.html',
  styleUrl: './homeowner-dashboard.scss',
})
export class HomeownerDashboardComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  serviceRequests: ServiceRequest[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  sortOption: string = 'newest';
  updateQuoteRequestId: number | null = null;
  updateProviderId: number | null = null;
  declineQuote: boolean = false;
  declineReason: string = '';
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadServiceRequests();
  }

  loadUserData() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userEmail = user.email;

      this.http.get<any>('http://localhost:8080/api/users/me').subscribe({
        next: (profile) => {
          this.userName = `${profile.firstName} ${profile.lastName}`;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
          this.userName = 'User';
          this.cdr.detectChanges();
        }
      });
    }
  }

  loadServiceRequests() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'User not found';
      this.isLoading = false;
      return;
    }

    this.http
      .get<any[]>(`http://localhost:8080/api/service-requests/homeowner/${userId}`)
      .subscribe({
        next: (requests) => {
          this.serviceRequests = requests.map((req) => ({
            id: req.id,
            categoryName: req.categoryName,
            description: req.description,
            status: req.status,
            scheduledDate: req.scheduledDate,
            providerName: req.providerName,
            agreedPrice: req.agreedPrice,
            providerId: req.providerId,
          }));

          this.sortRequests();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading service requests:', error);
          this.errorMessage = 'Failed to load service requests';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  get activeRequests(): ServiceRequest[] {
    return this.serviceRequests.filter(
      (req) => req.status !== 'COMPLETED' && req.status !== 'CANCELLED',
    );
  }

  get completedRequests(): ServiceRequest[] {
    return this.serviceRequests.filter((req) => req.status === 'COMPLETED');
  }

  get cancelledRequests(): ServiceRequest[] {
    return this.serviceRequests.filter((req) => req.status === 'CANCELLED');
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      PENDING: 'status-pending',
      ACCEPTED: 'status-accepted',
      IN_PROGRESS: 'status-progress',
      COMPLETED: 'status-completed',
      CANCELLED: 'status-cancelled',
      PENDING_QUOTE: 'status-pending',
      DECLINED: 'status-cancelled',
    };
    return statusMap[status] || '';
  }

  createNewRequest() {
    this.router.navigate(['/service-request/new']);
  }

  getPendingCount(): number {
    return this.serviceRequests.filter((req) => req.status === 'PENDING').length;
  }

  getCompletedCount(): number {
    return this.serviceRequests.filter((req) => req.status === 'COMPLETED').length;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }

  sortRequests() {
    this.serviceRequests.sort((a, b) => {
      const dateA = new Date(a.scheduledDate).getTime();
      const dateB = new Date(b.scheduledDate).getTime();

      return this.sortOption === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }

  acceptQuote(requestId: number, providerId: number) {
    this.http
      .patch(`http://localhost:8080/api/service-requests/${requestId}/status`, {
        status: 'ACCEPTED',
        providerId,
      })
      .subscribe({
        next: () => {
          this.loadServiceRequests();
          this.showToast('Quote accepted successfully!');
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error accepting quote:', error);
          this.showToast('Failed to accept quote. Please try again.', 'error');
          this.cdr.detectChanges();
        },
      });
  }

  declineQuoteRequest(requestId: number, providerId: number) {
    if (!this.declineReason.trim()) {
      this.showToast('Please provide a reason for declining the quote.', 'error');
      return;
    }

    this.http
      .patch(`http://localhost:8080/api/service-requests/${requestId}/status`, {
        status: 'DECLINED',
        notes: this.declineReason,
        providerId: providerId,
      })
      .subscribe({
        next: () => {
          this.loadServiceRequests();
          this.declineQuote = false;
          this.declineReason = '';
          this.showToast('Quote declined successfully!');
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error declining quote:', error);
          this.showToast('Failed to decline quote. Please try again.', 'error');
          this.cdr.detectChanges();
        },
      });
  }

  cancelRequest(requestId: number) {
    const confirmCancel = confirm('Are you sure you want to cancel this request?');
    if (!confirmCancel) return;

    const userId = this.authService.getCurrentUserId();

    const body = {
      providerId: userId,
      status: 'CANCELLED',
      notes: 'Request cancelled by homeowner',
    };

    this.http
      .patch(`http://localhost:8080/api/service-requests/${requestId}/status`, body)
      .subscribe({
        next: (response) => {
          this.loadServiceRequests();
          this.showToast('Request cancelled successfully!');
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error cancelling request:', error);
          this.showToast('Failed to cancel request. Please try again.', 'error');
          this.cdr.detectChanges();
        },
      });
  }
}
