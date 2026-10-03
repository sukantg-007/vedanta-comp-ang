import { inject, Injectable } from '@angular/core';
import { UserRole, LoginResponse } from '../../shared/models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthRequest } from '../../shared/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Core Endpoint Routing Parameters Configuration
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  
  // Storage Keys Setup
  private readonly accessTokenKey = 'accessToken';
  private readonly roleKey = 'role';
  private readonly emailKey = 'email';

  // In your home.component.ts
login(payload: AuthRequest): Observable<LoginResponse> {
  return this.http
    .post<LoginResponse>(
      `${this.apiUrl}/login`,
      payload, // Sends the whole payload object as the request body JSON string
      { withCredentials: true }
    )
    .pipe(
      tap((response: LoginResponse) => {
        this.saveSession(response);
      })
    );
}

  /**
   * FIXED: Reads session context strings directly from your persistent key identifiers
   */
  getRole(): UserRole | null {
    return localStorage.getItem(this.roleKey) as UserRole | null;
  }

  getEmail(): string | null {
    return localStorage.getItem(this.emailKey);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  isLoggedIn(): boolean {
    return this.getAccessToken() !== null;
  }

  hasRole(roles: UserRole[]): boolean {
    const activeRole = this.getRole();
    return !!activeRole && roles.includes(activeRole);
  }

  /**
   * FIXED: Uses the corrected getRole() accessor to switch dashboard modules path definitions fluidly
   */
  getDashboardRoute(): string {
    const role = this.getRole();

    switch (role) {
      case 'ADMIN':
        return '/admin';

      case 'STAFF':
        return '/staff';

      case 'STUDENT':
        return '/student';

      default:
        return '/';
    }
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/refresh`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((response: LoginResponse) => {
          this.saveSession(response);
        })
      );
  }

  saveSession(response: LoginResponse): void {
    localStorage.setItem(this.accessTokenKey, response.accessToken);
    localStorage.setItem(this.roleKey, response.role);
    localStorage.setItem(this.emailKey, response.email);
  }

  clearSession(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.emailKey);
  }

  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => this.finishLogout(),
        error: () => this.finishLogout() // Gracefully clear out states even if backend token validation has timed out
      });
  }

  private finishLogout(): void {
    this.clearSession();
    this.router.navigate(['/']);
  }
}
