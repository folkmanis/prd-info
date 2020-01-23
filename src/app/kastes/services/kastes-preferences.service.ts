import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { KastesPreferences } from './preferences';
import { KastesHttpService } from './kastes-http.service';
import { map, switchMap, tap } from 'rxjs/operators';

class defaultPreferences implements KastesPreferences {
  pasutijums: '';
  yellow: 'yellow'; rose: 'red'; white: 'gray';
}

@Injectable({
  providedIn: 'root'
})
export class KastesPreferencesService {

  private preferences$ = new BehaviorSubject(new defaultPreferences());
  private initialised = false;
  constructor(
    private kastesHttpService: KastesHttpService,
  ) { }

  get preferences(): Observable<KastesPreferences> {
    if (!this.initialised) {
      return this.kastesHttpService.getPreferencesHttp().pipe(
        tap(changes => {
          this.updatePreferences(changes)
          this.initialised = true;
        }),
        switchMap(() => this.preferences$)
      );
    } else {
      return this.preferences$;
    }
  }

  update(pr: Partial<KastesPreferences>): Observable<boolean> {
    return this.kastesHttpService.setPreferencesHttp(pr).pipe(
      tap(resp => {
        if (resp) {
          this.updatePreferences(pr);
        }
      })
    );
  }

  private updatePreferences(pr: Partial<KastesPreferences>) {
    const updated = this.preferences$.value;
    Object.keys(pr).forEach(key => updated[key] = pr[key]);
    this.preferences$.next(updated);
  }
}
