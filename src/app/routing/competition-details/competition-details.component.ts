import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { competitionInterface } from '../../interfaces/competition.interface.js';
import { inscriptionInterface } from '../../interfaces/inscription.interface.js';
import { CompetitionService } from '../../services/competition.service.js';
import { InscriptionService } from '../../services/inscription.service.js';
import { UserService } from '../../services/user.service.js';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { userInterface } from '../../interfaces/user.interface.js';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-competition-details',
  standalone: true,
  imports: [ButtonModule, RouterModule, DatePipe, CommonModule, TableModule],
  templateUrl: './competition-details.component.html',
  styleUrl: './competition-details.component.css'
})
export class CompetitionDetailsComponent implements OnInit{
  foundCompetition!: competitionInterface;
  foundInscription!: inscriptionInterface;
  user?: userInterface;
  isSaveInProgress: boolean = false;
  acceptedRegistrationsCount: number = 0;

  constructor(
    private competitionService: CompetitionService,
    private incriptionService: InscriptionService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ){}

  ngOnInit(): void{
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.getCompetitionById(+id!);
    };
    this.getUser();
    }

  getUser() {
    const userId = this.getUserIdFromToken();
    if (userId !== null) {
      this.userService.getUserById(userId).subscribe({
        next: (userData) => {
          this.user = userData;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User not found',
          });
        },
      });
    }
  }
  
  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.id || null;
    }
    return null;
  }

  getCompetitionById(id: number) {
    this.competitionService.getCompetitionById(id).subscribe({
      next: (foundCompetition) => {
        this.foundCompetition = foundCompetition;
        this.countAcceptedRegistrations(); 
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Competition not found.',
        });
        this.router.navigateByUrl('/');
      }
    });
  }

  countAcceptedRegistrations() {
    if (this.foundCompetition.registrations) {
      this.acceptedRegistrationsCount = this.foundCompetition.registrations.filter(
        (registration) => registration.status === 'accepted'
      ).length;
    }
  }

  acceptInscription(registration: inscriptionInterface){
    this.isSaveInProgress = true;

    if (this.acceptedRegistrationsCount >= this.foundCompetition.maxTeams) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The maximum number of accepted teams has been reached.',
      });
      this.isSaveInProgress = false;
      return;
    }
    registration.status = 'accepted';
    this.incriptionService.updateInscription(registration).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Inscription updated successfully.',
        });
        this.isSaveInProgress = false;
        this.countAcceptedRegistrations();
      },
      error: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Inscription couldn`t be accepted.',
        });
      },
    });
  }

  cancelInscription(registration: inscriptionInterface){
    this.isSaveInProgress = true;
    registration.status = 'pending';
    this.incriptionService.updateInscription(registration).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Inscription updated successfully.',
        });
        this.isSaveInProgress = false;
        this.countAcceptedRegistrations();
      },
      error: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Inscription couldn`t be cancelled.',
        });
      },
    });
  }
}
