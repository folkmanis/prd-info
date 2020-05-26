import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, zip, merge, of, combineLatest, Subscription } from 'rxjs';
import { KastesPreferences, UserPreferences, SystemPreferences } from './preferences';
import { KastesHttpService } from './kastes-http.service';
import { map, switchMap, tap, filter, shareReplay, take } from 'rxjs/operators';
import { SystemPreferencesService } from 'src/app/services';

@Injectable({
  providedIn: 'root'
})
export class KastesPreferencesService {

  constructor(
    private kastesHttpService: KastesHttpService,
    private systemPreferencesService: SystemPreferencesService,
  ) { }

  private sys$ = this.systemPreferencesService.sysPreferences$.pipe(
    map(sys => sys.get('kastes') as SystemPreferences),
    filter(sys => !!sys),
  );
  private _usr$: Subject<UserPreferences> = new Subject();
  private usr$ = merge(this._usr$, this.kastesHttpService.getPreferencesHttp())
    .pipe(
      shareReplay(1),
    );

  get preferences(): Observable<KastesPreferences> {
    return combineLatest([this.sys$, this.usr$])
      .pipe(
        map(([sys, usr]) => ({ ...sys, ...usr })),
      );
  }

  update(pr: Partial<UserPreferences>): Observable<boolean> {
    return this.kastesHttpService.setUserPreferencesHttp(pr).pipe(
      switchMap(resp => resp ? this.updatePreferences(pr) : of(false)),
    );
  }

  private updatePreferences(changes: Partial<UserPreferences>): Observable<boolean> {
    return this.usr$.pipe(
      take(1),
      map(usr => {
        Object.keys(changes).forEach(key => usr[key] = changes[key]);
        this._usr$.next(usr);
        return true;
      })
    );
  }

}
