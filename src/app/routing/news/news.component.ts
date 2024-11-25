import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NewsInterface } from '../../interfaces/news.interface.js';
import { NewsService } from '../../services/news.service.js';
import { MessageService } from 'primeng/api';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CardModule, ButtonModule, CarouselModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})

export class NewsComponent implements OnInit {
  newsList: NewsInterface[] = [];
  isDeleteInProgress: boolean = false;
  responsiveOptions: any[];

  constructor(private router: Router, private newsService: NewsService, private messageService: MessageService) {
      this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

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
          summary: 'OK',
          detail: 'News deleted',
        });
        this.isDeleteInProgress = false;
        this.getNews();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'could not delete news',
        });
      },
    });
  }
}