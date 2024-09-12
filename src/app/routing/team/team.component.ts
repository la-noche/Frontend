import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TeamInterface } from '../../interfaces/team.interface.js';
import { TeamService } from '../../services/team.service.js';
import { MessageService } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CardModule, ButtonModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
})
export class TeamComponent implements OnInit {
  teamList: TeamInterface[] = [];
  isDeleteInProgress: boolean = false;

  constructor(
    private teamService: TeamService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getTeams();
  }

  getTeams() {
    this.teamService.getTeams().subscribe((data) => {
      this.teamList = data;
    });
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
          summary: 'Correcto',
          detail: 'Te has unido al equipo',
        });
        this.getTeams();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'No se pudo unir al equipo',
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
          summary: 'Correcto',
          detail: 'Te has salido del equipo',
        });
        this.getTeams();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'No se pudo salir del equipo',
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
          summary: 'Correcto',
          detail: 'Equipo eliminado',
        });
        this.isDeleteInProgress = false;
        this.getTeams();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el equipo',
        });
      },
    });
  }
}
