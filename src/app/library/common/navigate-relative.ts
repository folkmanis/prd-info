import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

type NavigationParameters = Parameters<Router['navigate']>;
type CommandsType = NavigationParameters[0];
type ExtrasType = NavigationParameters[1];

export function navigateRelative(): (commands: CommandsType, extras?: ExtrasType) => Promise<boolean> {
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    return (commands, extras = {}) =>
        router.navigate(commands, { relativeTo: route, ...extras });

}