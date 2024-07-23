import { inject } from '@angular/core';
import { RedirectCommand, Router } from '@angular/router';

export async function resolveCatching<T>(url: string, resolver: () => Promise<T>): Promise<T | RedirectCommand> {
  const redirectUrl = inject(Router).createUrlTree(url.split('/').slice(0, -1));
  try {
    return await resolver();
  } catch {
    return new RedirectCommand(redirectUrl);
  }
}
