import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SystemPreferencesActions } from 'src/app/actions';
import { ModuleSettings, StoreState, SystemPreferencesGroups } from 'src/app/interfaces';
import { getModulePreferences } from 'src/app/selectors';

@Injectable()
export class ModulePreferencesService {

  constructor(
    private store: Store<StoreState>,
  ) { }

  getModulePreferences<T extends ModuleSettings>(module: SystemPreferencesGroups): Observable<T> {
    return this.store.select(getModulePreferences, { module }) as Observable<T>;
  }

  updateModulePreferences(module: SystemPreferencesGroups, settings: ModuleSettings): void {
    this.store.dispatch(SystemPreferencesActions.componentStoredModule({ module, settings }));
  }

}
