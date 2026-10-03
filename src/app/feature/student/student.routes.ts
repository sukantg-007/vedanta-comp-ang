import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: {
      roles: ['STUDENT']
    },
    loadComponent: () =>
      import('../student/student-dashboard/student-dashboard.component').then(
        component => component.StudentDashboardComponent
      )
  }
];