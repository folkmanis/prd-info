import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminMainMenuComponent } from './admin-main-menu/admin-main-menu.component';
import { UsersComponent } from './users/users.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { UserEditorComponent } from './users/user-editor/user-editor.component';
import { ModulePreferencesComponent } from './module-preferences/module-preferences.component';
import { CanDeactivateGuard } from '../library/guards/can-deactivate.guard';
import { LogfileComponent } from './logfile/logfile.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent,
        children: [
          {
            path: 'edit',
            component: UserEditorComponent,
            canDeactivate: [CanDeactivateGuard],
          },
          {
            path: 'new',
            component: NewUserComponent,
            canDeactivate: [CanDeactivateGuard],
          },
        ]
      },
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
