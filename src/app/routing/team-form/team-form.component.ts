import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamService } from '../../services/team.service.js';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, ButtonModule],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.css',
})
export class TeamFormComponent implements OnInit {
  formTeam!: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formTeam = this.fb.group({
      id: [null],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.edit = true;
      this.getTeamById(+id!);
    }
  }

  getTeamById(id: number) {
    this.teamService.getTeamById(id).subscribe({
      next: (foundTeam) => {
        this.formTeam.patchValue(foundTeam);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No encontrado',
        });
        this.router.navigateByUrl('/');
      },
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

  createTeam() {
    const userId = this.getUserIdFromToken();
    if (this.formTeam.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete los campos',
      });
      return;
    }

    const teamData = {
      id: this.formTeam.value.id,
      name: this.formTeam.value.name,
      userCreator: userId,
    };

    this.isSaveInProgress = true;
    this.teamService.createTeam(teamData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Creado',
          detail: 'Equipo guardado correctamente',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/team');
      },
      error: (err) => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'Revise los campos e intente nuevamente',
        });
      },
    });
  }

  updateTeam() {
    if (this.formTeam.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los campos e intente nuevamente',
      });
      return;
    }
    this.isSaveInProgress = true;
    this.teamService.updateTeam(this.formTeam.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'Equipo actualizado correctamente',
          });
          this.isSaveInProgress = false;
          this.router.navigateByUrl('/team');
        },
        error: (err) => {
          this.isSaveInProgress = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message || 'Revise los campos e intente nuevamente',
          });
        },
      });
  }
}
