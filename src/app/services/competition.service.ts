import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { competitionInterface } from '../interfaces/competition.interface.js';

@Injectable({
  providedIn: 'root',
})
export class CompetitionService {
  private apiUrl = 'https://backend-production-0538.up.railway.app/api/competition';

  constructor(private http: HttpClient) {}

  getCompetitions(): Observable<competitionInterface[]> {
    return this.http.get<competitionInterface[]>(this.apiUrl);
  }

  getCompetitionById(id: number): Observable<competitionInterface> {
    return this.http.get<competitionInterface>(`${this.apiUrl}/${id}`);
  }

  createCompetition(competition:competitionInterface): Observable<competitionInterface> {
    return this.http.post<competitionInterface>(this.apiUrl, competition);
  }

  updateCompetition(competition: competitionInterface): Observable<competitionInterface> {
    return this.http.put<competitionInterface>(
      `${this.apiUrl}/${competition.id}`,
      competition
    );
  }

  deleteCompetition(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  startCompetition(id: number) {
    return this.http.post(`${this.apiUrl}/${id}/start`, {});
  }
}
