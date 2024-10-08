import { Routes } from '@angular/router';
import { StartComponent } from './routing/start/start.component.js';
import { LoginComponent } from './routing/login/login.component.js';
import { GameTypesComponent } from './routing/game-types/game-types.component.js';
import { GameTypeFormComponent } from './routing/game-type-form/game-type-form.component.js';
import { GameComponent } from './routing/game/game.component.js';
import { GameFormComponent } from './routing/game-form/game-form.component.js';
import { authGuard } from './utils/auth.guard.js';
import { SignUpComponent } from './routing/sign-up/sign-up.component.js';
import { RegionComponent } from './routing/region/region.component.js';
import { RegionFormComponent } from './routing/region-form/region-form.component.js';
import { NewsFormComponent } from './routing/news-form/news-form.component.js';
import { NewsComponent } from './routing/news/news.component.js';
import { CompetitionComponent } from './routing/competition/competition.component.js';
import { CompetitionFormComponent } from './routing/competition-form/competition-form.component.js';
import { UserComponent } from './routing/user/user.component.js';
import { TeamComponent } from './routing/team/team.component.js';
import { TeamFormComponent } from './routing/team-form/team-form.component.js';
import { UserFormComponent } from './routing/user-form/user-form.component.js';
import { InscriptionFormComponent } from './routing/inscription-form/inscription-form.component.js';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Inicio de sesión',
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'Registrar Usuario',
  },
  {
    path: 'inicio',
    component: StartComponent,
    title: 'Página de inicio',
    canActivate: [
      authGuard,
    ] /* Coloco el canActivate para restringir que cualquiera inicie a la página de inicio */,
  },
  {
    path: 'user',
    component: UserComponent,
    title: 'Perfil de Usuario',
  },
  {
    path: 'user-form/:id',
    component: UserFormComponent,
    title: 'Formulario de Usuario',
  },
  {
    path: 'team',
    component: TeamComponent,
    title: 'Equipos',
  },
  {
    path: 'team-form/:id',
    component: TeamFormComponent,
    title: 'Formulario de equipos',
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
    title: 'Formulario de Juegos',
  },
  {
    path: 'competition',
    component: CompetitionComponent,
    title: 'Competiciones',
  },
  {
    path: 'competition-form/:id',
    component: CompetitionFormComponent,
    title: 'Formulario de competiciones',
  },
  {
    path: 'inscription-form/:id',
    component: InscriptionFormComponent,
    title: 'Formulario de Inscripciones',
  },
  {
    path: 'region',
    component: RegionComponent,
    title: 'Regiones',
  },
  {
    path: 'region-form/:id',
    component: RegionFormComponent,
    title: 'Formulario de Regiones',
  },
  {
    path: 'news',
    component: NewsComponent,
    title: 'Noticias',
  },
  {
    path: 'news-form/:id',
    component: NewsFormComponent,
    title: 'Formulario de Noticias',
  },
  {
    path: '**',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
];