import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        console.log('Usuario autenticado');
        return true; // Permite el acceso a la ruta
      } else {
        // Si no está autenticado, redirige al login
        console.log('Usuario no autenticado, redirigiendo al login');
        router.navigate(['/login']);
        return false; // Bloquea el acceso a la ruta
      }
    }),
    catchError((error) => {
      console.error('Error en authGuard:', error);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
