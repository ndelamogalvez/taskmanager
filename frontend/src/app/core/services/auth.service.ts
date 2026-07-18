import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8085/api/auth';
  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('auth');
    if (saved) {
      const data: AuthResponse = JSON.parse(saved);
      this.token.set(data.token);
      this.currentUser.set({ id: data.id, name: data.name, email: data.email });
    }
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, req).pipe(tap(r => this.saveAuth(r)));
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, req).pipe(tap(r => this.saveAuth(r)));
  }

  logout() {
    localStorage.removeItem('auth');
    this.token.set(null);
    this.currentUser.set(null);
  }

  private saveAuth(r: AuthResponse) {
    localStorage.setItem('auth', JSON.stringify(r));
    this.token.set(r.token);
    this.currentUser.set({ id: r.id, name: r.name, email: r.email });
  }
}
