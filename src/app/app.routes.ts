import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { roleGuard } from './core/guards/role.guard'; // 1. Import your custom role guard function

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./feature/admin/admin.routes').then(
        route => route.ADMIN_ROUTES
      ),
    canActivate: [roleGuard],          // 2. Protects direct address bar entry
    data: { roles: ['ADMIN'] }         // 3. Tells the guard who can enter
  },
  {
    path: 'staff',
    loadChildren: () =>
      import('./feature/staff/staff.routes').then(
        route => route.STAFF_ROUTES
      ),
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'STAFF'] } // Admins and Staff can access
  },
  {
    path: 'student',
    loadChildren: () =>
      import('./feature/student/student.routes').then(
        route => route.STUDENT_ROUTES
      ),
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'STAFF', 'STUDENT'] } // All roles can access
  },
  {
    path: '**',
    redirectTo: ''
  }
];
