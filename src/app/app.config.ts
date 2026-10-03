import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor'; // Verify your path definitions
import { jwtInterceptor } from './interceptors/jwt.interceptor';   // Verify your path definitions

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    // FIXED: Combined both interceptors sequentially inside a single array block
    provideHttpClient(
      withInterceptors([
        authInterceptor, 
        jwtInterceptor
      ])
    )
  ]
};
