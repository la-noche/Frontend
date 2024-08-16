import { Component, OnInit } from '@angular/core';
import { GameTypesService } from '../../services/game-types.service.js';
import { gameTypeInterface } from '../../interfaces/gameType.interface.js';

@Component({
  selector: 'app-game-types',
  standalone: true,
  imports: [],
  templateUrl: './game-types.component.html',
  styleUrl: './game-types.component.css'
})

export class GameTypesComponent implements OnInit{

  gameTypesList: gameTypeInterface[]=[];
  constructor(private gameTypesService: GameTypesService) {}

  ngOnInit(): void {
    this.getProducts()
  }

  getProducts(){
    this.gameTypesService.getGameTypes().subscribe({
      next: (result) =>{
        this.gameTypesList = result.data;
      },
      error: (err) =>{
        console.log(err);
      }
    })
  }
}