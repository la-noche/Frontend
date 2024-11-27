import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service.js';
import { GameTypesService } from '../../services/game-types.service.js';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { gameInterface } from '../../interfaces/game.interface.js';
import { gameTypeInterface } from '../../interfaces/gameType.interface.js';
import { RegionService } from '../../services/region.service.js';
import { RegionInterface } from '../../interfaces/region.interface.js';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [RouterModule, ButtonModule, TableModule],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css',
})

export class GameDetailsComponent implements OnInit{
  foundGame!: gameInterface;
  foundGameType!: gameTypeInterface;
  foundRegion!: RegionInterface;

  constructor(
    private regionService: RegionService,
    private gameService: GameService,
    private gameTypeService: GameTypesService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.getGameById(+id);};
    }
  
  getGameById(id: number) {
    this.gameService.getGameById(id).subscribe({
      next: (foundGame) => {
        this.foundGame = foundGame;
        if (foundGame.gameType) {
          this.getGameTypeById(foundGame.gameType);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Game type not found.',
          });
        }
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

  getGameTypeById(id: number) {
  this.gameTypeService.getGameTypeById(id).subscribe({
    next: (foundGameType) => {
      this.foundGameType = foundGameType;
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Game type not found.',
      });
    },
  });
}
/*
  getRegionById(id: number) {
  this.regionService.getRegionById(id).subscribe({
    next: (region) => {
      // Mapear las competiciones con sus regiones por nombre
      this.foundGame.competitions = this.foundGame.competitions.map((foundRegion) => {
        if (foundRegion.id === id) {
          foundRegion.name = region.name;
        }
        return foundRegion;
      });
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Region not found.',
      });
    },
  });
}                                    FALTA VER POR QUE NO SE MUESTRA EL TIPO DE JUEGO Y COMO MOSTRAR EL NOMBRE DE LA REGION */
}