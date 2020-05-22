import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import {StoreState, SystemPreferencesState, LoginState} from '../interfaces/store';
import * as fromLoginReducers from './login.reducer';
import * as frmoSystemPreferencesReducers from './system-preferences.reducer';

export const reducers: ActionReducerMap<StoreState> = {
  login: fromLoginReducers.reducer,
  systemPreferences: frmoSystemPreferencesReducers.reducer,
};


export const metaReducers: MetaReducer<StoreState>[] = !environment.production ? [] : [];
