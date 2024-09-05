import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');
  const messageService = inject(MessageService);
  const router = inject(Router);

  if(token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // Verificamos si es un error 401
      if(error.status === 401){
        messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
        router.navigateByUrl('/login') 
      } else {
        // Si no es un error 401, simplemente devolvemos el error sin modificar
        return throwError(() => error);
      }
      return throwError(() => new Error('Error'))
    })
    
  )
};
