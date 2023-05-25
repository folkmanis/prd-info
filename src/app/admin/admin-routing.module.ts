import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminMainMenuComponent } from './admin-main-menu/admin-main-menu.component';
import { ModulePreferencesComponent } from './module-preferences/module-preferences.component';
import { canComponentDeactivate } from '../library/guards/can-deactivate.guard';
import { LogfileComponent } from './logfile/logfile.component';

const routes: Routes = [
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
  { path: '**', redirectTo: '', },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
