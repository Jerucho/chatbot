import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Permite el acceso a la ruta
  } else {
    // Si no está autenticado, redirige al login
    router.navigate(['/login']);
    return false; // Bloquea el acceso a la ruta
  }
};
