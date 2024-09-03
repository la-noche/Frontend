import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);

  /* Valido que si el usuario esta autenticado, de permiso a pasar a la ruta */
  const router = inject(Router);
  if (authService.isAuth()) {                          
    return true;
  }
  else {
    router.navigateByUrl('/login');          /* Si no esta autenticado, lo redirijo a la pagina de login */
    return false;
  }

};
