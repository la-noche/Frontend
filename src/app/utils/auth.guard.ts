import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const token = localStorage.getItem('token')

  /* Valido que si el usuario esta autenticado, de permiso a pasar a la ruta */
  const router = inject(Router);
  if (token == undefined) {
    router.navigateByUrl('/login');   
  }
    return true;
};
