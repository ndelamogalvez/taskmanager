import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink, NgIf],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Welcome back</h1>
        <p class="subtitle">Sign in to your TaskManager account</p>
        <form #form="ngForm" (ngSubmit)="onSubmit()">
          <div class="form-field">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" required email>
            </mat-form-field>
          </div>
          <div class="form-field">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" [(ngModel)]="password" name="password" required>
            </mat-form-field>
          </div>
          <p class="text-muted" *ngIf="error">{{ error }}</p>
          <button mat-flat-button color="primary" class="full-width" type="submit" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        <div class="auth-link">Don't have an account? <a routerLink="/register">Register</a></div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.error = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/boards']); },
      error: (err) => { this.loading = false; this.error = err.error?.error || 'Login failed'; }
    });
  }
}
