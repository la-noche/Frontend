import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { gameTypeInterface } from '../interfaces/gameType.interface.js';
import { environment } from '../../environments/environment.js';

@Injectable({
  providedIn: 'root',
})
export class GameTypesService {
  private apiUrl = `${environment.apiUrl}/gameType`;

  constructor(private http: HttpClient) {}

  getGameTypes(): Observable<gameTypeInterface[]> {
    /*const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);*/ //esto es por si quiero restrigir esto solo
    return this.http.get<gameTypeInterface[]>(this.apiUrl);
  }

  getGameTypeById(id: number): Observable<gameTypeInterface> {
    return this.http.get<gameTypeInterface>(`${this.apiUrl}/${id}`);
  }

  createGameType(gameType: gameTypeInterface): Observable<gameTypeInterface> {
    return this.http.post<gameTypeInterface>(this.apiUrl, gameType);
  }

  updateGameType(gameType: gameTypeInterface): Observable<gameTypeInterface> {
    return this.http.put<gameTypeInterface>(
      `${this.apiUrl}/${gameType.id}`,
      gameType
    );
  }

  deleteGameType(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
