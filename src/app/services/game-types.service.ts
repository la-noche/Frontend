import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameTypesService {

  constructor(private http: HttpClient) { }

  getGameTypes(): Observable<any> {
    return this.http.get('http://localhost:3000/api/gameType')
  }
}