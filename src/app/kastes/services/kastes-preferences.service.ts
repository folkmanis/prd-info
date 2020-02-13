import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, zip, merge, of, combineLatest } from 'rxjs';
import { KastesPreferences, UserPreferences, SystemPreferences } from './preferences';
import { KastesHttpService } from './kastes-http.service';
import { LoginService } from '../../login/login.service';
import { map, switchMap, tap, filter } from 'rxjs/operators';

const defaultPreferences: UserPreferences = {
  pasutijums: '',
};

@Injectable({
  providedIn: 'root'
})
export class KastesPreferencesService {

  private loaded = false;
  private loading = false;
  constructor(
    private kastesHttpService: KastesHttpService,
    private loginService: LoginService,
  ) { }

  private sys$ = this.loginService.systemPreferences.pipe(
    map(sys => <SystemPreferences>sys.get('kastes')),
    filter(sys => !!sys),
  );
  private usr$ = new BehaviorSubject<UserPreferences>(defaultPreferences);

  get preferences(): Observable<KastesPreferences> {
    if (!this.loaded) {
      this.reloadPreferences();
    }

    return combineLatest(this.sys$, this.usr$)
      .pipe(
        map(([sys, usr]) => ({ ...sys, ...usr }))
      );
  }

  update(pr: Partial<UserPreferences>): Observable<boolean> {
    return this.kastesHttpService.setUserPreferencesHttp(pr).pipe(
      tap(resp => resp && this.reloadPreferences())
    );
  }

  private reloadPreferences() {
    if (!this.loading) {
      this.loading = true;
      this.kastesHttpService.getPreferencesHttp().pipe(
        tap(usrPref => this.usr$.next(usrPref))
      ).subscribe(() => {
        this.loading = false;
        this.loaded = true;
      });
    }
  }

}
