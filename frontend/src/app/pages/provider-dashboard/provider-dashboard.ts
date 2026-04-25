import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface ServiceRequest {
  id: number;
  categoryName: string;
  description: string;
  status: string;
  scheduledDate: string;
  homeownerName?: string;
  agreedPrice?: number;
  estimatedPriceMin?: number;
  estimatedPriceMax?: number;
}

type SortOption = 'newest' | 'oldest' | 'soonest';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './provider-dashboard.html',
  styleUrl: './provider-dashboard.scss'
})
export class ProviderDashboardComponent implements OnInit {
  
  userName: string = '';
  userEmail: string = '';
  myRequests: ServiceRequest[] = [];
  cancelledRequests: ServiceRequest[] = [];
  availableRequests: ServiceRequest[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  activeTab: 'my-requests' | 'available' = 'my-requests';
  priceInputs: { [key: number]: number } = {}; // Store price inputs for each request

  // Sort options - using separate variable for UI
  selectedSortOption: SortOption = 'soonest';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadMyRequests();
    this.loadAvailableRequests();
  }

  loadUserData() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userEmail = user.email;
      
      // Fetch full user profile from backend
      this.http.get<any>('http://localhost:8080/api/users/me')
        .subscribe({
          next: (profile) => {
            this.userName = `${profile.firstName} ${profile.lastName}`;
          },
          error: (error) => {
            console.error('Error loading user profile:', error);
            this.userName = 'User';
          }
        });
    }
  }

  loadMyRequests() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'User not found';
      this.isLoading = false;
      return;
    }

    this.http.get<any[]>(`http://localhost:8080/api/service-requests/provider/${userId}`)
      .subscribe({
        next: (requests) => {

          const mappedRequests: ServiceRequest[] = requests.map(req => ({
            id: req.id,
            categoryName: req.categoryName,
            description: req.description,
            status: req.status,
            scheduledDate: req.scheduledDate,
            homeownerName: req.homeownerName,
            agreedPrice: req.agreedPrice
          }));
          // Apply sorting after loading

          // Split active vs cancelled
          this.myRequests = mappedRequests.filter(r => r.status !== 'CANCELLED');
          this.cancelledRequests = mappedRequests.filter(r => r.status === 'CANCELLED');

          this.applySorting();
        },
        error: (error) => {
          console.error('Error loading my requests:', error);
        }
      });
  }

  loadAvailableRequests() {
    this.http.get<any[]>('http://localhost:8080/api/service-requests/available')
      .subscribe({
        next: (requests) => {
          this.availableRequests = requests.map(req => ({
            id: req.id,
            categoryName: req.categoryName,
            description: req.description,
            status: req.status,
            scheduledDate: req.scheduledDate,
            homeownerName: req.homeownerName,
            estimatedPriceMin: req.category?.estimatedPriceMin,
            estimatedPriceMax: req.category?.estimatedPriceMax
          }));
          // Apply sorting after loading

          this.applySorting();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading available requests:', error);
          this.errorMessage = 'Failed to load available requests';
          this.isLoading = false;
        }
      });
  }

  // Updated sorting to handle all lists
  applySorting() {
    this.sortRequests(this.myRequests);
    this.sortRequests(this.cancelledRequests);
    this.sortRequests(this.availableRequests);
  }

  // Sort requests based on selected option
  sortRequests(requests: ServiceRequest[]) {
    const now = new Date();
    
    requests.sort((a, b) => {
      const dateA = new Date(a.scheduledDate);
      const dateB = new Date(b.scheduledDate);
      
      switch(this.selectedSortOption) {
        case 'newest':
          // Most recent first
          return dateB.getTime() - dateA.getTime();
          
        case 'oldest':
          // Oldest first
          return dateA.getTime() - dateB.getTime();
          
        case 'soonest':
          // Soonest scheduled (closest to current date)
          const diffA = Math.abs(dateA.getTime() - now.getTime());
          const diffB = Math.abs(dateB.getTime() - now.getTime());
          return diffA - diffB;
          
        default:
          return 0;
      }
    });
  }

   // Change sort option
  onSortChange(event: any) {
    this.selectedSortOption = event.target.value;
    this.applySorting();
  }

  acceptRequest(requestId: number) {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    const proposedPrice = this.priceInputs[requestId];
    
    if (!proposedPrice || proposedPrice <= 0) {
      alert('Please enter a valid price before accepting');
      return;
    }

    const body = {
      agreedPrice: proposedPrice
    };

    this.http.patch(`http://localhost:8080/api/service-requests/${requestId}/accept?providerId=${userId}`, body)
      .subscribe({
        next: () => {
          // Clear price input
          delete this.priceInputs[requestId];
          // Reload both lists
          this.loadMyRequests();
          this.loadAvailableRequests();
          alert('Request accepted successfully!');
        },
        error: (error) => {
          console.error('Error accepting request:', error);
          alert('Failed to accept request. It may have already been assigned.');
        }
      });
  }

  updateStatus(requestId: number, newStatus: string) {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    const body = {
      providerId: userId,
      status: newStatus,
      notes: `Status updated to ${newStatus}`
    };

    this.http.patch(`http://localhost:8080/api/service-requests/${requestId}/status`, body)
      .subscribe({
        next: () => {
          this.loadMyRequests();
          alert('Status updated successfully!');
        },
        error: (error) => {
          console.error('Error updating status:', error);
          alert('Failed to update status');
        }
      });
  }

  // Cancel Function
  cancelRequest(requestId: number) {
    const confirmCancel = confirm("Are you sure you want to cancel this request?");
    if (!confirmCancel) return;

    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    const body = {
      providerId: userId,
      status: 'CANCELLED',
      notes: 'Request cancelled by provider'
    };

    this.http.patch(`http://localhost:8080/api/service-requests/${requestId}/status`, body)
      .subscribe({
        next: () => {
          this.loadMyRequests();
          alert('Request cancelled successfully!');
        },
        error: (error) => {
          console.error('Error cancelling request:', error);
          alert('Failed to cancel request');
        }
      });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'status-pending',
      'ACCEPTED': 'status-accepted',
      'IN_PROGRESS': 'status-progress',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled',
      'PENDING_QUOTE': 'status-pending',
      'DECLINED': 'status-cancelled'
        };
    return statusMap[status] || '';
  }

  setActiveTab(tab: 'my-requests' | 'available') {
    this.activeTab = tab;
  }

  getActiveCount(): number {
    return this.myRequests.filter(req => 
      req.status === 'ACCEPTED' || req.status === 'IN_PROGRESS'
    ).length;
  }

  getCompletedCount(): number {
    return this.myRequests.filter(req => req.status === 'COMPLETED').length;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}