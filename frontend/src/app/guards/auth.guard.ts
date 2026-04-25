import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard
 * Protects routes that require authentication
 * Redirects to login page if user is not authenticated
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (authService.isLoggedIn()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  const returnUrl = state.url;
  
  // Redirect to login page with return url
  router.navigate(['/login'], { 
    queryParams: { returnUrl } 
  });
  
  return false;
};

/**
 * Role-based guard factory
 * Creates a guard that checks for specific roles
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // First check if authenticated
    if (!authService.isLoggedIn()) {
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }

    // Check if user has required role
    const currentUser = authService.getCurrentUser();
    if (currentUser && allowedRoles.includes(currentUser.role)) {
      return true;
    }

    // User doesn't have required role, redirect to home
    router.navigate(['/']);
    return false;
  };
};

/**
 * Homeowner-only guard
 */
export const homeownerGuard: CanActivateFn = roleGuard(['HOMEOWNER']);

/**
 * Provider-only guard
 */
export const providerGuard: CanActivateFn = roleGuard(['PROVIDER']);

/**
 * Admin-only guard
 */
export const adminGuard: CanActivateFn = roleGuard(['ADMIN']);