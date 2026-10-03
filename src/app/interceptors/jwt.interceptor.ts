import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // 1. Only intercept requests targeting your Spring Boot API backend
  // This prevents accidentally leaking your security tokens to third-party APIs
  const isApiRequest = req.url.includes('/api/v1/');

  if (token && isApiRequest) {
    // 2. Clone the request and insert the Bearer authorization header spec
    // HttpRequests are immutable, so we must clone them to make modifications safely
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // 3. If no token is found, pass the original request through untouched
  return next(req);
};
