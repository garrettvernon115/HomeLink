import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentService, PaymentMethod, PaymentRequest } from '../../services/payment.service';
import { ServiceRequestService, ServiceRequestResponse } from '../../services/service-request.service';

/**
 * Payment Component
 * Handles payment processing for service requests.
 * Accessible only to homeowners via /payment/:serviceRequestId
 */
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class PaymentComponent implements OnInit {
  serviceRequestId!: number;
  serviceRequest: ServiceRequestResponse | null = null;
  loading = false;
  loadingRequest = false;
  error = '';
  success = false;
  
  // Payment form data
  paymentForm: PaymentRequest = {
    serviceRequestId: 0,
    amount: 0,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    cardLastFour: ''
  };

  // Available payment methods
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Get service request ID from route parameter
    const id = this.route.snapshot.paramMap.get('serviceRequestId');
    if (id) {
      this.serviceRequestId = Number(id);
      this.paymentForm.serviceRequestId = this.serviceRequestId;
      this.loadServiceRequest();
    } else {
      this.error = 'Invalid service request ID';
    }
  }

  /**
   * Load service request details from backend
   */
  loadServiceRequest(): void {
    this.loadingRequest = true;
    this.error = '';
    
    this.serviceRequestService.getServiceRequestById(this.serviceRequestId).subscribe({
      next: (request) => {
        this.serviceRequest = request;
        this.loadingRequest = false;
        this.cdr.detectChanges();
        
        // Validate service request is eligible for payment
        if (request.status !== 'COMPLETED') {
          this.error = 'Service request must be completed before payment can be made';
          return;
        }
        
        if (!request.agreedPrice) {
          this.error = 'No agreed price found for this service request';
          return;
        }
        
        // Set payment amount from service request
        this.paymentForm.amount = request.agreedPrice;
      },
      error: (err) => {
        this.loadingRequest = false;
        this.error = err.error?.message || err.error || 'Service request not found';
        console.error('Error loading service request:', err);
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Validate payment form
   */
  validateForm(): boolean {
    if (!this.paymentForm.paymentMethod) {
      this.error = 'Please select a payment method';
      return false;
    }
    
    if (!this.paymentForm.cardLastFour || this.paymentForm.cardLastFour.length !== 4) {
      this.error = 'Please enter the last 4 digits of your card';
      return false;
    }
    
    if (!/^\d{4}$/.test(this.paymentForm.cardLastFour)) {
      this.error = 'Card last 4 digits must be numbers only';
      return false;
    }
    
    return true;
  }

  /**
   * Submit payment
   * 
   * ============================================
   * DEMO MODE: Mock payment for presentation
   * ============================================
   * This bypasses the backend and simulates a successful payment.
   * 
   * TO ENABLE REAL PAYMENT:
   * 1. Comment out the "DEMO MODE" section below (lines ~135-150)
   * 2. Uncomment the "PRODUCTION MODE" section (lines ~152-170)
   */
  submitPayment(): void {
    this.error = '';
    
    if (!this.validateForm()) {
      return;
    }

    // ============================================
    // DEMO MODE: Mock payment simulation (INSTANT)
    // ============================================
    // Generate a fake transaction ID for demo
    const fakeTransactionId = 'DEMO-' + Math.random().toString(36).substring(2, 15);
    
    this.success = true;
    this.loading = false;
    
    console.log('DEMO MODE: Mock payment successful!');
    console.log('Transaction ID:', fakeTransactionId);
    
    // Show success message briefly then redirect
    setTimeout(() => {
      this.router.navigate(['/homeowner/dashboard'], {
        queryParams: { paymentSuccess: true, transactionId: fakeTransactionId }
      });
    }, 2000);

    // ============================================
    // PRODUCTION MODE: Real payment API call
    // ============================================
    // Uncomment this section to enable real payment processing
    /*
    this.paymentService.createPayment(this.paymentForm).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        
        // Show success message briefly then redirect
        setTimeout(() => {
          this.router.navigate(['/homeowner/dashboard'], {
            queryParams: { paymentSuccess: true, transactionId: response.transactionId }
          });
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || err.error || 'Payment failed. Please try again.';
        console.error('Payment error:', err);
      }
    });
    */
  }
}