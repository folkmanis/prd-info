import { Route } from '@angular/router';
import { canComponentDeactivate } from '../library/guards/can-deactivate.guard';
import { AdminMainMenuComponent } from './admin-main-menu/admin-main-menu.component';
import { LogfileComponent } from './logfile/logfile.component';
import { ModulePreferencesComponent } from './module-preferences/module-preferences.component';

export default [
  {
    path: 'module-preferences',
    component: ModulePreferencesComponent,
    canDeactivate: [canComponentDeactivate],
  },
  {
    path: 'logfile',
    component: LogfileComponent,
  },
  {
    path: 'users',
    loadChildren: () => import('./users/user-route'),
  },
  {
    path: '',
    component: AdminMainMenuComponent,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
] as Route[];
