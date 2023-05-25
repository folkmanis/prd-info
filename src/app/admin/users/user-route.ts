import { Route } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { resolveUser } from './services/user-resolver';
import { canComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';

export default [
    {
        path: '',
        component: UsersListComponent,
        children: [
            {
                path: 'new',
                component: UserEditComponent,
                data: {
                    user: null,
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
            }
        ]
    }
] as Route[];