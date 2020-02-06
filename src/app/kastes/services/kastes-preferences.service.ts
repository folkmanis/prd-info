import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { KastesPreferences, UserPreferences } from './preferences';
import { KastesHttpService } from './kastes-http.service';
import { map, switchMap, tap } from 'rxjs/operators';

const defaultPreferences: KastesPreferences = {
  pasutijums: '',
  yellow: 'gold', rose: 'magenta', white: 'gray',
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
  ) { }

  get preferences(): BehaviorSubject<KastesPreferences> {
    if (!this.initialised && !this.loading) {
      this.loading = true;
      this.kastesHttpService.getPreferencesHttp().pipe(
        tap(changes => {
          this.updatePreferences(changes);
          this.initialised = true;
        }),
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

  // getPreferencesRaw(): Observable<Partial<KastesPreferences>> {
  //   return this.kastesHttpService.getPreferencesHttp()
  // }

  private updatePreferences(pr: Partial<KastesPreferences>) {
    const updated = this.preferences$.value;
    Object.keys(pr).forEach(key => updated[key] = pr[key] || defaultPreferences[key]);
    this.preferences$.next(updated);
  }
}
