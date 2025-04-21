import { Routes } from '@angular/router';
import { StartComponent } from './routing/start/start.component.js';
import { LoginComponent } from './routing/login/login.component.js';
import { GameTypesComponent } from './routing/game-types/game-types.component.js';
import { GameTypeFormComponent } from './routing/game-type-form/game-type-form.component.js';
import { GameComponent } from './routing/game/game.component.js';
import { GameFormComponent } from './routing/game-form/game-form.component.js';
import { authGuard } from './utils/auth.guard.js';
import { adminGuard } from './utils/admin.guard.js';
import { competitionAccessGuard } from './utils/competition-access.guard.js';
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
import { TeamDetailsComponent } from './routing/team-details/team-details.component.js';
import { CompetitionDetailsComponent } from './routing/competition-details/competition-details.component.js';
import { GameDetailsComponent } from './routing/game-details/game-details.component.js';
import { ForgotPasswordComponent } from './routing/forgot-password/forgot-password.component.js';
import { ResetPasswordComponent } from './routing/reset-password/reset-password.component.js';
import { AccessDeniedComponent } from './routing/access-denied/access-denied.component.js';
import { teamAccessGuard } from './utils/team-access.guard.js';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'Signup',
  },
  {
    path: 'home',
    component: StartComponent,
    title: 'Home',
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: 'Forgot Password',
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'Reset Password',
  },
  {
    path: 'user',
    component: UserComponent,
    title: 'User profile',
  },
  {
    path: 'user-form/:id',
    component: UserFormComponent,
    title: 'User form',
  },
  {
    path: 'team',
    component: TeamComponent,
    title: 'Teams',
  },
  {
    path: 'team-details/:id',
    component: TeamDetailsComponent,
    title: 'Teams details',
  },
  {
    path: 'team-form/:id',
    component: TeamFormComponent,
    title: 'Team form',
    canActivate: [teamAccessGuard]
  },
  {
    path: 'gameTypes',
    component: GameTypesComponent,
    title: 'Game types',
    canActivate: [adminGuard]
  },
  {
    path: 'game',
    component: GameComponent,
    title: 'Games',
  },
  {
    path: 'game-details/:id',
    component: GameDetailsComponent,
    title: 'Games details',
  },
  {
    path: 'gameType-form/:id',
    component: GameTypeFormComponent,
    title: 'Game types form',
    canActivate: [adminGuard]
  },
  {
    path: 'game-form/:id',
    component: GameFormComponent,
    title: 'Game form',
    canActivate: [adminGuard]
  },
  {
    path: 'competition',
    component: CompetitionComponent,
    title: 'Competitions',
  },
  {
    path: 'competition-details/:id',
    component: CompetitionDetailsComponent,
    title: 'Competition details',
  },
  {
    path: 'team-details/:id',
    component: TeamDetailsComponent,
    title: 'Teams details',
  },
  {
    path: 'competition-form/:id',
    component: CompetitionFormComponent,
    title: 'Competition form',
    canActivate: [competitionAccessGuard]
  },
  {
    path: 'inscription-form/:id',
    component: InscriptionFormComponent,
    title: 'Inscription form',
  },
  {
    path: 'region',
    component: RegionComponent,
    title: 'Regions',
    canActivate: [adminGuard]
  },
  {
    path: 'region-form/:id',
    component: RegionFormComponent,
    title: 'Region form',
    canActivate: [adminGuard]
  },
  {
    path: 'news',
    component: NewsComponent,
    title: 'News',
  },
  {
  path: 'access-denied',
  component: AccessDeniedComponent,
  title: 'Acceso denegado',
  },
  {
    path: 'news-form/:id',
    component: NewsFormComponent,
    title: 'News form',
    canActivate: [adminGuard]
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'prefix',
  },
];