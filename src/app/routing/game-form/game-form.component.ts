import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameService } from '../../services/game.service.js';
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
import { gameTypeInterface } from '../../interfaces/gameType.interface.js';
import { GameTypesService } from '../../services/game-types.service.js';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    CardModule,
    RouterOutlet,
    DropdownModule,
  ],
  templateUrl: './game-form.component.html',
  styleUrl: './game-form.component.css',
})
export class GameFormComponent implements OnInit {
  formGame!: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;
  gameTypesList: gameTypeInterface[] = [];
  gameTypesLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private gameTypeService: GameTypesService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formGame = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      gameType: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.edit = true;
      this.getGameById(+id!);
    }
    this.loadGameTypes();
  }

  getGameById(id: number) {
    this.gameService.getGameById(id).subscribe({
      next: (foundGame) => {
        this.formGame.patchValue(foundGame);
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

  loadGameTypes() {
    this.gameTypeService.getGameTypes().subscribe({
      next: (data) => {
        this.gameTypesList = data;
        this.gameTypesLoaded = this.gameTypesList.length > 0;
        if (!this.gameTypesLoaded) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail:
              'No hay tipos de juego disponibles. Por favor, cargue al menos un tipo de juego antes de crear o editar juegos.',
          });
          this.router.navigateByUrl('/gameTypes');
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los tipos de juego',
        });
        this.gameTypesLoaded = false;
        this.router.navigateByUrl('/');
      },
    });
  }

  createGame() {
    if (this.formGame.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete los campos',
      });
      return;
    }
    this.isSaveInProgress = true;
    this.gameService.createGame(this.formGame.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Creado',
          detail: 'Juego guardado correctamente',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/game');
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

  updateGame() {
    if (this.formGame.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los campos e intente nuevamente',
      });
      return;
    }
    this.isSaveInProgress = true;
    this.gameService.updateGame(this.formGame.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Juego actualizado correctamente',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/game');
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
