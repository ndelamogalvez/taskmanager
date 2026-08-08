import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        auth.logout();
        router.navigate(['/login']);
        snackBar.open('Sesión expirada. Inicia sesión de nuevo.', 'Cerrar', { duration: 5000 });
      } else if (err.status === 403) {
        snackBar.open('No tienes permiso para realizar esta acción.', 'Cerrar', { duration: 5000 });
      } else if (err.status === 0) {
        snackBar.open('No se pudo conectar con el servidor.', 'Cerrar', { duration: 5000 });
      } else {
        const message = err.error?.error || err.error?.message || 'Ha ocurrido un error';
        snackBar.open(message, 'Cerrar', { duration: 5000 });
      }
      return throwError(() => err);
    })
  );
};
