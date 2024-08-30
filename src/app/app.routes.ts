import { Routes } from '@angular/router';
import { StartComponent } from './routing/start/start.component.js';
import { SecondComponent } from './routing/second/second.component.js';
import { GameTypesComponent } from './routing/game-types/game-types.component.js';
import { GameTypeFormComponent } from './routing/game-type-form/game-type-form.component.js';

export const routes: Routes = [
  {
    path: 'inicio',
    component: StartComponent,
    title: 'Página de inicio',
  },
  {
    path: 'gameTypes',
    component: GameTypesComponent,
    title: 'Tipos de Juego',
  },
  {
    path: 'gameType-form/:id',
    component: GameTypeFormComponent,
    title: 'Formulario de Tipos de Juego',
  },
  {
    path: 'second',
    component: SecondComponent,
  },
  {
    path: '**',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
];
