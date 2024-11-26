import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegionInterface } from '../interfaces/region.interface.js';

@Injectable({
  providedIn: 'root'
})

export class RegionService {
  private apiUrl = 'http://localhost:3000/api/region';

  constructor(private http: HttpClient) {}

  getRegions(): Observable<RegionInterface[]> {
    return this.http.get<RegionInterface[]>(this.apiUrl);
  }

  getRegionById(id: number): Observable<RegionInterface> {
    return this.http.get<RegionInterface>(`${this.apiUrl}/${id}`);
  }

  createRegion(region: FormData): Observable<RegionInterface> {
    return this.http.post<RegionInterface>(this.apiUrl, region);
  }

  updateRegion(region: FormData): Observable<RegionInterface> {
    return this.http.put<RegionInterface>(`${this.apiUrl}/${region.get('id')}`, region);
  }

  deleteRegion(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}