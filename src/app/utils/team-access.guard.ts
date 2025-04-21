import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TeamService } from '../services/team.service.js';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const teamAccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const teamService = inject(TeamService);
  const router = inject(Router);

  const user = authService.getUser();
  const isAdmin = authService.isAdmin();
  const idParam = route.paramMap.get('id');

  if (!user) {
    router.navigate(['/login']);
    return of(false);
  }

  if (idParam === 'new') return of(true);

  const teamId = +idParam!;

  if (isAdmin) return of(true);

  return teamService.getTeamById(teamId).pipe(
    map((team) => {
      const isCreator = (team.userCreator as any)?.id === user.id;
      if (!isCreator) router.navigate(['/access-denied'], { queryParams: { reason: 'not-creator' } });
      return isCreator;
    }),
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    })
  );
};
