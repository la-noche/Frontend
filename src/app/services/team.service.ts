import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TeamInterface } from '../interfaces/team.interface.js';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.js';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiUrl = `${environment.apiUrl}/team`;

  constructor(private http: HttpClient) {}

  getTeams(): Observable<TeamInterface[]> {
    return this.http.get<TeamInterface[]>(this.apiUrl);
  }

  getTeamById(id: number): Observable<TeamInterface> {
    return this.http.get<TeamInterface>(`${this.apiUrl}/${id}`);
  }

  createTeam(teamData: { name: string }): Observable<TeamInterface> {
    return this.http.post<TeamInterface>(this.apiUrl, teamData);
  }

  updateTeam(team: TeamInterface): Observable<TeamInterface> {
    return this.http.put<TeamInterface>(`${this.apiUrl}/${team.id}`, team);
  }

  deleteTeam(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addUserToTeam(teamId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${teamId}/user`, { userId });
  }

  removeUserFromTeam(teamId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${teamId}/user`, { params: { userId: userId.toString() } });
  }
}
