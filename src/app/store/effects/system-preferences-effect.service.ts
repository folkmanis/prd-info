import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { StoreState } from 'src/app/interfaces';
import { DbModulePreferences, SystemPreferencesObject } from 'src/app/interfaces/system-preferences';
import * as actions from '../actions/system-preferences.actions';
import { PrdApiService } from '../../services/index';

@Injectable({
  providedIn: 'root'
})
export class SystemPreferencesEffectService {

  constructor(
    private prdApi: PrdApiService,
    private router: Router,
    private actions$: Actions,
    private store: Store<StoreState>,
  ) { }

  systemRequestedPreferencesFromApi$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.systemRequestedPreferencesFromApi),
      switchMap(
        () => this.prdApi.systemPreferences.get().pipe(
          map(this.arrayToPrefObj),
          map(sysPref => actions.apiRetrievedAllPreferences({ systemPreferences: sysPref }))
        )
      )
    )
  );

  componentStoredModule$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.componentStoredModule),
      switchMap(
        ({ module, settings }) => this.prdApi.systemPreferences.updateOne(module, { settings }).pipe(
          filter(result => !!result),
          switchMap(() => this.prdApi.systemPreferences.get(module)),
          map(updSett => actions.apiUpdatedModule(updSett))
        )
      )
    ),
  );

  routeChanges$ = createEffect(
    () => this.router.events.pipe(
      filter(ev => ev instanceof NavigationEnd),
      map((ev: NavigationEnd) => actions.routerNavigated({ url: ev.url }))
    ),
  );

  // tslint:disable: semicolon
  private arrayToPrefObj = (dbpref: DbModulePreferences[]): Partial<SystemPreferencesObject> =>
    dbpref.reduce(
      (acc, curr) => (acc[curr.module] = curr.settings, acc),
      {}
    );

}
