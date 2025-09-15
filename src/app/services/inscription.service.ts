import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { inscriptionInterface } from '../interfaces/inscription.interface.js';
import { environment } from '../../environments/environment.js';

@Injectable({
  providedIn: 'root',
})
export class InscriptionService {
  private apiUrl = `${environment.apiUrl}/inscription`;

  constructor(private http: HttpClient) {}

  getInscription(): Observable<inscriptionInterface[]> {
    return this.http.get<inscriptionInterface[]>(this.apiUrl);
  }

  getInscriptionById(id: number): Observable<inscriptionInterface> {
    return this.http.get<inscriptionInterface>(`${this.apiUrl}/${id}`);
  }

  createInscription(inscription: inscriptionInterface): Observable<inscriptionInterface> {
    return this.http.post<inscriptionInterface>(this.apiUrl, inscription);
  }

  updateInscription(inscription: inscriptionInterface): Observable<inscriptionInterface> {
    return this.http.put<inscriptionInterface>(`${this.apiUrl}/${inscription.id}`, inscription);
  }

  deleteInscription(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}