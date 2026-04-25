import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Payment request interface for creating payments
 */
export interface PaymentRequest {
  serviceRequestId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  cardLastFour: string;
}

/**
 * Payment response interface from backend
 */
export interface PaymentResponse {
  id: number;
  serviceRequestId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  paymentDate: string;
  cardLastFour: string;
}

/**
 * Payment method enum
 */
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

/**
 * Payment Service
 * Handles all payment-related API calls to the backend
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  /**
   * Create a new payment for a service request
   * @param request Payment request data
   * @returns Observable of PaymentResponse
   */
  createPayment(request: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(this.apiUrl, request);
  }

  /**
   * Get payment for a specific service request
   * @param serviceRequestId Service request ID
   * @returns Observable of PaymentResponse
   */
  getPaymentByServiceRequest(serviceRequestId: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/service-request/${serviceRequestId}`);
  }

  /**
   * Get all payments for the authenticated user
   * Returns payments sorted by date descending (newest first)
   * @returns Observable array of PaymentResponse
   */
  getUserPayments(): Observable<PaymentResponse[]> {
    return this.http.get<PaymentResponse[]>(`${this.apiUrl}/user`);
  }
}