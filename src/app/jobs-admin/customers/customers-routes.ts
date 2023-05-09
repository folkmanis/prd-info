import { Route } from '@angular/router';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { canComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { resolveCustomer } from './services/customer-resolver';

export default [
    {
        path: '',
        component: CustomersListComponent,
        children: [
            {
                path: 'new',
                component: CustomerEditComponent,
                canDeactivate: [canComponentDeactivate],
                data: {
                    customer: {},
                }
            },
            {
                path: ':id',
                component: CustomerEditComponent,
                canDeactivate: [canComponentDeactivate],
                resolve: {
                    customer: resolveCustomer,
                }
            },
        ]
    }
] as Route[];