import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewsService } from '../../services/news.service.js';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { NewsInterface } from '../../interfaces/news.interface.js';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    CardModule,
    RouterOutlet,
    DropdownModule,
    FileUploadModule
  ],
  templateUrl: './news-form.component.html',
  styleUrl: './news-form.component.css'
})

export class NewsFormComponent implements OnInit {
  formNews!: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;
  newsList: NewsInterface[] = [];
  newsLoaded: boolean = false;
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formNews = this.fb.group({
      id: [null],
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.edit = true;
      this.getNewsById(+id!);
    }
  }

  onImageUpload(event: any) {
    this.imageFile = event.files[0]; 
  }

  getNewsById(id: number) {
    this.newsService.getNewsById(id).subscribe({
      next: (foundNews) => {
        this.formNews.patchValue(foundNews);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Not found.',
        });
        this.router.navigateByUrl('/');
      },
    });
  }

  createNews() {
    if (this.formNews.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please, complete the required fields.',
      });
      return;
    }
    const formData = new FormData();
    formData.append('title', this.formNews.value.title);
    formData.append('body', this.formNews.value.body);
    if (this.imageFile) {
      formData.append('image', this.imageFile);  
    }  
    this.isSaveInProgress = true;
    this.newsService.createNews(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Created',
          detail: 'News saved successfully.',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/news');
      },
      error: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Check the fields and try again.',
        });
      },
    });
    console.log(this.formNews.value);
  }

  updateNews() {
    if (this.formNews.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please, complete the required fields.',
      });
      return;
    }
    const formData = new FormData();
    formData.append('id', this.formNews.get('id')?.value);
    formData.append('title', this.formNews.value.title);
    formData.append('body', this.formNews.value.body);
    if (this.imageFile) {
      formData.append('image', this.imageFile);  
    }  
    this.isSaveInProgress = true;
    this.newsService.updateNews(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'News updated successfully.',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/news');
      },
      error: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Check the fields and try again.',
        });
      },
    });
  }
}
