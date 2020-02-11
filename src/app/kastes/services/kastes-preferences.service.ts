import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, zip, merge } from 'rxjs';
import { KastesPreferences, UserPreferences } from './preferences';
import { KastesHttpService } from './kastes-http.service';
import { LoginService } from '../../login/login.service';
import { map, switchMap, tap, filter } from 'rxjs/operators';

const defaultPreferences: KastesPreferences = {
  pasutijums: '',
  colors: {
    yellow: 'gold', rose: 'magenta', white: 'gray',
  }
};

@Injectable({
  providedIn: 'root'
})
export class KastesPreferencesService {

  private preferences$ = new BehaviorSubject(defaultPreferences);
  private initialised = false;
  private loading = false;
  constructor(
    private kastesHttpService: KastesHttpService,
    private loginService: LoginService,
  ) { }

  get preferences(): BehaviorSubject<KastesPreferences> {
    if (!this.initialised && !this.loading) {
      this.loading = true;

      const sys$ = this.loginService.systemPreferences.pipe(
        map(sys => sys.get('kastes')),
        filter(sys => !!sys),
      );
      const usr$ = this.kastesHttpService.getPreferencesHttp();

      merge(usr$, sys$)
        .pipe(
          tap(set => this.preferences$.next({ ...this.preferences$.value, ...set })),
          tap(() => this.initialised = true),
        ).subscribe(() => this.loading = false);
    }
    return this.preferences$;
  }

  update(pr: Partial<UserPreferences>): Observable<boolean> {
    return this.kastesHttpService.setUserPreferencesHttp(pr).pipe(
      tap(resp => {
        if (resp) {
          this.updatePreferences(pr);
        }
      })
    );
  }

  private updatePreferences(pr: Partial<KastesPreferences>) {
    const updated = this.preferences$.value;
    Object.keys(pr).forEach(key => updated[key] = pr[key] || defaultPreferences[key]);
    this.preferences$.next(updated);
  }
}
