import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Service Request interface
 */
export interface ServiceRequestResponse {
  id: number;
  homeownerId: number;
  categoryId: number;
  categoryName: string;
  description: string;
  scheduledDate: string;
  status: string;
  providerId?: number;
  providerName?: string;
  agreedPrice?: number;
  completionDate?: string;
  cancellationReason?: string;
}

/**
 * Service Request Service
 * Handles all service request-related API calls
 */
@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {
  private apiUrl = `${environment.apiUrl}/api/service-requests`;

  constructor(private http: HttpClient) {}

  /**
   * Get a service request by ID
   * @param id Service request ID
   * @returns Observable of ServiceRequestResponse
   */
  getServiceRequestById(id: number): Observable<ServiceRequestResponse> {
    return this.http.get<ServiceRequestResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all service requests for a homeowner
   * @param homeownerId Homeowner user ID
   * @returns Observable array of ServiceRequestResponse
   */
  getHomeownerRequests(homeownerId: number): Observable<ServiceRequestResponse[]> {
    return this.http.get<ServiceRequestResponse[]>(`${this.apiUrl}/homeowner/${homeownerId}`);
  }

  /**
   * Get all service requests for a provider
   * @param providerId Provider user ID
   * @returns Observable array of ServiceRequestResponse
   */
  getProviderRequests(providerId: number): Observable<ServiceRequestResponse[]> {
    return this.http.get<ServiceRequestResponse[]>(`${this.apiUrl}/provider/${providerId}`);
  }

  /**
   * Get all available service requests (PENDING status)
   * @returns Observable array of ServiceRequestResponse
   */
  getAvailableRequests(): Observable<ServiceRequestResponse[]> {
    return this.http.get<ServiceRequestResponse[]>(`${this.apiUrl}/available`);
  }
}