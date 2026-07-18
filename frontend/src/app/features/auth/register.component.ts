import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatInputModule, MatButtonModule, RouterLink, NgIf],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Create account</h1>
        <p class="subtitle">Start managing your tasks</p>
        <form #form="ngForm" (ngSubmit)="onSubmit()">
          <div class="form-field">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name</mat-label>
              <input matInput [(ngModel)]="name" name="name" required>
            </mat-form-field>
          </div>
          <div class="form-field">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" required email>
            </mat-form-field>
          </div>
          <div class="form-field">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" [(ngModel)]="password" name="password" required minlength="6">
            </mat-form-field>
          </div>
          <p class="text-muted" *ngIf="error">{{ error }}</p>
          <button mat-flat-button color="primary" class="full-width" type="submit" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Register' }}
          </button>
        </form>
        <div class="auth-link">Already have an account? <a routerLink="/login">Sign in</a></div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.name || !this.email || !this.password) return;
    this.loading = true;
    this.error = '';
    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/boards']); },
      error: (err) => { this.loading = false; this.error = err.error?.error || 'Registration failed'; }
    });
  }
}
