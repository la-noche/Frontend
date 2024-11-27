import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { competitionInterface } from '../../interfaces/competition.interface.js';
import { CompetitionService } from '../../services/competition.service.js';
import { MessageService } from 'primeng/api';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-competition',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CardModule, ButtonModule, DatePipe, TableModule, CommonModule],
  templateUrl: './competition.component.html',
  styleUrl: './competition.component.css',
})
export class CompetitionComponent implements OnInit {
  competitionList: competitionInterface[] = [];
  isDeleteInProgress: boolean = false;
  todayString: string | undefined;

  constructor(
    private competitionService: CompetitionService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getCompetitions();
    this.todayString = this.formatDate(new Date()); 
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Añade ceros si es necesario
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  getCompetitions() {
    this.competitionService.getCompetitions().subscribe((data) => {
      this.competitionList = data;
    });
  }

  deleteCompetition(id: number) {
    this.isDeleteInProgress = true;
    this.competitionService.deleteCompetition(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Competition deleted.',
        });
        this.isDeleteInProgress = false;
        this.getCompetitions();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Competition cannot be deleted.',
        });
      },
    });
  }
}
