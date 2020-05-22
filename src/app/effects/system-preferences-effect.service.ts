import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { map, tap, mergeMap, switchMap, concatMap, withLatestFrom } from 'rxjs/operators';
import { PrdApiService } from '../services/index';
import * as actions from '../actions/system-preferences.actions';
import { StoreState } from 'src/app/interfaces';
import { DbModulePreferences, SystemPreferencesGroups, ModuleSettings, SystemPreferences, SystemPreferencesObject } from 'src/app/interfaces/system-preferences';
import { of } from 'rxjs';

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
        ({ modName, settings }) => this.prdApi.systemPreferences.updateOne(modName, { settings })
      )
    ),
    { dispatch: false }
  );


  // tslint:disable: semicolon
  private arrayToPrefObj = (dbpref: DbModulePreferences[]): Partial<SystemPreferencesObject> =>
    dbpref.reduce(
      (acc, curr) => (acc[curr.module] = curr.settings, acc),
      {}
    );

}
