import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, switchMap } from 'rxjs/operators';
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
    private actions$: Actions,
    private store: Store<StoreState>,
  ) { }

  /*
    SystemRequestedPreferencesFromApi = '[System] Requested Preferences From Api',
    ApiRetrievedAllPreferences = '[Api] Retrieved All Preferences',
    ComponentStoredModule = '[Component] Stored Module',
    ApiUpdatedModule = '[Api] Updated Module',
   */

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
      // TODO pārbaude, vai modulis eksistē
      switchMap(
        ({ module, settings }) => this.prdApi.systemPreferences.updateOne(module, { settings }).pipe(
          filter(result => !!result),
          switchMap(() => this.prdApi.systemPreferences.get(module)),
          map(updSett => actions.apiUpdatedModule(updSett))
        )
      )
    ),
  );


  // tslint:disable: semicolon
  private arrayToPrefObj = (dbpref: DbModulePreferences[]): Partial<SystemPreferencesObject> =>
    dbpref.reduce(
      (acc, curr) => (acc[curr.module] = curr.settings, acc),
      {}
    );

}
