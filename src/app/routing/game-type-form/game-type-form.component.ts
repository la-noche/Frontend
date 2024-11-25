import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameTypesService } from '../../services/game-types.service.js';
import { ButtonModule } from 'primeng/button';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-game-type-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    CardModule,
    RouterOutlet,
  ],
  templateUrl: './game-type-form.component.html',
  styleUrl: './game-type-form.component.css',
})
export class GameTypeFormComponent {
  formGameType!: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private gameTypesService: GameTypesService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formGameType = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.edit = true;
      this.getGameTypeById(+id!);
    }
  }

  getGameTypeById(id: number) {
    this.gameTypesService.getGameTypeById(id).subscribe({
      next: (foundGameType) => {
        this.formGameType.patchValue(foundGameType);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Not found',
        });
        this.router.navigateByUrl('/');
      },
    });
  }

  createGameType() {
    if (this.formGameType.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please, complete the required fields',
      });
      return;
    }
    this.isSaveInProgress = true;
    this.gameTypesService.createGameType(this.formGameType.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Creado',
          detail: 'Game type succesfully created',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/gameTypes');
      },
      error: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please check the fields and try again.',
        });
      },
    });
  }

  updateGameType() {
    if (this.formGameType.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please check the fields and try again.',
      });
      return;
    }
    this.isSaveInProgress = true;
    this.gameTypesService.updateGameType(this.formGameType.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Game type updated succesfully',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/gameTypes');
      },
      error: () => {
        this.isSaveInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please check the fields and try again.',
        });
      },
    });
  }
}
