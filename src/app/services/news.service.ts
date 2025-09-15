import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsInterface } from '../interfaces/news.interface.js';
import { environment } from '../../environments/environment.js';

@Injectable({
  providedIn: 'root'
})

export class NewsService {
  private apiUrl = `${environment.apiUrl}/news`;

  constructor(private http: HttpClient) {}

  getNews(): Observable<NewsInterface[]> {
    return this.http.get<NewsInterface[]>(this.apiUrl);
  }

  getNewsById(id: number): Observable<NewsInterface> {
    return this.http.get<NewsInterface>(`${this.apiUrl}/${id}`);
  }

  createNews(news: FormData): Observable<NewsInterface> {
    return this.http.post<NewsInterface>(this.apiUrl, news);
  }

  updateNews(news: FormData): Observable<NewsInterface> {
    return this.http.put<NewsInterface>(`${this.apiUrl}/${news.get('id')}`, news);
  }

  deleteNews(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}