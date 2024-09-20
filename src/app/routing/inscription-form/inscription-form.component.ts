import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InscriptionService } from '../../services/inscription.service.js';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../services/user.service.js';
import { userInterface } from '../../interfaces/user.interface.js';

@Component({
  selector: 'app-inscription-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    DropdownModule,
  ],
  templateUrl: './inscription-form.component.html',
  styleUrl: './inscription-form.component.css',
})
export class InscriptionFormComponent implements OnInit {
  formInscription!: FormGroup;
  user?: userInterface;
  userteams: any[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private inscriptionService: InscriptionService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {
    this.formInscription = this.fb.group({
      team: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getUserTeams()
  }

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.id || null;
    }
    return null;
  }

  getUserTeams() {
    const userId = this.getUserIdFromToken();
    if (userId !== null) {
      this.userService.getUserById(userId).subscribe({
        next: (userData) => {
          this.user = userData;
          this.userteams = this.user?.teams || [];
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo encontrar el usuario',
          });
        },
      });
    }
  }

  submitInscription() {
    if (this.formInscription.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, seleccione un equipo',
      });
      return;
    }

    const competitionId = this.activatedRoute.snapshot.paramMap.get('id');
    // Verifico si el ID de la competición existe y es válido
    if (!competitionId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de competición inválido',
      });
      return;
    }

    // Lo convierto a number
    const competition = +competitionId;

    const inscriptionData = {
      competition: competition,
      team: this.formInscription.value.team,
      date: new Date(),
      status: 'pending',
    };

    this.inscriptionService.createInscription(inscriptionData).subscribe({
      
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Inscripción exitosa',
          detail: 'Te has inscrito correctamente a la competición',
        });
        this.router.navigateByUrl('/competition');
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'No se pudo completar la inscripción',
        });
      },
    });
  }
}
