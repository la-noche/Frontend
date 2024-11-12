import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthStatus());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();  // Observable para suscribirse al estado de autenticación

  constructor() {}

  // Verifica si el token está presente en el localStorage
  private checkAuthStatus(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Método para hacer login (guardar token)
  login(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);  // Actualizar el estado
  }

  // Método para hacer logout (eliminar token)
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);  // Actualizar el estado
  }
}
