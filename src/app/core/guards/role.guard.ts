import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../shared/models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Pull the authorized roles array defined on the active route
  const expectedRoles = route.data['roles'] as UserRole[];

  // 2. Gate Block: Check if a valid token session is present in localStorage
  if (!authService.isLoggedIn()) {
    console.warn('Unauthorized access attempt blocked. Redirecting to home...');
    router.navigate(['/']);
    return false; // Blocks the address bar navigation instantly
  }

  // 3. Authorization Block: Verify if the user's role matches the required roles array
  if (authService.hasRole(expectedRoles)) {
    return true; // Grant clean passage to render the component layout
  }

  // 4. Protection Fallback: Triggered if a Student/Staff attempts to type '/admin' manually
  alert('Access Denied: You do not have permission to view this panel.');
  
  // Cleanly route them back to their own authorized dashboard space
  const fallbackRoute = authService.getDashboardRoute();
  router.navigate([fallbackRoute]);
  return false; // Aborts routing thread
};
