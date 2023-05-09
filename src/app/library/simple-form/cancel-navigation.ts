import { RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';

export function cancelNavigation(state: RouterStateSnapshot): Observable<never> {
    this.router.navigate(state.url.split('/').slice(0, -1));
    return EMPTY;
}
