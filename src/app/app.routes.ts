import { Routes } from '@angular/router';
import { StartComponent } from './routing/start/start.component.js';
import { Login } from './routing/login/login.component.js';
import { GameTypesComponent } from './routing/game-types/game-types.component.js';
import { GameTypeFormComponent } from './routing/game-type-form/game-type-form.component.js';
import { GameComponent } from './routing/game/game.component.js';
import { GameFormComponent } from './routing/game-form/game-form.component.js';
import { authGuard } from './guards/auth.guard.js';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,                   /* FALTA DESARROLLAR EL CRUD DE LOGIN EN COMPONENT */
    title: 'Inicio de sesión',
  },
  {
    path: 'inicio',
    component: StartComponent,
    title: 'Página de inicio',
    canActivate: [authGuard],           /* Coloco el canActivate para restringir que cualquiera inicie a la página de inicio */
  },
  {
    path: 'gameTypes',
    component: GameTypesComponent,
    title: 'Tipos de Juego',
  },
  {
    path: 'game',
    component: GameComponent,
    title: 'Juegos',
  },
  {
    path: 'gameType-form/:id',
    component: GameTypeFormComponent,
    title: 'Formulario de Tipos de Juego',
  },
  {
    path: 'game-form/:id',
    component: GameFormComponent,
    title: 'Formulario de Juego',
  },
  {
    path: '**',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
];
