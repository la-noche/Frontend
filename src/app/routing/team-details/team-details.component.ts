import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TeamInterface } from '../../interfaces/team.interface.js';

@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [RouterModule, ButtonModule, TableModule],
  templateUrl: './team-details.component.html',
  styleUrl: './team-details.component.css',
})

export class TeamDetailsComponent implements OnInit{
  foundTeam!: TeamInterface;

  constructor(
    private teamService: TeamService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.getTeamById(+id);};
    }
  
  getTeamById(id: number) {
    this.teamService.getTeamById(id).subscribe({
      next: (foundTeam) => {
        this.foundTeam = foundTeam;
        console.log("El equipo encontrado es:", foundTeam);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Team not found.',
        });
        this.router.navigateByUrl('/');
      },
    });
  }
}

/* Revisar, desde el inspeccionar se producen errores, pero funciona LoL */