import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthStatus());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();  // Observable para suscribirse al estado de autenticación

  constructor() {}


  private checkAuthStatus(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded: any = jwtDecode(token);
    return decoded.role || null;
  }
  return null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
 
  login(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);  
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);  
  }
}
