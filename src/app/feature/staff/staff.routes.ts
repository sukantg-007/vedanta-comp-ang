import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const STAFF_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: {
      roles: ['STAFF']
    },
    loadComponent: () =>
      import('./staff-dashboard/staff-dashboard.component').then(
        component => component.StaffDashboardComponent
      )
  }
];