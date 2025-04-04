import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NewsInterface } from '../../interfaces/news.interface.js';
import { NewsService } from '../../services/news.service.js';
import { MessageService } from 'primeng/api';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CardModule, ButtonModule, CarouselModule, AnimateOnScrollModule, DialogModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})

export class NewsComponent implements OnInit {
  newsList: NewsInterface[] = [];
  selectedNews: NewsInterface | null = null;
  isDeleteInProgress: boolean = false;
  responsiveOptions: any[];
  visible: boolean = false;

  constructor(
    private router: Router, 
    private newsService: NewsService, 
    private messageService: MessageService
  ) {
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

  showDialog(news: NewsInterface): void {
  this.selectedNews = news;
  this.visible = true;
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
          summary: 'Success',
          detail: 'News deleted successfully.',
        });
        this.isDeleteInProgress = false;
        this.getNews();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'News cannot be deleted.',
        });
      },
    });
  }
}