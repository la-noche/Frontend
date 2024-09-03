import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { gameInterface } from '../../interfaces/game.interface.js';
import { GameService } from '../../services/game.service.js';
import { MessageService } from 'primeng/api';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CardModule, ButtonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  gameList: gameInterface[] = [];
  isDeleteInProgress: boolean = false;

  constructor(
    private gameService: GameService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getGames();
  }

  getGames() {
    this.gameService.getGames().subscribe((data) => {
      this.gameList = data;
    });
  }

  deleteGame(id: number) {
    this.isDeleteInProgress = true;
    this.gameService.deleteGame(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Juego eliminado',
        });
        this.isDeleteInProgress = false;
        this.getGames();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el Juego',
        });
      },
    });
  }
}
