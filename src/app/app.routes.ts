import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'users' },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/user-list/user-list.component').then((m) => m.UserListComponent),
  },
  {
    path: 'users/new',
    loadComponent: () =>
      import('./pages/user-create/user-create.component').then((m) => m.UserCreateComponent),
  },
  {
    path: 'users/:id',
    loadComponent: () =>
      import('./pages/user-detail/user-detail.component').then((m) => m.UserDetailComponent),
  },
  {
    path: 'users/:id/edit',
    loadComponent: () =>
      import('./pages/user-edit/user-edit.component').then((m) => m.UserEditComponent),
  },
];
