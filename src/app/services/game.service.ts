import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { gameInterface } from '../interfaces/game.interface.js';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiUrl = 'http://localhost:3000/api/game';

  constructor(private http: HttpClient) {}

  getGames(): Observable<gameInterface[]> {
    return this.http.get<gameInterface[]>(this.apiUrl);
  }

  getGameById(id: number): Observable<gameInterface> {
    return this.http.get<gameInterface>(`${this.apiUrl}/${id}`);
  }

  createGame(game: FormData): Observable<gameInterface> {
    return this.http.post<gameInterface>(this.apiUrl, game);
  }

  updateGame(game: FormData): Observable<gameInterface> {
    return this.http.put<gameInterface>(`${this.apiUrl}/${game.get('id')}`, game);
  }

  deleteGame(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
