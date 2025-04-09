import { Component, OnInit } from '@angular/core';
import { gameInterface } from '../../interfaces/game.interface.js';
import { GameService } from '../../services/game.service.js';
import { MessageService } from 'primeng/api';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CardModule, ButtonModule, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  gameList: gameInterface[] = [];
  isDeleteInProgress: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private gameService: GameService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.getGames();
    this.isAdmin = this.authService.isAdmin();
    console.log('Is admin?', this.isAdmin);
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
          summary: 'Success',
          detail: 'Game deleted successfully.',
        });
        this.isDeleteInProgress = false;
        this.getGames();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Game cannot be deleted.',
        });
      },
    });
  }
}
