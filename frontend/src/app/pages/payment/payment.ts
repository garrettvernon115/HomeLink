import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PaymentService, PaymentMethod, PaymentRequest } from '../../services/payment.service';
import { ServiceRequestService, ServiceRequestResponse } from '../../services/service-request.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class PaymentComponent implements OnInit {
  payableRequests: ServiceRequestResponse[] = [];
  selectedRequest: ServiceRequestResponse | null = null;
  loadingRequests = true;
  loading = false;
  error = '';
  success = false;
  transactionId = '';

  paymentForm: PaymentRequest = {
    serviceRequestId: 0,
    amount: 0,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    cardLastFour: ''
  };

  paymentMethods = [
    { value: PaymentMethod.CREDIT_CARD, label: 'Credit Card' },
    { value: PaymentMethod.DEBIT_CARD, label: 'Debit Card' },
    { value: PaymentMethod.PAYPAL, label: 'PayPal' },
    { value: PaymentMethod.BANK_TRANSFER, label: 'Bank Transfer' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private serviceRequestService: ServiceRequestService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPayableRequests();
  }

  loadPayableRequests(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.error = 'Please log in to make a payment';
      this.loadingRequests = false;
      return;
    }

    forkJoin({
      requests: this.serviceRequestService.getHomeownerRequests(userId),
      payments: this.paymentService.getUserPayments()
    }).subscribe({
      next: ({ requests, payments }) => {
        const paidIds = new Set(payments.map(p => p.serviceRequestId));

        this.payableRequests = requests.filter(
          r => r.status === 'COMPLETED' && r.agreedPrice && !paidIds.has(r.id)
        );

        // Preselect if a service request ID was passed in the URL
        const paramId = this.route.snapshot.paramMap.get('serviceRequestId');
        if (paramId) {
          const preselected = this.payableRequests.find(r => r.id === Number(paramId));
          if (preselected) {
            this.selectRequest(preselected);
          } else {
            this.error = 'This service request is not available for payment (already paid or not completed).';
          }
        }

        this.loadingRequests = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load service requests. Please try again.';
        this.loadingRequests = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectRequest(request: ServiceRequestResponse): void {
    this.selectedRequest = request;
    this.error = '';
    this.paymentForm = {
      serviceRequestId: request.id,
      amount: request.agreedPrice!,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      cardLastFour: ''
    };
    this.cdr.detectChanges();
  }

  isCardMethod(): boolean {
    return this.paymentForm.paymentMethod === PaymentMethod.CREDIT_CARD ||
           this.paymentForm.paymentMethod === PaymentMethod.DEBIT_CARD;
  }

  validateForm(): boolean {
    if (!this.paymentForm.paymentMethod) {
      this.error = 'Please select a payment method';
      return false;
    }
    if (this.isCardMethod()) {
      if (!this.paymentForm.cardLastFour || this.paymentForm.cardLastFour.length !== 4) {
        this.error = 'Please enter the last 4 digits of your card';
        return false;
      }
      if (!/^\d{4}$/.test(this.paymentForm.cardLastFour)) {
        this.error = 'Card last 4 digits must be numbers only';
        return false;
      }
    }
    return true;
  }

  submitPayment(): void {
    this.error = '';
    if (!this.validateForm()) return;

    if (!this.isCardMethod()) {
      this.paymentForm.cardLastFour = '0000';
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.paymentService.createPayment(this.paymentForm).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = true;
        this.transactionId = response.transactionId;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/homeowner/dashboard'], {
            queryParams: { paymentSuccess: true, transactionId: response.transactionId }
          });
        }, 2500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.detail || err.error?.message || err.error?.error || 'Payment failed. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}
