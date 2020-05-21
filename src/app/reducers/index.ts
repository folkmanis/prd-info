import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import {StoreState, PreferencesState, LoginState} from '../interfaces/store';
import * as fromLoginReducers from './login.reducer';
import { PRD_DEFAULTS } from 'src/app/app-params';

// const initialPreferencesState: PreferencesState = {
//   systemPreferences: PRD_DEFAULTS.defaultSystemPreferences,
//   error: null,
// };

export const reducers: ActionReducerMap<StoreState> = {
  login: fromLoginReducers.reducer
};


export const metaReducers: MetaReducer<StoreState>[] = !environment.production ? [] : [];
