import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  throwError
} from 'rxjs';

import { AuthService } from '../core/services/auth.service';

let refreshInProgress = false;

const refreshedTokenSubject =
  new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn =
  (request, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const requestWithToken =
      addAccessToken(request, authService);

    return next(requestWithToken).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status !== 401 ||
          isAuthenticationRequest(request.url)
        ) {
          return throwError(() => error);
        }

        return handleUnauthorized(
          request,
          next,
          authService,
          router
        );
      })
    );
  };

function addAccessToken(
  request: Parameters<HttpInterceptorFn>[0],
  authService: AuthService
) {
  const accessToken =
    authService.getAccessToken();

  const headers = accessToken
    ? request.headers.set(
        'Authorization',
        `Bearer ${accessToken}`
      )
    : request.headers;

  return request.clone({
    headers,
    withCredentials: true
  });
}

function isAuthenticationRequest(url: string): boolean {
  // Checks for the core auth endpoints regardless of the prefix/domain context path
  return (
    url.includes('auth/login') ||
    url.includes('auth/refresh') ||
    url.includes('auth/logout')
  );
}

function handleUnauthorized(
  originalRequest: Parameters<HttpInterceptorFn>[0],
  next: Parameters<HttpInterceptorFn>[1],
  authService: AuthService,
  router: Router
) {
  if (!refreshInProgress) {
    refreshInProgress = true;
    refreshedTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(response => {
        refreshedTokenSubject.next(
          response.accessToken
        );

        return next(
          addAccessToken(
            originalRequest,
            authService
          )
        );
      }),
      catchError(refreshError => {
        authService.clearSession();
        router.navigate(['/']);

        return throwError(() => refreshError);
      }),
      finalize(() => {
        refreshInProgress = false;
      })
    );
  }

  return refreshedTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(() =>
      next(
        addAccessToken(
          originalRequest,
          authService
        )
      )
    )
  );
}