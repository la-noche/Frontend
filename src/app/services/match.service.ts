import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { matchInterface } from '../interfaces/match.interface.js';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = 'https://backend-production-0538.up.railway.app/api/match';

  constructor(private http: HttpClient) {}

  getMatches(): Observable<matchInterface[]> {
    return this.http.get<matchInterface[]>(this.apiUrl);
  }

  getMatchById(id: number): Observable<matchInterface> {
    return this.http.get<matchInterface>(`${this.apiUrl}/${id}`);
  }

  createMatch(match: FormData): Observable<matchInterface> {
    return this.http.post<matchInterface>(this.apiUrl, match);
  }

  updateMatch(match: matchInterface): Observable<matchInterface> {
    return this.http.put<matchInterface>(`${this.apiUrl}/${match.id}`, match);
  }

  deleteMatch(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
