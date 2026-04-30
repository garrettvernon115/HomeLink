import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './password-change.html',
  styleUrls: ['./password-change.scss']
})
export class PasswordChangeComponent implements OnInit {

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Component initialization
  }

  changePassword() {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New passwords do not match.';
      return;
    }

    const body = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.http.post(
      `${environment.apiUrl}/api/users/change-password`,
      body,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`
        },
        responseType: 'text' as 'json'  // this cast is important for Angular
      }
    )
      .subscribe({
        next: (res: any) => {
          console.log('Response:', res);
          console.log('Success message set to:', res);
          this.successMessage = res || 'Password updated successfully.';
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.errorMessage = error?.error || 'Failed to change password.';
        }
      });
  }
}
