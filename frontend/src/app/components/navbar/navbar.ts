import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  isLoggedIn: boolean = false;
  isHomeowner: boolean = false;
  isProvider: boolean = false;
  isAdmin: boolean = false;
  userName: string = '';
  firstName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Check auth status on load
    this.updateAuthStatus();

    // Subscribe to auth changes
    this.authService.isAuthenticated$.subscribe(() => {
      this.updateAuthStatus();
    });
  }

  updateAuthStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isHomeowner = this.authService.isHomeowner();
    this.isProvider = this.authService.isProvider();
    this.isAdmin = this.authService.isAdmin();
    
    const user = this.authService.getCurrentUser();
    this.userName = user?.email || '';

    if (this.isLoggedIn) {
      this.http.get<{ firstName: string }>('http://localhost:8080/api/users/me').subscribe({
        next: (profile) => {
          this.firstName = profile.firstName;
        },
        error: (err) => {
          this.firstName = '';
        }
      });
    } else {
      this.firstName = '';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
