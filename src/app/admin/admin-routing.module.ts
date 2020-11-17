import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminMainMenuComponent } from './admin-main-menu/admin-main-menu.component';
import { ModulePreferencesComponent } from './module-preferences/module-preferences.component';
import { CanDeactivateGuard } from '../library/guards/can-deactivate.guard';
import { LogfileComponent } from './logfile/logfile.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'module-preferences',
        component: ModulePreferencesComponent,
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: 'logfile',
        component: LogfileComponent,
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: '',
        component: AdminMainMenuComponent,
        pathMatch: 'full',
      },
      { path: '**', redirectTo: '', },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
