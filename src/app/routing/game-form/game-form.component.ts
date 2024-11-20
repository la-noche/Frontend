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
import { FileUploadModule } from 'primeng/fileupload';

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
    FileUploadModule
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
  imageFile: File | null = null;

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
      imageUrl: [null]
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

  onImageUpload(event: any) {
    this.imageFile = event.files[0]; 
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
          detail: 'Not found.',
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
              'There are no game types available. Please, upload at least one game type before creating or editing a game.',
          });
          this.router.navigateByUrl('/gameTypes');
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Game types couldn`t be found.',
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
        detail: 'Please, complete the required fields and select an image.',
      });
      return;
    }
    const formData = new FormData();
    formData.append('name', this.formGame.value.name);
    formData.append('description', this.formGame.value.description);
    formData.append('gameType', this.formGame.value.gameType);
    if (this.imageFile) {
      formData.append('image', this.imageFile);  
    }  
    this.isSaveInProgress = true;
    this.gameService.createGame(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Created',
          detail: 'Game saved successfully.',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/game');
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


  updateGame() {
    if (this.formGame.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please check the fields and try again.',
      });
      return;
    }
    this.isSaveInProgress = true;
    const formData = new FormData();
    formData.append('id', this.formGame.get('id')?.value);
    formData.append('name', this.formGame.get('name')?.value);
    formData.append('description', this.formGame.get('description')?.value);
    formData.append('gameType', this.formGame.get('gameType')?.value);
    if (this.imageFile) {
      formData.append('image', this.imageFile); 
    }
    this.gameService.updateGame(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Game updated successfully.',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/game');
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
