import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { StoreState } from '../../interfaces/store';
import { systemReducer } from './system.reducers';
import { customersReducer } from './customers.reducers';

export const reducers: ActionReducerMap<StoreState> = {
  system: systemReducer,
  customers: customersReducer,
};

export const metaReducers: MetaReducer<StoreState>[] = !environment.production ? [] : [];
