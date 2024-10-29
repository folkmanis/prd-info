import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

type NavigationParameters = Parameters<Router['navigate']>;
type CommandsType = NavigationParameters[0];
type ExtrasType = NavigationParameters[1];

export function navigateRelative(): (commands: CommandsType, extras?: ExtrasType) => Promise<boolean> {
  const route = inject(ActivatedRoute);
  const router = inject(Router);

  return (commands, extras = {}) => {
    extras.state = extras.state ?? {};
    extras.state = { returnUrl: router.url, ...extras.state };
    return router.navigate(commands, { relativeTo: route, ...extras });
  };
}

export function navigateToReturn(): (extras?: ExtrasType) => Promise<boolean> {
  const router = inject(Router);
  const location = inject(Location);
  const route = inject(ActivatedRoute);

  return (extras = {}) => {
    const returnUrl = location.getState()['returnUrl'];
    if (typeof returnUrl === 'string') {
      return router.navigate([returnUrl], { ...extras });
    } else {
      return router.navigate(['..'], { relativeTo: route, ...extras });
    }
  };
}
