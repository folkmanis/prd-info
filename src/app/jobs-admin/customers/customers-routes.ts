import { Route } from '@angular/router';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { canComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { resolveCustomer } from './services/customer-resolver';
import { Customer } from 'src/app/interfaces';

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
                    customer: new Customer(),
                }
            },
            {
                path: ':id',
                component: CustomerEditComponent,
                canDeactivate: [canComponentDeactivate],
                resolve: {
                    customer: resolveCustomer,
                },
                runGuardsAndResolvers: 'always',
            },
        ]
    }
] as Route[];