import { Route } from '@angular/router';
import { newUser } from 'src/app/interfaces';
import { canComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { UserEditComponent } from './user-edit/user-edit.component';
import { resolveUser } from './user-resolver';
import { UsersListComponent } from './users-list/users-list.component';

export default [
  {
    path: '',
    component: UsersListComponent,
    children: [
      {
        path: 'new',
        component: UserEditComponent,
        resolve: {
          user: () => newUser(),
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
