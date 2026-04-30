import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface ServiceRequest {
  id: number;
  categoryName: string;
  description: string;
  status: string;
  scheduledDate: string;
  homeownerName?: string;
  providerName?: string;
  agreedPrice?: number;
  createdAt: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  // Tab management
  activeTab: 'users' | 'requests' = 'users';
  
  // Users tab
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedUser: User | null = null;
  showStatusModal: boolean = false;
  showUserDetailModal: boolean = false;
  searchTerm: string = '';
  selectedRole: string = 'ALL';
  
  // Service Requests tab
  serviceRequests: ServiceRequest[] = [];
  filteredRequests: ServiceRequest[] = [];
  isLoadingRequests: boolean = false;
  requestsErrorMessage: string = '';
  selectedRequest: ServiceRequest | null = null;
  showCancelModal: boolean = false;
  cancelReason: string = '';
  
  // Service Request filters
  requestSearchTerm: string = '';
  selectedStatus: string = 'ALL';
  selectedCategory: string = 'ALL';
  categories: string[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadServiceRequests();
  }
  
  // Tab management
  switchTab(tab: 'users' | 'requests'): void {
    this.activeTab = tab;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<User[]>('${environment.apiUrl}/api/users')
      .subscribe({
        next: (users) => {
          this.users = users;
          this.filteredUsers = users;
          this.applyFilters();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.errorMessage = 'Failed to load users. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  applyFilters(): void {
    let filtered = [...this.users];

    // Apply role filter
    if (this.selectedRole !== 'ALL') {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(search) ||
        user.lastName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    this.filteredUsers = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onRoleFilterChange(): void {
    this.applyFilters();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  openStatusModal(user: User): void {
  this.selectedUser = user;
  this.showStatusModal = true;
  }

  closeStatusModal(): void {
  this.showStatusModal = false;
  this.selectedUser = null;
  }

  openUserDetailModal(user: User): void {
  this.selectedUser = user;
  this.showUserDetailModal = true;
  }

  closeUserDetailModal(): void {
  this.showUserDetailModal = false;
  this.selectedUser = null;
  }

  // confirmStatusChange() {
  //   this.http.patch(`${environment.apiUrl}/api/users/${this.selectedUser!.id}/status`, { isActive: !this.selectedUser!.isActive })
  //     .subscribe(() => {
  //       this.selectedUser!.isActive = !this.selectedUser!.isActive;
  //       this.showStatusModal = false;
  //     });
  // }
  confirmStatusChange() {
    this.http.patch(
      `${environment.apiUrl}/api/users/${this.selectedUser!.id}/status`,
      { isActive: !this.selectedUser!.isActive },
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        this.selectedUser!.isActive = !this.selectedUser!.isActive;
        this.showStatusModal = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showStatusModal = false;
        this.cdr.detectChanges();
      }
    });
  }
  
  // Service Requests Management
  loadServiceRequests(): void {
    this.isLoadingRequests = true;
    this.requestsErrorMessage = '';

    this.http.get<ServiceRequest[]>('${environment.apiUrl}/api/service-requests/all')
      .subscribe({
        next: (requests) => {
          this.serviceRequests = requests;
          this.filteredRequests = requests;
          this.extractCategories();
          this.applyRequestFilters();
          this.isLoadingRequests = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading service requests:', error);
          this.requestsErrorMessage = 'Failed to load service requests. Please try again.';
          this.isLoadingRequests = false;
          this.cdr.detectChanges();
        }
      });
  }
  
  extractCategories(): void {
    const uniqueCategories = new Set(this.serviceRequests.map(req => req.categoryName));
    this.categories = Array.from(uniqueCategories).sort();
  }
  
  applyRequestFilters(): void {
    let filtered = [...this.serviceRequests];

    // Apply status filter
    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(req => req.status === this.selectedStatus);
    }

    // Apply category filter
    if (this.selectedCategory !== 'ALL') {
      filtered = filtered.filter(req => req.categoryName === this.selectedCategory);
    }

    // Apply search filter
    if (this.requestSearchTerm.trim()) {
      const search = this.requestSearchTerm.toLowerCase();
      filtered = filtered.filter(req =>
        req.description.toLowerCase().includes(search) ||
        req.categoryName.toLowerCase().includes(search) ||
        (req.homeownerName && req.homeownerName.toLowerCase().includes(search)) ||
        (req.providerName && req.providerName.toLowerCase().includes(search))
      );
    }

    this.filteredRequests = filtered;
  }
  
  onRequestSearchChange(): void {
    this.applyRequestFilters();
  }
  
  onStatusFilterChange(): void {
    this.applyRequestFilters();
  }
  
  onCategoryFilterChange(): void {
    this.applyRequestFilters();
  }
  
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  getRequestStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'status-pending',
      'ACCEPTED': 'status-accepted',
      'IN_PROGRESS': 'status-progress',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled'
    };
    return statusMap[status] || '';
  }
  
  openCancelModal(request: ServiceRequest): void {
    this.selectedRequest = request;
    this.cancelReason = '';
    this.showCancelModal = true;
  }
  
  closeCancelModal(): void {
    this.showCancelModal = false;
    this.selectedRequest = null;
    this.cancelReason = '';
  }
  
  confirmCancelRequest(): void {
    if (!this.selectedRequest || !this.cancelReason.trim()) {
      return;
    }

    this.http.patch(
      `${environment.apiUrl}/api/service-requests/${this.selectedRequest.id}/admin-cancel`,
      { reason: this.cancelReason },
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        // Update local state
        const requestIndex = this.serviceRequests.findIndex(r => r.id === this.selectedRequest!.id);
        if (requestIndex !== -1) {
          this.serviceRequests[requestIndex].status = 'CANCELLED';
        }
        this.applyRequestFilters();
        this.closeCancelModal();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cancelling request:', error);
        this.closeCancelModal();
        this.cdr.detectChanges();
      }
    });
  }
}
