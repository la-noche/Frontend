import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigateByUrl('/login');
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);

    if (decoded.role !== 'admin') {
      router.navigate(['/access-denied'], { queryParams: { reason: 'not-admin' } });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token inválido:', error);
    router.navigateByUrl('/login');
    return false;
  }
};