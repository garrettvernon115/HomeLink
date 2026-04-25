import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile-edit.html',
  styleUrls: ['./profile-edit.scss']
})
export class ProfileEditComponent implements OnInit {
  
  profile: UserProfile = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: ''
  };
  
  isLoading: boolean = true;
  isSaving: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  
  // Form validation errors
  validationErrors: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  } = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.http.get<UserProfile>('http://localhost:8080/api/users/me')
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          this.errorMessage = 'Failed to load profile. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  validateForm(): boolean {
    this.validationErrors = {};
    let isValid = true;

    // First name validation
    if (!this.profile.firstName || this.profile.firstName.trim() === '') {
      this.validationErrors.firstName = 'First name is required';
      isValid = false;
    } else if (this.profile.firstName.length > 100) {
      this.validationErrors.firstName = 'First name must be less than 100 characters';
      isValid = false;
    }

    // Last name validation
    if (!this.profile.lastName || this.profile.lastName.trim() === '') {
      this.validationErrors.lastName = 'Last name is required';
      isValid = false;
    } else if (this.profile.lastName.length > 100) {
      this.validationErrors.lastName = 'Last name must be less than 100 characters';
      isValid = false;
    }

    // Phone validation (optional but must be valid format if provided)
    if (this.profile.phone && this.profile.phone.trim() !== '') {
      // Basic phone format validation (allows various formats)
      const phonePattern = /^[\d\s\-\(\)\+\.]+$/;
      if (!phonePattern.test(this.profile.phone)) {
        this.validationErrors.phone = 'Please enter a valid phone number';
        isValid = false;
      } else if (this.profile.phone.length > 15) {
        this.validationErrors.phone = 'Phone number must be less than 15 characters';
        isValid = false;
      }
    }

    return isValid;
  }

  saveProfile(): void {
    // Clear previous messages
    this.successMessage = '';
    this.errorMessage = '';

    // Validate form
    if (!this.validateForm()) {
      this.errorMessage = 'Please fix the errors below';
      return;
    }

    this.isSaving = true;

    const updateRequest = {
      firstName: this.profile.firstName.trim(),
      lastName: this.profile.lastName.trim(),
      phone: this.profile.phone?.trim() || null
    };

    this.http.put<UserProfile>('http://localhost:8080/api/users/me', updateRequest)
      .subscribe({
        next: (updatedProfile) => {
          this.profile = updatedProfile;
          this.successMessage = 'Profile updated successfully!';
          this.isSaving = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
          this.isSaving = false;
          this.cdr.detectChanges();
        }
      });
  }

  cancel(): void {
    // Navigate back to the appropriate dashboard based on role
    if (this.profile.role === 'PROVIDER') {
      this.router.navigate(['/provider-dashboard']);
    } else if (this.profile.role === 'HOMEOWNER') {
      this.router.navigate(['/homeowner-dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}