import { HttpInterceptorFn } from '@angular/common/http';
import { timeout } from 'rxjs';

const REQUEST_TIMEOUT_MS = 15000;

/**
 * HTTP Interceptor — attaches JWT token and enforces a 15s request timeout.
 * The timeout prevents backend hangs from leaving component spinners stuck indefinitely.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  const outgoing = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(outgoing).pipe(timeout(REQUEST_TIMEOUT_MS));
};