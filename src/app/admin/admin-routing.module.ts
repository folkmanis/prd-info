import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { UserEditorComponent } from './users/user-editor/user-editor.component';
import { CanDeactivateGuard } from "../library/guards/can-deactivate.guard";

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
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
