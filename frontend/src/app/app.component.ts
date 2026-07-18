import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" *ngIf="authService.currentUser()">
      <span style="cursor:pointer" routerLink="/boards">TaskManager</span>
      <span class="spacer"></span>
      <span style="font-size:14px;margin-right:16px">{{ authService.currentUser()?.name }}</span>
      <button mat-icon-button (click)="logout()"><mat-icon>logout</mat-icon></button>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
