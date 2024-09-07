import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { competitionInterface } from '../../interfaces/competition.interface.js';
import { competitionService } from '../../services/competition.service.js';
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
export class competitionComponent implements OnInit {
  competitionList: competitionInterface[] = [];
  isDeleteInProgress: boolean = false;

  constructor(
    private competitionService: competitionService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getcompetitions();
  }

  getcompetitions() {
    this.competitionService.getcompetitions().subscribe((data) => {
      this.competitionList = data;
    });
  }

  deletecompetition(id: number) {
    this.isDeleteInProgress = true;
    this.competitionService.deletecompetition(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'competicion eliminada',
        });
        this.isDeleteInProgress = false;
        this.getcompetitions();
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
