import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  token = '';

  constructor() { }

  isAuth() {
    return this.token.length > 0;              /* Si el token es mayor a 0, el usuario esta autenticado, por lo que fuerzo a que retorne false por defecto */
  }
}