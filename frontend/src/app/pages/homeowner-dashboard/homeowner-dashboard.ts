import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { PaymentService, PaymentResponse } from '../../services/payment.service';
import { environment } from '../../../environments/environment';

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

type DashboardTab = 'active' | 'completed' | 'paid' | 'cancelled';

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
  payments: PaymentResponse[] = [];
  activeTab: DashboardTab = 'active';
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
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadDashboardData();

    this.route.queryParams.subscribe(params => {
      if (params['paymentSuccess'] === 'true') {
        this.activeTab = 'paid';
        const txId = params['transactionId'];
        this.showToast(txId ? `Payment successful! Tx: ${txId}` : 'Payment successful!');
      }
    });
  }

  loadUserData() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userEmail = user.email;

      this.http.get<any>('${environment.apiUrl}/api/users/me').subscribe({
        next: (profile) => {
          this.userName = `${profile.firstName} ${profile.lastName}`;
          this.cdr.detectChanges();
        },
        error: () => {
          this.userName = 'User';
          this.cdr.detectChanges();
        }
      });
    }
  }

  loadDashboardData() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'User not found';
      this.isLoading = false;
      return;
    }

    forkJoin({
      requests: this.http.get<any[]>(`${environment.apiUrl}/api/service-requests/homeowner/${userId}`),
      payments: this.paymentService.getUserPayments()
    }).subscribe({
      next: ({ requests, payments }) => {
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
        this.payments = payments;
        this.sortRequests();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load dashboard data';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private get paidRequestIds(): Set<number> {
    return new Set(this.payments.map(p => p.serviceRequestId));
  }

  get activeRequests(): ServiceRequest[] {
    return this.serviceRequests.filter(
      (req) => req.status !== 'COMPLETED' && req.status !== 'CANCELLED',
    );
  }

  get completedRequests(): ServiceRequest[] {
    return this.serviceRequests.filter(
      (req) => req.status === 'COMPLETED' && !this.paidRequestIds.has(req.id)
    );
  }

  get paidRequests(): ServiceRequest[] {
    return this.serviceRequests.filter(
      (req) => req.status === 'COMPLETED' && this.paidRequestIds.has(req.id)
    );
  }

  get cancelledRequests(): ServiceRequest[] {
    return this.serviceRequests.filter((req) => req.status === 'CANCELLED');
  }

  getPaymentForRequest(id: number): PaymentResponse | undefined {
    return this.payments.find(p => p.serviceRequestId === id);
  }

  formatPaymentMethod(method: string): string {
    return method.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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

  setTab(tab: DashboardTab) {
    this.activeTab = tab;
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

  getPaidCount(): number {
    return this.paidRequests.length;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => { this.toastMessage = ''; this.cdr.detectChanges(); }, 4000);
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
      .patch(`${environment.apiUrl}/api/service-requests/${requestId}/status`, {
        status: 'ACCEPTED',
        providerId,
      })
      .subscribe({
        next: () => {
          this.loadDashboardData();
          this.showToast('Quote accepted successfully!');
        },
        error: () => {
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
      .patch(`${environment.apiUrl}/api/service-requests/${requestId}/status`, {
        status: 'DECLINED',
        notes: this.declineReason,
        providerId: providerId,
      })
      .subscribe({
        next: () => {
          this.loadDashboardData();
          this.declineQuote = false;
          this.declineReason = '';
          this.showToast('Quote declined successfully!');
        },
        error: () => {
          this.showToast('Failed to decline quote. Please try again.', 'error');
          this.cdr.detectChanges();
        },
      });
  }

  cancelRequest(requestId: number) {
    const confirmCancel = confirm('Are you sure you want to cancel this request?');
    if (!confirmCancel) return;

    const userId = this.authService.getCurrentUserId();

    this.http
      .patch(`${environment.apiUrl}/api/service-requests/${requestId}/status`, {
        providerId: userId,
        status: 'CANCELLED',
        notes: 'Request cancelled by homeowner',
      })
      .subscribe({
        next: () => {
          this.loadDashboardData();
          this.showToast('Request cancelled successfully!');
        },
        error: () => {
          this.showToast('Failed to cancel request. Please try again.', 'error');
          this.cdr.detectChanges();
        },
      });
  }
}
