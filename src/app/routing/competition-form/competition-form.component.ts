import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompetitionService } from '../../services/competition.service.js';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { gameInterface } from '../../interfaces/game.interface.js';
import { GameService } from '../../services/game.service.js';
import { RegionInterface } from '../../interfaces/region.interface.js';
import { RegionService } from '../../services/region.service.js';
import { DropdownModule } from 'primeng/dropdown';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-competition-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ButtonModule, RouterModule, InputTextModule, CardModule, DropdownModule],
  templateUrl: './competition-form.component.html',
  styleUrl: './competition-form.component.css',
})
export class CompetitionFormComponent implements OnInit {
  formCompetition!: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;
  gamesList: gameInterface[] = [];
  gamesLoaded: boolean = false;
  regionsList: RegionInterface[] = [];
  regionsLoaded: boolean = false;
  minDateTime: string = '';

  constructor(
    private fb: FormBuilder,
    private competitionService: CompetitionService,
    private gameService: GameService,
    private regionService: RegionService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formCompetition = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      dateInscriptionLimit: ['', Validators.required],
      game: [null, Validators.required],
      region: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.edit = true;
      this.getCompetitionById(+id!);
    }
    this.setMinDateTime();
    this.loadGames();
    this.loadRegions();
  }

  setMinDateTime(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  DatesInvalid(dateInscriptionLimit: string): boolean {
  const endInsc = new Date(dateInscriptionLimit);
  const now = new Date();
  if (now > endInsc){
    return true;
  }
  return false;
  }

  getCompetitionById(id: number) {
    this.competitionService.getCompetitionById(id).subscribe({
      next: (foundCompetition) => {
        this.formCompetition.patchValue(foundCompetition);
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

  loadGames() {
    this.gameService.getGames().subscribe({
      next: (data) => {
        this.gamesList = data;
        this.gamesLoaded = this.gamesList.length > 0;
        if (!this.gamesLoaded) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail:
              'There are no games available. Please, upload at least one game before creating or editing a competition.',
          });
          this.router.navigateByUrl('/game');
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Games couldn`t be found.',
        });
        this.gamesLoaded = false;
        this.router.navigateByUrl('/');
      },
    });
  }

  loadRegions() {
    this.regionService.getRegions().subscribe({
      next: (data) => {
        this.regionsList = data;
        this.regionsLoaded = this.regionsList.length > 0;
        if (!this.regionsLoaded) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail:
              'There are no regions available. Please, upload at least one region before creating or editing a competition.',
          });
          this.router.navigateByUrl('/region');
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Regions couldn`t be found.',
        });
        this.regionsLoaded = false;
        this.router.navigateByUrl('/');
      },
    });
  }

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token); 
      console.log(decodedToken.id)
      return decodedToken.id || null;
    }
    return null;
  }

  createCompetition() {
    const userId = this.getUserIdFromToken();
    if (userId === null) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Authenticated user couldn`t be found.',
    });
    return;
    }
    if (this.formCompetition.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please, complete the required fields.',
      });
      return;
    }
    const competitionData = {
      id: this.formCompetition.value.id,
      name: this.formCompetition.value.name,
      dateInscriptionLimit: this.formCompetition.value.dateInscriptionLimit,
      game: this.formCompetition.value.game,
      region: this.formCompetition.value.region,
      userCreator: userId,
    };
    if (this.DatesInvalid(competitionData.dateInscriptionLimit)) {
      this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Dates are invalid.',
    });
    return;
    }
    this.isSaveInProgress = true;
    this.competitionService.createCompetition(competitionData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: 'Competition saved successfully.',
          });
          this.isSaveInProgress = false;
          this.router.navigateByUrl('/competition');
        },
        error: () => {
          this.isSaveInProgress = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Check the fields and try again.',
          });
        },
      });
  }

  updateCompetition() {
    if (this.formCompetition.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please, complete the required fields.',
      });
      return;
    }

    const { dateInscriptionLimit } = this.formCompetition.value;
    if (this.DatesInvalid(dateInscriptionLimit)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Dates are invalid.',
      });
      return;
    }

    this.isSaveInProgress = true;

    this.competitionService.updateCompetition(this.formCompetition.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Competition updated successfully.',
        });
        this.isSaveInProgress = false;
        this.router.navigateByUrl('/competition');
      },
      error: (err) => {
        this.isSaveInProgress = false;
        if (err.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Unauthorized',
            detail: 'You are not allowed to update this competition.',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Check the fields and try again.',
          });
        }
      }
    })
  }
}
