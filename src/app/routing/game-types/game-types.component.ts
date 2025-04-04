import { Component, OnInit } from '@angular/core';
import { GameTypesService } from '../../services/game-types.service.js';
import { gameTypeInterface } from '../../interfaces/gameType.interface.js';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-game-types',
  standalone: true,
  imports: [ButtonModule, CardModule, RouterModule, RouterOutlet, TableModule],
  templateUrl: './game-types.component.html',
  styleUrl: './game-types.component.css',
})
export class GameTypesComponent implements OnInit {
  gameTypesList: gameTypeInterface[] = [];
  isDeleteInProgress: boolean = false;
  
  constructor(
    private gameTypesService: GameTypesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getGames();
  }

  getGames() {
    this.gameTypesService.getGameTypes().subscribe((data) => {
      this.gameTypesList = data;
    });
  }

  deleteGameType(id: number) {
    this.isDeleteInProgress = true;
    this.gameTypesService.deleteGameType(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Game type deleted',
        });
        this.isDeleteInProgress = false;
        this.getGames();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Game type cannot be deleted, there is a game with this game type',
        });
      },
    });
  }
}
