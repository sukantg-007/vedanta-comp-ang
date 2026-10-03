import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard], // Keeps control localized inside the feature bundle folder
    data: {
      roles: ['ADMIN']
    },
    loadComponent: () =>
      import('../admin/admin-dashboard/admin-dashboard.component').then(
        component => component.AdminDashboardComponent
      )
  }
];
