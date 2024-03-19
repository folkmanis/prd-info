import { Route } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { resolveUser } from './user-resolver';
import { canComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { User } from 'src/app/interfaces';

export default [
  {
    path: '',
    component: UsersListComponent,
    children: [
      {
        path: 'new',
        component: UserEditComponent,
        data: {
          user: new User(),
        },
        canDeactivate: [canComponentDeactivate],
      },
      {
        path: ':id',
        component: UserEditComponent,
        resolve: {
          user: resolveUser,
        },
        canDeactivate: [canComponentDeactivate],
        runGuardsAndResolvers: 'always',
      },
    ],
  },
] as Route[];
