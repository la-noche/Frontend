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
import { AuthService } from '../../services/auth.service.js';

@Component({
  selector: 'app-competition',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CardModule, ButtonModule, DatePipe, TableModule, CommonModule],
  templateUrl: './competition.component.html',
  styleUrl: './competition.component.css',
})
export class CompetitionComponent implements OnInit {
  myCompetitions: competitionInterface[] = [];
  competitionList: competitionInterface[] = [];
  isDeleteInProgress: boolean = false;
  todayString: string | undefined;

  constructor(
    private competitionService: CompetitionService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCompetitions();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getCompetitions() {
    this.competitionService.getCompetitions().subscribe((data) => {
      const user = this.authService.getUser();
    if (!user) return;
    this.myCompetitions = data.filter(c => (c.userCreator as any)?.id === user.id);
    this.competitionList = data.filter(c => (c.userCreator as any)?.id !== user.id);
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
      error: (err) => {
        this.isDeleteInProgress = false;
        if (err.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Unauthorized',
            detail: 'You are not allowed to delete this competition.',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Competition cannot be deleted.',
          });
        }
      },
    });
  }
}
