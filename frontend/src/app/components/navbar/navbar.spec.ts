import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRole } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Navbar } from './navbar';
import { ActivatedRoute, Router } from '@angular/router';
import { FactoryTarget } from '@angular/compiler';
import { environment } from '../../../environments/environment';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authService: any;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const spy = {
      isLoggedIn: vi.fn(),
      isHomeowner: vi.fn(),
      isProvider: vi.fn(),
      getCurrentUser: vi.fn(),
      logout: vi.fn(),
      isAuthenticated$: of(true)
    };

    await TestBed.configureTestingModule({
      imports: [Navbar, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: spy },
        { provide: ActivatedRoute, useValue: {} } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Set up the AuthService spies
    authService.isLoggedIn.mockReturnValue(true);
    authService.isHomeowner.mockReturnValue(true);
    authService.isProvider.mockReturnValue(false);
    authService.getCurrentUser.mockReturnValue({
      email: 'test@example.com',
      token: '',
      userId: 0,
      role: UserRole.HOMEOWNER
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('should show welcome message when logged in', fakeAsync(() => {
  fixture.detectChanges();

  // Flush all matching requests for /api/users/me
  httpMock.match(`${environment.apiUrl}/api/users/me`).forEach(req => {
    req.flush({ firstName: 'Tester' });
  });

  tick();
  fixture.detectChanges();

  const welcomeMessage = fixture.nativeElement.querySelector('li');
  expect(welcomeMessage).toBeTruthy();
  expect(welcomeMessage.textContent).toContain('Welcome, Tester!');
}));
});


