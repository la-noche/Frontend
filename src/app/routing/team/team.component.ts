import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TeamInterface } from '../../interfaces/team.interface.js';
import { TeamService } from '../../services/team.service.js';
import { MessageService } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../services/auth.service.js';
@Component({
  selector: 'app-team',
  standalone: true,
  imports: [RouterModule, RouterOutlet, RouterLink, CardModule, ButtonModule, TableModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
})
export class TeamComponent implements OnInit {
  teamList: TeamInterface[] = [];
  myTeams: TeamInterface[] = [];
  isDeleteInProgress: boolean = false;

  constructor(
    private teamService: TeamService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getTeams();
  }

  getTeams() {
    this.teamService.getTeams().subscribe((data) => {
      if (data.length > 0) {
        this.myTeams = data.filter(team => (team.userCreator as any).id === this.getUserIdFromToken());
        this.teamList = data.filter(team => (team.userCreator as any).id !== this.getUserIdFromToken());
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  
  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.id || null;
    }
    return null;
  }

  joinTeam(teamId: number) {
    const userId = this.getUserIdFromToken();
    this.teamService.addUserToTeam(teamId, userId!).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'You joined the team.',
        });
        this.getTeams();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'You cannot join the team.',
        });
      },
    });
  }

  leaveTeam(teamId: number) {
    const userId = this.getUserIdFromToken();
    this.teamService.removeUserFromTeam(teamId, userId!).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'You left the team.',
        });
        this.getTeams();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'You cannot leave the team.',
        });
      },
    });
  }

  deleteTeam(id: number) {
    this.isDeleteInProgress = true;
    this.teamService.deleteTeam(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Team deleted.',
        });
        this.isDeleteInProgress = false;
        this.getTeams();
      },
      error: (err) => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'Team cannot be deleted.',
        });
      },
    });
  }
}
