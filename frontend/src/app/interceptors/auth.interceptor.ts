import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP Interceptor to automatically attach JWT token to all requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get token from localStorage
  const token = localStorage.getItem('auth_token');
  
  // If token exists, clone request and add Authorization header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }
  
  // If no token, proceed with original request
  return next(req);
};