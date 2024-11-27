import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service.js';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { gameInterface } from '../../interfaces/game.interface.js';
import { RegionService } from '../../services/region.service.js';
import { RegionInterface } from '../../interfaces/region.interface.js';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [RouterModule, ButtonModule, TableModule, DatePipe],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css',
})

export class GameDetailsComponent implements OnInit{
  foundGame!: gameInterface;
  foundRegion!: RegionInterface;


  constructor(
    private regionService: RegionService,
    private gameService: GameService,
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

  getRegionName(region: number): string {
    this.regionService.getRegionById(region).subscribe({
      next: (foundRegion) => {
        this.foundRegion = foundRegion
        
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Region not found.',
        });
      },
    });
    return this.foundRegion.name;
  }
}