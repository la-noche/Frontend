import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userInterface } from '../interfaces/user.interface.js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) {}

  signUp(user: userInterface): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  login(user: userInterface): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/login`, user);
  }
}
