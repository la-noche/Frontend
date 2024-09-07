import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { competitionInterface } from '../interfaces/competition.interface.js';

@Injectable({
  providedIn: 'root',
})
export class competitionService {
  private apiUrl = 'http://localhost:3000/api/competition';

  constructor(private http: HttpClient) {}

  getcompetitions(): Observable<competitionInterface[]> {
    return this.http.get<competitionInterface[]>(this.apiUrl);
  }

  getcompetitionById(id: number): Observable<competitionInterface> {
    return this.http.get<competitionInterface>(`${this.apiUrl}/${id}`);
  }

  createcompetition(competition:competitionInterface): Observable<competitionInterface> {
    return this.http.post<competitionInterface>(this.apiUrl, competition);
  }

  updatecompetition(competition: competitionInterface): Observable<competitionInterface> {
    return this.http.put<competitionInterface>(
      `${this.apiUrl}/${competition.id}`,
      competition
    );
  }

  deletecompetition(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
