import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NewsInterface } from '../../interfaces/news.interface.js';
import { NewsService } from '../../services/news.service.js';
import { MessageService } from 'primeng/api';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CardModule, ButtonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})

export class NewsComponent implements OnInit {
  newsList: NewsInterface[] = [];
  isDeleteInProgress: boolean = false;

  constructor(
    private newsService: NewsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getNews();
  }

  getNews() {
    this.newsService.getNews().subscribe((data) => {
      this.newsList = data;
    });
  }

  deleteNews(id: number) {
    this.isDeleteInProgress = true;
    this.newsService.deleteNews(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Noticia eliminada',
        });
        this.isDeleteInProgress = false;
        this.getNews();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la noticia',
        });
      },
    });
  }
}