import { Component, OnInit} from '@angular/core';
import { competitionInterface } from '../../interfaces/competition.interface.js';
import { CompetitionService } from '../../services/competition.service.js';
import { MessageService } from 'primeng/api';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-competition',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CardModule, ButtonModule],
  templateUrl: './competition.component.html',
  styleUrl: './competition.component.css',
})
export class CompetitionComponent implements OnInit {
  competitionList: competitionInterface[] = [];
  isDeleteInProgress: boolean = false;

  constructor(
    private competitionService: CompetitionService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getCompetitions();
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
          summary: 'Correcto',
          detail: 'Competicion eliminada',
        });
        this.isDeleteInProgress = false;
        this.getCompetitions();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la competicion',
        });
      },
    });
  }
}
