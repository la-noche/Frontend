import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsInterface } from '../interfaces/news.interface.js';

@Injectable({
  providedIn: 'root'
})

export class NewsService {
  private apiUrl = 'http://localhost:3000/api/news';

  constructor(private http: HttpClient) {}

  getNews(): Observable<NewsInterface[]> {
    return this.http.get<NewsInterface[]>(this.apiUrl);
  }

  getNewsById(id: number): Observable<NewsInterface> {
    return this.http.get<NewsInterface>(`${this.apiUrl}/${id}`);
  }

  createNews(news: NewsInterface): Observable<NewsInterface> {
    return this.http.post<NewsInterface>(this.apiUrl, news);
  }

  updateNews(news: NewsInterface): Observable<NewsInterface> {
    return this.http.put<NewsInterface>(`${this.apiUrl}/${news.id}`, news);
  }

  deleteNews(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}