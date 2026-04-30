import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface Category {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-service-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './service-request-form.html',
  styleUrl: './service-request-form.scss'
})
export class ServiceRequestFormComponent implements OnInit {
  requestForm: FormGroup;
  categories: Category[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  timeSlots = ['Morning (8 AM - 12 PM)', 'Afternoon (12 PM - 5 PM)', 'Evening (5 PM - 8 PM)'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.requestForm = this.fb.group({
      categoryId: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      scheduledDate: ['', Validators.required],
      preferredTimeSlot: [''],
      additionalNotes: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
    
    // Check for pre-selected category from query params
    this.route.queryParams.subscribe(params => {
      if (params['categoryId']) {
        this.requestForm.patchValue({
          categoryId: params['categoryId']
        });
        
        // Optionally log which category was selected
        if (params['categoryName']) {
          console.log(`Pre-selected category: ${params['categoryName']}`);
        }
      }
    });
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/api/categories`)
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.errorMessage = 'Failed to load service categories';
          this.cdr.detectChanges();
        }
      });
  }

  onSubmit() {
    if (this.requestForm.invalid) {
      this.markFormGroupTouched(this.requestForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'User not logged in';
      this.isLoading = false;
      return;
    }

    // Prepare request data
    const formValue = this.requestForm.value;
    const requestData = {
      categoryId: formValue.categoryId,
      description: formValue.description,
      scheduledDate: formValue.scheduledDate ? new Date(formValue.scheduledDate).toISOString() : null,
      serviceId: null // Can be added later when selecting specific services
    };

    // Include additional notes in description if provided
    if (formValue.preferredTimeSlot) {
      requestData.description += `\n\nPreferred Time: ${formValue.preferredTimeSlot}`;
    }
    if (formValue.additionalNotes) {
      requestData.description += `\n\nAdditional Notes: ${formValue.additionalNotes}`;
    }

    // POST to backend
    this.http.post(`${environment.apiUrl}/api/service-requests?homeownerId=${userId}`, requestData)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Service request created successfully!';
          this.cdr.detectChanges();
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/homeowner/dashboard']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to create service request';
          console.error('Error creating request:', error);
          this.cdr.detectChanges();
        }
      });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  hasError(fieldName: string): boolean {
    const field = this.requestForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.requestForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;

    return 'Invalid input';
  }

  cancel() {
    this.router.navigate(['/homeowner/dashboard']);
  }
}