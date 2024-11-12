import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CarouselModule } from 'primeng/carousel';
import { GameService } from '../../services/game.service.js';
import { gameInterface } from '../../interfaces/game.interface.js';


@Component({
  selector: 'app-start',
  standalone: true,
  imports: [ButtonModule, RippleModule, CarouselModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent implements OnInit{
  responsiveOptions: any[];
  constructor( private router: Router, private gameService: GameService){
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }
  gameList: gameInterface[] = [];

  getGames() {
    this.gameService.getGames().subscribe((data) => {
      this.gameList = data;
    });
  }

  ngOnInit(): void {
    this.getGames();
  }
  
  team(){
    this.router.navigateByUrl('/team');
  }

}
