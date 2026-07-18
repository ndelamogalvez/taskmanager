import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'boards', loadComponent: () => import('./features/boards/board-list.component').then(m => m.BoardListComponent), canActivate: [authGuard] },
  { path: 'boards/:id', loadComponent: () => import('./features/boards/board-detail.component').then(m => m.BoardDetailComponent), canActivate: [authGuard] },
  { path: '', redirectTo: '/boards', pathMatch: 'full' },
  { path: '**', redirectTo: '/boards' }
];
