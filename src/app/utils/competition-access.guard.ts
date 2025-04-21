import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CompetitionService } from '../services/competition.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const competitionAccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const competitionService = inject(CompetitionService);
  const router = inject(Router);

  const user = authService.getUser();
  const isAdmin = authService.isAdmin();
  const idParam = route.paramMap.get('id');

  if (!user) {
    router.navigate(['/login']);
    return of(false);
  }

  if (idParam === 'new') return of(true);

  const competitionId = +idParam!;

  if (isAdmin) return of(true);

  return competitionService.getCompetitionById(competitionId).pipe(
    map((competition) => {
      const isCreator = (competition.userCreator as any)?.id === user.id;
      if (!isCreator) router.navigate(['/access-denied'], { queryParams: { reason: 'not-creator' } });
      return isCreator;
    }),
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    })
  );
};
