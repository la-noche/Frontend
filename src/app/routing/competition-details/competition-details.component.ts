import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { competitionInterface } from '../../interfaces/competition.interface.js';
import { inscriptionInterface } from '../../interfaces/inscription.interface.js';
import { matchInterface } from '../../interfaces/match.interface.js';
import { CompetitionService } from '../../services/competition.service.js';
import { InscriptionService } from '../../services/inscription.service.js';
import { MatchService } from '../../services/match.service.js';
import { UserService } from '../../services/user.service.js';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { userInterface } from '../../interfaces/user.interface.js';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-competition-details',
  standalone: true,
  imports: [ButtonModule, RouterModule, DatePipe, CommonModule, TableModule, TabViewModule, DropdownModule, FormsModule],
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
    private matchService: MatchService,
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

  saveWinner(match: matchInterface) {
    this.isSaveInProgress = true;
    if (match.winner === null && match.draw === null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a winner before saving.',
      });
      this.isSaveInProgress = false;
      return;
    }
    if (match.winner === 0) {
      match.draw = true;
      match.winner = null;
    } else {
      match.draw = false;
    }
    this.giveScore(match);
    this.matchService.updateMatch(match).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Match winner updated successfully.',
        });
        this.getCompetitionById(this.foundCompetition.id);
        this.isSaveInProgress = false;
      },
      error: (err) => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }

  giveScore(match: matchInterface) {
    if (match.winner !== null) {
      this.foundCompetition.registrations?.forEach((registration) => {
        if (registration.team === match.winner) {
          if (typeof registration.points === 'number') {
            registration.points += 3;
            this.updateWinners(registration);
          }
        }
      });
    }
    if (match.winner === null && match.draw) {
      this.foundCompetition.registrations?.forEach((registration) => {
        match.teams?.forEach((team) => {
          if (registration.team === (team as any).id) {
            if (typeof registration.points === 'number') {
              registration.points += 1;
              this.updateWinners(registration);
            }
          }
        });
      });
    }
  }

  updateWinners(inscription: inscriptionInterface){
    this.incriptionService.updateInscription(inscription).subscribe({
      next: () => {},
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Inscription couldn`t be updated.',
        });
      },
    });
  }

  startCompetition() {
    this.competitionService.startCompetition(this.foundCompetition.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Started',
          detail: 'Competition started successfully',
        });
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: err.error.message 
        })
      }
    })    
  }

  finishCompetition(){
    this.isSaveInProgress = true;
    for (const match of this.foundCompetition.matches || []) {
    if ((match as any).winner === null && (match as any).draw === null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a winner for all matches before finishing the competition.',
      });
      this.isSaveInProgress = false;
      return;
    }
  }
    let maxPoints = 0;
    this.foundCompetition.registrations?.forEach((registration) => {
      if (typeof registration.points === 'number' && registration.points > maxPoints) {
        maxPoints = registration.points;
      }
    });
    const winners: number[] = this.foundCompetition.registrations?.filter((registration) => registration.points === maxPoints).map((registration) => registration.team) || [];
    if (winners.length > 1) {
      const randomIndex = Math.floor(Math.random() * winners.length);
      this.foundCompetition.winner = winners[randomIndex];
    }
    else if (winners.length === 1) {
      this.foundCompetition.winner = winners[0];
    }
    this.foundCompetition.dateEnd = new Date()
    const payload:competitionInterface = {
      id: this.foundCompetition.id,
      name: this.foundCompetition.name,
      dateStart: this.foundCompetition.dateStart,
      dateEnd: this.foundCompetition.dateEnd,
      dateInscriptionLimit: this.foundCompetition.dateInscriptionLimit,
      maxTeams: this.foundCompetition.maxTeams,
      winner: this.foundCompetition.winner,
      game: (this.foundCompetition.game as any).id,
      region: (this.foundCompetition.region as any).id,
      userCreator: (this.foundCompetition.userCreator as any).id,
    };
    this.competitionService.updateCompetition(payload).subscribe({
      next: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Competition finished successfully.',
        });
      },
      error: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Competition couldn`t be finished.',
        });
      },
    });
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
