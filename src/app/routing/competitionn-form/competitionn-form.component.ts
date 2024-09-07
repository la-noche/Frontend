import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { competitionService } from '../../services/competition.service.js';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { gameInterface } from '../../interfaces/game.interface.js';
import { GameService } from '../../services/game.service.js';
import { RegionInterface } from '../../interfaces/region.interface.js';
import { RegionService } from '../../services/region.service.js';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-competitionn-form',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    CardModule,
    RouterOutlet,
    DropdownModule,],
  templateUrl: './competitionn-form.component.html',
  styleUrl: './competitionn-form.component.css'
})
export class CompetitionnFormComponent implements OnInit  {
  formcompetition!: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;
  gamesList: gameInterface[] = [];
  gamesLoaded: boolean = false;
  regionsList: RegionInterface[] =[];
  regionsLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private competitionService: competitionService,
    private gameService: GameService,
    private regionService: RegionService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formcompetition = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      type: ['', Validators.required],
      game: [null, Validators.required],
      dateStart: ['', Validators.required],
      dateEnding: ['', Validators.required],
      region: [null, Validators.required],
      
    })
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.edit = true;
        this.competitionService.getcompetitionById(+id!)
    }   
    this.loadgames();
    this.loadregions();
  }

  getCompetitionById(id: number) {
    this.competitionService.getcompetitionById(id).subscribe({
      next: (foundcompetition) => {
        this.formcompetition.patchValue(foundcompetition);
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

  loadgames() {
    this.gameService.getGames().subscribe({
      next: (data) => {
        this.gamesList = data;
        this.gamesLoaded = this.gamesList.length > 0;
        if (!this.gamesLoaded) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail:
              'No hay juegos disponibles. Por favor, cargue al menos un juego antes de crear o editar competiciones.',
          });
          this.router.navigateByUrl('/games');
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los juegos',
        });
        this.gamesLoaded = false;
        this.router.navigateByUrl('/');
      },
    });
  }

  loadregions() {
    this.regionService.getRegions().subscribe({
      next: (data) => {
        this.regionsList = data;
        this.regionsLoaded = this.regionsList.length > 0;
        if (!this.regionsLoaded) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail:
              'No hay regiones disponibles. Por favor, cargue al menos una region antes de crear o editar competiciones.',
          });
          this.router.navigateByUrl('/gameTypes');
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las regiones',
        });
        this.regionsLoaded = false;
        this.router.navigateByUrl('/');
      },
    });
  }

  createCompetition() {
    if (this.formcompetition.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete los campos',
      });
      return;
    }
    this.isSaveInProgress = true;
    this.competitionService.createcompetition(this.formcompetition.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Creado',
          detail: 'competicion guardada correctamente',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/competition');
      },
      error: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revise los campos e intente nuevamente',
        });
      },
    });
  }

  updateCompetition() {
    if (this.formcompetition.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los campos e intente nuevamente',
      });
      return;
    }
    this.isSaveInProgress = true;
    this.competitionService.updatecompetition(this.formcompetition.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'competicion actualizada correctamente',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/competition');
      },
      error: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revise los campos e intente nuevamente',
        });
      },
    });
  }
}


